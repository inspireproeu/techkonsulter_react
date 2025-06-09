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

import React, { useState, useContext, useEffect } from 'react';

import { DATAURLS } from '../../../utils/constants';
import { fetchPost, fetchPut } from '../../../utils/utils';
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
  }),
);

const AddNew = ({
  open,
  setOpen,
  parentGridApi,
  getNewData,
  title,
  editData,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [partNo, setPartNo] = useState();
  const [action, setaction] = useState();
  const [model, setmodel] = useState();
  const [asset_type, setAsset_type] = useState();
  const [manufacturer, setmanufacturer] = useState();
  const [form_factor, setForm_factor] = useState();

  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [weight,setweight] = useState(null)
  const [co2,setco2] = useState(null)
  const [base_price,setbase_price] = useState(null)
  const [model_year,setmodel_year] = useState(null)
  
  useEffect(() => {
    setPartNo();
    setForm_factor(null)
    setmanufacturer(null);
    setmodel(null);
    setAsset_type(null);
    setaction(null);
    setweight(null)
    setco2(null)
    setbase_price(null)
    setmodel_year(null)
  }, [open]);

  useEffect(() => {
    if (editData) {
      setPartNo(editData?.part_no);
      setForm_factor(editData?.form_factor);
      setmanufacturer(editData?.manufacturer);
      setmodel(editData?.model);
      setAsset_type(editData?.asset_type);
      setaction(editData?.action);
      setweight(editData?.weight)
      setco2(editData?.co2)
      setbase_price(editData?.base_price)
      setmodel_year(editData?.model_year)
    }
  }, [editData]);

  useEffect(() => {
    if (!partNo) {
      setEnableSubmission(false);
      return;
    }
    if (partNo) {
      setEnableSubmission(true);
    }
  }, [partNo]);

  const handleSubmit = () => {
    setLoading(true);
    let values = {
      part_no: partNo,
      action: action,
      asset_type: asset_type,
      manufacturer: manufacturer,
      model: model,
      form_factor: form_factor,
      base_price: base_price,
      model_year: model_year,
      weight: weight,
      co2: co2,
    };
    if (editData && editData.id) {
      fetchPut(`${DATAURLS.PARTNUMBERS.url}/${editData.id}`, values, getAccessToken())
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
      fetchPost(`${DATAURLS.PARTNUMBERS.url}`, values, getAccessToken())
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
  };

  return (
    <Dialog
      open={open}
      //   onClose={getNewData(p)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      className="dialogRoot"
      classes={{ paper: classes.dialogRoot }}
    >
      <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
        <div className={classes.dialogTitleText}>{title}</div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!success && !error && (
          <div className={classes.inputGroup}>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={partNo}
                onChange={(event) => setPartNo(event.target.value)}
                variant="outlined"
                required
                fullWidth
                id="partNo"
                label="Part Number"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={asset_type}
                onChange={(event) => setAsset_type(event.target.value)}
                variant="outlined"
                required
                fullWidth
                id="assettype"
                label="Asset type"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={form_factor}
                onChange={(event) => setForm_factor(event.target.value)}
                variant="outlined"
                required
                fullWidth
                id="form_factor"
                label="formfactor"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={manufacturer}
                onChange={(event) => setmanufacturer(event.target.value)}
                variant="outlined"
                required
                fullWidth
                id="manufacturer"
                label="Manufacturer"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={model}
                onChange={(event) => setmodel(event.target.value)}
                variant="outlined"
                required
                fullWidth
                id="model"
                label="Model"
              />
            </FormControl>
    

            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={model_year}
                onChange={(event) => setmodel_year(event.target.value)}
                variant="outlined"
                fullWidth
                id="model_year"
                label="Model year"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={base_price}
                onChange={(event) => setbase_price(event.target.value)}
                variant="outlined"
                fullWidth
                id="base_price"
                label="Base price"
              />
            </FormControl>

            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={co2}
                onChange={(event) => setco2(event.target.value)}
                variant="outlined"
                fullWidth
                id="co2"
                label="CO2"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                inputProps={{ className: classes.inputControl }}
                value={weight}
                onChange={(event) => setweight(event.target.value)}
                variant="outlined"
                fullWidth
                id="weight"
                label="Weight"
              />
            </FormControl>
          </div>
        )}
        {success && !error && (
          <div>
            {editData.id ? 'Part number successfully updated.' : 'Part number creation successful'}
          </div>
        )}
        {!success && error && <div>{errorMessage}</div>}
      </DialogContent>
      <DialogActions>
        {success && (
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
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
              variant="contained"
              onClick={() => setOpen(false)}
              color="secondary"
              disabled={loading}
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSubmit()}
              color="primary"
              disabled={!editData.id && !enableSubmission}
              className={classes.button}
            >
              {`${editData.id ? 'Update' : 'Add'}`}
              {loading && <CircularProgress size="1rem" className={classes.buttonProgress} />}
            </Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddNew;
