import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { getAccessToken } from '@/utils/authority';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import * as moment from 'moment';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import React, { useState, useContext, useEffect } from 'react';

import { DATAURLS } from '../../../utils/constants';
import { fetchPost } from '../../../utils/utils';

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
  columnDefs,
  title,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();
  const [process, setProcess] = useState();
  const [instructions, setInstructions] = useState();
  // const [emailError, setEmailError] = useState(false);
  // const [invalidEmail, setInvalidEmail] = useState(false);
  // const [userRole, setUserRole] = useState();

  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gridApi, setGridApi] = useState(null);


  useEffect(() => {
    setInfo();
    setProcess();
    setInstructions();
    // setUserRole();
    setSuccess(false);
    setError(false);
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (
      info &&
      process &&
      instructions
    ) {
      setEnableSubmission(true);
    }
  }, [info, process, instructions]);

  const handleSubmit = () => {
    setLoading(true);
    fetchPost(DATAURLS.INSTRUCTIONS.url, {
      data: {
        info: info,
        process: process,
        instructions: instructions,
        date: moment().format('YYYY-MM-DD')
      },
      matchBy: 'id'
    }, getAccessToken())
      .then((response) => {
        if (response.ok) {
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
      <DialogContent className={classes.dialogContent}>
        {!success && !error && (
          <div className={classes.inputGroup}>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={info}
                onChange={(event) => setInfo(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='info'
                label='Model/Partner/Model'
                autoFocus
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                //   autoComplete='fname'
                value={process}
                onChange={(event) => setProcess(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='process'
                label='Process'
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                variant='outlined'
                required
                fullWidth
                id='instructions'
                label='Instruction'
                password
              />
            </FormControl>
          </div>
        )}
        {success && !error && <div>Instruction creation successful</div>}
        {!success && error && <div>{errorMessage}</div>}
      </DialogContent>
      <DialogActions>
        {success && (
          <div className={classes.buttonContainer}>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={() => {
                getNewData(parentGridApi);
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
              onClick={() => setOpen(false)}
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
              disabled={!enableSubmission}
              className={classes.button}
            >
              Add
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
