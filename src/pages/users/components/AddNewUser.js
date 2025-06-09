import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import React, { useState, useContext, useEffect } from 'react';

import { DATAURLS, WAREHOUSE as WAREHOUSES } from '../../../utils/constants';
import { fetchPost, fetchPut, fetchGet } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';

import {
  CloseCircleOutlined,
} from '@ant-design/icons';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) =>
  createStyles({
    actionIcon: {
      fontSize: '1.25rem',
      cursor: 'pointer',
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
      width: '800px !important',
      height: '950px',
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
      width: '70%',
      marginBottom: '15px',
    },
    inputGroup: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    inputControl: { fontSize: '1rem' },
  })
);

const AddNewUser = ({
  open,
  setOpen,
  parentGridApi,
  allUsers,
  allUserRoles,
  getNewData,
  title,
  urlParams,
  page,
  editData,
  paramId,
  seteditData,
  currentpage,// This is used for profile update
  logout,
  callCurrentUser,
  userType
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [emailError, setEmailError] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [userRole, setUserRole] = useState();

  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requiredMessage, setRequiredMessage] = useState('');
  const [alreadyErrorMessage, setAlreadyErrorMessage] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [isDefault, setisDefault] = useState(null);
  const [warehouse, setWarehouse] = useState(null);

  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  useEffect(() => {
    if (!open) {
      setUserName();
      setUserEmail();
      setUserPassword();
      setUserRole();
      setSuccess(false);
      setError(false);
      setLoading(false);
      setPhone_number('')
      setisDefault(null)
      setAlreadyErrorMessage('')
      setRequiredMessage('')
      setWarehouse(null)
    }
  }, [open]);


  useEffect(() => {
    if (editData) {
      setUserName(editData?.first_name);
      setUserEmail(editData?.email);
      setUserRole(editData?.role?.id);
      setPhone_number(editData?.phone_number)
      setisDefault(editData?.isDefault)
      setWarehouse(editData.warehouse)
    }

  }, [editData]);

  useEffect(() => {
    if ((userEmail && !userEmail.match(mailformat)) || emailError) {
      setEnableSubmission(false);
      return;
    }
    if (!userName || !userEmail || !userPassword || !userRole) {
      setEnableSubmission(false);
      return;
    }
    if (
      userName &&
      userEmail.match(mailformat) &&
      (userPassword) &&
      userRole &&
      !emailError
    ) {
      setEnableSubmission(true);
    }
  }, [userName, userEmail, userPassword, userRole, emailError, invalidEmail]);

  const handleSubmit = () => {
    if (!userName) {
      setRequiredMessage("Please enter fullname");
      return
    } else if (!userEmail) {
      setRequiredMessage("Please enter email");
      return
    } else if (!userRole) {
      setRequiredMessage("Please select role");
      return
    }
    setRequiredMessage('')
    setLoading(true);
    let values = {
      first_name: userName,
      email: userEmail,
      password: userPassword,
      role_name: userRole,
      role: userRole,
      phone_number: phone_number,
      isDefault: isDefault
    }
    if (currentpage === 'profile') {
      delete values.email;
      delete values.role_name;
      delete values.role;
      delete values.isDefault;
    }
    if (warehouse && userType === 'ADMIN') {
      values.warehouse = warehouse;
    }
    if (!currentpage) {
      if ((urlParams?.id || paramId) && page[1] == 'clientusersList') {
        values.client = paramId ? paramId : urlParams.id
        values.userType = 'CLIENT'
      }
      if ((urlParams?.id || paramId) && page[1] == 'partnerusersList') {
        values.partner = paramId ? paramId : urlParams.id
        values.userType = 'PARTNER'
      } else if (page[1] == 'users') {
        let currentrole = allUserRoles.filter((itm) => itm.id === userRole);
        if (currentrole[0]?.description?.toUpperCase() === 'FINANCIAL') {
          values.userType = 'FINANCIAL'
        } else {
          values.userType = 'ADMIN'
        }
      }
    }


    if (editData && editData?.id) {
      let queryParams = `filter={"_and":[{"id":{"_neq":"${editData?.id}"}},{"email":{"_eq":"${userEmail}"}}]}&aggregate={"count":["*"]}`
      fetchGet(`${DATAURLS.USERS.url}?${queryParams}`, values, getAccessToken())
        .then((response) => {
          if (parseInt(response.data[0].count) > 0) {
            setLoading(false);
            setError(false);
            setAlreadyErrorMessage('Email already exists on other user. Please try some other account.');
          } else {
            setAlreadyErrorMessage('')
            fetchPut(`${DATAURLS.USERS.url}/${editData.id}`, values, getAccessToken())
              .then((response) => {
                if (response.data.id) {
                  setLoading(false);
                  setSuccess(true);
                  if (currentpage === 'profile' && values.password) {
                    logout()
                  }
                } else {
                  setLoading(false);
                  setError(true);
                  setErrorMessage(response.message);
                }
              })
              .catch((err) => {
                setLoading(false);
                throw err;
              });
          }
        }).catch((err) => {
          throw err;
        });
      // setTimeout(() => {
      //   handleReset();
      // }, 500); 

    } else {
      if (userEmail) {
        let queryParams = `filter={"_and":[{"email":{"_eq":"${userEmail}"}}]}&aggregate={"count":["*"]}`
        fetchGet(`${DATAURLS.USERS.url}?${queryParams}`, values, getAccessToken())
          .then((response) => {
            if (parseInt(response.data[0].count) > 0) {
              setLoading(false);
              setError(false);
              setAlreadyErrorMessage('Account already exists. Please try some other account.');

            } else {

              fetchPost(`${DATAURLS.USERS.url}`, values, getAccessToken())
                .then((response) => {
                  if (response.data.id) {
                    setLoading(false);
                    setSuccess(true);
                  } else {
                    setLoading(false);
                    setError(true);
                    setErrorMessage(response.message);
                  }
                })
                .catch((err) => {
                  setLoading(false);
                  throw err;
                });
            }
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      }


    }

  };
  const refreshData = () => {

    if (!currentpage) {
      getNewData(parentGridApi, paramId);
      parentGridApi.deselectAll();
    }

    setSuccess(false);
    setOpen(false);
    if (currentpage) {
      callCurrentUser()
    }
  }

  return (
    <Dialog
      open={open}
      //  onClose={getNewData(p)}

      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='lg'
      className='dialogRoot'
      classes={{ paper: classes.dialogRoot }}
    >
      <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
        <div className={classes.dialogTitleText}>{title}</div>
        <CloseCircleOutlined
          className={classes.actionIcon}
          onClick={() => {
            refreshData()
          }}
        />
      </DialogTitle>
      { requiredMessage && <div className="requiredmessage">{requiredMessage}</div>}

      {alreadyErrorMessage && <div style={{ color: 'red', textAlign: 'center', padding: '6px' }}>{alreadyErrorMessage}</div>}
      <DialogContent className={classes.dialogContent}>
        {!success && !error && (
          <div className={classes.inputGroup}>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='user_name'
                label='Full Name'
                autoFocus
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                //   autoComplete='fname'
                disabled={currentpage === 'profile' ? true : false}
                error={emailError || invalidEmail}
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                onBlur={(event) => {
                  if (userEmail) {
                    setEmailError(
                      allUsers.find((user) => user.user_email === userEmail)
                    );
                    setInvalidEmail(!userEmail.match(mailformat));

                  }
                }}
                variant='outlined'
                required
                fullWidth
                id='user_email'
                label='Email'
                helperText={
                  emailError
                    ? 'An account already exists for this email !'
                    : invalidEmail
                      ? 'Invalid Email'
                      : ''
                }
              />
            </FormControl>
            {
              <FormControl className={classes.formControl}>
                <TextField
                  value={userPassword}
                  onChange={(event) => setUserPassword(event.target.value)}
                  variant='outlined'
                  required
                  fullWidth
                  id='user_password'
                  label='Password'
                  password
                />
              </FormControl>
            }

            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={phone_number}
                onChange={(event) => setPhone_number(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='phone'
                label='Phone Number'
              />
            </FormControl>
            {
              !currentpage && <FormControl
                variant='outlined'
                required
                className={classes.formControl}
              >
                <InputLabel id='demo-simple-select-outlined-label'>
                  Role
              </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={userRole}
                  name="role"
                  onChange={(event) => {
                    console.log("event.target", event.target)
                    setUserRole(event.target.value)
                    // setUserName(event.target.value)
                  }}
                  label='Role'
                >
                  {allUserRoles &&
                    allUserRoles.map((item) => (
                      <MenuItem value={item.id}>{item.description}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            }
            { (!currentpage && (page[1] == 'partnerusersList' || page[1] == 'clientusersList')) &&
              <FormControl className={classes.formControl}>
                <Box sx={{ display: 'flex' }}>
                  <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                    {/* <FormLabel component="legend">Default set access to project</FormLabel> */}
                    <FormGroup>
                      <FormControlLabel
                        className="chekcbox-label"
                        control={
                          <Checkbox
                            onChange={(event) => {
                              setisDefault(event.target.checked);
                            }}
                            checked={isDefault}
                          />
                        }
                        label="Default set access to project"
                      />
                    </FormGroup>
                  </FormControl>
                </Box>
              </FormControl>
            }
            {
              userType === 'ADMIN' &&
              <FormControl
                variant='outlined'
                className={classes.formControl}
              >
                <InputLabel id='demo-simple-select-outlined-label'>
                  Warehouse
              </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={warehouse ? warehouse : []}
                  multiple
                  onChange={(event) => setWarehouse(event.target.value)}
                  label="Warehouse"
                >
                  {
                    WAREHOUSES.map((option, index) => (
                      <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            }
          </div>
        )}
        {success && !error && <div>{editData.id ? 'User successfully updated.' : 'User creation successful'}</div>}
        {!success && error && <div style={{ color: 'red' }}>{errorMessage}</div>}
      </DialogContent>
      <DialogActions>
        {success && (
          <div className={classes.buttonContainer}>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={() => {
                refreshData()
              }}
            >
              Ok!
            </Button>
          </div>
        )}
        {!success && (
          <div className={classes.buttonContainer}>
            <Button
              variant='contained'
              onClick={() => {
                seteditData();
                setOpen(false)
              }}
              color='secondary'
              disabled={loading}
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={() => handleSubmit()}
              color='primary'
              disabled={!editData && !enableSubmission}
              className={classes.button}
            >
              {`${editData?.id ? 'Update' : 'Add'}`}
              {loading && (
                <CircularProgress
                  size='1rem'
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddNewUser;
