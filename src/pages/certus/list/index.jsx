import Icon, {
  UploadOutlined,
  DownloadOutlined,
  WindowsOutlined,
  AppleOutlined, AndroidOutlined
} from '@ant-design/icons';
import Divider from '@material-ui/core/Divider';
import {
  Button,
  Modal,
  Tooltip,
  Menu, Input,
  Dropdown
} from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect, useRef } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../../assets/components/ActionCellRenderer';
// import BulkUpdateDialog from '../components/BulkUpdateDialog';
import CustomDropdown from '../../assets/components/CustomDropdown';
// import FileUploadDialog from '../components/FileUploadDialog';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
  fetchGet,
  FormatFilterValues
} from '@/utils/utils';
import { generateExcelNew } from '@/utils/generateExcel';
import { getAccessToken } from '@/utils/authority';
import FileUpload from '../components/FileUpload';
import { Tabs } from 'antd';
import { connect, history } from 'umi';
import { useLocation } from 'react-router-dom'

const { TabPane } = Tabs;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '93vh',
      // marginLeft: '4vw',
      // marginTop: '80px',
    },

    buttonBox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '50%',
    },
    buttonArea: {
      display: 'flex',
    },
    select: {
      color: 'white',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // color: '#212121',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1rem',
      // marginTop: '10px',
      width: '95%',
      height: '40px',
      boxShadow: '0px 0px 5px #222',
      paddingLeft: '10px',
      background:
        'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
    },
    actionArea: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '30%',
    },
    actionIcon: {
      fontSize: '1rem',
      cursor: 'pointer',
      color: theme.primary,
    },
    textRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      height: '30px',
    },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  })
);

const frameworkComponents = {
  //   CustomCellEditor: CustomCellEditor,
  ActionCellRenderer: ActionCellRenderer,
};

const Certus = (props) => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Loading, Please Wait...</span>';

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        cellRenderer: false,
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        headerName: columnDef.header_name,
        field: columnDef.field1,
        editable: columnDef.editable,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        floatingFilter: true,
        width: index === 0 ? 140 : 'auto',
      };

      return columnDefinition;
    });
  };

  const buildColumnDefinitions1 = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        cellRenderer: false,
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        headerName: columnDef.header_name,
        field: columnDef.field1,
        editable: columnDef.editable,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        floatingFilter: true,
        width: index === 0 ? 140 : 'auto',
      };

      return columnDefinition;
    });
  };

  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(50);
  const [rowData, setRowData] = useState([]);
  const [rowDataMobile, setRowDataMobile] = useState([]);
  const [rowDataMobileNew, setRowDataMobileNew] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [rowDataAPIMobile, setRowDataAPIMobile] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [columnDefsMobile, setColumnDefsMobile] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [gridApiMobile, setGridApiMobile] = useState();
  const [gridApiMobileNew, setGridApiMobileNew] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const [quickFilterTextMobile, setQuickFilterTextMobile] = useState('');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState('computer');
  const [dataSourceparams, setDataSourceparams] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(1000);

  const location = useLocation();

  const { currentUser } = props;

  useEffect(() => {
    if (location && currentUser) {
      let currentpage = location.pathname.split("/")
      if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'certus') {
        history.push({
          pathname: '/projects'
        });
      }
      // setPage(currentpage[1])
    }
  }, [location, currentUser]);



  const externalFilterChangedNew = (value) => {
    setSelectedAssetType(value);
  };


  const getColumnDefinitions = async (gridApi) => {

    setLoading(true);
    gridApi.showLoadingOverlay();
    let fields1 = '?limit=-1&sort=order_by_id'

    // Fetching column definition
    fetchGet(`${DATAURLS.CERTUS_COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
      .then((response) => {
        // console.log('response col def', response.columnDefinitions);
        setColumnDefs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    // gridApi.sizeColumnsToFit();
  };


  const getNewData = async (request = dataSourceparams, isExport = false) => {
    setLoading(true);
    gridApi.showLoadingOverlay();
    const currentpage = request ? request.endRow / rowsPerPage : 1;

    let options = {
      filter: {
      }
    }

    if (request && Object.keys(request.filterModel).length > 0) {
      const filterVal = FormatFilterValues(request.filterModel);
      let filterParam = options.filter['_and'] ? [...options.filter['_and'], ...filterVal] : [...filterVal];

      options.filter['_and'] = filterParam
    }

    let fields = `?limit=${isExport ? '-1' : rowsPerPage}${!isExport ? "&page=" + (currentpage) : ''}&meta[]=filter_count&sort=-created_date`
    fields = `${fields}&filter=${JSON.stringify(options.filter)}`

    // Fetching data
    fetchGet(`${DATAURLS.CERTUS.url}${fields}`, getAccessToken())
      .then((response) => {
        //console.log('response', response);
        setLoading(false);
        if (response.data) {
          setRowData(response.data);
          let tempAPI = JSON.parse(JSON.stringify(response.data));
          setRowDataAPI(tempAPI);
          request.successCallback(response.data, response.meta.filter_count);
          gridApi.hideOverlay();
        }
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const getNewMobileData = async (gridApiMobile) => {
    setLoading(true);
    gridApiMobile && gridApiMobile.showLoadingOverlay();
    let fields = '?limit=-1&sort=-created_at'
    let fields1 = '?limit=-1&sort=order_by_id'

    // Fetching data
    fetchGet(`${DATAURLS.CERTUSMOBILEGET.url}${fields}`, getAccessToken())
      .then((response) => {
        //console.log('response', response);
        setLoading(false);
        if (response?.data) {
          setRowDataMobile(response.data);
          let tempAPI = JSON.parse(JSON.stringify(response.data));
          setRowDataAPIMobile(tempAPI);
          gridApiMobile && gridApiMobile.hideOverlay();
        }
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
    // Fetching column definition
    fetchGet(`${DATAURLS.CERTUS_MOBILE_COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
      .then((response) => {
        // console.log('response col def', response.columnDefinitions);
        setColumnDefsMobile(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    // gridApi.sizeColumnsToFit();
  };

  const getNewCertusMobileData = async (gridApiMobile) => {
    setLoading(true);
    gridApiMobileNew && gridApiMobileNew.showLoadingOverlay();
    let fields = '?limit=-1&sort=-date_created'
    let fields1 = '?limit=-1&sort=order_by_id'

    // Fetching certus mobile data
    fetchGet(`${DATAURLS.CERTUSMOBILENEW.url}${fields}`, getAccessToken())
      .then((response) => {
        //console.log('response', response);
        setLoading(false);
        if (response?.data) {
          setRowDataMobileNew(response.data);
          let tempAPI = JSON.parse(JSON.stringify(response.data));
          setRowDataAPIMobile(tempAPI);
          gridApiMobileNew && gridApiMobileNew.hideOverlay();
        }
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });

    // Fetching column definition
    fetchGet(`${DATAURLS.CERTUS_MOBILE_NEW_COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
      .then((response) => {
        // console.log('response col def', response.columnDefinitions);
        setColumnDefsMobile(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    // gridApi.sizeColumnsToFit();
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    getColumnDefinitions(params.api)

  };
  const onGridReadyMobile = (params) => {
    // console.log("certus mobileeeeee")
    setGridApiMobile(params.api);
    getNewMobileData(params.api);
  };

  const onGridReadyMobileNew = (params) => {
    // console.log("certus mobileeeeee")
    setGridApiMobileNew(params.api);
    getNewCertusMobileData(params.api);
  };

  const onModelUpdated = (params) => {
    // console.log()
    // params.api.sizeColumnsToFit();
  };

  const handleExport = (generateData = [], action = null) => {
    if (action == 'certus') {
      generateExcelNew(gridApi, `Certus`, generateData);
    } else if (action == 'certusmanual') {
      generateExcelNew(gridApiMobile, `Certus_Mobile`, generateData);
    } else if (action == 'certusauto') {
      generateExcelNew(gridApiMobileNew, `Certus_Mobile_New`, generateData);
    }
  };

  const selectReport = (key) => {
    setSelectedAssetType(key)
    if (key === 'computer') {
      getNewData(gridApi)
    } else if (key === 'mobile') {
      setGridApiMobile(gridApiMobile);
      // getNewMobileData(gridApiMobile)
    } else if (key === 'mobile1') {
      setGridApiMobileNew(gridApiMobileNew);
      // getNewMobileData(gridApiMobile)
    }
  }

  function clearFilters() {
    gridApi.setFilterModel(null);
  }

  //SSR
  useEffect(() => {
    if (gridApi && columnDefs?.length > 0) {
      const dataSource = {
        getRows: (params) => {
          getNewData(params)
          setDataSourceparams(params);
          // getAssetTypes()

        }
      }
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi, columnDefs]);

  return (
    <>
      <Tabs defaultActiveKey={selectedAssetType} onChange={selectReport}>
        <TabPane
          tab={<span><WindowsOutlined /> Certus Device</span>}
          key="computer"
        >
          <div className={classes.root}>
            <div className={'sectionHeader'}>
              Certus Devices
              <Paper component='form' className={classes.textRoot}>
                <InputBase
                  className={classes.input}
                  placeholder='Search Certus Devices'
                  inputProps={{ 'aria-label': 'Search Certus Devices' }}
                  value={quickFilterText}
                  onChange={(event) => setQuickFilterText(event.target.value)}
                />
                <IconButton
                  // type='submit'
                  className={classes.iconButton}
                  aria-label='search'
                >
                  <SearchIcon />
                </IconButton>
              </Paper>

              <div className={classes.actionArea}>
                <Button style={{ verticalAlign: 'bottom', background: 'red', color: 'white' }} onClick={() => clearFilters()} >
                  <span className="instorage">Reset Filter</span>
                </Button>
                <DownloadOutlined
                  // icon={DownloadOutlined}
                  // title='Export'
                  className={classes.actionIcon}
                  onClick={() => handleExport([], 'certus')}
                />
              </div>
            </div>
            <div
              className='ag-theme-quartz'
              style={{
                width: '95%',
                height: '80vh',
                boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
              }}
            >
              <AgGridReact
                rowData={rowData}
                rowModelType={"infinite"}
                debounceVerticalScrollbar={true}
                columnDefs={buildColumnDefinitions(columnDefs)}
                components={frameworkComponents}
                suppressDragLeaveHidesColumns={true}
                onGridReady={onGridReady}
                rowSelection='multiple'
                overlayLoadingTemplate={overlayLoadingTemplate}
                maxBlocksInCache={rowsPerPage}
                cacheBlockSize={rowsPerPage}
    
                pagination={true}
                enableCellTextSelection={true}
                paginationPageSize={rowsPerPage}
                suppressRowClickSelection={true}
                alwaysShowVerticalScroll={true}
                quickFilterText={quickFilterText}
                onModelUpdated={onModelUpdated}
                suppressFieldDotNotation={true}
              ></AgGridReact>
              {/* <FileUpload
                open={fileUploadOpen}
                setOpen={setFileUploadOpen}
                allAssets={rowData}
                title='Mobile device upload'
                handleCancel={setFileUploadOpen}
                getNewData={getNewData}
                parentGridApi={gridApi}
              /> */}
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
          </div>
        </TabPane>
        <TabPane
          tab={<span><AppleOutlined style={{ marginRight: 0 }} /><AndroidOutlined /> Certus Mobile Device (Manual)</span>}
          key="mobile"
        >
          <div className={classes.root}>
            <div className={'sectionHeader'}>
              Certus Mobile Device (Manual)
              <Paper component='form' className={classes.textRoot}>
                <InputBase
                  className={classes.input}
                  placeholder='Search Certus Mobile Devices'
                  inputProps={{ 'aria-label': 'Search Certus Mobile Devices' }}
                  value={quickFilterText}
                  onChange={(event) => setQuickFilterText(event.target.value)}
                />
                <IconButton
                  // type='submit'
                  className={classes.iconButton}
                  aria-label='search'
                >
                  <SearchIcon />
                </IconButton>
              </Paper>

              <div className={classes.actionArea}>
                <Button style={{ verticalAlign: 'bottom', background: 'red', color: 'white' }} onClick={() => clearFilters()} >
                  <span className="instorage">Reset Filter</span>
                </Button>
                <Tooltip placement="topLeft" title="Import">
                  <UploadOutlined
                    // icon={faUpload}
                    // title='Import'
                    className={classes.actionIcon}
                    onClick={() => setFileUploadOpen(true)}
                  />
                </Tooltip>
                <Divider orientation='vertical' flexItem />
                <DownloadOutlined
                  // icon={DownloadOutlined}
                  // title='Export'
                  className={classes.actionIcon}
                  onClick={() => handleExport([], 'certusmanual')}
                />
              </div>
            </div>
            <div
              className='ag-theme-quartz'
              style={{
                width: '95%',
                height: '80vh',
                boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
              }}
            >
              <AgGridReact
                rowData={rowDataMobile}
                debounceVerticalScrollbar={true}
                columnDefs={buildColumnDefinitions1(columnDefsMobile)}
                components={frameworkComponents}
                suppressDragLeaveHidesColumns={true}
                onGridReady={onGridReadyMobile}
                rowSelection='multiple'
                overlayLoadingTemplate={overlayLoadingTemplate}
                // getNewData={getNewMobileData}
                pagination={true}
                enableCellTextSelection={true}
                paginationPageSize={pageSize}
                suppressRowClickSelection={true}
                alwaysShowVerticalScroll={true}
                quickFilterText={quickFilterText}
                onModelUpdated={onModelUpdated}
                suppressFieldDotNotation={true}
              ></AgGridReact>
              <FileUpload
                open={fileUploadOpen}
                setOpen={setFileUploadOpen}
                allAssets={rowDataMobile}
                title='Mobile device upload'
                handleCancel={setFileUploadOpen}
                getNewData={getNewMobileData}
                parentGridApi={gridApiMobile}
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
          </div>
        </TabPane>
        <TabPane
          tab={<span><AppleOutlined style={{ marginRight: 0 }} /><AndroidOutlined /> Certus Mobile Device (Automate)</span>}
          key="mobile1"
        >
          <div className={classes.root}>
            <div className={'sectionHeader'}>
              Certus Mobile Device (Automate)
              <Paper component='form' className={classes.textRoot}>
                <InputBase
                  className={classes.input}
                  placeholder='Search Certus Mobile Devices'
                  inputProps={{ 'aria-label': 'Search Certus Mobile Devices' }}
                  value={quickFilterText}
                  onChange={(event) => setQuickFilterText(event.target.value)}
                />
                <IconButton
                  // type='submit'
                  className={classes.iconButton}
                  aria-label='search'
                >
                  <SearchIcon />
                </IconButton>
              </Paper>

              <div className={classes.actionArea}>
                <Button style={{ verticalAlign: 'bottom', background: 'red', color: 'white' }} onClick={() => clearFilters()} >
                  <span className="instorage">Reset Filter</span>
                </Button>
                {/* <Tooltip placement="topLeft" title="Import">
                  <UploadOutlined
                    // icon={faUpload}
                    // title='Import'
                    className={classes.actionIcon}
                    onClick={() => setFileUploadOpen(true)}
                  />
                </Tooltip> */}
                <Divider orientation='vertical' flexItem />
                <DownloadOutlined
                  // icon={DownloadOutlined}
                  // title='Export'
                  className={classes.actionIcon}
                  onClick={() => handleExport([], 'certusauto')}
                />
              </div>
            </div>
            <div
              className='ag-theme-quartz'
              style={{
                width: '95%',
                height: '80vh',
                boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
              }}
            >
              <AgGridReact
                rowData={rowDataMobileNew}
                debounceVerticalScrollbar={true}
                columnDefs={buildColumnDefinitions1(columnDefsMobile)}
                components={frameworkComponents}
                suppressDragLeaveHidesColumns={true}
                onGridReady={onGridReadyMobileNew}
                rowSelection='multiple'
                overlayLoadingTemplate={overlayLoadingTemplate}
                // getNewData={getNewMobileData}
                pagination={true}
                enableCellTextSelection={true}
                paginationPageSize={pageSize}
                suppressRowClickSelection={true}
                alwaysShowVerticalScroll={true}
                quickFilterText={quickFilterText}
                onModelUpdated={onModelUpdated}
                suppressFieldDotNotation={true}
              ></AgGridReact>

            </div>
          </div>
        </TabPane>
      </Tabs>

    </>
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user.currentUser,
}))(Certus);