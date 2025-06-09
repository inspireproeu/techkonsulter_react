import React, { useState, useContext, useEffect } from 'react';
import { history } from 'umi';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { useParams, useLocation } from 'react-router-dom';
import { DATAURLS } from '../../../utils/constants';
import { fetchPost, fetchGet, fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import CustomGoBackButton from '../../../uikit/GoBack';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';

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
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '20px'
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
    inputControl: { fontSize: '1rem' },
  })
);


const AddNew = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const urlParams = useParams();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [values, setValues] = useState({
    country: 'SWEDEN'
  });
  const [emailError, setEmailError] = useState(false);
  const [subAddressId, setSubAddressId] = useState('');
  const location = useLocation()
  const [allCountries, setAllCountries] = useState([]);

  const handleChange = name => event => {
    let targetvalues = event.target.value ? event.target.value : '';
    setValues({ ...values, [name]: targetvalues });
  };

  useEffect(() => {
    getCountry()

    if (location && urlParams?.id) {
      let pathname = location.pathname.split("/");
      if (pathname[1] === 'updateaddress') {
        setSubAddressId(pathname[2])
        getClientAddressDetail(pathname[2])
      } if (pathname[1] === 'createaddress') {
        values.client = urlParams.id;
        setValues({ ...values });
        getUsers(urlParams.id);
      }
    }
  }, [location, urlParams])

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

  const getClientAddressDetail = async (id) => {
    // setLoading(true);
    fetchGet(`${DATAURLS.CLIENTADDRESS.url}/${id}`, getAccessToken())
      .then((response) => {
        let data = response.data;
        getUsers(data.client);
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
    setLoading(true);
    if (subAddressId) {
      fetchPut(`${DATAURLS.CLIENTADDRESS.url}/${subAddressId}`, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            setSubAddressId('')
            history.push(`/clientsubaddress/${values.client}`);
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
      fetchPost(DATAURLS.CLIENTADDRESS.url, values, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
            history.push(`/clientsubaddress/${values.client}`);
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

  const goBack = () => {
    setSubAddressId('')
    history.push(`/clientsubaddress/${values.client}`);
  }

  return (
    <>
      <div className="go-back">
        <CustomGoBackButton color="warning" title='Go Back' to={`clientsubaddress/${values.client}`} />
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
              <h3 className={"card_label"}>Create Sub Address</h3>
            </div>
            <div className={classes.inputGroup}>
              <form
                autoComplete="off"
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework sub-add"
                noValidate
                id="kt_login_signup_form"
              // onSubmit={handleSubmit}
              >
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl }}
                    value={values.sub_org}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    required
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
                <FormControl className={classes.formControl}>
                  <TextField
                    inputProps={{ className: classes.inputControl, disabled: false }}
                    value={values.city}
                    // onChange={(event) => setUserName(event.target.value)}
                    variant='outlined'
                    required
                    onChange={handleChange('city')}
                    id='city'
                    label='City'
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
                    variant='outlined'
                    required
                    onChange={handleChange('phone_number')}
                    id='phone_number'
                    label='Phone Number'
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
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
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
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
                    required
                    // fullWidth
                    //margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
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
              </form>
            </div>
          </Box>
        </CardContent>
      </Card>

    </>
  );
};

export default AddNew;
