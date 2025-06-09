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


const useStyles = makeStyles((theme) =>
  createStyles({
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

const AddNew = ({
  open,
  setOpen,
  parentGridApi,
  getNewData,
  title,
  urlParams,
  page,
  editData,
  paramId,
  seteditData
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [description, setdescription] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [company_cost, setcompany_cost] = useState('');
  const [enableSubmission, setEnableSubmission] = useState(false);

  const [client_cost, setclient_cost] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requiredMessage, setRequiredMessage] = useState('');
  const [alreadyErrorMessage, setAlreadyErrorMessage] = useState('');


  useEffect(() => {
    if (!open) {
      setName('');
      setdescription('');
      setclient_cost('');
      setcompany_cost('')
      setSuccess(false);
      setError(false);
      setLoading(false);
      setAlreadyErrorMessage('')
      setRequiredMessage('')
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setName(editData?.name);
      setdescription(editData?.description);
      setclient_cost(editData?.client_cost);
      setcompany_cost(editData?.company_cost)
    }

  }, [editData]);

  useEffect(() => {
    if (!name) {
      setEnableSubmission(false);
      return;
    }
    if (
      name &&
      description &&
      client_cost &&
      company_cost
    ) {
      setEnableSubmission(true);
    }
  }, [name, description, client_cost, company_cost]);

  const handleSubmit = () => {
    if (!name) {
      setRequiredMessage("Please enter deviation title");
      return
    }
    // else if (!userEmail) {
    //   setRequiredMessage("Please enter email");
    //   return
    // } else if (!userRole) {
    //   setRequiredMessage("Please select role");
    //   return
    // }
    setRequiredMessage('')
    setLoading(true);
    let values = {
      name: name,
      description: description,
      client_cost: client_cost,
      company_cost: company_cost
    }

    if (editData && editData?.id) {
      fetchPut(`${DATAURLS.DEVIATION.url}/${editData.id}`, values, getAccessToken())
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
          throw err;
        });
    } else {
      if (name) {
        let queryParams = `filter={"_and":[{"name":{"_contains":"${name}"}}]}&aggregate={"count":["*"]}`
        fetchGet(`${DATAURLS.DEVIATION.url}?${queryParams}`, values, getAccessToken())
          .then((response) => {
            if (parseInt(response.data[0].count) > 0) {
              setLoading(false);
              setError(false);
              setAlreadyErrorMessage('Deviation already exists. Please try some other title.');

            } else {
              setAlreadyErrorMessage('')
              fetchPost(`${DATAURLS.DEVIATION.url}`, values, getAccessToken())
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
                  throw err;
                });
            }
          })
          .catch((err) => {
            throw err;
          });
      }


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
      <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
        <div className={classes.dialogTitleText}>{title}</div>
      </DialogTitle>
      { requiredMessage && <div className="requiredmessage">{requiredMessage}</div>}

      {alreadyErrorMessage && <div style={{ color: 'red', textAlign: 'center', padding: '6px' }}>{alreadyErrorMessage}</div>}
      <DialogContent className={classes.dialogContent}>
        {!success && !error && (
          <div className={classes.inputGroup}>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={name}
                onChange={(event) => setName(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='user_name'
                label='Title'
                autoFocus
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={description}
                onChange={(event) => setdescription(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='phone3'
                label='Description'
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={company_cost}
                onChange={(event) => setcompany_cost(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='phone1'
                label='Company cost'
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={client_cost}
                onChange={(event) => setclient_cost(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='phone2'
                label='Client cost'
              />
            </FormControl>
          </div>
        )}
        {success && !error && <div>{editData?.id ? 'Deviation successfully updated.' : 'Deviation creation successful'}</div>}
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
                seteditData()
                getNewData(parentGridApi, paramId);
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

export default AddNew;
