import React, { useState, useRef, useEffect, useContext } from 'react';
import { Steps, Col, Modal, Progress, Button, Icon, Spin } from 'antd';
import styles from './style.less';
import moment from 'moment';
import { useMobile, useMobileSmall } from '@/utils/utils';
import {
  FileAddOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { fetchPost, fetchPut } from '@/utils/utils';
import * as XLSX from "xlsx";
import { CustomButton } from '@/uikit/Button';
import proxy from '../../../../config/proxy';
let endpoint = proxy.dev['/api/'].target + '/api/assets/multiple';

const { Step } = Steps;
const FILE_UPLOAD_ROW_COUNT_ERROR = 1000;
const FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE =
  'Invalid file. Exceeds 1000 rows';
const FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE =
  'Invalid file. Column asset_id (Asset Number) is missing';
const FILE_UPLOAD_EMPTY_FILE_MESSAGE =
  'Invalid file. No records available';

export const FileUpload = (props) => {
  // const appContext = useContext(AppContext);
  const fileUploader = useRef(null);
  const {
    dispatch,
    assetTypes,
    palletNumbers,
    getNewData,
    parentGridApi,
    setOpen,
    open,
    statusNames, showModalDialog, handleCancel, allAssets } = props;

  const [loading, setLoading] = useState(false);
  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState('');
  const [data, setData] = useState([]);
  const [cols, setCols] = useState([]);
  const [steps, setSteps] = useState([
    'Select a file',
    'Update Records',
    'Insert Records',
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [assetIDRows, setAssetIDRows] = useState([]);
  const [nonAssetIDRows, setNonAssetIDRows] = useState([]);
  const [updateRecordsCount, setUpdateRecordsCount] = useState(0);

  const isMobile = useMobile();
  useEffect(() => {
    if (!success) {
      return;
    }
    let allAssetIDs = allAssets.map((asset) => asset.asset_id);
    // console.log('allasset ids , data', allAssetIDs, data);
    setAssetIDRows(
      data.filter((row) => allAssetIDs.indexOf('' + row.asset_id) !== -1)
    );
    setNonAssetIDRows(
      data.filter((row) => allAssetIDs.indexOf('' + row.asset_id) === -1)
    );
  }, [success]);

  // const handeleInsert = async () => {
  //   console.log("dataWithoutAssetIds", data)
  //   dispatch({
  //     type: 'assetForm/submitAssetForm',
  //     payload: {
  //       data: { ...data },
  //     },
  //   });
  // }
  const onToggleViewDialog = async () => {
    handleCancel(false);
  };
  // console.log("palletNumbers", palletNumbers)
  // const propss = {
  //   // name: 'file',
  //   // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  //   // headers: {
  //   //   authorization: 'authorization-text',
  //   // },
  //   onChange(info) {
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

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
        console.log('resetting load');

        setLoading(false);
        console.log('columns', data);

        // checking all file upload errors here

        if (data.length === 0 || !data) {
          console.log('columns empty file', data);
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

        // if (data.length > FILE_UPLOAD_ROW_COUNT_ERROR) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE);
        //   return;
        // }
        // // Checking for new asset types in uploaded file
        // let newAssetType = data.find(
        //   (asset) => assetTypes.indexOf(asset.asset_type) === -1
        // );
        // console.log("newAssetType", newAssetType)
        // if (newAssetType) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(
        //     `Invalid asset type - '${newAssetType.asset_type}' found in one or more rows`
        //   );
        //   return;
        // }

        // Checking for new status values in uploaded file
        let newStatus = data.find(
          (asset) => asset.status && statusNames.indexOf(asset.status) === -1
        );
        if (newStatus) {
          setSuccess(true);
          setFileUploadError(true);
          setFileUploadErrorMessage(
            `Invalid status - '${newStatus.status}' found in one or more rows`
          );
          return;
        }

        // Checking for new pallet number in uploaded file
        let newPalletNumber = data.find(
          (asset) =>
            asset.pallet_number &&
            palletNumbers.indexOf(asset.pallet_number) === -1
        );

        console.log('pallet numbers', data, palletNumbers, newPalletNumber);
        if (newPalletNumber) {
          setSuccess(true);
          setFileUploadError(true);
          setFileUploadErrorMessage(
            `Invalid pallet number - '${newPalletNumber.pallet_number}' found in one or more rows`
          );
          return;
        }

        // Checking for empty quanity in uploaded file
        // let emptyQuantity = data.find((asset) => !asset.quantity);
        // if (emptyQuantity) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(
        //     `Invalid quantity - one or more rows with no quantity values`
        //   );
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


  const handleInsert = async () => {
    setLoading(true);
    let dataWithoutAssetIds = nonAssetIDRows.map((asset) => {
      let tempObject = { ...asset };
      if (!tempObject.asset_id) {
        tempObject.asset_id = null;
      }
      Object.keys(tempObject).forEach((key) => {
        if (!tempObject[key]) {
          delete tempObject[key];
        }
      });

      return tempObject;
    });

    let summaryOffset = 0;

    try {
      let noofRequests = 100;
      let summaryLoopCount = parseInt(dataWithoutAssetIds.length)
      // console.log("summaryLoopCount", summaryLoopCount)
      // console.log( "tempassetIDRows", tempassetIDRows)
      let tempassetIDRows = dataWithoutAssetIds;
      let insertSuccess;
      for (let i = 0; i <= dataWithoutAssetIds.length; i += 100) {
        let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
        insertSuccess = await fetchPost(
          endpoint,
          filterassetIDRows
        );
        summaryOffset += filterassetIDRows.length;
        // setUpdateRecordsCount(summaryOffset);
      }
      // let insertSuccess = await fetchPost(
      //   DATAURLS.ASSETS_MULTIPLE.url,
      //   dataWithoutAssetIds,
      //   appContext.token
      // );
      setLoading(false);
      if (insertSuccess.ok) {
        setSuccess(true);
      } else {
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage(insertSuccess.message.split('-')[1]);
      }
    } catch (err) {
      setLoading(false);
      setError(false);
      setFileUploadErrorMessage(err.message);
      throw err;
    }
  };


  const handleUpdate = async () => {
    setLoading(true);
    let summaryOffset = 0;
    try {
      let noofRequests = 100;
      let summaryLoopCount = parseInt(assetIDRows.length)
      // console.log("summaryLoopCount", summaryLoopCount)
      // console.log( "tempassetIDRows", tempassetIDRows)
      let tempassetIDRows = assetIDRows;
      let updateSuccess;
      for (let i = 0; i <= assetIDRows.length; i += 100) {
        let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
        updateSuccess = await fetchPut(
          endpoint,
          filterassetIDRows
        );
        // console.log("updateSuccess", updateSuccess)

        summaryOffset += filterassetIDRows.length;
        setUpdateRecordsCount(summaryOffset);
      }

      // let updateSuccess = await fetchPut(
      //   DATAURLS.ASSETS_MULTIPLE.url,
      //   assetIDRows,
      //   appContext.token
      // );
      setLoading(false);
      setUpdateRecordsCount(0)
      if (updateSuccess.ok) {
        setSuccess(true);
      } else {
        summaryOffset = 0;
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage(updateSuccess.message.split('-')[1]);
      }
    } catch (err) {
      console.log('update error', err);
      setLoading(false);
      setError(false);
      setFileUploadErrorMessage(err.message);
      throw err;
    }
  };

  const stepContent = (stepNumber) => {
    switch (stepNumber) {
      case 0: {
        return (
          <div className={styles.steps}>
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
                className={styles.uploadArea}
              >
                <FileAddOutlined className={styles.uploadIcon} />
                <div className={styles.stepsText}>Select a file</div>
                <div className={styles.stepsSubText}>
                  (.csv, .xls, .xlsx. Also, limit)
                </div>
              </div>
            )}
            {loading && (
              // <FontAwesomeIcon
              //   icon={faSpinner}
              //   spin
              //   className={clsx(styles.uploadArea, styles.uploadIcon)}
              // />
              <LoadingOutlined className={[styles.uploadArea, styles.uploadIcon].join(' ')} />
            )}
            {!loading && success && (
              <div className={styles.successArea}>
                {/* {!fileUploadError && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className={clsx(
                      styles.uploadArea,
                      styles.uploadIcon,
                      styles.successIcon,
                      styles.animatedItem
                    )}
                  />
                )} */}
                {!fileUploadError && (
                  <CheckCircleFilled className={[styles.uploadArea, styles.uploadIcon, styles.successIcon, styles.animatedItem].join(' ')} />
                )}
                {fileUploadError && (
                  <div className={styles.uploadArea}>
                    {/* <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className={clsx(
                        styles.uploadIcon,
                        styles.errorIcon,
                        styles.animatedItem
                      )}
                    /> */}
                    <ExclamationCircleOutlined className={[styles.errorIcon, styles.uploadIcon, styles.animatedItem].join(' ')} />

                    <div
                      className={styles.uploadArea}
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
                  <div className={styles.stepsText}>
                    {data.length} rows found. Let's start reviewing
                  </div>
                )}
                {fileUploadError && (
                  <div className={styles.stepsTextError}>
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
          <div className={styles.successArea}>
            {!loading && !success && (
              <div>
                <div className={styles.stepsText}>
                  {assetIDRows.length} records with a matching Asset ID
                </div>
              </div>
            )}

            {/* {loading && updateRecordsCount > 0 && <div className={styles.recordsCount}>{updateRecordsCount} of {assetIDRows.length} records completed.</div>} */}
            {/* {loading && <PacmanLoader color='#004750' size={50} />} */}
            {loading && <Spin color='#004750' size={50} />}
            {loading && <Progress type="circle" style={{ paddingTop: '30px', margin: '0 auto' }} strokeColor={{ '0%': '#f80059', '100%': '#87d068', }} percent={Math.round((updateRecordsCount * 100) / assetIDRows.length)} />}

            {!loading && success && (
              <div>
                <div className={styles.stepsText}>Update Successful</div>
              </div>
            )}
            {!loading && error && (
              <div>
                <div className={styles.stepsTextError}>
                  {fileUploadErrorMessage}
                </div>
              </div>
            )}
          </div>
        );
      }
      case 2: {
        return (
          <div className={styles.successArea}>
            {!loading && !success && (
              <div>
                <div className={styles.stepsText}>
                  {nonAssetIDRows.length} new records found
                </div>
              </div>
            )}
            {loading && <Spin color='#004750' size={30} />}
            {!loading && success && (
              <div>
                <div className={styles.stepsText}>Insertion Successful</div>
              </div>
            )}
            {!loading && error && (
              <div>
                <div className={styles.stepsTextError}>
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

  return (
    <Modal
      animation="zoom"
      maskAnimation="fade"
      width={640}
      forceRender
      visible={open}
      title="FILE UPLOAD"
      size={'large'}
      footer={<div className={styles.footer}>
        <div className={styles.buttonContainer}>
          <Button
            onClick={() => handlePrevious()}
            disabled={currentStep === 0}
            className={[styles.button, styles.backbtn].join(' ')}
          >
            Back
          </Button>
          {/* <CustomButton
            buttontype="type5"
            //icon={isMobileSmall ? <ArrowLeftOutlined /> : false}
            htmlType="button"
            onClick={() => handlePrevious()}
            size="large"
            disabled={currentStep === 0}
            // className={styles.button}
          >
            Back
          </CustomButton> */}
          {currentStep !== 2 && (
            <Button
              variant='contained'
              onClick={() => handleNext()}
              type='primary'
              disabled={
                !assetIDRows.length === 0 ||
                !fileUploadSuccess ||
                (assetIDRows.length > 0 &&
                  (loading || fileUploadError || !success))
              }
              className={styles.button}
            >
              Next
              {/* {loading && (
              <CircularProgress
                size='1rem'
                className={styles.buttonProgress}
              /> 
            )}*/}
            </Button>
          )}

          {currentStep === 1 && !success && assetIDRows.length > 0 && (
            <Button
              variant='contained'
              onClick={() => handleUpdate()}
              color='primary'
              type="primary"
              disabled={loading}
              className={styles.button}
            >
              Update
              {/* {loading && (
                <Spin
                  size='1rem'
                  className={styles.buttonProgress}
                />
              )} */}
            </Button>
          )}
          {currentStep === 2 && !success && nonAssetIDRows.length > 0 && (
            <Button
              variant='contained'
              onClick={() => handleInsert()}
              color='primary'
              type="primary"
              disabled={loading}
              className={styles.button}
            >
              Insert
              {loading && (
                <Spin
                  size='1rem'
                  className={styles.buttonProgress}
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
                  getNewData(parentGridApi);
                  setOpen(false);
                }}
                type="primary"
                color='primary'
                disabled={loading}
                className={styles.button}
              >
                Finish
                {loading && (
                  <Spin
                    size='1rem'
                    className={styles.buttonProgress}
                  />
                )}
              </Button>
            )}
        </div>
      </div>}
      destroyOnClose
      maskClosable={false}
      bodyStyle={{
        padding: '32px 30px 48px',
      }}

      onCancel={() => onToggleViewDialog()}
    >
      <>
        <div>
          <div>
            <Steps progressDot current={currentStep}>
              {steps.map(item => <Step key={item} title={item} />)}
            </Steps>
            <div className={styles.stepContent}>{stepContent(currentStep)}</div>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default FileUpload;
