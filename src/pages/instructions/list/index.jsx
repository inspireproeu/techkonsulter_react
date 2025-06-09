import {
  PlusOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import {
  Modal,
  Tooltip
} from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as moment from 'moment';

import { useState, useEffect, useContext } from 'react';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
import CustomDropdown from '../../assets/components/CustomDropdown';
import AddNewUser from '../components/AddForm';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';

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



const Users = () => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

  const frameworkComponents = {
    ActionCellRenderer
  };


  const deleteConfirm = (values) => {
    setShowDeleteDialog(true)
    let arr = [];
    arr.push(values.data)
    setDeleteId(arr)
  }
  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer: index === 0 ? "ActionCellRenderer" : false,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        // filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        sortable: true,
        resizable: true,
        width: 'auto',
        valueFormatter: (params) => {
          if (columnDef.type === 'date') {
            return params.value ? moment(params.value).format('YYYY-MM-DD') : '';
          }
        }
      };
      return columnDefinition;
    });
  };

  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(25);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState([]);
  const [editData, setEditData] = useState({})
  const [columnDefs, setColumnDefs] = useState([
    {
      "header_name": "Operation",
      "id": 0,
      "field": "actions",
      "editable": false
    },
    {
      "header_name": "Date",
      "id": 1,
      "field": "date",
      "type": 'date',
      "editable": false
    },
    {
      "header_name": "Product / Partnr / Model ",
      "id": 2,
      "field": "info",
      "editable": false
    },
    {
      "header_name": "Process",
      "id": 3,
      "field": "process",
      "editable": false
    },
    {
      "header_name": "Instructions",
      "id": 3,
      "field": "instructions",
      "editable": false
    }
  ]);
  const [assetTypeFieldMapping, setAssetTypeFieldMapping] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState('All');
  const [enableDelete, setEnableDelete] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');

  const [addNewDialog, setAddNewDialog] = useState(false);
  useEffect(() => {
    if (!gridApi) {
      return;
    }
    let allColumnIds = gridApi.columnController.gridColumns.map(
      (col) => col.colId
    );
    let currentMapping = assetTypeFieldMapping.find(
      (mapping) => mapping.Asset_Name === selectedAssetType
    );

    let columnsToShow = currentMapping ? currentMapping.Fields : [];
    if (!columnsToShow || columnsToShow.length === 0) {
      gridApi.columnController.setColumnsVisible(allColumnIds, true);
      return;
    }

    if (columnsToShow.length > 0) {
      columnsToShow.push('actions', 'pallet_id');
    }

    gridApi.columnController.setColumnsVisible(allColumnIds, false);
    gridApi.columnController.setColumnsVisible(columnsToShow, true);
  }, [gridApi, assetTypeFieldMapping, selectedAssetType]);


  const getNewData = async (gridApi) => {
    // console.log('gridapi', gridApi);
    setLoading(true);
    gridApi.showLoadingOverlay();

    // Fetching all users
    fetchGet(DATAURLS.INSTRUCTIONS.url, getAccessToken())
      .then((response) => {
        setRowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    // Fetching all user roles
    // fetchGet(DATAURLS.USER_ROLES.url, getAccessToken())
    //   .then((response) => {
    //     setUserRoles(response.data);
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });

    // // Fetching column definition
    // fetchGet(DATAURLS.USERS_COLUMNDEFINITIONS.url, accesstoken)
    //   .then((response) => {
    //     setColumnDefs(response.columnDefinitions);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });

    highlightUnsavedRows();
    gridApi.sizeColumnsToFit();
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    getNewData(params.api);
  };

  const onModelUpdated = (params) => {
    params.api.sizeColumnsToFit();
  };

  const onRowSelected = (params) => {
    setEnableDelete(gridApi.getSelectedRows().length > 0);
  };

  const onRowDataChanged = (params) => {
    highlightUnsavedRows(params);
  };

  const handleAddNew = async (data) => {
    setAddNewDialog(true);
    // console.log('add new', gridApi);
    // let newRow = [{ ...data }];
    // setRowData((prev) => [...newRow, ...prev]);
  };

  const gotoEdit = async (param) => {
    setAddNewDialog(true);
    setEditData(param.data)

  }

  const handleBulkDelete = async (props) => {
    let selectedRows = gridApi.getSelectedRows();

    let ids = selectedRows.map(
      (key) => key.id
    );

    setLoading(true);
    // console.log("selectedUserIds", selectedIds)

    fetchDelete(
      DATAURLS.INSTRUCTIONS.url,
      ids,
      getAccessToken()
    )
      .then((res) => {
        if (res) {
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage("succesfully deleted");
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const handleDelete = (params) => {
    console.log('handle delete Asset Type', params);

    fetchDelete(DATAURLS.INSTRUCTIONS.url,
      [params.data.id], getAccessToken())
      .then((res) => {
        if (res) {
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
      content: 'Are you sure that you want to delete these instructions',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete
    });
  }

  const handleOpen = () => {
    confirm()
  };

  return (
    <div className={classes.root}>
      <div className={'sectionHeader'}>
        Instructions
        <Paper component='form' className={classes.textRoot}>
          <InputBase
            className={classes.input}
            placeholder='Search Instructions'
            inputProps={{ 'aria-label': 'Search Users' }}
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
          <PlusOutlined
            // icon={faPlus}
            title='Add'
            className={classes.actionIcon}
            onClick={() => handleAddNew()}
          />
          <DeleteFilled
            // icon={faTrash}
            title='Delete'
            className={classes.actionIconDisabled}
            onClick={() => handleOpen()}
          />
        </div>
      </div>
      <div
        className='ag-theme-balham'
        style={{
          width: '95%',
          height: '80vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
        <AgGridReact
          rowData={rowData}
          rowBuffer={500}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          frameworkComponents={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection='multiple'
          onRowEditingStopped={false}
          onRowSelected={onRowSelected}
          onRowDataChanged={onRowDataChanged}
          onRowEditingStarted={false}
          editType='fullRow'
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={overlayLoadingTemplate}
          getNewData={getNewData}
          handleDelete={handleDelete}
          gotoEdit={gotoEdit}
          pagination={true}
          paginationPageSize={pageSize}
          suppressRowClickSelection={true}
          alwaysShowVerticalScroll={true}
          quickFilterText={quickFilterText}
          onModelUpdated={onModelUpdated}
        ></AgGridReact>

        <CustomDropdown
          options={[25, 50, 100, 500]}
          title={'Page Size'}
          value={pageSize}
          onChange={(value) => {
            setPageSize(value);
            gridApi.paginationSetPageSize(value);
          }}
        />
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={() =>
            setSnackBarOpen(snackBarType === 'error' ? true : false)
          }
        >
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={() => setSnackBarOpen(false)}
            severity={snackBarType}
          >
            {snackBarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
      <AddNewUser
        open={addNewDialog}
        setOpen={setAddNewDialog}
        title='Add New Instructions'
        allUsers={rowData}
        editData={editData}
        setEditData={setEditData}
        getNewData={getNewData}
        parentGridApi={gridApi}
      />
    </div>
  );
};

export default Users;
