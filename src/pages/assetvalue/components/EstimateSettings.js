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
import { fetchPut, fetchGet } from '../../../utils/utils';
import Editor from 'react-simple-wysiwyg';
import Grid from '@mui/material/Grid';
import { getAccessToken } from '@/utils/authority';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
  CloseCircleOutlined
} from '@ant-design/icons';

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
      width: '850px !important',
      height: '650px',
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
      width: '100%'
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
      height: '130px',
    },
    inputControl: { fontSize: '.7rem' },
  })
);

const AddNew = ({
  open,
  setOpen
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({});
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    let queryParams = '?limit=-1&sort=-id'
    fetchGet(`${DATAURLS.ESTIMATE_VALUES_SETTINGS.url}?${queryParams}`)
      .then((response) => {
        let result = response.data;
        setValues(result[0])
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  }

  const handleSubmit=()=>{
    fetchPut(`${DATAURLS.ESTIMATE_VALUES_SETTINGS.url}/1`, values, getAccessToken())
        .then((response) => {

          // setLoading(false);
          // setSuccess(true);
          setSnackBarOpen(true);
          setSnackBarType('success');
          setSnackBarMessage('Settings updated successfully');
        })
        .catch((err) => {
          setSnackBarOpen(true);
          setSnackBarType('error');
          setSnackBarMessage('Failed to update.');
          throw err;
        });
  }

  const handleChange = (name) => (event) => {
    let targetvalues = event.target.value ? event.target.value : '';
    setValues({ ...values, [name]: targetvalues });
  };

  return (
    <Dialog
      open={open}
      //   onClose={getNewData(p)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='xl'
      fullWidth="xl"
      className='dialogRoot'
      classes={{ paper: classes.dialogRoot }}
    >
      <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
        <div className={classes.dialogTitleText}>TechValuator Settings</div>
        <CloseCircleOutlined
            className={classes.actionIcon}
            onClick={() => {
              setOpen(false);
            }}
          />
      </DialogTitle>
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
      <DialogContent className={classes.dialogContent}>
        {!success && !error && (
          <>
            <div className={classes.inputGroup}>
              <Grid container spacing={2}>

                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      inputProps={{ className: classes.inputControl }}
                      value={values.agrade_text}
                      variant='outlined'
                      required
                      fullWidth
                      id='bgrade'
                      label='A - Grade'
                      autoFocus
                      onChange={handleChange('agrade_text')}
                      InputLabelProps={{
                        shrink: true,
                    }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      inputProps={{ className: classes.inputControl }}
                      value={values.bgrade_text}
                      variant='outlined'
                      onChange={handleChange('bgrade_text')}
                      required
                      fullWidth
                      id='bgrade'
                      label='B - Grade'
                      autoFocus
                      InputLabelProps={{
                        shrink: true,
                    }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      inputProps={{ className: classes.inputControl }}
                      value={values.cgrade_text}
                      variant='outlined'
                      required
                      fullWidth
                      id='cgrade'
                      label='C - Grade'
                      onChange={handleChange('cgrade_text')}
                      autoFocus
                      InputLabelProps={{
                        shrink: true,
                    }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>

                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      inputProps={{ className: classes.inputControl }}
                      value={values.euro_sek}
                      variant='outlined'
                      required
                      fullWidth
                      id='eurotosek'
                      label='EURO to SEK'
                      onChange={handleChange('euro_sek')}
                      autoFocus
                      InputLabelProps={{
                        shrink: true,
                    }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      inputProps={{ className: classes.inputControl }}
                      value={values.euro_nok}
                      onChange={handleChange('euro_nok')}

                      variant='outlined'
                      required
                      fullWidth
                      id='eurotonok'
                      label='EURO to NOK'
                      autoFocus
                      InputLabelProps={{
                        shrink: true,
                    }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={24}>
                  <FormControl className={classes.formControl}>
                    <Editor value={values.text} onChange={handleChange('text')} editorStyle={{ height: '400px' }}  />
                  </FormControl>
                </Grid>
              </Grid>
            </div>

          </>
        )}
       
      </DialogContent>
      <DialogActions>
        <div className={classes.buttonContainer}>
          <Button
            variant='contained'
            onClick={() => {
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
            className={classes.button}
          >
            Save
              {loading && (
              <CircularProgress
                size='1rem'
                className={classes.buttonProgress}
              />
            )}
          </Button>
        </div>I
      </DialogActions>
    </Dialog>
  );
};

export default AddNew;
