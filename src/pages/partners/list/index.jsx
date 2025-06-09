import { PlusOutlined, DeleteFilled } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Link, useLocation } from 'react-router-dom';

import { useState, useEffect, useContext } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
import CustomDropdown from '../../assets/components/CustomDropdown';
import * as moment from 'moment';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import { fetchPut, fetchPost, fetchGet, fetchDelete } from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { connect, history } from 'umi';

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

const frameworkComponents = {
  //   CustomCellEditor: CustomCellEditor,
  ActionCellRenderer: ActionCellRenderer,
};

const Users = (props) => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer:
          index === 0
            ? 'ActionCellRenderer'
            : false,
        cellRendererParams: {
          handleEdit: (params) => handleEdit(params),
          handleDelete: (params) => handleDelete(params),
        },
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: false,
        valueGetter: columnDef.valueGetter,
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        floatingFilter: true,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        width: 'auto',
        valueFormatter: (params) => {
          if (columnDef.type === 'date' && params.value) {
            return params.value ? moment(params.value).format('YYYY-MM-DD') : null;
          }
        },
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
  const [allUserRoles, setUserRoles] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [assetTypeFieldMapping, setAssetTypeFieldMapping] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState('All');
  const [enableDelete, setEnableDelete] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const [addNewDialog, setAddNewDialog] = useState(false);
  const { currentUser } = props;
  const location = useLocation();
  
  useEffect(() => {
    if (location && currentUser?.userType) {
      let currentpage = location.pathname.split("/")
      if (currentUser?.userType !== 'ADMIN' && currentpage[1] === 'partners') {
        history.push({
          pathname: '/projects'
        });
      }
    }
  }, [location, currentUser]);

  const columns = [
    {
      header_name: 'Action',
      field: 'action',
    },
    {
      header_name: 'Partner Name',
      field: 'partner_name',
    },
    {
      header_name: 'Partner org no',
      field: 'partner_org_no',
    },
    {
      header_name: 'Postal Address',
      field: 'postal_address',
    },
    {
      header_name: 'City',
      field: 'city',
    },
    {
      header_name: 'Country',
      field: 'country',
    },
    {
      header_name: 'Postal Code',
      field: 'postal_code',
    },
    {
      header_name: 'Phone Number',
      field: 'phone_number',
    }
  ];

  const getNewData = async (gridApi) => {
    setLoading(true);
    gridApi.showLoadingOverlay();
    let fields4 = 'limit=-1&sort=partner_name&fields=id,country,partner_name,partner_org_no,postal_address,city,postal_code,phone_number';
    // Fetching all users

    fetchGet(`${DATAURLS.PARTNER.url}?${fields4}`, getAccessToken())
      .then((response) => {
        setRowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    // // Fetching all user roles
    // fetchGet(DATAURLS.USER_ROLES.url, accesstoken)
    //   .then((response) => {
    //     setUserRoles(response.data);
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });
    setColumnDefs(columns);
    gridApi.hideOverlay();
    highlightUnsavedRows();
    gridApi.sizeColumnsToFit();
  };

  const deleteConfirmation = (data, allAssets) => {
    // console.log('deleteconfirmation,data', data, allAssets, rowData);
    const existingAssets = allAssets.filter((asset) => asset.pallet_id === data.pallet_id);

    if (existingAssets.length > 0) {
      setSnackBarOpen(true);
      setSnackBarMessage(
        `Cannot delete ${data.pallet_id}. There are assets existing with this pallet id`,
      );
      setSnackBarType('error');

      return false;
    }
    return true;
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

  const onRowEditingStopped = (params) => {
    let currentRowFromAPI = rowDataAPI.find((row) => row.pallet_id === params.data.pallet_id);

    if (currentRowFromAPI && JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)) {
      console.log('no update done');
      return;
    }

    // if (params.data.pallet_id) {
    //   handleUpdate(params);
    //   return;
    // }
    handleSave(params);
  };

  const handleAddNew = async (data) => {
    setAddNewDialog(true);
    // console.log('add new', gridApi);
    // let newRow = [{ ...data }];
    // setRowData((prev) => [...newRow, ...prev]);
  };

  // const handleUpdate = (params) => {
  //   console.log('rowediting, update', params);
  //   Object.keys(params.data).forEach((key) => {
  //     if (!params.data[key]) {
  //       params.data[key] = null;
  //     }
  //   });

  //   console.log('rowediting update data', params.data);

  //   setLoading(true);
  //   gridApi.showLoadingOverlay();

  //   fetchPut(
  //     DATAURLS.PALLETS.url,
  //     {
  //       data: params.data,
  //       matchBy: 'pallet_id',
  //     },
  //     accesstoken
  //   )
  //     .then((response) => {
  //       console.log('response', response);
  //       if (response.ok) {
  //         setSnackBarOpen(true);
  //         setSnackBarMessage(response.message);
  //         setSnackBarType('success');
  //         gridApi.redrawRows({ rowNodes: [params.node] });
  //       } else {
  //         setSnackBarOpen(true);
  //         setSnackBarMessage(response.message);
  //         setSnackBarType('error');
  //         gridApi.startEditingCell({
  //           rowIndex: params.rowIndex,
  //           colKey: 'quantity',
  //         });
  //       }
  //       setLoading(false);
  //       gridApi.hideOverlay();
  //       setTimeout(() => {
  //         highlightUnsavedRows(params);
  //       }, 600);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // };

  const handleSave = (params) => {
    console.log('handlesave, params', params);
    setLoading(true);
    gridApi.showLoadingOverlay();

    fetchPost(DATAURLS.PALLETS.url, { data: params.data }, getAccessToken())
      .then((response) => {
        if (response.ok) {
          setSnackBarOpen(true);
          setSnackBarMessage(response.message);
          setSnackBarType('success');
          params.data.pallet_id = response.rows[0].pallet_id;
          gridApi.redrawRows({ rowNodes: [params.node] });
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage(response.message);
          setSnackBarType('error');
          gridApi.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: 'pallet_type',
          });
        }
        setLoading(false);
        gridApi.hideOverlay();
        params.node.setSelected(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(rowData);
        throw err;
      });
  };

  const handleBulkDelete = async (props) => {
    let selectedRows = gridApi.getSelectedRows();
    let selectedUserIds = selectedRows.map((row) => row.id);
    setLoading(true);

    fetchDelete(DATAURLS.PARTNER.url, selectedUserIds, getAccessToken())
      .then((res) => {
        if (res) {
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage('Faile to delete users');
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const handleDelete = (params) => {
    let ids = [params.data].map((item) => item.id);

    fetchDelete(DATAURLS.PARTNER.url, ids, getAccessToken())
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
      content: 'Are you sure that you want to delete these assets',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete,
    });
  }

  const handleOpen = () => {
    confirm();
  };

  return (
    <div className={classes.root}>
      <div className={'sectionHeader'}>
        Partners
        <Paper component="form" className={classes.textRoot}>
          <InputBase
            className={classes.input}
            placeholder="Search Partner"
            inputProps={{ 'aria-label': 'Search Partners' }}
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
          <Link to={`/createpartner`} className={classes.newBtn}>
            <PlusOutlined
              // icon={faPlus}
              title="Add"
              className={classes.actionIcon}
              onClick={() => handleAddNew()}
            />
          </Link>
          <DeleteFilled
            // icon={faTrash}
            title="Delete"
            className={classes.actionIconDisabled}
            onClick={() => handleOpen()}
          />
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
          rowBuffer={500}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          components={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection="multiple"
          // onRowEditingStopped={onRowEditingStopped}
          onRowSelected={onRowSelected}
          enableCellTextSelection={true}
          // onRowDataChanged={onRowDataChanged}
          // onRowEditingStarted={onRowEditingStarted}
          // editType='fullRow'
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={overlayLoadingTemplate}
          getNewData={getNewData}
          handleDelete={handleDelete}
          pagination={true}
          paginationPageSize={pageSize}
          suppressRowClickSelection={true}
          alwaysShowVerticalScroll={true}
          quickFilterText={quickFilterText}
          floatingFilter={true}
          onModelUpdated={onModelUpdated}
          currentUser={currentUser}
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
      {/* <AddNewUser
        open={addNewDialog}
        setOpen={setAddNewDialog}
        title='Add New Project'
        allUsers={rowData}
        allUserRoles={allUserRoles}
        getNewData={getNewData}
        parentGridApi={gridApi}
      /> */}
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Users);