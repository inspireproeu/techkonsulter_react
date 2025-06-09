import React, { useRef, useState, useEffect } from 'react';

import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  EditOutlined,
  DownOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Modal,
  Form,
  Space,
  Tooltip,
  Menu, Input,
  Dropdown
} from 'antd';
import ProTable, { ProColumns, IntlProvider, enUSIntl } from '@ant-design/pro-table';
import { connect, Link, FormattedMessage, formatMessage } from 'umi';
import styles from '../style.less';
import ViewDetails from '../components/ViewDetails';
// import CustomerModal from '../components/CustomerModal';
import ProDescriptions from '@ant-design/pro-descriptions';
import ExportExcel from '@/utils/exportExcel';
import Highlighter from 'react-highlight-words';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import CustomDropdown from '../../components/CustomDropdown';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import "./style.less";
// import ActionCellRenderer from '../components/ActionCellRenderer';

const List = (props) => {
  const { loading, dispatch, certusForm: { assetsList, assetTotalCount, columnDefinitions }, currentUser, localeLanguage } = props;
  // console.log("columnDefinitions****", columnDefinitions)
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [customerData, setCustomerData] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const [tableColumns, setTableColumns] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [offset, setOffset] = useState(0);
  const [assetDataList, setAssetDataList] = useState([]);
  const [tempLoading, setTempLoading] = useState(true)
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const [enableBulkUpdates, setEnableBulkUpdates] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [form] = Form.useForm();
  const [selectedAssetType, setSelectedAssetType] = useState('All');

  const refInput = useRef();

  const buildColumnDefinitions = (columnDefs, assetTypes) => {
    return columnDefs.map((columnDef, index) => {
      if (columnDef.type === 'date') {
        console.log({ columnDef });
      }
      let columnDefinition = {
        headerName: index !== 0 ? columnDef.header_name : '',
        cellRenderer: index === 0 ? 'ActionCellRenderer' : false,

        cellRendererParams: {
          onRowEditingStopped: (params) => onRowEditingStopped(params),
        },
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field1,
        editable: columnDef.editable,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        width: index === 0 ? 100 : 250,

        valueFormatter: (params) => {
          if (columnDef.type === 'currencyColumn') {
            console.log('valueformatter - currency', params);

            return params.value ? '\xA3' + params.value : ' ';
          }

          if (columnDef.type === 'date') {
            return moment(params.value).format('YYYY/MM/DD HH:mm');
          }
        },
      };
      if (columnDef.field === 'asset_type') {
        columnDefinition.cellEditor = 'agSelectCellEditor';
        columnDefinition.cellEditorParams = {
          values: assetTypes,
        };
      }

      if (columnDef.field === 'pallet_number') {
        columnDefinition.cellEditor = 'DialogEditor';
        columnDefinition.cellEditorParams = {
          values: palletNumbers.sort((a, b) => (a > b ? -1 : 1)),
        };
      }
      if (columnDef.field === 'status') {
        columnDefinition.cellEditor = 'agSelectCellEditor';
        columnDefinition.cellEditorParams = {
          values: statusNames,
        };
      }
      if (columnDef.type === 'numericColumn') {
        columnDefinition.cellEditor = 'NumericEditor';
      }
      if (columnDef.type === 'currencyColumn') {
        columnDefinition.cellEditor = 'CurrencyEditor';
      }

      return columnDefinition;
    });
  };


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

    // this.setState({
    //   searchText: selectedKeys[0],
    //   searchedColumn: dataIndex,
    // });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')

    // this.setState({ searchText: '' });
  };


  const columns = [
    {
      title: `Report Custom Field 1`,
      dataIndex: 'project_id',
      key: 'project_id',
      render: (dom, entity) => {
        return <Link onClick={() => { setRow(entity); setShowModalDialog(true); }}>{dom}</Link>;
      },
    },
    {
      title: `Report Custom Field 5`,
      dataIndex: 'asset_id',
      key: 'asset_id',
      // render: (item) => {
      //   return <div>{Asset_id}</div>;
      // },
    },
    {
      title: `Report System Chassis Type`,
      dataIndex: 'chasis_type',
      key: 'chasis_type',
    },
    {
      title: `Report System Manufacturer`,
      dataIndex: 'system_manufacturer',
      key: 'system_manufacturer',
      render: (item) => {
        return <div className={styles.tableCell}>{item}</div>;
      },
    },
    {
      title: `Report System Model`,
      dataIndex: 'system_model',
      key: 'system_model',

    },
    {
      title: `Report System Serial Number`,
      dataIndex: 'serial_number',
      key: 'serial_number',
    },
    {
      title: `Report Erasure Device Type`,
      dataIndex: 'device_type',
      key: 'device_type',

    },
    {
      title: `Action`,
      dataIndex: '',
      key: '',
      render: (_, record) => {
        return <div>
          <Link onClick={() => {
            setRow(record);
            setShowModalDialog(true);
          }
          } className={styles.addlead} ><EyeFilled /></Link>
        </div>;
      },
    }
  ];

  useEffect(() => {
    // componentWillMount events
    // console.log("columnDefinitions", columnDefinitions);
    let columnsDef = [];
    columnDefinitions.map((item, i) => {
      let width = 100;
      if (item.header_name.length > 8) {
        width = 100
      } else if (item.header_name.length > 10) {
        width = 130
      } else if (item.header_name.length > 12) {
        width = 150
      } else if (item.header_name.length > 14) {
        width = 180
      }
      if (!item.hideinform) {
        columnsDef.push({
          title: item.header_name,
          dataIndex: item.field1,
          key: item.order_by_id,
          width: 250,
          sorter: true,
          ellipsis: true,
          ...getColumnSearchProps(item.field1, item.header_name),
        })
      } else if (item.field1 === 'actions') {
        columnsDef.push(
          {
            title: `Action`,
            dataIndex: '',
            key: '',
            fixed: 'left',
            width: 100,
            render: (_, record) => {
              return <div>
                <Link onClick={() => {
                  setRow(record);
                  setShowModalDialog(true);
                }
                } className={styles.addlead} ><EyeFilled /></Link>
              </div>;
            },
          }
        )
      }
    })
    // console.log("columnsDef", columnsDef)
    setTableColumns(columnsDef)
    // }    
  }, [columnDefinitions]);


  const handleCancel = async () => {
    setShowModalDialog(value => !value);
  };
  const handleViewCancel = async () => {
    setShowDialog(value => !value);
  };

  useEffect(() => {
    if (!gridApi) {
      return;
    }
    let allColumnIds = gridApi.columnController.gridColumns.map(
      (col) => col.colId
    );
    // console.log("allColumnIds", allColumnIds)
    // let currentMapping = assetTypeFieldMapping.find(
    //   (mapping) => mapping.Asset_Name === selectedAssetType
    // );
    let mobileFields = ["document_id", "asset_id", "report_operator", "report_date", "reort_date_modified", "software_version", "operator_group_name", "mobile_lot_number", "system_manufacturer", "system_model", "device_model_number", "erasure_status", "number_of_erasures", "chasis_type", "serial_number", "device_imei", "device_operating_system", "device_operating_system_version", "device_rooted", "device_ram", "device_ecid", "device_meid", "device_uuid", "device_color", "device_battery_level", "device_battery_health", "device_internal_memory", "device_external_memory", "project_id", "asset_id", "grade", "comments", "Mobile_Report_Custom5"];
    let computerfields = ["document_id", "asset_id", "report_date", "software_version", "project_id", "report_status", "lot_number", "system_manufacturer", "serial_number", "compliane_requested", "compliane_resulted", "smart_health", "performance", "report_operator", "chasis_type", "system_model", "uuid", "motherboard", "bios", "processor", "device", "memory", "graphic_card", "sound_card", "adapter", "optical_drive", "controller", "peripheral_ports", "battery", "device_hpa", "device_dco", "easure_pattern", "verification_percentage", "erasure_time_start", "erasure_time_end", "erasure_duration", "erasure_status", "erasure_hidden_area", "erasure_sectors", "erasure_failed_sector", "erasure_remapped_sectors", "software_version", "keyboard", "complaint", "grade", "asset_id", "operator_name", "operator_group_name", "smart_erl", "power_on_time", "read_errors", "errors_corrected", "errors_uncorrected", "write_errors", "write_errors_correced", "write_errors_uncorreced", "verify_errors", "verify_errors_correced", "verify_errors_uncorreced", "erasure_lot_name", "device_vendor", "device_model", "device_type", "bus_type", "device_serial_number", "device_size", "device_sectors", "device_sector_size", "remapped_sectors"];
    let columnsToShow = [];

    if (selectedAssetType === 'mobile') {
      columnsToShow = mobileFields;
      setQuickFilterText(selectedAssetType)
    } else if (selectedAssetType === 'computer') {
      columnsToShow = computerfields;
      setQuickFilterText(selectedAssetType)
    } else {
      setQuickFilterText('')
    }
    console.log(selectedAssetType, "selectedAssetType", columnsToShow)
    if (!columnsToShow || columnsToShow.length === 0) {
      gridApi.columnController.setColumnsVisible(allColumnIds, true);
      return;
    }

    gridApi.columnController.setColumnsVisible(allColumnIds, false);
    gridApi.columnController.setColumnsVisible(columnsToShow, true);
  }, [gridApi, selectedAssetType]);


  useEffect(() => {
    // componentWillMount events
    if (dispatch && currentUser && currentUser.id) {

      dispatch({
        type: 'certusForm/fetchAssets',
        payload: {
          limit: 10,
          offset: 0
        }
      });
      dispatch({
        type: 'certusForm/fetchCertusColumns',
        payload: {
          limit: 1000,
          offset: 0
        }
      });
      dispatch({
        type: 'certusForm/resetFormData',
        payload: {}
      });
    }
  }, [currentUser]);


  const handlePagination1 = (pagination, filters, sorter) => {
    //console.log("pageNumber", pageNumber);
    dispatch({
      type: 'certusForm/fetchAssets',
      payload: {
        limit: pagination.pageSize,
        offset: ((pagination.current * pagination.pageSize) - pagination.pageSize)
      }
    });
  }
  const handlePagination = (pageNumber, pageSize) => {
    dispatch({
      type: 'assetForm/fetchAssets',
      payload: {
        limit: pageSize,
        offset: ((pageNumber * pageSize) - pageSize)
      }
    });
  }

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        // editing: isEditing(record),
      }),
    };
  });

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
  // console.log("assetDataList", assetDataList)

  const onGridReady = (params) => {
    // console.log(" ***** ", params.api.getDisplayedRowCount())
    setGridApi(params.api);
    // getNewData(params.api);
  };

  useEffect(() => {
    // componentWillMount events
    // console.log("currentUser", currentUser)
    if (assetsList && assetsList.length > 0) {
      assetsList.map((item, i) => {
        item.key = item.asset_id;
      })
      setAssetDataList(assetsList)
    }
  }, [assetsList]);

  const menu = (
    <Menu
      selectedKeys={[selectedAssetType]}
      onClick={(e) => externalFilterChangedNew(e)}
    >
      <Menu.Item key={'All'}>
        All
        </Menu.Item>
      <Menu.Item key={'computer'}>
        Computer
        </Menu.Item>
      <Menu.Item key={'mobile'}>
        Mobil
        </Menu.Item>
    </Menu>);

  const externalFilterChangedNew = (event) => {
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
          Certus Devices
        </div>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Input.Search
            placeholder="Search device"
            enterButton="Search"
            size="large"
            value={quickFilterText}
            onChange={(event) => {
              event.stopPropagation();
              setQuickFilterText(event.target.value);
            }}
            // onSearch={e => filterData(e)}
            // suffix={suffix}
            allowClear
            style={{
              maxWidth: 522,
              width: '100%',
            }}
          />
        </div>
        <div style={{ textAlign: 'right', display: 'flex' }}>

          <Dropdown overlay={menu} trigger={['click']}>
            <Tooltip placement="topLeft" title="Select Device Type">
              <Link className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {selectedAssetType} <DownOutlined />
              </Link>
            </Tooltip>
          </Dropdown>

          <div style={{ textAlign: 'right' }}>
            <ExportExcel csvData={assetDataList} fileName={'Certus_devices'} />
          </div>
        </div>
      </div>
      <Form form={form} component={false}>
        <div
          className='ag-theme-balham'
          style={{
            width: '100%',
            height: '80vh',
            boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
          }}
        >
          <AgGridReact
            rowData={assetDataList}
            rowBuffer={500}
            debounceVerticalScrollbar={true}
            columnDefs={buildColumnDefinitions(columnDefinitions)}
            // frameworkComponents={frameworkComponents}
            suppressDragLeaveHidesColumns={true}
            onGridReady={onGridReady}
            rowSelection={false}
            // onRowEditingStopped={onRowEditingStopped}
            // onCellEditingStopped={onCellEditingStopped}
            // onRowSelected={onRowSelected}
            // onRowDataChanged={onRowDataChanged}
            // onRowEditingStarted={onRowEditingStarted}
            editType='fullRow'
            // getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
            // overlayLoadingTemplate={overlayLoadingTemplate}
            // getNewData={getNewData}
            // handleDelete={handleDelete}
            enableCellTextSelection={true}
            enableColResize
            pagination={true}
            paginationPageSize={50}
            suppressRowClickSelection={true}
            alwaysShowVerticalScroll={true}
            quickFilterText={quickFilterText}
            // quickFilterText={selectedAssetType !== 'All' ? selectedAssetType : ''}
            // isExternalFilterPresent={isExternalFilterPresent}
            // doesExternalFilterPass={doesExternalFilterPass}
            floatingFilter={true}
            suppressMenuHide={true}
            enableCellChangeFlash={true}
            suppressCellFlash={true}
          // stopEditingWhenGridLosesFocus={true}
          />
          <CustomDropdown
            options={[25, 50, 100, 500]}
            title={'Page Size'}
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              gridApi.paginationSetPageSize(value);
            }}
          />
        </div>
      </Form>
      {row?.asset_id && (
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
export default connect(({ loading, certusForm, user, language }) => ({
  certusForm,
  user,
  currentUser: user.currentUser,
  loading: loading.effects['certusForm/fetchAssets'],
  localeLanguage: language.localeLanguage
}))(List);
