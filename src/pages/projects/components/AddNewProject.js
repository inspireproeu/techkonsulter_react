import React, { useState, useContext, useEffect } from 'react';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import { Form, Row, Col } from 'antd';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@material-ui/core/Box';
import { history, connect } from 'umi';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { DATAURLS } from '../../../utils/constants';
import { fetchPost, fetchGet, fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@mui/material/Divider';
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
      margin: '10px',
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
    inputControl: { fontSize: '1rem' },
  }),
);

const AddNewProjects = (props) => {
  const { currentUser } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [clientsAddressList, setClientsAddressList] = useState([]);
  const [projectId, setProjectId] = useState();
  const [clientsList, setClientsList] = useState([]);
  const [partnersList, setPartnersList] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [success, setSuccess] = useState(false);
  const [roleName, setRoleName] = useState(null);
  const [form] = Form.useForm();
  const [checked, setChecked] = React.useState([]);
  const [values, setValues] = useState({});
  const [errValues, setErrValues] = useState({});
  const urlParams = useParams();
  const [clientUsers, setClientUsers] = useState([]);
  const [partnerUsers, setPartnerUsers] = useState([]);
  const [deliveryValues, setDeliveryValues] = useState({});
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getNewData();
    if (currentUser) {
      setRoleName(currentUser?.role?.name);
      if (currentUser && currentUser?.role?.name === 'client_admin' || currentUser?.role?.name === 'client_cio' || currentUser?.role?.name === 'client_sales') {
        values.client = currentUser.client ? currentUser.client.id : null;
        setValues({ ...values });
      }
    }
  }, [currentUser]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // useEffect(() => {
  //   if (currentUser) {
  //   }
  // }, [currentUser]);

  useEffect(() => {
    if (urlParams && urlParams.id) {
      setProjectId(urlParams.id);
      getProjectDetail(urlParams.id);
    }
  }, [urlParams]);

  const getProjectDetail = async (id) => {
    // setLoading(true);
    fetchGet(`${DATAURLS.PROJECT.url}/${id}?fields=id,project_name,client_ref,project_info,delivery_info,delivery_address,project_status,partner.id,contact_attn.phone_number,partner_contact_attn.id,contact_attn.email,contact_attn.id,client.phone_number,client.address2,client.postal_code,client.city,client.id,client.postal_address,access.*`, getAccessToken())
      .then((response) => {
        let data = response.data;
        let projData = {}
        projData.project_name = data.project_name;
        projData.project_status = data.project_status;
        projData.project_info = data.project_info;
        projData.delivery_info = data.delivery_info;
        if (data.client) {
          projData.client = data.client?.id;
          projData.postal_address = data.client?.postal_address;
          projData.city = data.client?.city;
          projData.postal_code = data.client?.postal_code;
          projData.address2 = data.client?.address2;
          projData.phone_number = data.client?.phone_number;
        }
        projData.contact_attn = data.contact_attn?.id;
        projData.contact_phone_number = data.contact_attn?.phone_number;
        projData.contact_email = data.contact_attn?.email;
        projData.delivery_address = data?.delivery_address;
        projData.partner_contact_attn = data.partner_contact_attn?.id
        projData.client_ref = data?.client_ref;
        projData.access = data?.access;

        projData.partner = data.partner ? data.partner.id : '';
        setValues(projData);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };
  // console.log("projData", values)
  const getNewData = async () => {
    // setLoading(true);
    let fields4 = 'limit=-1&sort=-id';
    fetchGet(`${DATAURLS.CLIENT.url}?${fields4}`, getAccessToken())
      .then((response) => {
        setClientsList(response.data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
    fetchGet(`${DATAURLS.PARTNER.url}?${fields4}`, getAccessToken())
      .then((response) => {
        setPartnersList(response.data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    if (values.client) {
      getClientAddress(values.client);
      let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"client":{"_eq":${values.client}}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
      fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
        .then((response) => {
          // let val = {
          //   contact_email: '',
          //   contact_phone_number: ''
          // }
          response.data.forEach((item) => {
            item.checked = false;
          })

          if (values.access && values.access.length > 0) {
            let selectedUseres = values.access.map(
              (row) => row.projects_users_id
            );
            response.data.forEach((item) => {
              if (selectedUseres.some((x) => x == item.id)) {
                item.checked = true
              } else {
                item.checked = false;
              }
            })
          }
          // setValues({ ...values, ...val });
          setValues({ ...values });
          setClientUsers(response.data);
          setLoading(false);
        })
        .catch((err) => {
          throw err;
        });
      let clientValues = clientsList.find((row) => row.id === values.client);
      // let client_Users = usersList && usersList.filter((row) => row.client === values.client);
      // setClientUsers(client_Users)
      if (clientValues) {
        let val = {
          postal_address: clientValues.postal_address,
          city: clientValues.city,
          postal_code: clientValues.postal_code,
          address2: clientValues.address2,
          phone_number: clientValues.phone_number,
          delivery_info: clientValues.delivery_info

        };
        setValues({ ...values, ...val });
      }
    }
  }, [values.client]);

  useEffect(() => {
    if (partnerUsers || clientUsers) {
      setUsersList([...partnerUsers, ...clientUsers]);
    }
  }, [partnerUsers, clientUsers])

  useEffect(() => {
    if (usersList && values.access?.length > 0) {
      // console.log(usersList, "values.access", values.access);
      let users = usersList;
      let access = values.access
      users.forEach((item) => {
        if (access && access.length > 0) {
          item.checked = access.some(el => el.projects_users_id === item.id);
        }
      })

      let chkd = users.filter((item) => item.checked)
      chkd = chkd.map((item) => item.id)
      chkd = _.uniq(chkd)
      setChecked(chkd)
    }
  }, [usersList, values.access])

  useEffect(() => {
    if (clientsAddressList?.length > 0 && values.delivery_address) {

      let datas = clientsAddressList.find((row) => row.id === values.delivery_address);
      // let client_Users = usersList && usersList.filter((row) => row.client === values.client);
      // setClientUsers(client_Users)
      if (datas) {
        let val = {
          delievery_address: datas.delievery_address,
          address_info: datas.address_info,
          city: datas.city,
          postal_code: datas.postal_code,
          sub_org: datas.sub_org,
          phone_number: datas.phone_number,
          name: datas.name,
          family_name: datas.family_name,
          email: datas.email
        };
        setDeliveryValues(val);
      }
    }
  }, [clientsAddressList && values.delivery_address]);

  useEffect(() => {
    if (values.partner) {
      let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"partner":{"_eq":${values.partner}}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
      fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
        .then((response) => {
          setPartnerUsers(response.data)
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [values.partner]);

  useEffect(() => {
    if (values.contact_attn) {
      if (clientUsers) {
        let clientValues = clientUsers.find((row) => row.id === values.contact_attn);
        if (clientValues) {
          let val = {
            contact_email: clientValues.email,
            contact_phone_number: clientValues.phone_number,
          };
          setValues({ ...values, ...val });
        }
      }
    }
  }, [values.contact_attn])

  useEffect(() => {
    if (values.partner) {
      if (partnerUsers) {
        let Values = partnerUsers.find((row) => row.id === values.partner);
        if (Values) {
          let val = {
            partner_contact_attn: Values.id
          };
          setValues({ ...values, ...val });
        }
      }

    }
  }, [values.partner])

  const getClientAddress = async (clientid) => {
    // setLoading(true);
    let param1 = `limit=-1&sort=-id&filter={"_and":[{"client":{"_nnull":true}},{"client":{"_eq":${clientid}}}]}`;

    // let fields4 = `limit=-1&sort=-id&?filter[client][_eq]=${clientid}`;
    fetchGet(`${DATAURLS.CLIENTADDRESS.url}?${param1}`, getAccessToken())
      .then((response) => {
        setClientsAddressList(response.data);
        if (values.delivery_address) {
          let datas = response.data.find((row) => row.id === values.delivery_address);
          if (datas) {
            let val = {
              delievery_address: datas.delievery_address,
              address_info: datas.address_info,
              city: datas.city,
              postal_code: datas.postal_code,
              sub_org: datas.sub_org,
              phone_number: datas.phone_number,
              name: datas.name,
              family_name: datas.family_name,
              email: datas.email
            };
            setDeliveryValues(val);
          }
        }
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleChange = (name) => (event) => {
    let targetvalues = event.target.value ? event.target.value : '';
    setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })
    values.contact_phone_number = ''
    values.contact_email = ''

    setValues({ ...values, [name]: targetvalues });
  };

  const handleSubmit = () => {
    if (!values.project_name) {
      setErrValues({ ...errValues, ['project_nameError']: true });
      return
    }
    setLoading(true);
    values.partner = values.partner ? values.partner : null;
    if (currentUser && currentUser?.role?.name === 'client_admin' || currentUser?.role?.name === 'client_cio' || currentUser?.role?.name === 'client_sales') {
      values.client = currentUser.client ? currentUser.client.id : null;
    }
    if (projectId) {
      delete values.id;
      let contact_attn = values.contact_attn ? values.contact_attn : null
      let delivery_address = values.delivery_address?.id ? values.delivery_address.id : values.delivery_address || null
      delete values.delivery_address;
      delete values.contact_attn;
      delete values.user_created;
      delete values.user_updated;
      delete values.access;
      values.contact_attn = contact_attn;
      values.delivery_address = delivery_address;
      let access = [];
      let actions = {};
      if (checked && checked.length > 0) {
        for (var i = 0; i < checked.length; i++) {
          let val = {
            project_id: projectId,
            projects_users_id: {
              id: checked[i],
            },
          };

          access.push(val);
        }
        actions.create = access;
      }
      values.access = actions;
      fetchPut(`${DATAURLS.PROJECT.url}/${projectId}`, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSnackBarOpen(true);
            setSnackBarType('success');
            setSnackBarMessage('Project updated successfully');
            history.push({
              pathname: '/projects',
            });
          } else {
            setLoading(false);
            setSnackBarOpen(true);
            setSnackBarType('error');
            setSnackBarMessage(response.message);
          }
        })
        .catch((err) => {
          throw err;
        });
    } else {
      let access = [];
      let actions = {};

      if (checked && checked.length > 0) {
        for (var i = 0; i < checked.length; i++) {
          let val = {
            project_id: projectId,
            projects_users_id: {
              id: checked[i],
            },
          };

          access.push(val);
        }
        actions.create = access;
      }
      values.access = actions;

      fetchPost(DATAURLS.PROJECT.url, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            setSnackBarOpen(true);
            setSnackBarType('success');
            setSnackBarMessage('Project created successfully');
            history.push({
              pathname: '/projects',
            });
          } else {
            setLoading(false);
            setSnackBarOpen(true);
            setSnackBarType('error');
            setSnackBarMessage('Project updated failed.');
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };
  const goBack = () => {
    history.push(`/projects`);
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
        }}
        noValidate
        autoComplete="off"
      >
        <div className={"card_title"}>
          <h3 className={"card_label"}>{urlParams && urlParams.id ? `Project - ${urlParams.id} (number)` : 'Create Project'}</h3>        </div>
        <form
          autoComplete="off"
          className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
          noValidate
          id="kt_login_signup_form"
        // onSubmit={handleSubmit}
        >
          <div className={classes.inputGroup}>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={values.project_name}
                onChange={handleChange('project_name')}
                variant="outlined"
                required
                error={errValues.project_nameError ? true : false}
                id="project_name"
                name="project_name"
                label="Project Name"
                // //margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            {(roleName === 'client_admin' || roleName === 'client_cio' || roleName === 'client_sales') &&

              <FormControl className={classes.formControl}>
                <TextField
                  id="outlined-multiline-static"
                  label="Project Info"
                  multiline
                  rows={3}
                  inputProps={{ className: classes.inputControl }}
                  value={values.project_info}
                  onChange={handleChange('project_info')}
                  variant="outlined"
                  name="project_info"
                  //margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            }
            {(roleName !== 'client_admin' && roleName !== 'client_cio' && roleName !== 'client_sales') && (
              <>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-outlined-label">
                    Project Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.project_status ? values.project_status : null}
                    name="project_status"
                    onChange={handleChange('project_status')}
                    label="Project Status"
                    notched={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={'ONGOING'}>{'ONGOING'}</MenuItem>
                    <MenuItem value={'PROCESSING'}>{'PROCESSING'}</MenuItem>
                    <MenuItem value={'FINISHING'}>{'FINISHING'}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Client ref"
                    inputProps={{ className: classes.inputControl }}
                    value={values.client_ref}
                    onChange={handleChange('client_ref')}
                    variant="outlined"
                    name="client_ref"
                    // fullWidth
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Project Info"
                    multiline
                    rows={3}
                    inputProps={{ className: classes.inputControl }}
                    value={values.project_info}
                    onChange={handleChange('project_info')}
                    variant="outlined"
                    name="project_info"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-outlined-label">
                    Client
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.client ? values.client : null}
                    name="client"
                    notched
                    placeholder={'please select client'}
                    onChange={handleChange('client')}
                    label="Client"
                    // //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {clientsList &&
                      clientsList.map((item) => (
                        <MenuItem value={item.id}>{item.client_name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Project Request"
                    multiline
                    rows={3}
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={values.delivery_info}
                    variant="filled"
                    name="project_request"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-outlined-label">Delivery Address</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.delivery_address ? values.delivery_address : null}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    notched
                    onChange={handleChange('delivery_address')}
                    label="Delivery Address"
                    name="delivery_address"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {clientsAddressList &&
                      clientsAddressList.map((item) => (
                        <MenuItem value={item.id}>{item.delievery_address}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>)
            }
            {/* <FormControl className={classes.formControl}>
              <TextField
                id="outlined-multiline-static"
                label="Project Info"
                multiline
                rows={3}
                inputProps={{ className: classes.inputControl }}
                value={values.project_info}
                onChange={handleChange('project_info')}
                variant="outlined"
                name="project_info"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl> */}
          </div>


          {(roleName !== 'client_admin' && roleName !== 'client_cio' && roleName !== 'client_sales') && (
            <>
              <Divider />
              <div className={classes.inputGroup}>

                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={`${deliveryValues?.name ? deliveryValues?.name : ''}`}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="filled"
                    // fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="contact_tfn4"
                    label="Name"
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={deliveryValues.sub_org}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="filled"
                    // fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="contact_tfn3"
                    label="Sub org"
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={deliveryValues.city}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="filled"
                    // fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="contact_tfn2"
                    label="City"
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={deliveryValues.postal_code}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="filled"
                    // fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="contact_tfn1"
                    label="Postal Code"
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Delivery Info"
                    multiline
                    rows={3}
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={deliveryValues.address_info}
                    variant="filled"
                    name="delivery_info1"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </div>
              <Divider />

              <div className={classes.inputGroup}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-outlined-label">Main Contact</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.contact_attn ? values.contact_attn : null}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    notched={true}
                    onChange={handleChange('contact_attn')}
                    label="Main Contact"
                    name="contact_attn"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {clientUsers &&
                      clientUsers.map((item) => (
                        <MenuItem value={item.id}>{item.first_name ? item.first_name : ''} {item.last_name ? item.last_name : ''}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={values.contact_phone_number}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="filled"
                    // fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="contact_tfn"
                    label="Contact telephone"
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: true }}
                    value={values.contact_email}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="filled"
                    // fullWidth
                    id="contact_email"
                    label="Contact E-mail"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </div>
              <Divider />
              <div className={classes.inputGroup}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-outlined-label">
                    Partner
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.partner ? values.partner : null}
                    name="partner"
                    onChange={handleChange('partner')}
                    label="Partner"
                    notched
                    // margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {partnersList &&
                      partnersList.map((item) => (
                        <MenuItem value={item.id}>{item.partner_name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>

                  <InputLabel shrink id="demo-simple-select-outlined-label">
                    Partner Contact
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.partner_contact_attn ? values.partner_contact_attn : null}
                    name="partner_contact_attn"
                    onChange={handleChange('partner_contact_attn')}
                    label="Partner Contact"
                    notched
                    // margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {partnerUsers &&
                      partnerUsers.map((item) => (
                        <MenuItem value={item.id}>{item.first_name ? item.first_name : '' + "" + item.last_name ? item.last_name : ''}</MenuItem>
                      ))}
                  </Select>

                </FormControl>
              </div>
            </>
          )}
          {
            usersList && usersList.length > 0 &&
            <div className={classes.inputGroup}>
              {(roleName === 'Administrator' || roleName === 'Associate') && (
                <div>
                  <List
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Access
                      </ListSubheader>
                    }
                    sx={{
                      width: '100%',
                      maxHeight: 360,
                      bgcolor: 'background.paper',
                      overflowY: 'scroll',
                    }}
                  >
                    {usersList &&
                      usersList.map((value) => {
                        const labelId = `${value.id}`;
                        return (
                          <>
                            <Row gutter={16} className="user-list" onClick={handleToggle(value.id)}>
                              <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                <Checkbox
                                  edge="start"
                                  checked={checked.indexOf(value.id) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </Col>
                              <Col className="gutter-row" xl={8} lg={8} md={12} sm={12} xs={8}>
                                <div className="list-name">{value.first_name ? value.first_name : '' + " " + value.last_name ? value.last_name : ''}</div>
                              </Col>
                              <Col className="gutter-row" xl={6} lg={6} md={12} sm={12} xs={6}>
                                <div className="list-name">{value.role?.description}</div>
                              </Col>
                              <Col className="gutter-row" xl={6} lg={6} md={12} sm={12} xs={6}>
                                <div className="list-name">{value.email}</div>
                              </Col>
                            </Row>
                            {/* <ListItem key={value} disablePadding className="li-list" >
                              <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(value.id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value.first_name ? value.first_name : '' + " " + value.last_name ? value.last_name : ''} />
                                <ListItemText id={labelId} primary={value.userType} />
                                <ListItemText id={labelId} primary={value.role?.description} />
                                <ListItemText id={labelId} primary={value.email} />
                              </ListItemButton>
                            </ListItem> */}
                          </>
                        );
                      })}
                  </List>
                </div>
              )}

            </div>
          }
          <div className={classes.inputGroup}>
            <div className="stepper-btn">
              <Button
                variant="contained"
                color="warning"
                disabled={loading}
                onClick={() => goBack()}
                className={"actionbutton"}
              >
                <span className='indicator-label'>{'Cancel'}</span>
              </Button>

              <Button
                onClick={() => handleSubmit()}
                variant="contained"
                color="primary"
                disabled={loading}
                className={"actionbutton"}
              >
                <span className='indicator-label'>{'Submit'}</span>
              </Button>
            </div>
          </div>
        </form>
      </Box>
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

    </Card>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AddNewProjects);
