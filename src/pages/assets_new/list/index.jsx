import React, { useRef, useState, useEffect } from 'react';

import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  SearchOutlined,
  OrderedListOutlined,
  EditFilled,
  DownOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Space,
  InputNumber, Popconfirm, Form, Typography,
  Table, Input,
  Tooltip,
  Select,
  Menu,
  Dropdown,
  Alert
} from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, IntlProvider, enUSIntl } from '@ant-design/pro-table';
import { connect, Link, FormattedMessage, formatMessage } from 'umi';
import styles from '../style.less';
import ViewDetails from '../components/ViewDetails';
import InStorage from '../components/Instorage';
import FileUpload from '../components/FileUpload';
import BulkUpdate from '../components/BulkUpdate';
import ExportExcel from '@/utils/exportExcel';
import ImportExcel from '@/utils/importExcel';
import CreateForm from '../components/CreateForm';
import Highlighter from 'react-highlight-words';
import { Resizable } from "react-resizable";
import _ from "underscore"
import ReactDragListView from "react-drag-listview";
import { DataTable } from 'antd-data-table'
import "./style.less";

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};


const List = (props) => {
  const { submitting, loading, dispatch, assetFormNew: {
    multipleAssetUpdateReponse,
    multipleAssetDeleteReponse,
    assetDeleteReponse,
    assetCreateStatus,
    assetsList,
    assetTotalCount,
    columnDefinitions,
    singleAssetUpdateReponse,
    statusCodes,
    assetIdsList
  },
    assetsTypesForm: { assetsTypeList },
    palletsForm: {
      palletsInProduction
    }, currentUser } = props;
  // console.log("columnDefinitions****", columnDefinitions)
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [row, setRow] = useState();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [bulkUpdateModalVisible, setBulkUpdateModalVisible] = useState(false);
  const [showModalFileDialog, setShowModalFileDialog] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const [tableColumns, setTableColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState();
  const [offset, setOffset] = useState(0);
  const refInput = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [assetDataList, setAssetDataList] = useState([]);
  const [selectionType,] = useState('checkbox');
  const [count, setCount] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [assetTypes, setAssetsTypeList] = useState([]);
  const [assetTypeFieldMapping, setAssetTypeFieldMapping] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState('All');
  const [showInStorageModalDialog, setShowInStorageModalDialog] = useState(false);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [assetStatusNames, setAssetStatusNames] = useState([]);
  const [assetStatusCodes, setAssetStatusCodes] = useState([]);
  const [palletNumber, setPalletNumber] = useState([]);
  const [inStorageSubmitType, setInStorageSubmitType] = useState([]);
  const [showInstorageSubmitTypes, setShowInstorageSubmitTypes] = useState();
  const [tempLoading, setTempLoading] = useState(true)
  const inputRef = useRef(null);

  const { Option } = Select;

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={refInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchedColumn(dataIndex)
              setSearchText(selectedKeys[0])
              // this.setState({
              //   searchText: selectedKeys[0],
              //   searchedColumn: dataIndex,
              // });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#ffffff' : '#ffffff' }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      // if (visible) {
      //   setTimeout(() => refInput.select(), 100);
      // }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex)
    setSearchText(selectedKeys[0])

  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const handleCancel = async () => {
    setShowModalDialog(value => !value);
  };
  const handleInStorageCancel = async () => {
    setShowInStorageModalDialog(value => !value);
  };

  const handleFileUploadCancel = async () => {
    setShowModalFileDialog(value => !value);
  };
  const handleFileUpload = () => {
    setShowModalFileDialog(true);
  };
  const editAndDelete = (key, type, id) => {
    setCurrentId(id);
    if (key === 'delete' && type === 'single') {
      Modal.confirm({
        title: 'Delete',
        content: 'are you sure you want to delete this asset ?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => deleteItem(id),
      });
    } else if (key === 'delete' && type === 'multiple') {
      Modal.confirm({
        title: 'Delete Multiple',
        content: 'Are you sure that you want to delete these assets?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => deleteMultipleItem(),
      });
    }
  };

  const deleteMultipleItem = () => {

    let selectedAssetIds = selectedRowsState.map((row) => {
      return { asset_id: row.asset_id };
    });

    dispatch({
      type: 'assetFormNew/deleteMultipleAssetById',
      payload: {
        selectedAssetIds
      },
      errorHandler: (e) => {
        message.error(e.data.error.message);
        // dispatch({
        //   type: 'formAndstepFormEdit/setValidationerror',
        //   payload: 'Something Went wrong'
        // });
      }
    });
  };


  const deleteItem = (id) => {
    dispatch({
      type: 'assetFormNew/deleteAssetId',
      payload: {
        data: { asset_id: id },
      },
      errorHandler: (e) => {
        message.error(e.data.error.message);
        // dispatch({
        //   type: 'formAndstepFormEdit/setValidationerror',
        //   payload: 'Something Went wrong'
        // });
      }
    });
  };


  const handleSubmit = (values) => {
    dispatch({
      type: 'assetFormNew/submitassetFormNew',
      payload: {
        data: { ...values },
      },
    });
  };

  const showInstorageSubmitType = (type) => {
    setShowInstorageSubmitTypes(type)
  }
  const handleUpdate = (values, type) => {
    //let selectedData = values.asset_info;
    setInStorageSubmitType(type);
    let selectedData = [];
    selectedData = values.asset_info.map((row) => {
      return { asset_id: row.asset_id, storage_id: values.storage_id };
    });
    dispatch({
      type: 'assetFormNew/updateMultipleAssetById',
      payload: { selectedData },
    });
  };

  const checkAssetExists = (values) => {
    if (values) {
      dispatch({
        type: 'assetFormNew/checkAssetExists',
        payload: { values },
      });
    }
  };

  const handleBulkSubmit = (values) => {
    let selectedData = [];

    selectedData = selectedRowsState.map((row) => {
      return { asset_id: row.asset_id, ...values };
    });
    dispatch({
      type: 'assetFormNew/updateMultipleAssetById',
      payload: { selectedData },
    });
  }

  useEffect(() => {
    if (palletsInProduction && palletsInProduction.length > 0) {
      let pallet_number = palletsInProduction.map(
        (pallets) => pallets.pallet_number
      );
      // setAssetTypeFieldMapping(palletsInProduction);
      setPalletNumber(pallet_number);
    }
  }, [palletsInProduction]);

  useEffect(() => {
    if (assetsList && assetsList.length > 0) {
      // assetsList.map((item, i) => {
      //   item.key = i;
      // })
      setAssetDataList(assetsList)
      setTempLoading(false)
      setCount(assetsList.length)
      let tempAPI = JSON.parse(JSON.stringify(assetsList));
      setRowDataAPI(tempAPI);
    }
  }, [assetsList]);

  useEffect(() => {
    if (assetsTypeList && assetsTypeList.length > 0) {
      let assetNames = assetsTypeList.map(
        (assetType) => assetType.Asset_Name
      );
      setAssetTypeFieldMapping(assetsTypeList);
      setAssetsTypeList(assetNames);
    }
  }, [assetsTypeList]);

  useEffect(() => {
    if (statusCodes && statusCodes.length > 0) {
      setAssetStatusCodes(statusCodes);
      let statusNames = statusCodes.map(
        (status) => status.status_name
      );
      setAssetStatusNames(statusNames);
    }
  }, [statusCodes]);

  useEffect(() => {
    // console.log("currentUser", currentUser)
    if (dispatch && currentUser && currentUser.id) {
      dispatch({
        type: 'assetFormNew/fetchAssetsColumns',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetFormNew/fetchAssets',
        payload: {
          limit: pageSize,
          offset: offset
        }
      });
      dispatch({
        type: 'assetFormNew/fetchAssetsId',
        payload: {}
      });
      dispatch({
        type: 'palletsForm/fetchPalletsInproduction',
        payload: {
          limit: 500,
          offset: 0
        }
      });
      dispatch({
        type: 'assetsTypesForm/fetchAssetsType',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetFormNew/fetchStatusCodes',
        payload: {
          limit: 100,
          offset: 0
        }
      });

      dispatch({
        type: 'assetFormNew/resetFormData',
        payload: {}
      });
    }
  }, [currentUser]);

  useEffect(() => {
    let tempcolumnDefinitions = columnDefinitions;
    if (selectedAssetType !== 'All') {
      let currentMapping = assetTypeFieldMapping.find(
        (mapping) => mapping.Asset_Name === selectedAssetType
      );
      let columnsToShow = currentMapping ? currentMapping.Fields : [];
      columnsToShow.push('actions')
      tempcolumnDefinitions =
        _.filter(columnDefinitions, function (b) {
          return columnsToShow.map(function (c) {
            return c
          }).indexOf(b.field) > -1
        });

    }

    let columnsDef = [];
    tempcolumnDefinitions.map((item, i) => {
      if (!item.hideinform) {
        let field = item.field;
        columnsDef.push({
          title: <span className="dragHandler">{item.header_name}</span>,
          dataIndex: item.field,
          //key: i,
          editable: item.editable,
          inputType: item.type,
          width: item.header_name.length > 13 ? 190 : 150,
          sorter: true,
          ellipsis: true,
          // sorter: (a, b) => a.field - b.field,
          ...getColumnSearchProps(item.field, item.header_name),
        })
      } else if (item.field === 'actions' || selectedAssetType != 'All') {
        columnsDef.push(
          {
            title: `Action`,
            dataIndex: '',
            //key: '',
            fixed: 'left',
            width: 100,
            render: (_, record) => {
              const editable = isEditing(record);
              // console.log(record, "editable", editable)
              return editable ? (
                <span>
                  <Link
                    className={[styles.addlead, styles.editBtn].join(' ')}
                    onClick={() => handleSubmit11(record.key)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    <CheckCircleFilled />
                  </Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <Link className={[styles.addlead, styles.deleteBtn].join(' ')}><CloseCircleFilled /></Link>
                  </Popconfirm>
                </span>
              ) : (
                <div>
                  <Link onClick={() => {
                    setRow(record);
                    setShowModalDialog(true);
                  }}
                    className={styles.addlead} >
                    <EyeFilled />
                  </Link>
                  <Link className={[styles.addlead, styles.editBtn].join(' ')} disabled={editingKey !== ''} onClick={() => edit(record)}>
                    <EditFilled />
                  </Link>
                  <Link to="#" onClick={() => editAndDelete('delete', 'single', record.asset_id)} className={[styles.addlead, styles.deleteBtn].join(' ')} ><DeleteFilled /></Link>
                </div>
              );
            },
            // render: (_, record) => {
            //   return <div>

            //   </div>;
            // },
          }
        )
      }
    })
    // console.log("columnsDef", columnsDef)
    setTableColumns(columnsDef)
    // }    
  }, [columnDefinitions, selectedAssetType, editingKey]);

  useEffect(() => {
    // componentWillMount events
    // console.log("assetDeleteReponse", assetDeleteReponse)
    // console.log("singleAssetUpdateReponse", singleAssetUpdateReponse)
    if ((assetCreateStatus && assetCreateStatus.status) ||
      (multipleAssetUpdateReponse && multipleAssetUpdateReponse.status) ||
      (assetDeleteReponse && assetDeleteReponse.status) ||
      (singleAssetUpdateReponse && singleAssetUpdateReponse.status) ||
      multipleAssetDeleteReponse && multipleAssetDeleteReponse.status) {
      handleModalVisible(false);
      setSelectedRows([]);
      console.log("showInstorageSubmitTypes", showInstorageSubmitTypes)
      if (showInstorageSubmitTypes === 'single') {
        setShowInStorageModalDialog(false);
      } else {
        setShowInStorageModalDialog(true);
      }
      setEditingKey('');
      if (assetCreateStatus && assetCreateStatus.status === 'success') {
        message.success("Asset created successfully.");
      } else if (assetCreateStatus && assetCreateStatus.status === 'error') {
        message.error("Failed to create Asset.");
      }
      if (assetDeleteReponse && assetDeleteReponse.status === 'success') {
        message.success("Asset deleted successfully.");
      } else if (assetDeleteReponse && assetDeleteReponse.status === 'error') {
        message.error("Failed to delete Asset.");
      }
      if (multipleAssetDeleteReponse && multipleAssetDeleteReponse.status === 'success') {
        message.success("Multiple Asset deleted successfully.");
      } else if (multipleAssetDeleteReponse && multipleAssetDeleteReponse.status === 'error') {
        message.error("Failed to delete Asset.");
      }
      if (multipleAssetUpdateReponse && multipleAssetUpdateReponse.status === 'success') {
        message.success("Multiple Asset updated successfully.");
        setBulkUpdateModalVisible(false)
      } else if (multipleAssetUpdateReponse && multipleAssetUpdateReponse.status === 'error') {
        message.error("Failed to update multiple Asset.");
        setBulkUpdateModalVisible(false)
      }
      if (singleAssetUpdateReponse && singleAssetUpdateReponse.status === 'success') {
        // success("Asset updated successfully.")
        message.success("Asset updated successfully.");
        setBulkUpdateModalVisible(false)
      } else if (singleAssetUpdateReponse && singleAssetUpdateReponse.status === 'error') {
        message.error("Failed to update Asset.");
        // error("Failed to update Asset.")
        setBulkUpdateModalVisible(false)
      }

      dispatch({
        type: 'assetFormNew/fetchAssets',
        payload: {
          limit: 100,
          offset: 0
        }
      });

      dispatch({
        type: 'assetFormNew/resetFormData',
        payload: {}
      });
    }

  }, [singleAssetUpdateReponse, assetCreateStatus, assetDeleteReponse, multipleAssetDeleteReponse, multipleAssetUpdateReponse]);

  const error = (text) => {
    return <Alert type="error" message={text} showIcon closable />
  }
  const success = (text) => {
    return <Alert type="success" message={text} showIcon closable />
  }
  const handlePagination1 = (pageNumber, pageSize) => {
    dispatch({
      type: 'assetFormNew/fetchAssets',
      payload: {
        limit: pageSize,
        offset: ((pageNumber * pageSize) - pageSize)
      }
    });
  }

  const dropDownSelect = () => {
    return <Select
      key="to"
      name="to"
      dropdownStyle={{ position: "fixed" }}
      style={{ width: '100%', zIndex: 2000 }}
    >
      {
        assetTypes.map((item, index) => {
          return (<Option key={index} value={item}>
            {item}
          </Option>)
        })
      }
    </Select>
  }

  const handleSubmit11 = async (record) => {
    // try {
    const values = await form.validateFields();

    let validValues = {}
    Object.keys(values).map(function (key, index) {
      if (values[key] && values[key] != "") {
        validValues[key] = values[key]
      }
    });
    if (validValues.status === 'Sold' && !validValues.date_nor) {
      validValues.date_nor = new Date().toISOString().slice(0, 10);
    }

    if (validValues.status !== 'Sold' && validValues.date_nor) {
      validValues.date_nor = null;
    }
    let currentRowFromAPI = rowDataAPI.find(
      (row) => row.asset_id === validValues.asset_id
    );
    if (
      currentRowFromAPI &&
      JSON.stringify(validValues) === JSON.stringify(currentRowFromAPI)
    ) {
      return;
    }
    // console.log(validValues, "currentRowFromAPI", currentRowFromAPI);

    if (currentRowFromAPI) {
      Object.keys(validValues).forEach((key) => {
        if (!validValues[key]) {
          validValues[key] = null;
          validValues['deleted'] = false;
        }
      });
      validValues.last_updated_by = currentUser.user_email;
      validValues.last_updated_at = new Date().toISOString();
      dispatch({
        type: 'assetFormNew/updateSingleAssetById',
        payload: {
          data: { ...validValues },
          matchBy: 'asset_id',
        }
      });
      return
    } else {
      dispatch({
        type: 'assetFormNew/submitassetFormNew',
        payload: {
          data: { ...validValues },
        },
      });
    }
    // } catch (errInfo) {
    //   console.log('Save failed:', errInfo);
    // }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // console.log("record", record)
    const handleSubmit1 = async (record) => {
      // try {
      const values = await form.validateFields();
      let validValues = {}
      Object.keys(values).map(function (key, index) {
        if (values[key] && values[key] != "") {
          validValues[key] = values[key]
        }
      });
      validValues.data_generated = 'MANUAL';
      if (validValues.status === 'Sold' && !validValues.date_nor) {
        validValues.date_nor = new Date().toISOString().slice(0, 10);
      }

      if (validValues.status !== 'Sold' && validValues.date_nor) {
        validValues.date_nor = null;
      }
      let currentRowFromAPI = rowDataAPI.find(
        (row) => row.asset_id === validValues.asset_id
      );

      if (
        currentRowFromAPI &&
        JSON.stringify(validValues) === JSON.stringify(currentRowFromAPI)
      ) {
        return;
      }
      // console.log(validValues, "currentRowFromAPI", currentRowFromAPI);

      if (currentRowFromAPI) {
        Object.keys(validValues).forEach((key) => {
          if (!validValues[key]) {
            validValues[key] = null;
            validValues['deleted'] = false;
          }
        });
        validValues.last_updated_by = currentUser.user_email;
        validValues.last_updated_at = new Date().toISOString();
        dispatch({
          type: 'assetFormNew/updateSingleAssetById',
          payload: {
            data: { ...validValues },
            matchBy: 'asset_id',
          }
        });
        return
      } else {
        dispatch({
          type: 'assetFormNew/submitassetFormNew',
          payload: {
            data: { ...validValues },
          },
        });
      }
      // } catch (errInfo) {
      //   console.log('Save failed:', errInfo);
      // }
    };
    // console.log("assetTypeFieldMapping", assetTypeFieldMapping)

    let inputNode = <Input ref={inputRef} onPressEnter={() => handleSubmit1(record)} />;
    if (inputType === 'numericColumn' || inputType === 'currencyColumn') {
      inputNode = <InputNumber onPressEnter={() => handleSubmit1(record)} />;
    } else if (inputType === 'dropdown') {
      let dropDownMap = []
      if (dataIndex === 'asset_type') {
        dropDownMap = assetTypes.map((item, index) => {
          return (<Option key={index} value={item}>
            {item}
          </Option>)
        })
      } else if (dataIndex === 'status') {
        dropDownMap = assetStatusNames.map((item, index) => {
          return (<Option key={index} value={item}>
            {item}
          </Option>)
        })
      } else if (dataIndex === 'pallet_number') {
        dropDownMap = palletNumber.map((item, index) => {
          return (<Option key={index} value={item}>
            {item}
          </Option>)
        })
      }
      // console.log("dropDownMap", dropDownMap)
      inputNode = <Select
        dropdownStyle={{ position: "fixed" }}
        style={{ width: '100%', zIndex: 2000 }}
      >
        {dropDownMap}
      </Select>;
    }
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          // rules={[
          //   {
          //     required: true,
          //     message: `Please Input ${title}!`,
          //   },
          // ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record) => record.key === editingKey;
  // console.log(isEditing, "editingKey ******", editingKey)

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const mergedColumns = tableColumns.map((col, index) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        // handleSave: handleSubmit,
      }),
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index)
      })
    };
  });

  const suffix = (
    <SearchOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );

  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") setAssetDataList(assetsList);
    else {
      const filteredData = assetDataList.filter(item => {
        return Object.keys(item).some(key =>
          item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : ''
        );
      });
      setAssetDataList(filteredData);
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  const handleAdd = () => {
    // const { count, dataSource } = this.state;
    const newData = {
      key: count,
      "created_by": null,
      "asset_id": "",
      "data_generated": "MANUAL",
      "asset_type": "Adapter",
      "quantity": 0,
      "manufacturer": "",
      "model": "",
      "ip": 0,
      "form_factor": "",
      "processor": "",
      "memory": "",
      "hdd": "",
      "optical": "",
      "screen": "",
      "color": "",
      "coa": "",
      "battery": "",
      "keyboard": "",
      "pallet_number": "",
      "serial_number": "",
      "hdd_serial_number": "",
      "data_destruction": "",
      "wipe_standard": "",
      "grade": "",
      "complaint": "",
      "description": "",
      "psu": "",
      "article_ref": null,
      "purchase_order": "",
      "date_nor": "",
      "client": "",
      "project_id": "",
      "status": "",
      "storage_license": "",
      "sold_order_nr": 0,
      "sold_price": 0,
      "sample_co2": 0,
      "sample_weight": 0,
      "target_price": 0,
      "imei": 0,
      "graphic_card": "",
      "erasure_ended": "",
      "parent_index": null,
      "storage_id": "",
      "new_record": true
    }
    assetDataList.splice(-1, 1);
    setAssetDataList([newData, ...assetDataList])
    edit(newData)
    setCount(count + 1)
    // setEditingKey(count + 1)

  };

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
    header: {
      cell: ResizableTitle
    }
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      if (fromIndex > 1) {
        fromIndex = fromIndex - 1;
        toIndex = toIndex - 1;
      }
      const columns = [...tableColumns];
      const item = columns.splice(fromIndex, 1)[0];
      columns.splice(toIndex, 0, item);
      setTableColumns(columns)
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle"
  };

  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...tableColumns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width
    };
    setTableColumns(nextColumns)
  };

  const menu = (
    <Menu
      selectedKeys={[selectedAssetType]}
      onClick={(e) => externalFilterChanged(e)}
    >
      <Menu.Item key={'All'}>
        All
        </Menu.Item>
      {
        assetTypes.map((item, index) => {
          return (<Menu.Item key={item}>
            {item}
          </Menu.Item>)
        })
      }
    </Menu>);

  const externalFilterChanged = (event) => {
    const { key } = event;
    setSelectedAssetType(key);
  };

  const onSearch = () => {
    return {
      dataSource: assetsList,
      total: assetTotalCount
    }
  }


  const columns11 = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id'
    }, {
      key: 'title',
      title: 'Title',
      dataIndex: 'title'
    }
  ]
  return (
    // const { advancedOperation1, advancedOperation2, advancedOperation3 } = profileAndadvanced;
    // <PageContainer
    // // content={mainSearch}

    // // className={styles.pageHeader}
    // >
    <IntlProvider value={enUSIntl}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '98%',
        margin: '0 auto',
        fontSize: '1rem',
        fontWeight: 'bold',
        // background:'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
      }}>
        <div>
          Visa tillgångar
        </div>
        <div
          style={{
            textAlign: 'center',
            width: '400px',
          }}
        >
          <Input.Search
            placeholder="Search Assets"
            enterButton="Search"
            size="large"
            onSearch={e => filterData(e)}
            // suffix={suffix}
            allowClear
            style={{
              maxWidth: 522,
              width: '100%',
            }}
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button className={styles.btns} onClick={() => setShowInStorageModalDialog(true)} >
            In Storage
          </Button>
          <Dropdown overlay={menu} trigger={['click']}>
            <Link className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {selectedAssetType} <DownOutlined />
            </Link>
          </Dropdown>
          <Button className={styles.btns} onClick={() => handleAdd()} >
            <PlusOutlined />
          </Button>
          <Button disabled={selectedRowsState.length === 0} className={styles.btns} onClick={() => editAndDelete('delete', 'multiple', selectedRowsState)} ><DeleteFilled /></Button>
          <ImportExcel showFileUpload={handleFileUpload} fileName={'setShowModalFileDialog'} />
          <ExportExcel csvData={assetDataList} fileName={'Assets'} />
          {/* <Tooltip placement="topLeft" title="Bulk Update"> */}
          <Button disabled={selectedRowsState.length === 0} className={styles.btns} onClick={() => setBulkUpdateModalVisible(true)}>
            <OrderedListOutlined /></Button>
          {/* </Tooltip> */}
        </div>
      </div>

      <Form form={form} component={false}>
        <ReactDragListView.DragColumn {...dragProps}>
          {/* <DataTable
    // rowKey={record => record.asset_id}
    // searchFields={searchFields}
    // initialColumns={mergedColumns}
    // // initialExpands={expands}
    // onSearch={onSearch}
  /> */}
          <Table
            // title={() => 'Visa tillgångar'}
            components={components}
            bordered
            // dataSource={data}
            dataSource={assetDataList}
            columns={mergedColumns}
            rowClassName="editable-row"
            scroll={{ x: 1500, y: 1000 }}
            loading={tempLoading}
            pagination={{
              pageSizeOptions: ['50', '100', '500'],
              showSizeChanger: true,
              onChange: handlePagination1,
              pageSize: pageSize,
              total: assetTotalCount
            }}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
          />
        </ReactDragListView.DragColumn>
      </Form>
      {/* {
        columnDefinitions.length > 0 && <CreateForm onCancel={() => handleModalVisible(false)} onSubmit={handleSubmit} modalVisible={createModalVisible}>
          <ProTable
            onSubmit={async (value) => {
            }}
            rowKey="key"
            type="form"
            columns={columnDefinitions}
          />
        </CreateForm>
      } */}
      {/* {
        bulkUpdateModalVisible && <BulkUpdate onCancel={() => setBulkUpdateModalVisible(false)} onSubmit={handleBulkSubmit} modalVisible={bulkUpdateModalVisible}>
          <ProTable
            onSubmit={async (value) => {
            }}
            rowKey="key"
            type="form"
            columns={columnDefinitions}
          />
        </BulkUpdate>
      } */}
      <FileUpload
        showModalDialog={showModalFileDialog}
        handleCancel={handleFileUploadCancel}
      />
      {row?.asset_id && (
        <ViewDetails
          showModalDialog={showModalDialog}
          handleCancel={handleCancel}
          columnDefinitions={columnDefinitions}
          data={row}
        />
      )}
      <InStorage
        showModalDialog={showInStorageModalDialog}
        handleCancel={handleInStorageCancel}
        assetDataList={assetDataList}
        storageData={handleUpdate}
        //checkAssetExists={checkAssetExists}
        assetIdsList={assetIdsList}
        submitting={submitting}
        showInstorageSubmitType={showInstorageSubmitType}
      // columnDefinitions={columnDefinitions}
      // data={row}
      />

    </IntlProvider>

    // </PageContainer>
  );
}
export default connect(({ loading, assetFormNew, user, language, assetsTypesForm, palletsForm }) => ({
  assetFormNew,
  assetsTypesForm,
  user,
  palletsForm,
  submitting: loading.effects['assetFormNew/updateMultipleAssetById'],
  currentUser: user.currentUser,
  loading: loading.effects['assetFormNew/fetchAssets'],
  localeLanguage: language.localeLanguage
}))(List);
