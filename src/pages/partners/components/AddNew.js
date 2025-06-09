import React, { useState, useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
// import Button from '@mui/material/Button';
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
import { DATAURLS, APIPREFIX } from '../../../utils/constants';
import { fetchPost, fetchGet, fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import CustomGoBackButton from '../../../uikit/GoBack';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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
      width: '95%',
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

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [partnerId, setPartnerId] = useState()
  const [values, setValues] = useState({
    country: 'SWEDEN'
  });
  const [errValues, setErrValues] = useState({});
  // const [allDatas, setAllDatas] = useState([])
  const [allCountries, setAllCountries] = useState([]);
  const [state, setState] = useState({});
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [toShowEstimateValues, settoShowEstimateValues] = useState(false);

  useEffect(() => {
    if (urlParams && urlParams.id) {
      setPartnerId(urlParams.id);
      getDetail(urlParams.id);

    }
    // getPartners();
    getCountry()
  }, [urlParams]);

  const getDetail = async (id) => {
    // setLoading(true);
    fetchGet(`${DATAURLS.PARTNER.url}/${id}?fields=id,country,partner_name,partner_org_no,postal_address,city,postal_code,phone_number,commission,partner_logo.id,toShowEstimateValues`, getAccessToken())
      .then((response) => {
        let data = response.data;
        settoShowEstimateValues(data.toShowEstimateValues);

        // data.partner_logo 
        setValues(data);
        if (data.partner_logo) {
          setState({
            currentFile: data.partner_logo,
            previewImage: `${APIPREFIX}/assets/${data.partner_logo.id}?access_token=${getAccessToken()}`,
            progress: 0,
            message: ""
          });
        }
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
  // const getPartners = async () => {
  //   // setLoading(true);
  //   fetchGet(`${DATAURLS.PARTNER.url}?fields=id,partner_name&limit=-1`, getAccessToken())
  //     .then((response) => {
  //       let data = response.data;
  //       setAllDatas(data);
  //       // setLoading(false);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // };

  const goBack = () => {
    history.push(`/partners`);
  }

  // const getCheck = (value) => {
  //   let response = allDatas.find((row) => (row.partner_name.toUpperCase() === value.toUpperCase()))
  //   return response?.id ? true : false
  // }


  const handleSubmit = () => {
    if (!values.partner_name?.trim()) {
      setErrValues({ ...errValues, ['partner_nameError']: true });
      return
    }
    values.toShowEstimateValues = toShowEstimateValues;
    setLoading(true);
    values.partner_name = values.partner_name.trim();
    if (urlParams && urlParams.id) {
      delete values.id;
      delete values.user_updated;
      delete values.user_created;
      fetchPut(`${DATAURLS.PARTNER.url}/${urlParams.id}`, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            history.push({
              pathname: '/partners',
            });
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
    } else {
      fetchPost(DATAURLS.PARTNER.url, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            history.push({
              pathname: '/partners',
            });
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
  };

  const handleChange = (name) => (event) => {
    let targetvalues = event.target.value ? event.target.value : '';
    setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })
    setValues({ ...values, [name]: targetvalues });
  };

  const selectFile = async (event) => {
    if ((event?.target?.files[0]?.type) !== 'image/png') {
      setSnackBarOpen(true)
      setSnackBarMessage("Only PNG files are accepted for images.");
      setSnackBarType("error")
      return
    }
    setSnackBarOpen(false)
    setSnackBarMessage("");
    setState({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      progress: 0,
      message: ""
    });
    const formData = new FormData();
    let importFiles = event.target.files;
    formData.append('title', `${importFiles[0].name}`);
    formData.append('folder', `ffcc8a2e-2159-49a1-85c2-36d9397c037f`);
    formData.append('file', importFiles[0]);
    await fetchPost(
      `${DATAURLS.FILE.url}`,
      formData
    ).then((response) => {
      if (response.data.id) {
        setValues({ ...values, ['partner_logo']: response.data.id });
      } else {
        setLoading(false);
        setError(true);
        setErrorMessage("Failed to upload image");
      }
    })
      .catch((err) => {
        setLoading(false);
        setError(true);
        setErrorMessage("Failed to upload image");
        throw err;
      });

  }

  return (
    <>
      <div className="go-back">
        <CustomGoBackButton color="warning" title='Go Back' to="partners" />
      </div>
      <Card sx={{ minWidth: 275 }}>
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
              <h3 className={"card_label"}>Create Partner</h3>
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
                    value={values.partner_name}
                    error={errValues.partner_nameError ? true : false}
                    variant="outlined"
                    required
                    // fullWidth
                    id="partner_name"
                    label="Partner Name"
                    onChange={handleChange('partner_name')}
                    // //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.partner_org_no}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    required
                    onChange={handleChange('partner_org_no')}
                    id="partner_org_no"
                    label="Org No"
                    //margin="normal"
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
                    required
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
                    value={values.postal_code}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    required
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
                    required
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
                    required
                    onChange={handleChange('phone_number')}
                    id="phone_number"
                    label="Phone Number"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <div className={"card_title"}>
                  <h4 className={"card_label"}>Settings</h4>
                </div>
                <FormControl className={classes.formControl}>
                  <TextField
                    type='number'
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.commission}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant="outlined"
                    onChange={handleChange('commission')}
                    id="commission"
                    label="Commission"
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div className="upload-image">

                    <div className="mg20">
                      <label htmlFor="btn-upload">
                        <input
                          id="btn-upload"
                          name="btn-upload"
                          style={{ display: 'none' }}
                          type="file"
                          accept="image/png"
                          onChange={selectFile}
                        />
                        <Button
                          className="btn-choose"
                          variant="outlined"
                          component="span" >
                          Choose Logo
                          </Button>
                      </label>
                      {state.previewImage && (
                        <div>
                          <img className="preview my20" src={state.previewImage} alt="" />
                        </div>
                      )}
                    </div >
                  </div >
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
    </>
  );
};

export default AddNew;
