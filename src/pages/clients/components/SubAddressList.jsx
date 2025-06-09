import React, { useState, useContext, useEffect } from 'react';
import { Form, Modal, Button } from 'antd';
import Card from '@mui/material/Card';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { Link, useParams } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { history } from 'umi';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { DATAURLS } from '../../../utils/constants';
import { fetchPost, fetchGet, fetchPut, fetchDelete } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import SubAddActionCellRenderer from './SubAddActionCellRenderer';

import { PlusOutlined, DeleteFilled } from '@ant-design/icons';
import CreteSubAddress from '../components/createSubAddressModal';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      //   display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // width: '100vw',
      // height: '93vh',
      //   marginLeft: '4vw',
      // marginTop: '80px',
    },

    dialogTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '40px',
      background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
      boxShadow: '1px 1px 3px #8e9eab',
    },
    dialogRoot: {
      width: '90% !important',
      height: '700px',
      //   display: 'flex',
      //   flexDirection: 'column',
    },
    dialogTitleText: {
      // fontFamily: "'Poppins'",
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: '0.85rem',
    },
    dialogContent: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '50%',
      marginBottom: '15px',
      marginRight: '15px',
    },
    button: {
      marginLeft: '15px',
    },
    buttonProgress: { marginLeft: '5px' },
    formControl: {
      width: '32%',
      marginRight: '15px',
      marginBottom: '15px',
    },
    inputGroup: {
      width: '100%',
      display: 'inline-block',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '20px',
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
      width: '100%',
      height: '40px',
      boxShadow: '0px 0px 5px #222',
      paddingLeft: '10px',
      background: 'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
    },
    inputControl: { fontSize: '1rem' },
    newBtn: {
      color: '#FFFFFF',
    },
  }),
);

const AddNew = () => {
  const classes = useStyles();
  const urlParams = useParams();
  const [loading, setLoading] = useState(false);
  const [clientsAddressList, setClientsAddressList] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [open, setOpen] = useState(false);
  const [editData, seteditData] = useState({})
  const [action, setAction] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (urlParams && urlParams.id) {
      getClientDetail(urlParams.id);
      getClientAddress(urlParams.id);
      getCountry()
      getUsers(urlParams.id)
    }
  }, [urlParams]);

  const getClientDetail = async (id) => {
    // setLoading(true);
    fetchGet(`${DATAURLS.CLIENT.url}/${id}?fields=id,country,client_name,client_org_no,postal_address,address2,city,postal_code,phone_number,delivery_address,delivery_info`, getAccessToken())
      .then((response) => {
        setClientsData(response.data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    setClientsAddressList([]);
    setLoading(false);
  }, [getAccessToken()]);


  function confirm() {
    Modal.confirm({
      header_name: 'Delete multiple',
      // icon: false,
      content: 'Are you sure that you want to delete these sub address',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete,
    });
  }
  const handleDelete = (params) => {
    handleBulkDelete(params)
  };
  const handleOpen = () => {
    confirm();
  };

  const handleBulkDelete = async (props) => {
    let selectedRows = gridApi.getSelectedRows();
    let selectedUserIds = []
    if (props?.data?.id) {
      selectedUserIds = [props.data.id]
    } else {
      selectedUserIds = selectedRows.map(
        (row) => row.id
      );
    }
    setLoading(true);
    fetchDelete(DATAURLS.CLIENTADDRESS.url, selectedUserIds, getAccessToken())
      .then((res) => {
        if (res) {
          getClientAddress(urlParams.id);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage('Faile to delete sub address');
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const getClientAddress = async (clientid = null) => {
    // setLoading(true);
    let fields4 = `limit=-1&sort=-date_created&filter[client][_eq]=${clientid}&fields=country,sub_org,delievery_address,address_info,phone_number,postal_code,city,id,sub_address_contact.first_name`;
    fetchGet(`${DATAURLS.CLIENTADDRESS.url}?${fields4}`, getAccessToken())
      .then((response) => {
        setClientsAddressList(response.data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };
  const getCountry = async () => {
    // setLoading(true);
    fetchGet(`${DATAURLS.COUNTRY.url}?fields=id,country&limit=-1&sort=id`, getAccessToken())
      .then((response) => {
        let data = response.data;
        setAllCountries(data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };


  const getUsers = (client) => {

    if (client) {
      let filter = `,{"client":{"_eq":"${client}"}}`;
      let fields4 = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}}${filter}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number`;

      fetchGet(`${DATAURLS.USERS.url}?${fields4}`, getAccessToken())
        .then((response) => {
          setUsersList(response.data);
        })
        .catch((err) => {
          throw err;
        });
    }

  }

  const frameworkComponents = {
    //   CustomCellEditor: CustomCellEditor,
    SubAddActionCellRenderer,
  };

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer:
          index === 0
            ? 'SubAddActionCellRenderer'
            : false,
        cellRendererParams: {
          handleEdit: (params) => handleEdit(params),
          handleDelete: (params) => handleDelete(params),
        },
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        valueGetter: columnDef.valueGetter,
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        floatingFilter: true,
        width: index === 0 ? 140 : 250,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
      };
      return columnDefinition;
    });
  };
  const onRowEditingStarted = (params) => {
    // getRowStyle
    // console.log("params 111***", params.column)
    // params.colDef.cellStyle = { color: 'red' };
    gridApi.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    });
  };

  const columns = [
    {
      header_name: 'Action',
      field: '',
    },
    {
      header_name: 'Sub Org',
      field: 'sub_org',
    },
    {
      header_name: 'Delievery Address',
      field: 'delievery_address',
    },
    {
      header_name: 'Postal Code',
      field: 'postal_code',
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
      header_name: 'Name',
      field: 'sub_address_contact',
      valueGetter: (params) => {
        return params?.data?.sub_address_contact?.first_name;
      }
    },
    // {
    //   header_name: 'Family Name',
    //   field: 'family_name',
    // },
    {
      header_name: 'E-Mail',
      field: 'email',
    },
    {
      header_name: 'Phone Number',
      field: 'phone_number',
    },
    {
      header_name: 'Address Info',
      field: 'address_info',
    },
  ];

  const handleEdit = (params) => {
    setAction('update')
    seteditData(params.data)
    setOpen(true)
  };

  const addressList = () => {
    return (
      <>
        <div className={classes.root}>
          <div className="proj-container">
            <Button
              variant="contained"
              color="warning"
              style={{ verticalAlign: 'bottom', background: '#ed6c02', color: '#FFFFFF' }}
              onClick={() => {
                history.push({
                  pathname: '/clients',
                });
              }}
              className={"actionbutton"}
            >
              <span className='indicator-label'>{'Go Back'}</span>
            </Button>
          </div>
        </div>
        <div className={'sectionHeader'}>
          Sub Address
          <div className={"actionArea"}>
            {/* <Link to={`/clients`} className={classes.newBtn}>
              Dashboard
            </Link> */}

            <Link className={classes.newBtn}>
              <PlusOutlined
                // icon={faPlus}
                title="Add"
                className={classes.actionIcon}
                onClick={() => { setOpen(true); setAction('create'); }}

              />
            </Link>
            <DeleteFilled
              // icon={faTrash}
              title="Delete"
              className={classes.actionIconDisabled}
              onClick={() => {
                handleOpen();
              }}
            />
          </div>
        </div>
        <div
          className="ag-theme-quartz"
          style={{
            width: '100%',
            height: '40vh',
            margin: '20px',
            boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
          }}
        >
          <AgGridReact
            rowData={clientsAddressList}
            columnDefs={buildColumnDefinitions(columns)}
            enableCellTextSelection={true}
            pagination={true}
            components={frameworkComponents}
            onRowEditingStarted={onRowEditingStarted}
            editType="fullRow"
            handleDelete={handleDelete}
            onGridReady={onGridReady}
            handleEdit={handleEdit}
            paginationPageSize={20}
            suppressRowClickSelection={true}
            alwaysShowVerticalScroll={true}
          ></AgGridReact>
        </div>
        <CreteSubAddress
          usersList={usersList}
          allCountries={allCountries}
          open={open}
          setOpen={setOpen}
          title={`${editData?.id ? 'Update ' : 'Create '}sub address`}
          page={location.pathname.split("/")}
          urlParams={urlParams}
          getNewData={getClientAddress}
          parentGridApi={gridApi}
          editData={editData}
          seteditData={seteditData}
          clientsData={clientsData}
          action={action}
        />
      </>
    );
  };

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
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
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100%' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>{urlParams && urlParams.id && addressList()}</div>
        </Box>

      </Card>
    </>
  );
};

export default AddNew;
