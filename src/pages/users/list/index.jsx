import {
  PlusOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import {
  Modal
} from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import CustomDropdown from '../../assets/components/CustomDropdown';
import AddNewUser from '../components/AddNewUser';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
  fetchGet,
  fetchDelete,
  fetchPut
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useParams, useLocation } from 'react-router-dom';
import ActionCellRenderer from '../components/ActionCellRenderer';
import { connect, history } from 'umi';
import CustomGoBackButton from '../../../uikit/GoBack';
import Switch from '@mui/material/Switch';


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


const Users = (props) => {
  const theme = useTheme(AppTheme);
  const urlParams = useParams();
  const location = useLocation();
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

  const overlayLoadingTemplate1 =
    '<span class="ag-overlay-loading-center">No records found.</span>';

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRendererParams: {
          handleEdit: (params) => handleEdit(params),
          handleDelete: (params) => handleDelete(params),
        },
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        cellRenderer:
          index === 0
            ? 'ActionCellRenderer' : false,
        // : columnDef.field === 'isDefault' ? 'SwitchRendererComponent' : false,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        filter: index === 0 ? false : 'agTextColumnFilter',
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        // floatingFilter: true,
        valueGetter: (params) => {
          // console.log(columnDef.field, "paramssss", params)
          if (columnDef.field === 'role_name') {
            return params?.data?.role?.description;
          }
          if (columnDef.field === 'isDefault') {
            return params?.data?.isDefault ? 'Yes' : 'No';
          }
          return params.data[columnDef.field];
        },

        width: index === 0 ? 40 : 'auto',
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
  const [editData, seteditData] = useState({})
  const [addNewDialog, setAddNewDialog] = useState(false);
  const { currentUser } = props;
  const [paramId, setparamId] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  // const SwitchRendererComponent = (props) => {
  //   //
  //   return (
  //     props ?
  //       <div>
  //         <Switch onChange={(e) => changeDefault(e, props.data)} checked={props.data.isDefault === true ? true : false} />
  //       </div> : null
  //   );
  // }

  const frameworkComponents = {
    //   CustomCellEditor: CustomCellEditor,
    ActionCellRenderer: ActionCellRenderer,
    // SwitchRendererComponent: SwitchRendererComponent
  };

  useEffect(() => {
    if (!gridApi) {
      return;
    }

    let allColumnIds = gridApi.columnModel.gridColumns.map(
      (col) => col.colId
    );
    let currentMapping = assetTypeFieldMapping.find(
      (mapping) => mapping.Asset_Name === selectedAssetType
    );

    let columnsToShow = currentMapping ? currentMapping.Fields : [];
    // console.log('assettypes', assetTypeFieldMapping, columnsToShow);
    if (!columnsToShow || columnsToShow.length === 0) {
      gridApi.columnModel.setColumnsVisible(allColumnIds, true);
      return;
    }

    if (columnsToShow.length > 0) {
      columnsToShow.push('actions', 'pallet_id');
    }

    gridApi.columnModel.setColumnsVisible(allColumnIds, false);
    gridApi.columnModel.setColumnsVisible(columnsToShow, true);
  }, [gridApi, assetTypeFieldMapping, selectedAssetType]);

  useEffect(() => {
    if (gridApi && currentUser) {
      if (currentUser.userType === 'CLIENT' && currentUser.client?.id) {
        setparamId(currentUser.client.id)
        getNewData(gridApi, currentUser.client.id)
      }
      if (currentUser.userType === 'PARTNER' && currentUser.partner?.id) {
        setparamId(currentUser.partner.id)
        getNewData(gridApi, currentUser.partner.id)

      }
      if (currentUser.userType === 'FINANCIAL' && currentUser?.id) {
        setparamId(currentUser.id)
        getNewData(gridApi, currentUser.id)

      }
      if (currentUser.userType === 'ADMIN') {
        getNewData(gridApi)
      }
    }
  }, [gridApi, currentUser])


  useEffect(() => {
    if (location && currentUser?.userType) {
      let currentpage = location.pathname.split("/")
      if (currentUser?.userType !== 'ADMIN' && currentpage[1] === 'users') {
        history.push({
          pathname: `${currentUser?.userType === "CLIENT" ? '/clientusersList' : '/partnerusersList'}`
        });
      }
      setCurrentPage(currentpage[1])
    }
  }, [location, currentUser]);

  useEffect(() => {
    if (gridApi && rowData.length === 0) {
      gridApi.showLoadingOverlay();
    }
  }, [gridApi, rowData])

  const getNewData = async (gridApi, id) => {
    setLoading(true);
    gridApi.showLoadingOverlay();
    let fields4 = '';
    let filter = '';
    let rolesfilter = '';
    let page = location.pathname.split("/")
    // Fetching all users
    let rolesQueryparam = ''
    if (page[1] == 'clientusersList') {
      //filter = `&filter[client][_eq]=${urlParams.id}`
      filter = `,{"client":{"_eq":"${id ? id : urlParams.id}"}}`;
      rolesfilter = `&filter[userType][_eq]=CLIENT`
    } else if (page[1] == 'partnerusersList') {
      //filter = `&filter[partner][_eq]=${urlParams.id}`
      filter = `,{"partner":{"_eq":"${id ? id : urlParams.id}"}}`;
      rolesfilter = `&filter[userType][_eq]=PARTNER`
    } else if (page[1] == 'users') {
      rolesfilter = `&filter={"_or":[{"userType":{"_eq":"ADMIN"}},{"userType":{"_eq":"ASSOCIATE"}},{"userType":{"_eq":"FINANCIAL"}}]}`
      filter = `,{"_or":[{"userType":{"_eq":"ADMIN"}},{"userType":{"_eq":"ASSOCIATE"}},{"userType":{"_eq":"FINANCIAL"}}]}`
    }
    // filter = `{"_and":[{"email":{"_nnull":true}}]}`
    fields4 = `limit=-1&sort=first_name&filter={"_and":[{"status":{"_neq":"suspended"}},{"id":{"_nin":["${currentUser.id}"]}},{"email":{"_nnull":true}}${filter}]}&fields=isDefault,role_name,first_name,last_name,role.description,email,id,role.id,phone_number,warehouse`;

    // fields4 = `limit=-1&sort=-id${filter}`
    rolesQueryparam = `limit=-1&sort=-id${rolesfilter}&fields=id,description`
    fetchGet(`${DATAURLS.USERS.url}?${fields4}`, getAccessToken())
      .then((response) => {
        setRowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
    // Fetching all user roles
    fetchGet(`${DATAURLS.USER_ROLES.url}?${rolesQueryparam}`, getAccessToken())
      .then((response) => {
        setUserRoles(response.data);
      })
      .catch((err) => {
        throw err;
      });

    // Fetching column definition
    fetchGet(`${DATAURLS.USERS_COLUMNDEFINITIONS.url}`, getAccessToken())

      .then((response) => {
        setColumnDefs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
    gridApi.hideOverlay();
    highlightUnsavedRows();
    // gridApi.sizeColumnsToFit();
  };

  // const onGridReady = (params) => {
  //   setGridApi(params.api);
  //   getNewData(params.api);
  // };


  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

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
    console.log('rowediting stopped');
    let currentRowFromAPI = rowDataAPI.find(
      (row) => row.pallet_id === params.data.pallet_id
    );

    if (
      currentRowFromAPI &&
      JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
    ) {
      console.log('no update done');
      return;
    }
  };

  const handleAddNew = async (data) => {
    seteditData({})
    setAddNewDialog(true);
    // console.log('add new', gridApi);
    // let newRow = [{ ...data }];
    // setRowData((prev) => [...newRow, ...prev]);
  };

  const handleDelete = async (props) => {
    try {
      let selectedRows = gridApi.getSelectedRows();
      let selectedUserIds = [];
      if (props?.data?.id) {
        selectedUserIds = [props.data]
      } else {
        selectedUserIds = selectedRows
      }
      setLoading(true);
      let response = '';
      for (let i = 0; i <= selectedUserIds.length; i++) {
        if (selectedUserIds[i]?.id) {
          let params = {
          }
          params.status = 'suspended';
          params.first_name = 'deleted';
          params.last_name = 'user';
          params.email = `${selectedUserIds[i].email}@${selectedUserIds[i].id}`;
          response = await fetchPut(
            `${DATAURLS.USERS.url}/${selectedUserIds[i].id}`,
            params,
            getAccessToken()
          )
        }
      }
      if (response?.data?.email) {
        setSnackBarOpen(true);
        setSnackBarMessage("Selected user deleted successfully.");
        setSnackBarType('success');
        getNewData(gridApi, paramId);
      } else {
        setSnackBarOpen(true);
        setSnackBarMessage("Failed to delete users");
        setSnackBarType('error');
      }
    } catch (err) {
      throw err
    }
  };

  // const handleDelete = (params) => {
  //   handleBulkDelete(params)
  // };
  const handleEdit = (params) => {
    seteditData(params.data)
    setAddNewDialog(true)
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
      content: 'Are you sure that you want to delete these users?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete
    });
  }

  const handleOpen = () => {
    confirm()
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 74,
      floatingFilter: true,
    };
  }, []);


  return (
    <div className={classes.root}>
      {
        currentUser.userType === 'ADMIN' && <div className="go-back">
          {
            (currentPage == 'clientusersList') &&
            <CustomGoBackButton color="warning" title='Go Back' to="clients" />
          }
          {
            (currentPage == 'partnerusersList') &&
            <CustomGoBackButton color="warning" title='Go Back' to="partners" />
          }
        </div>
      }

      <div className={'sectionHeader'}>
        Users
        <Paper component='form' className={classes.textRoot}>
          <InputBase
            className={classes.input}
            placeholder='Search Users'
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
        className='ag-theme-quartz'
        style={{
          width: '95%',
          height: '80vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
        <AgGridReact
          rowData={rowData}
          defaultColDef={defaultColDef}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          components={frameworkComponents}
          // suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection='multiple'
          onRowEditingStopped={onRowEditingStopped}
          onRowSelected={onRowSelected}
          enableCellTextSelection={true}
          onRowDataChanged={onRowDataChanged}
          onRowEditingStarted={onRowEditingStarted}
          editType='fullRow'
          // overlayNoRowsTemplate={overlayLoadingTemplate}
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
          // getNewData={getNewData}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          pagination={true}
          floatingFilter={true}
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
        title={`${editData?.id ? 'Update ' : 'Add New '}User`}
        allUsers={rowData}
        page={location.pathname.split("/")}
        urlParams={urlParams}
        allUserRoles={allUserRoles}
        getNewData={getNewData}
        parentGridApi={gridApi}
        editData={editData}
        seteditData={seteditData}
        paramId={paramId}
        userType={currentUser.userType}
      />
    </div>
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user.currentUser,
}))(Users);