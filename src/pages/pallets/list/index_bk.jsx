import React, { useRef, useState, useEffect } from 'react';

import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  SearchOutlined,
  EditFilled,
} from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Space,
  InputNumber, Popconfirm, Form,
  Table, Input,
  Select
} from 'antd';
import ProTable, { IntlProvider, enUSIntl } from '@ant-design/pro-table';
import { connect, Link } from 'umi';
import styles from '../style.less';
import ViewDetails from '../components/ViewDetails';
import ExportExcel from '@/utils/exportExcel';
import CreateForm from '../components/CreateForm';
import Highlighter from 'react-highlight-words';
import { Resizable } from "react-resizable";
import _ from "underscore"
import ReactDragListView from "react-drag-listview";
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
  const { loading, dispatch, palletsForm: {
    palletsDeleteReponse,
    palletsCreateStatus,
    palletsList,
    palletTotalCount,
    columnDefinitions,
    statusCodes,
    palletsUpdateStatus
  },
    assetsTypesForm: { assetsTypeList },
    currentUser } = props;
  // console.log("assetTotalCount****", assetTotalCount)
  const [form] = Form.useForm();

  const [row, setRow] = useState();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const [tableColumns, setTableColumns] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [current, setCurrent] = useState();
  const [offset, setOffset] = useState(0);
  const refInput = useRef();
  // const [data, setData] = useState(originData);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [assetDataList, setAssetDataList] = useState([]);
  const [selectionType,] = useState('checkbox');
  const [count, setCount] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [assetTypes, setAssetsTypeList] = useState([]);
  const [assetTypeFieldMapping, setAssetTypeFieldMapping] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState('All');
  const [palletStatusNames, setPalletStatusNames] = useState([]);
  const [palletStatusCodes, setPalletStatusCodes] = useState([]);

  const inputRef = useRef(null);

  const { Option } = Select;

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
    const handleSubmit1 = async (record) => {
      // setShowAddStatusDialog(value => !value);
      const values = await form.validateFields();
      let validValues = {}
      Object.keys(values).map(function (key, index) {
        if (values[key] && values[key] != "") {
          validValues[key] = values[key]
        }
      });
      if (record.pallet_id) {
        dispatch({
          type: 'palletsForm/submitPalletsUpdateForm',
          payload: {
            data: { ...values, pallet_id: record.pallet_id },
            matchBy: "pallet_id"
          },
        });
      } else {
        dispatch({
          type: 'palletsForm/submitPalletsForm',
          payload: {
            data: { ...validValues }
          },
        });
      }
    };
    // console.log(record ? record.key : '', "=== 11111", editingKey)
    let inputNode = <Input ref={inputRef} onPressEnter={() => handleSubmit1(record)} />;
    if (inputType === 'number') {
      inputNode = <InputNumber />;
    } else if (inputType === 'dropdown') {
      if (dataIndex === 'pallet_status') {
        inputNode = <Select
          key="to"
          name="to"
          dropdownStyle={{ position: "fixed" }}
          style={{ width: '100%', zIndex: 2000 }}
        >
          {
            palletStatusNames.map((item, index) => {
              return (<Option key={index} value={item}>
                {item}
              </Option>)
            })
          }
        </Select>;
      }
      if (dataIndex === 'pallet_type') {
        inputNode = <Select
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
        </Select>;
      }
    }

    return (
      <td {...restProps}>
         {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

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
      setPalletStatusCodes(statusCodes);
      let statusNames = statusCodes.map(
        (status) => status.status_name
      );
      setPalletStatusNames(statusNames);
    }
  }, [statusCodes]);

  useEffect(() => {
    if (palletsList && palletsList.length > 0) {
      palletsList.map((item, i) => {
        item.key = i;
      })
      setAssetDataList(palletsList)
      setCount(palletsList.length)
    }
  }, [palletsList]);

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

  const editAndDelete = (key, id) => {
    if (key === 'delete') {
      Modal.confirm({
        title: 'Delete',
        content: 'are you sure you want to delete this Pallet ?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => deleteItem(id),
      });
    }
  };

  const deleteItem = (id) => {
    // console.log("iddd", id)
    dispatch({
      type: 'palletsForm/deletePalletsId',
      payload: {
        data: { pallet_id: id },
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

  const handleSubmit = async (record) => {
    const values = await form.validateFields();
    if (record.pallet_id) {
      dispatch({
        type: 'palletsForm/submitPalletsUpdateForm',
        payload: {
          data: { ...values, pallet_id: record.pallet_id },
          matchBy: "pallet_id"
        },
      });
    } else {
      dispatch({
        type: 'palletsForm/submitPalletsForm',
        payload: {
          data: { ...values },
        },
      });
    }
  };

  useEffect(() => {
    if (dispatch && currentUser && currentUser.id) {
      dispatch({
        type: 'palletsForm/fetchPallets',
        payload: {
          limit: 100,
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
        type: 'palletsForm/fetchStatusCodes',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'palletsForm/fetchPalletsColumns',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'palletsForm/resetFormData',
        payload: {}
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // componentWillMount events
    // console.log("palletsUpdateStatus", palletsUpdateStatus)
    if (palletsCreateStatus || palletsDeleteReponse || palletsUpdateStatus) {
      handleModalVisible(false);
      setEditingKey('');

      if (palletsCreateStatus && palletsCreateStatus.status === 'success') {
        message.success("Pallet created successfully.");
      } else if (palletsCreateStatus && palletsCreateStatus.status === 'error') {
        message.error("Failed to create Pallet.");
      }
      if (palletsDeleteReponse && palletsDeleteReponse.status === 'success') {
        message.success("Pallet deleted successfully.");
      } else if (palletsDeleteReponse && palletsDeleteReponse.status === 'error') {
        message.error("Failed to delete Pallet.");
      }
      if (palletsUpdateStatus && palletsUpdateStatus.status === 'success') {
        message.success("Pallet update successfully.");
      } else if (palletsUpdateStatus && palletsUpdateStatus.status === 'error') {
        message.error("Failed to update Pallet.");
      }
      dispatch({
        type: 'palletsForm/fetchPallets',
        payload: {
          limit: 100,
          offset: 0
        }
      });
  
      dispatch({
        type: 'palletsForm/resetFormData',
        payload: {}
      });
    }

  }, [palletsCreateStatus, palletsDeleteReponse, palletsUpdateStatus]);

  useEffect(() => {
    let tempcolumnDefinitions = columnDefinitions;
    if (selectedAssetType !== 'All') {
      let currentMapping = assetTypeFieldMapping.find(
        (mapping) => mapping.Asset_Name === selectedAssetType
      );

      let columnsToShow = currentMapping ? currentMapping.Fields : [];
      tempcolumnDefinitions =
        _.filter(columnDefinitions, function (b) {
          return columnsToShow.map(function (c) {
            return c
          }).indexOf(b.field) > -1
        });
    }

    let columnsDef = [];
    tempcolumnDefinitions.map((item, i) => {
      // console.log(item.header_name, "******", item.field)
      if (!item.hideinform) {
        columnsDef.push({
          title: <span className="dragHandler">{item.header_name}</span>,
          dataIndex: item.field,
          //key: i,
          editable: item.editable,
          inputType: item.type,
          width: item.header_name.length > 13 ? 190 : 150,
          sorter: true,
          ellipsis: true,
          ...getColumnSearchProps(item.field, item.header_name),
        })
      } else if (item.field === 'actions') {
        columnsDef.push(
          {
            title: `Action`,
            dataIndex: '',
            //key: '',
            fixed: 'left',
            width: 100,
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <a
                    href="javascript:;"
                    onClick={() => handleSubmit(record)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    Save
                  </a>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
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
                  <Link to="#" onClick={() => editAndDelete('delete', record.pallet_id)} className={[styles.addlead, styles.deleteBtn].join(' ')} ><DeleteFilled /></Link>
                </div>
              );
            }
          }
        )
      }
    })
    setTableColumns(columnsDef)
    // }    
  }, [columnDefinitions, selectedAssetType, editingKey]);


  const handlePagination1 = (pageNumber, pageSize) => {
    dispatch({
      type: 'assetForm/fetchAssets',
      payload: {
        limit: pageSize,
        offset: ((pageNumber * pageSize) - pageSize)
      }
    });
  }


  const isEditing = (record) => record.key === editingKey;
  // console.log(palletsList, "editingKey ******", editingKey)

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    // console.log("record key", record.key)
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  // console.log("tableColumns", tableColumns)
  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        // handleSave: handleSubmit(record),
      }),
    };
  });

  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") setAssetDataList(palletsList);
    else {
      const filteredData = assetDataList.filter(item => {
        return Object.keys(item).some(key =>
          item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : ''
        );
      });
      setAssetDataList(filteredData);
    }
  }

  const handleAdd = () => {
    const newData = {
      key: count,
      pallet_type: "Adapter",
      pallet_status: "Sold",
      pallet_info: "",
      pallet_items: 0,
      pallet_sold_order: "",
      pallet_number: "",
      storage_place: ""
    }
    assetDataList.splice(-1, 1);
    setAssetDataList([newData, ...assetDataList]);
    edit(newData);
    setCount(count + 1);
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

  const externalFilterChanged = (event) => {
    const { key } = event;
    setSelectedAssetType(key);
  };


  return (
    // const { advancedOperation1, advancedOperation2, advancedOperation3 } = profileAndadvanced;
    // <PageContainer
    //   // className={styles.pageHeader}
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
          Pallets
        </div>
        <div
          style={{
            textAlign: 'center',
            width: '400px',
          }}
        >
          <Input.Search
            placeholder="Search Pallets"
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
          <Button className={styles.btns} onClick={() => handleAdd()} >
            <PlusOutlined />
          </Button>
          {/* <Button className={styles.btns} onClick={() => editAndDelete('delete', 'multiple', selectedRowsState)} ><DeleteFilled /></Button> */}
          <ExportExcel csvData={palletsList} fileName={'Pallets'} />,
        </div>
      </div>

      <Form form={form} component={false}>
        <ReactDragListView.DragColumn {...dragProps}>
          <Table
            // title={() => 'Visa tillgångar'}
            components={components}
            bordered
            // dataSource={data}
            dataSource={assetDataList}
            columns={mergedColumns}
            rowClassName="editable-row"
            rowKey="key"
            scroll={{ x: 1500, y: 1000 }}
            loading={loading}
            pagination={{
              pageSizeOptions: ['50', '100', '500'],
              showSizeChanger: true,
              onChange: handlePagination1,
              pageSize: pageSize,
              total: palletTotalCount
            }}
          // rowSelection={{
          //   type: selectionType,
          //   ...rowSelection,
          // }}
          />
        </ReactDragListView.DragColumn>
      </Form>
      {
        columnDefinitions.length > 0 && <CreateForm onCancel={() => handleModalVisible(false)} onSubmit={handleSubmit} modalVisible={createModalVisible}>
          <ProTable
            onSubmit={async (value) => {
              // console.log("value", value)
              // const success = await handleAdd(value);

              // if (success) {
              //   handleModalVisible(false);

              //   if (actionRef.current) {
              //     actionRef.current.reload();
              //   }
              // }
            }}
            rowKey="key"
            type="form"
            columns={columnDefinitions}
          />
        </CreateForm>
      }
      {row?.pallet_id && (
        <ViewDetails
          showModalDialog={showModalDialog}
          handleCancel={handleCancel}
          columnDefinitions={columnDefinitions}
          data={row}
        />
      )}
    </IntlProvider>

    // </PageContainer>
  );
}
export default connect(({ loading, assetsTypesForm, palletsForm, user, language }) => ({
  palletsForm,
  user,
  assetsTypesForm,
  currentUser: user.currentUser,
  loading: loading.effects['palletsForm/fetchAssets'],
  localeLanguage: language.localeLanguage
}))(List);
