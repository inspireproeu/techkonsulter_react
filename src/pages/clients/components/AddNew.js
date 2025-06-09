import React, { useState, useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
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
import CustomGoBackButton from '../../../uikit/GoBack';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

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
  const [userEmail, setUserEmail] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [values, setValues] = useState({
    country: 'SWEDEN'
  });
  const [clientid, setClientId] = React.useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [errValues, setErrValues] = useState({});
  const [allCountries, setAllCountries] = useState([]);
  const [toShowEstimateValues, settoShowEstimateValues] = useState(false);

  useEffect(() => {
    getCountry()

    if (urlParams && urlParams.id) {
      setClientId(urlParams.id);
      getClientDetail(urlParams.id);
    }
  }, [urlParams]);

  const getClientDetail = async (id, value = null) => {
    // setLoading(true);

    let filter = '';
    let queryId = '';
    if (value?.client_org_no) {
      filter = `&filter[client_org_no][_eq]=${value.client_org_no}`
    } else {
      queryId = `/${id}`
    }
    fetchGet(`${DATAURLS.CLIENT.url}${queryId}?fields=id,country,client_name,client_org_no,postal_address,address2,city,postal_code,phone_number,delivery_address,delivery_info,toShowEstimateValues${filter}`)
      .then((response) => {
        let data = response.data;
        settoShowEstimateValues(data.toShowEstimateValues);
        if (value?.client_org_no) {
          if (data.length === 0) {
            handleInsert(value)
          } else {
            setSnackBarOpen(true);
            setSnackBarType('error');
            setSnackBarMessage('Client org number already exists.');
            setLoading(false);
          }

        } else {
          setValues(data);
        }

      })
      .catch((err) => {
        throw err;
      });
  };

  const getCountry = async () => {
    // setLoading(true);
    fetchGet(`${DATAURLS.COUNTRY.url}?fields=id,country&limit=-1&sort=id`)
      .then((response) => {
        let data = response.data;
        setAllCountries(data);
        // setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };
  const goBack = () => {
    history.push(`/clients`);
  }

  useEffect(() => {
    setUserEmail();
    setSuccess(false);
    setError(false);
    setLoading(false);
  }, [getAccessToken()]);


  const handleSubmit = async () => {
    if (!values.client_name?.trim()) {
      setErrValues({ ...errValues, ['client_nameError']: true });
      return
    }
    setLoading(true);
    values.client_name = values.client_name.trim();
    setSnackBarOpen(false);
    if (urlParams && urlParams.id) {
      delete values.id;
      delete values.user_updated;
      delete values.user_created;
      values.toShowEstimateValues = toShowEstimateValues
      fetchPut(`${DATAURLS.CLIENT.url}/${urlParams.id}`, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            setSnackBarOpen(true);
            setSnackBarType('success');
            setSnackBarMessage('Client updated successfully');
            history.push({
              pathname: '/clients',
            });
          } else {
            setLoading(false);
            setError(true);
            setErrorMessage(response.message);
            setSnackBarOpen(true);
            setSnackBarType('error');
            setSnackBarMessage(response.message);
          }
        })
        .catch((err) => {
          console.log("errrrr", err)
          setLoading(false);
          throw err;
        });
    } else {
      getClientDetail(null, values)
    }
  };


  const handleChange = (name) => (event) => {
    setSnackBarOpen(false);
    let targetvalues = event.target.value ? event.target.value : '';
    setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })

    setValues({ ...values, [name]: targetvalues });
  };

  const handleInsert = (values) => {
    values.toShowEstimateValues = toShowEstimateValues
    fetchPost(DATAURLS.CLIENT.url, values)
      .then((response) => {
        if (response.data.id) {
          setLoading(false);
          setSuccess(true);
          setSnackBarOpen(true);
          setSnackBarType('success');
          setSnackBarMessage('Client inserted successfully');
          history.push({
            pathname: '/clients',
          });
        } else {
          setLoading(false);
          setError(true);
          setErrorMessage(response.message);
          setSnackBarOpen(true);
          setSnackBarType('error');
          setSnackBarMessage(response.message);

        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("errrrr", err)
        throw err;
      });
  };

  return (
    <>
      <div className="go-back">
        <CustomGoBackButton to={`clients`} color="warning" title='Go Back' />
      </div>
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
        <CardContent className="project-1" >

          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <div className={"card_title"}>
              <h3 className={"card_label"}>Create Client</h3>
            </div>

            <div className={classes.inputGroup}>
              <form
                autoComplete="off"
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                id="kt_login_signup_form"
              // onSubmit={handleSubmit}
              >
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl }}
                    value={values.client_name}
                    variant="outlined"
                    required
                    error={errValues.client_nameError ? true : false}
                    id="client_name"
                    label="Client Name"
                    onChange={handleChange('client_name')}
                    // //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl }}
                    value={values.client_org_no}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    required
                    // fullWidth
                    id="client_org_no"
                    label="Client Org no"
                    onChange={handleChange('client_org_no')}
                    // //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.postal_address}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    onChange={handleChange('postal_address')}
                    id="postal_address"
                    label="Postal Address"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.address2}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    onChange={handleChange('address2')}
                    id="address2"
                    label="Address2"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.postal_code}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    onChange={handleChange('postal_code')}
                    id="zip"
                    label="Postal Code"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.city}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    onChange={handleChange('city')}
                    id="city"
                    label="City"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
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
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.phone_number}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    onChange={handleChange('phone_number')}
                    id="phone_number"
                    label="Phone Number"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Delivery Address"
                    multiline
                    rows={4}
                    inputProps={{ className: classes.inputControl }}
                    value={values.delivery_address}
                    onChange={handleChange('delivery_address')}
                    variant="outlined"
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
                    label="Client request"
                    multiline
                    rows={4}
                    inputProps={{ className: classes.inputControl }}
                    value={values.delivery_info}
                    onChange={handleChange('delivery_info')}
                    variant="outlined"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
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
                                settoShowEstimateValues(event.target.checked);
                              }}
                              checked={toShowEstimateValues}
                            />
                          }
                          label="Show TechValuator"
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
                </FormControl>

                <div className="stepper-btn">
                  <Button
                    variant="contained"
                    color="warning"
                    disabled={loading}
                    className={"actionbutton"}
                    onClick={() => goBack()}
                  >
                    <span className="indicator-label">{'Cancel'}</span>
                  </Button>

                  <Button
                    onClick={() => handleSubmit()}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    className={"actionbutton"}
                  >
                    <span className="indicator-label">{'Submit'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default AddNew;
