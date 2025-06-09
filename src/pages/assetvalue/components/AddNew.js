import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import React, { useState, useEffect } from 'react';

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
      height: '160px',
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
  seteditData,
  rowData
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [shortName, setShortName] = useState();
  const [description, setdescription] = useState('');
  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requiredMessage, setRequiredMessage] = useState('');
  const [alreadyErrorMessage, setAlreadyErrorMessage] = useState('');
  const [datas, setDatas] = useState([]);


  useEffect(() => {
    if (!open) {
      setName('');
      setShortName('');
      setdescription('');
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
      setShortName(editData?.short_name);
      setdescription(editData?.description);
    }

  }, [editData]);

  useEffect(() => {
    if (rowData) {
      let row = []
      rowData.forEach(element => {
        if (element.short_name !== null) {
          row.push(element.short_name.toLowerCase())
        }
      });
      setDatas(row)
    }

  }, [rowData]);

  useEffect(() => {
    if (!name) {
      setEnableSubmission(false);
      return;
    }
    if (
      name &&
      shortName
    ) {
      setEnableSubmission(true);
    }
  }, [name, description]);

  const handleSubmit = () => {
    if (!name) {
      setRequiredMessage("Please enter complain title");
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
      short_name: shortName,
      // description: description
    }
    if (shortName && (editData?.short_name === null || (editData?.short_name && editData?.short_name.toLowerCase() !== shortName.toLowerCase()))) {
      let already = datas.indexOf('' + shortName.toLowerCase()) === -1
      if (already === false) {
        setLoading(false);
        setAlreadyErrorMessage(`Given shortname already exists.`);
        setShortName('')
        return
      }else {
        setAlreadyErrorMessage('')
      }
    }
    if (editData && editData?.id) {
      fetchPut(`${DATAURLS.COMPLAINTS.url}/${editData.id}`, values, getAccessToken())
        .then((response) => {
          getNewData(parentGridApi, paramId);

          if (response.data.id) {
            setLoading(false);
            setSuccess(true);
          } else {
            console.log("elseeeee", response)
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
        let queryParams = `filter={"_and":[{"name":{"_eq":"${name.trim()}"}}]}&aggregate={"count":["*"]}`
        fetchGet(`${DATAURLS.COMPLAINTS.url}?${queryParams}`, values, getAccessToken())
          .then((response) => {
            if (parseInt(response.data[0].count) > 0) {
              setLoading(false);
              setError(false);
              setAlreadyErrorMessage('Complain already exists. Please try some other title.');

            } else {
              setAlreadyErrorMessage('')
              fetchPost(`${DATAURLS.COMPLAINTS.url}`, values, getAccessToken())
                .then((response) => {
                  getNewData(parentGridApi, paramId);

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
      maxWidth='sm'
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
          <>
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
                  value={shortName}
                  onChange={(event) => setShortName(event.target.value)}
                  variant='outlined'
                  required
                  fullWidth
                  id='short_name'
                  label='Short name'
                  autoFocus
                />
              </FormControl>

            </div>
          </>
        )}
        {success && !error && <div>{editData.id ? 'Complain successfully updated.' : 'Complain creation successful'}</div>}
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
