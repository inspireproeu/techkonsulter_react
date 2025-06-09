import { DownloadOutlined, OrderedListOutlined, PlusOutlined, DeleteFilled, UploadOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useState, useEffect, useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
import AddNew from '../components/AddNew';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import { fetchPut, fetchGet, fetchDelete } from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import BulkUpdateDialog from '../components/BulkUpdateDialog';
import { generateExcelNew } from '@/utils/generateExcel';
import DropDownSelect from '../components/SelectDropDown';
import ActionDownSelect from '../components/ActionDropDown';
import { useLocation } from 'react-router-dom'
import { connect, history } from 'umi';
import _ from "lodash";
import FileUpload from '../components/FileUpload';

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
  }),
);

const frameworkComponents = {
  ActionDownSelect,
  DropDownSelect,
  ActionCellRenderer,
};

const Partnumbers = (props) => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let header = columnDef.header_name;
      let field = columnDef.field;

      let columnDefinition = {
        headerName: header,
        cellRendererParams: {
          handleEdit: (params) => handleEdit(params),
          handleDelete: (params) => handleDelete(params),
          handleApprove: (params) => handleApprove(params),
          setSnackBarOpen: (params) => setSnackBarOpen(params),
          setSnackBarMessage: (params) => setSnackBarMessage(params),
          setSnackBarType: (params) => setSnackBarType(params),
        },
        cellRenderer: index === 0 ? 'ActionCellRenderer' : field === 'status' ? 'DropDownSelect' : field === 'action' ? 'ActionDownSelect' : false,
        field: columnDef.field,
        editable: columnDef.editable,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        sortable: true,
        resizable: true,
        filter: index === 0 ? false : 'agTextColumnFilter',

        hide: columnDef.hide,
        checkboxSelection: index === 0 ? true : false,
        headerCheckboxSelection: index === 0 ? true : false,
        // headerCheckboxSelectionFilteredOnly: true,
        // headerCheckboxSelectionCurrentPageOnly: true,
        // floatingFilter: true,
        width: index === 0 ? 200 : 'auto',
        valueFormatter: (params) => {
          if (columnDef.field === 'status') {
            return params.value === 'draft' ? 'NOT APPROVED' : 'APPROVED';
          }
          return params.value === 'null' ? '' : params.value
        },
      };
      return columnDefinition;
    });
  };

  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(1000);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [columnDefs] = useState([
    {
      field: 'id',
      header_name: 'Actions',
      id: 0,
      editable: false,
    },
    {
      field: 'part_no',
      header_name: 'Part Number',
      id: 1,
      editable: false,
    },
    {
      field: 'asset_type',
      header_name: 'Asset type',
      id: 2,
      editable: false,
      bulk_update: true
    },
    {
      field: 'form_factor',
      header_name: 'Form factor',
      id: 3,
      editable: false,
      bulk_update: true
    },
    {
      field: 'manufacturer',
      header_name: 'Manufacturer',
      id: 4,
      editable: false,
      bulk_update: true
    },
    {
      field: 'model',
      header_name: 'Model',
      id: 5,
      editable: false,
      bulk_update: true
    },
    {
      field: 'model_year',
      header_name: 'Model year',
    },
    {
      field: 'base_price',
      header_name: 'Base price',
    }, {
      field: 'co2',
      header_name: 'CO2',
    }, {
      field: 'weight',
      header_name: 'Weight',
    },
    {
      field: 'status',
      header_name: 'Status',
      id: 7,
      editable: false,
      bulk_update: true
    },
  ]);
  const [enableBulkUpdates, setEnableBulkUpdates] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');

  const [addNewDialog, setAddNewDialog] = useState(false);
  const [editData, seteditData] = useState({});
  const [assetTypes, setAssetTypes] = useState([]);
  const location = useLocation();
  const { currentUser } = props;
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

  useEffect(() => {
    if (location && currentUser) {
      let currentpage = location.pathname.split("/")
      if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'partnumbers') {
        history.push({
          pathname: '/projects'
        });
      }
      // setPage(currentpage[1])
    }
  }, [location, currentUser]);

  const getAssetTypes = async () => {
    let fields3 = '?limit=-1&sort=Asset_Name&field=Asset_Name&filter[Asset_Name][_nnull]=true';

    fetchGet(`${DATAURLS.ASSETTYPES.url}${fields3}`, getAccessToken())
      .then((response) => {


        let assetNames = response.data.map(
          (assetType) => assetType.Asset_Name.toUpperCase()
        );


        setAssetTypes(_.uniq(assetNames));
      })
      .catch((err) => {
        throw err;
      });

  }
  const getNewData = async (gridApi) => {
    setLoading(true);
    gridApi && gridApi.showLoadingOverlay();
    let fields4 = 'limit=-1&sort=-id';
    // Fetching all users

    fetchGet(`${DATAURLS.PARTNUMBERS.url}?${fields4}`, getAccessToken())
      .then((response) => {
        setRowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    highlightUnsavedRows();
    gridApi && gridApi.sizeColumnsToFit();
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    getNewData(params.api);
    getAssetTypes()
  };

  const onModelUpdated = (params) => {
    params.api.sizeColumnsToFit();
  };

  const onRowSelected = (params) => {
    setEnableBulkUpdates(gridApi.getSelectedRows().length > 0);
  };

  const onRowDataChanged = (params) => {
    highlightUnsavedRows(params);
  };

  const onRowEditingStarted = (params) => {
    // console.log('on row editing started', params);
    if (params.columnApi.columnController.allDisplayedColumns) {
      gridApi.refreshCells({
        rowNodes: [params.node],
        columns: [params.columnApi.columnController.allDisplayedColumns[0]],
        force: true,
      });
    }
  };

  const handleBulkDelete = async (props) => {
    let selectedRows = gridApi.getSelectedRows();
    let selectedUserIds = selectedRows.map((row) => row.id);
    setLoading(true);

    fetchDelete(DATAURLS.PARTNUMBERS.url, selectedUserIds, getAccessToken())
      .then((res) => {
        if (res) {
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage('Failed to delete partnumber');
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const handleDelete = (params) => {
    fetchDelete(DATAURLS.PARTNUMBERS.url, [params.data.id], getAccessToken())
      .then((res) => {
        if (res.ok) {
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

  const handleExport = (generateData = []) => {
    generateExcelNew(gridApi, `Partnumbers`, generateData);
  };

  const handleApprove = (params) => {
    let values = {
      status: 'published',
      id: params.data.id
    };
    fetchPut(`${DATAURLS.PARTNUMBERS.url}/${params.data.id}`, values, getAccessToken())
      .then((res) => {
        if (res?.data?.id) {
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage(res.message);
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        throw err;
      });
  };

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
      title: 'Delete multiple',
      // icon: false,
      content: 'Are you sure that you want to delete these part numbers',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete,
    });
  }

  const handleOpen = () => {
    confirm();
  };

  const handleEdit = (params) => {
    seteditData(params.data);
    setAddNewDialog(true);
  };

  const handleAddNew = async (data) => {
    setAddNewDialog(true);
    // console.log('add new', gridApi);
    // let newRow = [{ ...data }];
    // setRowData((prev) => [...newRow, ...prev]);
  };

  const getRowStyle = (params) => {
    let status = params.node.data && params.node.data.status ? params.node.data?.status : '';
    if (status === 'draft') {
      return { background: 'red', color: 'white' };
    }
  };

  const handleBulkUpdate = (params) => {
    setBulkUpdateOpen(true);
  };
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 60,
      floatingFilter: true,
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={'sectionHeader'}>
        Part numbers
        <Paper component="form" className={classes.textRoot}>
          <InputBase
            className={classes.input}
            placeholder="Search Part no"
            inputProps={{ 'aria-label': 'Search Part numbers' }}
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
          <Tooltip placement="topLeft" title="Bulk Update">
            <OrderedListOutlined
              // icon={faTasks}
              // title='Bulk Update'
              className={clsx(classes.actionIconDisabled, {
                [classes.actionIcon]: enableBulkUpdates,
              })}
              onClick={() => enableBulkUpdates && handleBulkUpdate(gridApi)}
            />
            {/* <Button className={styles.btns} onClick={() => handleAdd()} >
                <PlusOutlined />
              </Button> */}
          </Tooltip>
          <PlusOutlined
            // icon={faPlus}
            title="Add"
            className={classes.actionIcon}
            onClick={() => handleAddNew()}
          />
          <DeleteFilled
            // icon={faTrash}
            title="Delete"
            className={classes.actionIconDisabled}
            onClick={() => handleOpen()}
          />
          {currentUser?.userType === 'ADMIN' && <Tooltip placement="topLeft" title="Import">
            <UploadOutlined
              className={classes.actionIcon}
              onClick={() => setFileUploadOpen(true)}
            />
          </Tooltip>}
          <Tooltip placement="topLeft" title="Export">
            <DownloadOutlined
              // icon={faDownload}
              // title='Export'
              className={classes.actionIcon}
              // onClick={() => handleExport()}
              onClick={() => handleExport()}
            />
          </Tooltip>

        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{
          width: '95%',
          height: '80vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
        <AgGridReact
          rowData={rowData}
          getRowStyle={getRowStyle}
          floatingFilter={true}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          components={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection="multiple"
          onRowSelected={onRowSelected}
          enableCellTextSelection={true}
          onRowDataChanged={onRowDataChanged}
          paginationPageSizeSelector={[100, 250, 500, 1000]}
          paginationPageSize={pageSize}
          onRowEditingStarted={onRowEditingStarted}
          editType="fullRow"
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={overlayLoadingTemplate}
          getNewData={getNewData}
          handleDelete={handleDelete}
          handleApprove={handleApprove}
          pagination={true}
          suppressRowClickSelection={true}
          alwaysShowVerticalScroll={true}
          quickFilterText={quickFilterText}
          onModelUpdated={onModelUpdated}
          handleEdit={handleEdit}
          setSnackBarOpen={setSnackBarOpen}
          setSnackBarMessage={setSnackBarMessage}
          setSnackBarType={setSnackBarType}
          defaultColDef={defaultColDef}
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
      <AddNew
        open={addNewDialog}
        setOpen={setAddNewDialog}
        title={`${editData.id ? 'Update ' : 'Add New '}Partnumber`}
        allUsers={rowData}
        page={location.pathname.split('/')}
        // urlParams={urlParams}
        getNewData={getNewData}
        parentGridApi={gridApi}
        editData={editData}
      />
      <BulkUpdateDialog
        open={bulkUpdateOpen}
        title='bulk update'
        columnDefs={columnDefs}
        parentGridApi={gridApi}
        getNewData={getNewData}
        setOpen={setBulkUpdateOpen}
        assetTypes={assetTypes}
      />
      {
        fileUploadOpen && <FileUpload
          open={fileUploadOpen}
          setOpen={setFileUploadOpen}
          partnumbers={rowData}
          title='Partnumber file upload'
          handleCancel={setFileUploadOpen}
          getNewData={getNewData}
          parentGridApi={gridApi}
          currentUser={currentUser}
        />
      }
    </div>
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user.currentUser,
}))(Partnumbers);