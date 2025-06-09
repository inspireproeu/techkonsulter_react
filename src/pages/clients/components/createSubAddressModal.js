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
import { DATAURLS } from '../../../utils/constants';
import { fetchPost, fetchPut, fetchGet } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useParams, useLocation } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '46px',
      background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
      boxShadow: '1px 1px 3px #8e9eab',
    },
    dialogRoot: {
      width: '650px !important',
      height: '500px',
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
      width: '100%',
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
  getNewData,
  title,
  urlParams,
  page,
  editData,
  action,
  seteditData,
  clientsData,
  allCountries,
  usersList
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [values, setValues] = useState({
    country: 'SWEDEN'
  });
  const [subAddressId, setSubAddressId] = useState('');
  const [requiredMessage, setRequiredMessage] = useState('');

  const handleChange = name => event => {
    let targetvalues = event.target.value ? event.target.value : '';
    setValues({ ...values, [name]: targetvalues });
  };

  useEffect(() => {

    if (open && page && urlParams?.id) {
      if (editData?.id) {
        setSubAddressId(editData.id)
        getClientAddressDetail(editData.id)
      } else {
        values.client = urlParams.id;
        values.country= 'SWEDEN';
        setValues({ ...values });
      }
    }
  }, [page, urlParams, open])

  useEffect(() => {
    if (!open) {
      setRequiredMessage('')
    }
  }, [open]);

  const copyaddress = () => {
    if (clientsData && action === 'create') {
      // let postal_address = clientsData.postal_address ? clientsData.postal_address + ' , ' : ''
      // let postal_code = clientsData.postal_code ? clientsData.postal_code + ' , ' : ''
     // let delievery_address = `${postal_address}${postal_code}${clientsData.city}`

      setValues({
        sub_org: clientsData.client_name,
        postal_code: clientsData.postal_code,
        city: clientsData.city,
        delievery_address: clientsData.delivery_address,
        country: 'SWEDEN'
      })
    }
  }

  useEffect(() => {
    if (editData) {
      setValues(editData)
    }

  }, [editData]);

  const getClientAddressDetail = async (id) => {
    // setLoading(true);
    fetchGet(`${DATAURLS.CLIENTADDRESS.url}/${id}`, getAccessToken())
      .then((response) => {
        let data = response.data;
        if (!data.country) {
          data.country = 'SWEDEN';
        }
        setValues(data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };
  const handleSubmit = () => {
    if (subAddressId) {
      setLoading(true);
      fetchPut(`${DATAURLS.CLIENTADDRESS.url}/${subAddressId}`, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            setSubAddressId('')
            getNewData(urlParams.id);
          } else {
            setLoading(false);
            setError(true);
            setErrorMessage(response.message);
          }
        })
        .catch((err) => {
          throw err;
        });
    } else {
      values.client = urlParams.id
      if (!values.delievery_address) {
        setRequiredMessage("Please enter delivery address");
        return
      }
      setLoading(true);
      fetchPost(DATAURLS.CLIENTADDRESS.url, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            getNewData(urlParams.id);
          } else {
            setLoading(false);
            setError(true);
            setErrorMessage(response.message);
          }
        })
        .catch((err) => {
          throw err;
        });
    }

  };

  return (
    <Dialog
      open={open}
      //   onClose={getNewData(p)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
      className='dialogRoot'
      classes={{ paper: classes.dialogRoot }}
    >

      {
        action === 'create' &&
        <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
          <div className={classes.dialogTitleText}>{title}</div>
          <div>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={() => {
                copyaddress()
              }}
            >
              Copy main address
            </Button>
          </div>
        </DialogTitle>
      }
      { requiredMessage && <div className="requiredmessage">{requiredMessage}</div>}

      <DialogContent className={classes.dialogContent}>
        {!success && !error && (
          <div className={classes.inputGroup}>
            <Grid container spacing={2}>

              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl }}
                    value={values.sub_org}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    // error={!values.sub_org ? true : false}
                    // fullWidth
                    id='sub_org'
                    label='Sub Org'
                    onChange={handleChange('sub_org')}
                    // //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel shrink id='demo-simple-select-outlined-label'>
                    User
              </InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    value={values.sub_address_contact ? values.sub_address_contact : null}
                    onChange={handleChange('sub_address_contact')}
                    label='User'
                    notched
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {usersList &&
                      usersList.map((item) => (
                        <MenuItem value={item.id}>{item.first_name ? item.first_name : ''} {item.last_name ? item.last_name : ''}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.postal_code}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    onChange={handleChange('postal_code')}
                    id='zip'
                    label='Postal Code'
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.city}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    onChange={handleChange('city')}
                    id='city'
                    label='City'
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <Autocomplete
                    id="size-small-standard"
                    value={values && values.country ? allCountries.find(v => v.country === values.country) || {} : null}
                    getOptionLabel={((option) => option.country) || {}}
                    options={allCountries}
                    onChange={(e, option) => {
                      if (option) {
                        setValues({ ...values, ['country']: option.country });
                      }
                    }}
                    // onChange={handleChange('client')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant={"outlined"}
                        label="Country"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.phone_number}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    onChange={handleChange('phone_number')}
                    id='phone_number'
                    label='Phone Number'
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.delievery_address}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    multiline
                    rows={4}
                    onChange={handleChange('delievery_address')}
                    id='delievery_address'
                    label='Delivery address'
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="outlined-multiline-static"
                    label='Address Info'
                    multiline
                    rows={4}
                    inputProps={{ className: classes.inputControl }}
                    value={values.address_info}
                    onChange={handleChange('address_info')}
                    variant='outlined'
                    // fullWidth
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        )}
        {success && !error && <div>{editData?.id ? 'Sub address updated successfully' : 'Sub address created successfully'}</div>}
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
                getNewData(urlParams.id);
                parentGridApi.deselectAll();
                setSuccess(false);
                setOpen(false);
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
                seteditData({});
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
              // disabled={!editData && !enableSubmission}
              className={classes.button}
            >
              {`${editData?.id ? 'Update' : 'Submit'}`}
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
