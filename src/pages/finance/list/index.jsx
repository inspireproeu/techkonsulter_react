import { PlusOutlined, DeleteFilled, DownloadOutlined, UploadOutlined, StopOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Button } from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Link, useParams, useLocation } from 'react-router-dom'

import { connect, history } from 'umi';
import { generateExcelNew } from '@/utils/generateExcel';

import { useState, useEffect, useContext } from 'react';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
import * as moment from 'moment';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import { fetchPut, fetchPost, fetchGet, fetchDelete } from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import FileUpload from '../components/FileUpload';
import styles from '../../assets/style.less';
import NumericEditor from '../../assets/components/NumericEditor';
import AssetTypesEditor from '../components/AssetTypes';
import ProjTypesEditor from '../components/ProjTypes';
import CustomGoBackButton from '../../../uikit/GoBack';
import _ from "underscore"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      //   display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '93vh',
      //   marginLeft: '4vw',
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
      background: 'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
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
    newBtn: {
      color: '#FFFFFF',
    },
  }),
);

const Projects = (props) => {
  const { currentUser } = props;
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(100);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [enableDelete, setEnableDelete] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState();
  const [page, setPage] = useState('')
  const location = useLocation()
  const [showFileExportDialog, setShowFileExportDialog] = useState(false);
  const urlParams = useParams();
  const [projects, setProjects] = useState([]);
  const [clientName, setClientName] = useState('');

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer:
          index === 0
            ? 'ActionCellRenderer' : false,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionCurrentPageOnly: true,
        sortable: true,
        resizable: true,
        hide: (columnDef.field === 'project_id' && urlParams?.id) ? true : false,
        filter: index === 0 ? 'none' : true,
        width: index === 0 ? 140 : 'auto',
        floatingFilter: true,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        // cellRendererParams: {
        //   // onRowEditingStopped: (params) => onRowEditingStopped(params),
        //   handleDelete: (params) => handleDelete(params),
        //   userType: currentUser?.userType
        // },
        cellRendererParams: {
          handleDelete: (params) => handleDelete(params),
          projectLists: projects,
        },
        valueGetter: (params) => {
          if (columnDef.field === 'client_name') {
            return params?.data?.project_id?.client?.client_name;
          }
          if (columnDef.field === 'project_id') {
            params.data.project_id_obj = params.data.project_id;
            let proj_id = params.data.project_id?.id ? params.data.project_id?.id : params.data.project_id
            return proj_id;
          }
          if (urlParams.id) {
            params.data.project_id_obj = { id: urlParams.id };
          }


          if (columnDef.type === 'numericColumn') {
            return params.data[columnDef.field] ? params.data[columnDef.field] : null;
          }
          return params.data[columnDef.field];
        },
        valueFormatter: (params) => {
          if (columnDef.type === 'date' && params.value) {
            return params.value ? moment(params.value).format('YYYY-MM-DD') : null;
          }
          if (urlParams.id && columnDef.field === 'client_name') {
            return clientName;
          }
          if (columnDef.type === 'numericColumn' && params.value) {
            return params.value ? `${params.value}` : null;
          }

        },
      };
      if (columnDef.field === 'type') {
        columnDefinition.cellEditor = 'AssetTypesEditor';
        // columnDefinition.cellEditorParams = {
        //   values: assetTypes,
        // };
      }
      if (columnDef.field === 'project_id') {
        columnDefinition.cellEditor = 'ProjTypesEditor';
        // columnDefinition.cellEditorParams = {
        //   values: assetTypes,
        // };
      }


      return columnDefinition;
    });
  };


  const frameworkComponents = {
    ActionCellRenderer,
    NumericEditor,
    AssetTypesEditor,
    ProjTypesEditor
  };

  useEffect(() => {
    if (location && currentUser?.userType) {
      let currentpage = location.pathname.split("/")
      if (currentUser?.userType !== 'ADMIN' && currentpage[1] === 'finance') {
        history.push({
          pathname: '/projects'
        });
      }
      setPage(currentpage[1])
    }
  }, [location, currentUser]);


  useEffect(() => {
    if (gridApi) {
      getNewData(gridApi);
    }
  }, [gridApi]);

  const getNewData = async (gridApi) => {
    // console.log('gridapi', gridApi);
    setLoading(true);
    gridApi && gridApi.showLoadingOverlay();
    let fields1 = `?limit=-1&sort=order_by`

    // Fetching column definition
    fetchGet(`${DATAURLS.FINANCECOLUMNDEFINITION.url}${fields1}`, getAccessToken())
      .then(async (response) => {
        let result = response.data;
        await getProjectsFinance()

        await getProjects();

        // if (!urlParams.id) {
        //   await getProjects();
        // } else {
        //   await getProjectsFinance()
        // }
        setColumnDefs(result);
      })
      .catch((err) => {
        throw err;
      });

    // fetchGet(`${DATAURLS.PROJECTFINANCE}?${fields4}`, getAccessToken())
    //   .then((response) => {
    //     setRowData(response.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });
    gridApi.hideOverlay();
    highlightUnsavedRows();

  };

  let finFields = 'project_id.id,quantity,id,total,price,status,source,info,type,date_created,project_id.client.client_name'

  const getProjectsFinance = async () => {
    gridApi && gridApi.showLoadingOverlay();
    let filter = `&filter[status][_neq]=archived`

    let params = `limit=-1&sort=-id&fields=${finFields}`;
    if (urlParams && urlParams.id) {
      filter = `${filter}&filter[project_id]=${urlParams.id}`
    }

    await fetchGet(`${DATAURLS.PROJECTFINANCE.url}?${params}${filter}`, getAccessToken())
      .then(async (response) => {
        gridApi.hideOverlay();
        setRowData(response.data);
        let tempAPI = JSON.parse(JSON.stringify(response.data));
        setRowDataAPI(tempAPI);
        setLoading(false);
      })
      .catch((err) => {
        gridApi.hideOverlay();
        throw err;
      });

  }


  const getProjects = async () => {
    let filter = `&filter[status][_neq]=archived`
    if (urlParams && urlParams.id) {
      filter = `${filter}&filter[id]=${urlParams.id}`
    }
    let params = `limit=-1&sort=-id&fields=id,client.client_name`;
    await fetchGet(`${DATAURLS.PROJECT.url}?${params}${filter}`, getAccessToken())
      .then(async (response) => {
        let projIds = response.data.map(
          (key) => key.id
        );
        setProjects(projIds);
        if (urlParams.id) {
          let client = ''
          if (response.data.length > 0 && response.data[0]?.client) {
            client = response.data[0].client?.client_name;
          }
          setClientName(client)
        }


      })
      .catch((err) => {
        gridApi.hideOverlay();
        throw err;
      });

  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    // getNewData(params.api);
  };

  useEffect(() => {
    if (!gridApi) {
      return;
    }
    let allColumnIds = gridApi.columnModel.gridColumns.map(
      (col) => col.colId
    );
    gridApi.columnModel.setColumnsVisible(allColumnIds, false);
  }, [gridApi]);

  const onRowSelected = (params) => {
    setEnableDelete(gridApi.getSelectedRows().length > 0);
  };

  const handleBulkDelete = async (props) => {
    let selectedRows = gridApi.getSelectedRows();
    let selectedIds = selectedRows.map((row) => row.id);
    setLoading(true);

    let selectedData = { keys: selectedIds, data: { status: 'archived' } }

    fetchPut(DATAURLS.PROJECTFINANCE.url, selectedData, getAccessToken())
      .then(async (res) => {
        if (res.data?.length > 0) {
          //update project finance
          let allprojectids = selectedRows.map((row) => row.project_id.id);
          allprojectids = _.uniq(allprojectids)
          await fetchGet(
            `${DATAURLS.UPDATEPROJECTFINANCE.url}?ids=${allprojectids.toString()}`,
            getAccessToken()
          )
          setSnackBarOpen(true);
          setSnackBarMessage('Successfully deleted');
          setSnackBarType('success');
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage('Faile to delete project');
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const handleDelete = async (params) => {
    let obj = { status: 'archived', id: params.data.id }
    if (params.data.id) {
      obj.id = params.data.id;
      if (params.data?.project_id?.id) {
        obj.project_id = params.data.project_id.id;
      }
    }
    fetchPut(`${DATAURLS.PROJECTFINANCE.url}/${params.data.id}`, obj, getAccessToken())
      .then(async (res) => {
        if (res.data.id) {
          //update project finance
          await fetchGet(
            `${DATAURLS.UPDATEPROJECTFINANCE.url}?ids=${obj.project_id}`,
            getAccessToken()
          )

          setSnackBarOpen(true);
          setSnackBarMessage('Successfully deleted');
          setSnackBarType('success');
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage(res.message);
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const getRefresData = (params) => {
    setRowData(params);
    gridApi.redrawRows({ rowNodes: [params.node] });

  }

  const highlightUnsavedRows = (params) => {
    // console.log('highlightUnsavedRows', params);
    if (!params || rowDataAPI.length === 0) {
      return;
    }
    let missingRowNodes = params.api.rowModel.rowsToDisplay.filter((row) => {
      if (!row.data.pallet_id) {
        return row;
      }
    });

    // console.log('highlightUnsavedRows', missingRowNodes);
    if (missingRowNodes.length > 0) {
      missingRowNodes.map((node) => {
        if (params.node !== node) {
          node.setSelected(true);
        }
      });
    }
  };

  const bgColorDecider = (params, rowDataAPI) => {
    return false;
  };

  function confirm() {
    Modal.confirm({
      header_name: 'Delete multiple',
      // icon: false,
      content: 'Are you sure that you want to delete these finance?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete,
    });
  }

  const handleOpen = () => {
    confirm();
  };

  const handleExport = (generateData = []) => {
    generateExcelNew(gridApi, `Projects-finance`, generateData, urlParams?.id);
  };

  const handleFileExportOpen = (params) => {
    setShowFileExportDialog(true);
    setSelectedAsset(params)
  };

  const onRowEditingStarted = (params) => {
    // getRowStyle
    // params.colDef.cellStyle = { color: 'red' };
    gridApi.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };

  const onRowEditingStopped = (params) => {
    gridApi.stopEditing();
    let currentRowFromAPI = rowDataAPI.find(
      (row) => parseInt(row.id) === parseInt(params.data.id)
    );
    if (
      currentRowFromAPI &&
      JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
    ) {

      return;
    }
    if (currentRowFromAPI) {
      handleUpdate(params);
      return;
    }
    if (params.data.id) {
      handleUpdate(params);
      return;
    }
    handleSave(params);
  };

  const handleUpdate = (params) => {
    params.data.type = params.data.type ? params.data.type.toLowerCase() : null;
    delete params.data.client_name;

    params.data.project_id = params.data.project_id_obj.id ? params.data.project_id_obj.id : null;
    delete params.data.project_id_obj;
    if (!params.data.project_id) {
      setSnackBarOpen(true);
      setSnackBarMessage("Please select project number.");
      setSnackBarType('error');
      return
    }
    fetchPut(
      `${DATAURLS.PROJECTFINANCE.url}/${params.data.id}?fields=${finFields}`,
      params.data,
      getAccessToken()
    )
      .then((response) => {
        if (response?.data?.id) {
          // let index = params.node.rowIndex
          // let rowDataCopy = [...rowData];
          // rowDataCopy[index] = response.data
          // setRowData(rowDataCopy);
          setSnackBarOpen(true);
          setSnackBarMessage("Project finance updated successfully");
          setSnackBarType('success');
          gridApi.redrawRows({ rowNodes: [params.node] });
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage("Something went wrong.");
          setSnackBarType('error');
          gridApi.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: 'id',
          });
        }
        setLoading(false);
        gridApi.hideOverlay();

      })
      .catch((err) => {
        throw err;
      });
  }

  const handleSave = (params) => {
    if (params.data.project_id) {
      fetchPost(
        `${DATAURLS.PROJECTFINANCE.url}?fields=${finFields}`,
        params.data,
        getAccessToken()
      )
        .then((response) => {
          if (response?.data?.id) {
            let index = params.node.rowIndex
            let rowDataCopy = [...rowData];
            rowDataCopy[index] = response.data
            setRowData(rowDataCopy);
            setSnackBarOpen(true);
            setSnackBarMessage("Project finance added successfully");
            setSnackBarType('success');
            gridApi.redrawRows({ rowNodes: [params.node] });
          } else {
            setSnackBarOpen(true);
            setSnackBarMessage("Something went wrong.");
            setSnackBarType('error');
            gridApi.startEditingCell({
              rowIndex: params.rowIndex,
              colKey: 'id',
            });
          }
          setLoading(false);
          gridApi.hideOverlay();

        })
        .catch((err) => {
          throw err;
        });
    }
  }

  const handleAddNew = async (data) => {
    if (gridApi) {
      gridApi.paginationGoToFirstPage();
    }
    gridApi.setFilterModel(null);
    let newRow = [{ ...data, status: 'published', dat_created: moment().format('YYYY-MM-DD'), project_id: urlParams.id ? urlParams.id : null, quantity: 1 }];
    setRowData((prev) => [...newRow, ...prev]);
    setTimeout(() => {
      gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'quantity',
        keyPress: '1',
      });
    }, 1200);
    gridApi.deselectAll();

  };
  return (
    <div className={classes.root}>
      <div className="proj-container">
        <CustomGoBackButton to={`financials${urlParams?.id ? "/" + urlParams.id : ''}`} color="warning" title='Go Back' />
      </div>
      <div className={'sectionHeader'}>
        Project Cost {urlParams?.id ? " - " + urlParams.id : ''}
        <Paper component="form" className={classes.textRoot}>
          <InputBase
            className={classes.input}
            placeholder="Search Project"
            inputProps={{ 'aria-label': 'Search Project' }}
            value={quickFilterText}
            onChange={(event) => setQuickFilterText(event.target.value)}
          />
          <IconButton
            // type='submit'
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <div className={classes.actionArea}>
          {
            // (currentUser && currentUser?.userType === 'ADMIN' || currentUser && currentUser?.userType === 'CLIENT') &&
            <>
              <Button style={{ verticalAlign: 'bottom', background: 'red' }} className={[styles.btns, styles.reset].join(' ')} onClick={() => gridApi && gridApi.setFilterModel(null)} >
                <span className="instorage">Reset Filter</span>
              </Button>
              {
                <>

                  <PlusOutlined
                    onClick={() => handleAddNew()}
                    title="Add"
                    className={classes.actionIcon}
                  />
                </>
              }
              <Tooltip placement="topLeft" title="Import">
                <UploadOutlined
                  className={classes.actionIcon}
                  onClick={() => setFileUploadOpen(true)}
                />
              </Tooltip>
            </>
          }
          {
            <Tooltip placement="topLeft" title="Export">
              <DownloadOutlined
                className={classes.actionIcon}
                onClick={() => handleExport()}
              />
            </Tooltip>
          }
          {
            currentUser?.userType === 'ADMIN' && <DeleteFilled
              // icon={faTrash}
              title="Delete"
              className={classes.actionIconDisabled}
              onClick={() => handleOpen()}
            />
          }
        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{
          width: '95%',
          height: rowData.length > 100 ? '90vh' : '60vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
        <AgGridReact
          rowData={rowData}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          components={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection="multiple"
          onRowSelected={onRowSelected}
          enableCellTextSelection={true}
          onRowEditingStopped={onRowEditingStopped}
          onRowEditingStarted={onRowEditingStarted}
          editType='fullRow'
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={overlayLoadingTemplate}
          getNewData={getNewData}
          handleDelete={handleDelete}
          setRowData={getRefresData}
          pagination={true}
          floatingFilter={true}
          paginationPageSize={pageSize}
          suppressRowClickSelection={true}
          alwaysShowVerticalScroll={true}
          quickFilterText={quickFilterText}
          users={users}
          parentGridApi={gridApi}
          setSnackBarOpen={setSnackBarOpen}
          setSnackBarMessage={setSnackBarMessage}
          setSnackBarType={setSnackBarType}
          handleFileExportOpen={handleFileExportOpen}
          // projectLists={projects}
          project_id={urlParams.id ? urlParams.id : null}
        ></AgGridReact>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackBarOpen(snackBarType === 'error' ? true : false)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setSnackBarOpen(false)}
            severity={snackBarType}
          >
            {snackBarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
      <FileUpload
        open={fileUploadOpen}
        setOpen={setFileUploadOpen}
        allAssets={rowData}
        title='Project Finance file upload'
        handleCancel={setFileUploadOpen}
        getNewData={getNewData}
        parentGridApi={gridApi}
        currentUser={currentUser}
        project_id={urlParams.id ? urlParams.id : null}
      />
    </div >
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Projects);
