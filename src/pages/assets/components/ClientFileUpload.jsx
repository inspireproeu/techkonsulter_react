// import {
//   faTimes,
//   faFileUpload,
//   faCheckCircle,
//   faExclamationCircle,
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FileAddOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import _ from "underscore"

import { Steps, Col, Progress, Icon, Spin } from 'antd';
import clsx from 'clsx';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import XLSX from 'xlsx';
// import AppContext from '../context/AppContext';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchPut, fetchPost, fetchGet, ExcelDateToJSDate } from '../../../utils/utils';
import React, { useState, useRef, useEffect, useContext } from 'react';
// import GridLoader from 'react-spinners/GridLoader';
// const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload
import { getAccessToken } from '@/utils/authority';

import {
  DATAURLS,
  FILE_UPLOAD_EMPTY_FILE_MESSAGE,
} from '../../../utils/constants';

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogRoot: {
      width: '600px',
      height: '450px',
      display: 'flex',
      flexDirection: 'column',
    },
    dialogTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40px',
      background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
      boxShadow: '1px 1px 3px #8e9eab',
    },
    dialogTitleText: {
      display: 'flex',
      justifyContent: 'space-between',
      // fontFamily: "'Poppins'",
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: '0.85rem',
    },
    dialogContent: {
      //   marginTop: '10px',
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
    actionIcon: {
      fontSize: '1.25rem',
      cursor: 'pointer',
    },
    stepContent: {
      width: '100%',
    },
    steps: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      //   paddingLeft: '20px',
    },
    stepsText: {
      marginTop: '15px',
      // fontFamily: 'Poppins',
      fontSize: '20px',
    },
    stepsTextError: {
      marginTop: '15px',
      // fontFamily: 'Poppins',
      fontSize: '20px',
      color: 'red',
      textAlign: 'center',
    },
    stepsSubText: {
      marginTop: '5px',
      // fontFamily: 'Poppins',
      fontSize: '12px',
    },
    uploadArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#ababab',
      '&:hover': {
        color: '#004750',
        cursor: 'pointer',
      },
    },
    uploadIcon: {
      fontSize: '80px',
      // color: '#cdcdcd',
      // '&:hover': {
      //   color: '#004750',
      //   cursor: 'pointer',
      // },
    },
    successIcon: {
      color: '#004750',
      marginBottom: '15px',
    },
    errorIcon: {
      color: '#eb8034',
      marginBottom: '15px',
    },
    successArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    spinnerArea: {
      marginBottom: '10px',
    },
    animatedItem: {
      animation: `$myEffect 300ms ${theme.transitions.easing.easeInOut}`,
    },
    '@keyframes myEffect': {
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    },
    recordsCount: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      fontSize: '14px',
      marginBottom: '10px'
    }
  })
);

const FileUploadDialog = ({
  open,
  title,
  setOpen,
  assetTypes,
  palletNumbers,
  statusNames,
  getNewData,
  parentGridApi,
  currentUser,
  projectId
}) => {
  // console.log('Allassets', allAssets, assetTypes, statusNames);
  const classes = useStyles();
  const fileUploader = useRef(null);
  // const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [allAssets, setAllAssets] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState('');
  const [data, setData] = useState([]);
  const [cols, setCols] = useState([]);
  const [updateRecordsCount, setUpdateRecordsCount] = useState(0);
  const [insertRecordsCount, setInsertRecordsCount] = useState(0);
  const [steps, setSteps] = useState([
    'Select a file',
    'Update Records',
    'Insert Records',
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [assetIDRows, setAssetIDRows] = useState([]);
  const [nonAssetIDRows, setNonAssetIDRows] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [importId, setImportId] = useState('')
  const [importFiles, setImportFiles] = useState([])

  useEffect(() => {
    if (currentUser && currentUser?.role?.name === 'client_admin' || currentUser?.role?.name === 'client_cio' || currentUser?.role?.name === 'client_sales') {
      let client = currentUser.client ? currentUser.client.id : null;
      setClientId(client)
    }
    if (currentUser && currentUser?.role?.name === 'partner_admin' || currentUser?.role?.name === 'partner_sales') {
      let client = currentUser.partner ? currentUser.partner.id : null;
      setPartnerId(client)
    }
    handleReset();
    lists()
    if (open) {
      setImportId(Math.floor(Math.random() * 90000) + 10000)
    }
  }, [open]);

  useEffect(() => {
    if (!success) {
      return;
    }
    let allAssetIDs = allAssets.map((asset) => asset.id);
    setAssetIDRows(
      data.filter((row) => allAssetIDs.indexOf('' + row.id) !== -1)
    );
    setNonAssetIDRows(
      data.filter((row) => allAssetIDs.indexOf('' + row.id) === -1)
    );

  }, [success, allAssets]);

  const lists = async () => {
    let fields = `?limit=-1&sort=-id&fields[]=id`
    fetchGet(`${DATAURLS.CLIENTASSETS.url}${fields}`, getAccessToken())
      .then((response) => {
        setAllAssets(response.data);
      })
      .catch((err) => {
        throw err;
      });

  }

  const handleReset = () => {
    setLoading(false);
    setSuccess(false);
    setError(false);
    setData([]);
    setCols([]);
    setCurrentStep(0);
    setAssetIDRows([]);
    setNonAssetIDRows([]);
    setFileUploadSuccess(false);
    setFileUploadErrorMessage('');
    setFileUploadError(false);
    if (fileUploader.current) {
      fileUploader.current.value = null;
    }
  };

  const handleNext = () => {
    setSuccess(false);
    setError(false);
    setCurrentStep((prev) => prev + 1);
  };

  // console.log(objToString(data1).slice(0, -1));
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleUpdate = async () => {
    setLoading(true);
    let summaryOffset = 0;

    try {
      let updateSuccess = '';
      try {
        // for (let j = 0; j <= assetIDRows.length; j += 20) {
        // let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
        let filterassetIDRows = assetIDRows;
        // console.log("filterassetIDRows", filterassetIDRows)
        for (let i = 0; i <= filterassetIDRows.length; i++) {
          if (assetIDRows.length > 0 && filterassetIDRows[i] && filterassetIDRows[i].id) {
            // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
            if (updateRecordsCount === filterassetIDRows.length) {
              break
            }
            // if (clientId) {
            //   filterassetIDRows[i].client = clientId;
            // }
            // if (partnerId) {
            //   filterassetIDRows[i].partner = partnerId;
            // }
            updateSuccess = await fetchPut(
              `${DATAURLS.CLIENTASSETS.url}/${filterassetIDRows[i].id}`,
              filterassetIDRows[i],
              getAccessToken()
            )
            setUpdateRecordsCount(i + 1);

          }
        }

        // console.log("updated success", updateSuccess)
        if (updateSuccess?.data?.id) {
          // console.log("updateSuccess", updateSuccess)
          await uploadFile();

          summaryOffset += filterassetIDRows.length;
          setUpdateRecordsCount(summaryOffset);
        }
        // }
      } catch (err) {
        console.log('update error', err);
        await uploadFile();

        // setLoading(false);
        // setError(false);
        // setFileUploadErrorMessage(err.message);
        throw err;
      }
      setLoading(false);
      setUpdateRecordsCount(0)
      if (updateSuccess?.data?.id) {
        setSuccess(true);
      } else {
        summaryOffset = 0;
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage("Failed to update. Try after something");
      }
    } catch (err) {
      console.log('update error', err);
      setLoading(false);
      setError(false);
      setFileUploadErrorMessage(err.message);
      throw err;
    }
  };

  const handleInsert = async () => {
    setLoading(true);
    try {
      let tempassetIDRows = nonAssetIDRows;
      let insertSuccess = "";
      let noofRequests = 50;
      let summaryOffset = 0;

      for (let i = 0; i <= tempassetIDRows.length; i += 50) {
        if (tempassetIDRows.length > 0 && tempassetIDRows[i] && tempassetIDRows[i].project_id) {
          // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
          if (insertRecordsCount === tempassetIDRows.length) {
            break
          }
          let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);

          // if (clientId) {
          //   filterassetIDRows[i].client = clientId;
          // }
          // if (partnerId) {
          //   filterassetIDRows[i].partner = partnerId;
          // }
          // insertSuccess = await directUSAPICall().items('Asset').createMany(filterassetIDRows);
          insertSuccess = await fetchPost(
            DATAURLS.CLIENTASSETS.url,
            filterassetIDRows,
            getAccessToken()
          )
          summaryOffset += filterassetIDRows.length;
          setUpdateRecordsCount(summaryOffset);

          // let insertSuccess;
          // for (let i = 0; i <= dataWithoutAssetIds.length; i += 50) {
          //   let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
          //   insertSuccess = await directUSAPICall().items('Asset').createMany(filterassetIDRows);


          //   summaryOffset += filterassetIDRows.length;
          //   setUpdateRecordsCount(summaryOffset);
          // }
          setInsertRecordsCount(i + 1);

        }
      }
      setLoading(false);
      if (insertSuccess && insertSuccess?.data.length > 0) {
        await uploadFile();

        setSuccess(true);
        setNonAssetIDRows([])
        setTimeout(() => {
          getNewData(projectId);
          setOpen(false);
        }, 600);

      } else {
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage("Failed to insert");
      }
    } catch (err) {
      await uploadFile();

      setLoading(false);
      setError(false);
      setFileUploadErrorMessage("Something went wrong");
      throw err;
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('title', `${importId}-Client - Assets - ${importFiles[0].name}`);
    formData.append('file', importFiles[0]);
    await fetchPost(
      `${DATAURLS.FILE.url}`,
      formData
    )
  }

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setUpdateRecordsCount(0)
    setInsertRecordsCount(0)
    setImportFiles(files)

    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    setLoading(true);
    try {
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        // const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
        const wb = XLSX.read(bstr, { type: 'binary' });
        // const wb = XLSX.readFile(file.path);
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        let data = XLSX.utils.sheet_to_json(ws, { defval: null, blankRows: false });
        /* Update state */

        data.forEach((item) => {
          item.project_id = projectId;
          if (clientId) {
            item.client = clientId;
          }
          if (partnerId) {
            item.partner = partnerId;
          }
        })
        data = _.map(data, function (user) {
          return _.omit(user, function (value, key) {
            // console.log("*********", key)
            return key.charAt(0) == "_";
          });
        });
        setData(data);
        setCols(make_cols(ws['!ref']));
        // console.log('resetting load');

        setLoading(false);
        // console.log('columns', data);

        // checking all file upload errors here
        if (data.length === 0 || !data) {
          setSuccess(true);
          setFileUploadError(true);
          setFileUploadErrorMessage(FILE_UPLOAD_EMPTY_FILE_MESSAGE);
          return;
        }

        // if (Object.keys(data[0]).indexOf('id') === -1) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(FILE_UPLOAD_id_MISSING_MESSAGE);
        //   return;
        // }

        setFileUploadSuccess(true);
        setSuccess(true);
        // this.setState({ data: data, cols: make_cols(ws['!ref']) });
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(true);
      throw err;
    }

    // fileUploader.current.value = '';
  };

  const make_cols = (refstr) => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i)
      o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
  };

  // console.log(data, "************", assetIDRows)
  const stepContent = (stepNumber) => {
    switch (stepNumber) {
      case 0: {
        return (
          <div className={classes.steps}>
            <input
              type='file'
              ref={fileUploader}
              style={{ display: 'none' }}
              accept={'.csv, .xls, .xlsx'}
              onChange={(e) => handleFileUpload(e)}
            />
            {!loading && !success && (
              <div
                onClick={(e) => fileUploader.current.click()}
                className={classes.uploadArea}
              >
                <FileAddOutlined
                  className={classes.uploadIcon}
                />
                <div className={classes.stepsText}>Select a file</div>
                <div className={classes.stepsSubText}>
                  (.csv, .xls, .xlsx. Also, limit to 1000 rows)
                </div>
              </div>
            )}
            {loading && (
              <LoadingOutlined
                spin
                className={clsx(classes.uploadArea, classes.uploadIcon)}
              />
            )}
            {!loading && success && (
              <div className={classes.successArea}>
                {!fileUploadError && (
                  <CheckCircleFilled
                    // icon={CheckCircleFilled}
                    className={clsx(
                      classes.uploadArea,
                      classes.uploadIcon,
                      classes.successIcon,
                      classes.animatedItem
                    )}
                  />
                )}
                {fileUploadError && (
                  <div className={classes.uploadArea}>
                    <ExclamationCircleOutlined
                      // icon={ExclamationCircleOutlined}
                      className={clsx(
                        classes.uploadIcon,
                        classes.errorIcon,
                        classes.animatedItem
                      )}
                    />
                    <div
                      className={classes.uploadArea}
                      onClick={(e) => {
                        fileUploader.current.click();
                        setTimeout(() => {
                          handleReset();
                        }, 500);
                      }}
                    >
                      Click here to try again
                    </div>
                  </div>
                )}
                {!fileUploadError && (
                  <div className={classes.stepsText}>
                    {data.length} rows found. Let's start reviewing
                  </div>
                )}
                {fileUploadError && (
                  <div className={classes.stepsTextError}>
                    {fileUploadErrorMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
      case 1: {
        return (
          <div className={classes.successArea}>
            {!loading && !success && (
              <div>
                <div className={classes.stepsText}>
                  {assetIDRows.length} records with a matching Asset ID
                </div>
              </div>
            )}
            {loading && updateRecordsCount > 0 && <div className={classes.recordsCount}>{updateRecordsCount} of {assetIDRows.length} records completed.</div>}
            {loading && <Spin color='#004750' size={50} />}
            {loading && <Progress type="circle" style={{ paddingTop: '30px', margin: '0 auto' }} strokeColor={{ '0%': '#f80059', '100%': '#87d068', }} percent={Math.round((updateRecordsCount * 100) / assetIDRows.length)} />}
            {!loading && success && (
              <div>
                <div className={classes.stepsText}>Update Successful</div>
              </div>
            )}
            {!loading && error && (
              <div>
                <div className={classes.stepsTextError}>
                  {fileUploadErrorMessage}
                </div>
              </div>
            )}
          </div>
        );
      }
      case 2: {
        return (
          <div className={classes.successArea}>
            {!loading && !success && (
              <div>
                <div className={classes.stepsText}>
                  {nonAssetIDRows.length} new records found
                </div>
              </div>
            )}
            {loading && insertRecordsCount > 0 && <div className={classes.recordsCount}>{insertRecordsCount} of {nonAssetIDRows.length} records completed.</div>}
            {loading && <Spin color='#004750' size={50} />}
            {loading && <Progress type="circle" style={{ paddingTop: '30px', margin: '0 auto' }} strokeColor={{ '0%': '#f80059', '100%': '#87d068', }} percent={Math.round((insertRecordsCount * 100) / nonAssetIDRows.length)} />}

            {!loading && success && (
              <div>
                <div className={classes.stepsText}>Insertion Successful</div>
              </div>
            )}
            {!loading && error && (
              <div>
                <div className={classes.stepsTextError}>
                  {fileUploadErrorMessage}
                </div>
              </div>
            )}
          </div>
        );
      }
      default: {
        <div>Successful</div>;
      }
    }
  };
  // console.log("assetIDRows", assetIDRows)
  return (
    <Dialog
      open={open}
      //   onClose={getNewData(p)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
    //   className={classes.dialogRoot}
    >
      <div className={classes.dialogRoot}>
        <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
          <div className={classes.dialogTitleText}>
            <div>{title}</div>
          </div>
          <CloseCircleOutlined
            className={classes.actionIcon}
            onClick={() => {
              handleReset();
              setOpen(false);
            }}
          />
        </DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <DialogContentText id='alert-dialog-description'>
            <Stepper
              activeStep={currentStep}
              alternativeLabel
            // style={{ width: '700px', height: '400px' }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </DialogContentText>
          <div className={classes.stepContent}>{stepContent(currentStep)}</div>
        </DialogContent>
        <DialogActions>
          <div className={classes.buttonContainer}>
            <Button
              variant='contained'
              onClick={() => handlePrevious()}
              color='secondary'
              disabled={currentStep === 0}
              className={classes.button}
            >
              Back
            </Button>

            {currentStep !== 2 && (
              <Button
                variant='contained'
                onClick={() => handleNext()}
                color='primary'
                disabled={
                  !assetIDRows.length === 0 ||
                  !fileUploadSuccess ||
                  (assetIDRows.length > 0 &&
                    (loading || fileUploadError || !success))
                }
                className={classes.button}
              >
                Next
                {/* {loading && (
                <CircularProgress
                  size='1rem'
                  className={classes.buttonProgress}
                /> 
              )}*/}
              </Button>
            )}

            {currentStep === 1 && !success && assetIDRows.length > 0 && (
              <Button
                variant='contained'
                onClick={() => handleUpdate()}
                color='primary'
                disabled={loading}
                className={classes.button}
              >
                {updateRecordsCount?.length > 0 ? 'Continue' : 'Update'}
                {loading && (
                  <Spin
                    size='1rem'
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            )}
            {currentStep === 2 && !success && nonAssetIDRows.length > 0 && (
              <Button
                variant='contained'
                onClick={() => handleInsert()}
                color='primary'
                disabled={loading}
                className={classes.button}
              >
                Insert
                {loading && (
                  <Spin
                    size='1rem'
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            )}
            {currentStep === 2 &&
              (nonAssetIDRows.length === 0 ||
                (nonAssetIDRows.length > 0 && success)) && (
                <Button
                  variant='contained'
                  onClick={() => {
                    getNewData(projectId);
                    setOpen(false);
                  }}
                  color='primary'
                  disabled={loading}
                  className={classes.button}
                >
                  Finish
                  {loading && (
                    <Spin
                      size='1rem'
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              )}
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default FileUploadDialog;
