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

import { Steps, Col, Progress, Icon, Spin } from 'antd';
import clsx from 'clsx';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import XLSX from 'xlsx';
// import AppContext from '../context/AppContext';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchPut, fetchPost, fetchGet } from '../../../utils/utils';
import React, { useState, useRef, useEffect, useContext } from 'react';
// import GridLoader from 'react-spinners/GridLoader';
// const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload
import { getAccessToken } from '@/utils/authority';

import {
  DATAURLS,
  FILE_UPLOAD_ROW_COUNT_ERROR,
  FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE,
  FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE,
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
  allAssets,
  setOpen,
  getNewData,
  parentGridApi,
}) => {
  // console.log('Allassets', allAssets, assetTypes, statusNames);
  const classes = useStyles();
  const fileUploader = useRef(null);
  // const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState('');
  const [data, setData] = useState([]);
  const [cols, setCols] = useState([]);
  const [updateRecordsCount, setUpdateRecordsCount] = useState(0);
  const [steps, setSteps] = useState([
    'Select a file',
    'Submit Records'
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [assetIDRows, setAssetIDRows] = useState([]);
  const [nonAssetIDRows, setNonAssetIDRows] = useState([]);
  const [certusMobileInsert, setCertusMobileInsert] = useState(false);

  useEffect(() => {
    handleReset();
  }, [open]);

  useEffect(() => {
    if (!success) {
      return;
    }
    // console.log("allAssets", allAssets)
    // let allAssetIDs = allAssets.map((asset) => asset.asset_id);
    // setAssetIDRows(
    //   data.filter((row) => allAssetIDs.indexOf('' + row.asset_id) !== -1)
    // );
    // setNonAssetIDRows(
    //   data.filter((row) => allAssetIDs.indexOf('' + row.asset_id) === -1)
    // );
  }, [success]);

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

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // const handleUpdate = async () => {
  //   setLoading(true);
  //   let summaryOffset = 0;

  //   try {
  //     let noofRequests = 20;
  //     let summaryLoopCount = parseInt(assetIDRows.length)
  //     // console.log("summaryLoopCount", summaryLoopCount)
  //     // console.log( "tempassetIDRows", tempassetIDRows)
  //     let tempassetIDRows = assetIDRows;
  //     let updateSuccess;
  //     for (let i = 0; i <= assetIDRows.length; i += 20) {
  //       let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
  //       updateSuccess = await fetchPut(
  //         DATAURLS.CERTUS_MOBILE_MULTIPLE.url,
  //         filterassetIDRows,
  //         getAccessToken()
  //       );
  //       updateSuccess = await fetchPut(
  //         `${DATAURLS.CERTUS_MOBILE.url}/${filterassetIDRows[i].asset_id}`,
  //         filterassetIDRows[i],
  //         getAccessToken()
  //       )
  //       summaryOffset += filterassetIDRows.length;
  //       setUpdateRecordsCount(summaryOffset);
  //     }
  //     // console.log("updateSuccess", updateSuccess)

  //     // let updateSuccess = await fetchPut(
  //     //   DATAURLS.ASSETS_MULTIPLE.url,
  //     //   assetIDRows,
  //     //   appContext.token
  //     // );
  //     setUpdateRecordsCount(0)
  //     if (updateSuccess.data.asset_id) {
  //       setCertusMobileInsert(true)
  //       let noofRequests1 = 20;

  //       let summaryOffset1 = 0;
  //       let tempassetIDRows1 = assetIDRows;
  //       let updateSuccess1;
  //       for (let i = 0; i <= assetIDRows.length; i += 20) {
  //         let filterassetIDRows1 = tempassetIDRows1.slice(i, noofRequests1 + i);
  //         updateSuccess1 = await fetchPut(
  //           `${DATAURLS.ASSETS.url}/${filterassetIDRows1[i].asset_id}`,
  //           filterassetIDRows[i],
  //           getAccessToken()
  //         )
  //         summaryOffset1 += filterassetIDRows1.length;
  //         setUpdateRecordsCount(summaryOffset1);
  //       }
  //       setLoading(false);
  //       if (updateSuccess1.data.asset_id) {
  //         setSuccess(true);
  //         summaryOffset1 = 0;
  //       }
  //     } else {
  //       summaryOffset = 0;
  //       setError(true);
  //       setLoading(false);
  //       setFileUploadErrorMessage("Successfully updated");
  //     }
  //   } catch (err) {
  //     console.log('update error', err);
  //     setLoading(false);
  //     setError(false);
  //     setFileUploadErrorMessage("Something went wrong. Please try again.");
  //     throw err;
  //   }
  // };

  // const handleInsert = async () => {
  //   setLoading(true);
  //   let dataWithoutAssetIds = nonAssetIDRows.map((asset) => {
  //     let tempObject = { ...asset };
  //     if (!tempObject.asset_id) {
  //       tempObject.asset_id = null;
  //     }
  //     Object.keys(tempObject).forEach((key) => {
  //       if (!tempObject[key]) {
  //         delete tempObject[key];
  //       }
  //     });

  //     return tempObject;
  //   });

  //   let summaryOffset = 0;

  //   try {
  //     let noofRequests = 50;
  //     let summaryLoopCount = parseInt(dataWithoutAssetIds.length)
  //     // console.log("summaryLoopCount", summaryLoopCount)
  //     // console.log( "tempassetIDRows", tempassetIDRows)
  //     let tempassetIDRows = dataWithoutAssetIds;
  //     let insertSuccess;
  //     for (let i = 0; i <= dataWithoutAssetIds.length; i += 50) {
  //       let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
  //       insertSuccess = await fetchPost(
  //         DATAURLS.CERTUS_MOBILE.url,
  //         filterassetIDRows,
  //         getAccessToken()
  //       );
  //       summaryOffset += filterassetIDRows.length;
  //       // setUpdateRecordsCount(summaryOffset);
  //     }

  //     // let insertSuccess = await fetchPost(
  //     //   DATAURLS.ASSETS_MULTIPLE.url,
  //     //   dataWithoutAssetIds,
  //     //   appContext.token
  //     // );
  //     // setLoading(false);
  //     // console.log("certusMobileInsert", certusMobileInsert)
  //     if (insertSuccess && insertSuccess?.data.length > 0) {
  //       let summaryOffset1 = 0;
  //       let noofRequests1 = 50;
  //       setCertusMobileInsert(true)
  //       let tempassetIDRows1 = dataWithoutAssetIds;
  //       let insertAssetSuccess;
  //       for (let i = 0; i <= dataWithoutAssetIds.length; i += 50) {
  //         let filterassetIDRows1 = tempassetIDRows1.slice(i, noofRequests1 + i);
  //         insertAssetSuccess = await fetchPost(
  //           DATAURLS.CERTUS_MOBILE.url,
  //           filterassetIDRows1,
  //           getAccessToken()
  //         );
  //         summaryOffset1 += filterassetIDRows1.length;
  //         // setUpdateRecordsCount(summaryOffset);
  //       }
  //       setLoading(false);
  //       if (insertAssetSuccess.ok) {
  //         setCertusMobileInsert(false)
  //         setSuccess(true);
  //         summaryOffset1 = 0;
  //       }
  //     } else {
  //       setError(true);
  //       setLoading(false);
  //       setFileUploadErrorMessage("Certus mobile data inserted");
  //     }
  //   } catch (err) {
  //     setLoading(false);
  //     setError(false);
  //     setFileUploadErrorMessage("Something went wrong. Please try again.");
  //     throw err;
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);


    let summaryOffset = 0;

    try {
      let noofRequests = 50;
      // console.log("summaryLoopCount", summaryLoopCount)
      // console.log( "tempassetIDRows", tempassetIDRows)
      let tempassetIDRows = data;
      let insertSuccess;
      for (let i = 0; i <= data.length; i += 50) {
        let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
        insertSuccess = await fetchPost(
          DATAURLS.CERTUSMOBILENEW.url,
          filterassetIDRows,
          getAccessToken()
        );
        summaryOffset += filterassetIDRows.length;
        setUpdateRecordsCount(summaryOffset);
      }

      // let insertSuccess = await fetchPost(
      //   DATAURLS.ASSETS_MULTIPLE.url,
      //   dataWithoutAssetIds,
      //   appContext.token
      // );
      // setLoading(false);
      if (insertSuccess && insertSuccess?.data.length > 0) {
        setCertusMobileInsert(false)
        setSuccess(true);
        setLoading(false)
        setCurrentStep(2)
      } else {
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage("Certus mobile data Failed");
      }
    } catch (err) {
      setLoading(false);
      setError(false);
      setFileUploadErrorMessage("Something went wrong. Please try again.");
      throw err;
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];

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
        const data = XLSX.utils.sheet_to_json(ws, { defval: null });
        /* Update state */
        setData(data);
        setCols(make_cols(ws['!ref']));
        // console.log('resetting load');

        setLoading(false);
        // console.log('columns', data);

        // checking all file upload errors here
        if (data.length === 0 || !data) {
          // console.log('columns empty file', data);
          setSuccess(true);
          setFileUploadError(true);
          setFileUploadErrorMessage(FILE_UPLOAD_EMPTY_FILE_MESSAGE);
          return;
        }

        if (Object.keys(data[0]).indexOf('asset_id') === -1) {
          setSuccess(true);
          setFileUploadError(true);
          setFileUploadErrorMessage(FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE);
          return;
        }

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
                  <Icon
                    icon={CheckCircleFilled}
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
                    <Icon
                      icon={ExclamationCircleOutlined}
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
            {loading && updateRecordsCount > 0 && <div className={classes.recordsCount}>{updateRecordsCount} of {data.length} records completed.</div>}
            {loading && <Spin color='#004750' size={50} />}
            {/* {loading && <Progress type="circle" style={{ paddingTop: '30px', margin: '0 auto' }} strokeColor={{ '0%': '#f80059', '100%': '#87d068', }} percent={Math.round((updateRecordsCount * 100) / assetIDRows.length)} />} */}
            {!loading && success && (
              <div>
                <div className={classes.stepsText}>Successfully processed</div>
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
            {loading && <Spin color='#004750' size={30} />}
            {!loading && success && (
              <div>
                <div className={classes.stepsText}>Certus mobile Successfully processed</div>
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
            onClick={() => setOpen(false)}
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

            {currentStep === 1 && !success && data.length > 0 && (
              <Button
                variant='contained'
                onClick={() => handleSubmit()}
                color='primary'
                disabled={loading}
                className={classes.button}
              >
                {'Submit'}
                {loading && (
                  <Spin
                    size='1rem'
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            )}
            {currentStep === 2 &&
              (data.length === 0 ||
                (data.length > 0 && success)) && (
                <Button
                  variant='contained'
                  onClick={() => {
                    getNewData(parentGridApi);
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
