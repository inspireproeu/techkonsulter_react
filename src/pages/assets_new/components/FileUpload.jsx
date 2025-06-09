import React, { useState, useRef, useEffect, useContext } from 'react';
import { message, Col, Modal, Upload, Button, Icon, Spin } from 'antd';
import styles from './style.less';
import moment from 'moment';
import { useMobile, useMobileSmall } from '@/utils/utils';
import { UploadOutlined } from '@ant-design/icons';

import * as XLSX from "xlsx";
const FILE_UPLOAD_ROW_COUNT_ERROR = 1000;
const FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE =
  'Invalid file. Exceeds 1000 rows';
const FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE =
  'Invalid file. Column asset_id (Asset Number) is missing';
const FILE_UPLOAD_EMPTY_FILE_MESSAGE =
  'Invalid file. No records available';

// const importExcel = (file, addItem) => {
//   const fileReader = new FileReader();
//   fileReader.onload = event => {
//     try {
//       const { result } = event.target;
//       const workbook = XLSX.read(result, { type: "binary" });
//       for (const Sheet in workbook.Sheets) {
//         // var XL_row_object =
//         XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
//         if (workbook.Sheets.hasOwnProperty(Sheet)) {
//           data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
//           data.forEach(x => {
//             addItem(x.sku, x.description, parseInt(x.quantity), parseFloat(x.cost));
//           });
//         }
//       }
//       message.success("upload success!");
//     } catch (e) {
//       message.error("file type is incorrect!");
//     }
//   };
//   fileReader.readAsBinaryString(file);
// };
export const FileUpload = (props) => {
  // const appContext = useContext(AppContext);
  const fileUploader = useRef(null);

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

  const { showModalDialog, handleCancel, columnDefinitions } = props;
  const isMobile = useMobile();
  // const onImportExcel = event => {
  //   const { files } = event.target;
  //   if (files.length === 1) {
  //     // Process a file if we have exactly one
  //     importExcel(
  //       files[0],
  //       // Not sure what you want to do with the data, so let's just log it
  //       (asset_id) => console.log(asset_id),
  //     );
  //   }
  // };
  const onToggleViewDialog = async () => {
    handleCancel(false);
  };
  const propss = {
    // name: 'file',
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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

        if (data.length > FILE_UPLOAD_ROW_COUNT_ERROR) {
          setSuccess(true);
          setFileUploadError(true);
          setFileUploadErrorMessage(FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE);
          return;
        }
        // // Checking for new asset types in uploaded file
        // let newAssetType = data.find(
        //   (asset) => assetTypes.indexOf(asset.asset_type) === -1
        // );

        // if (newAssetType) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(
        //     `Invalid asset type - '${newAssetType.asset_type}' found in one or more rows`
        //   );
        //   return;
        // }

        // // Checking for new status values in uploaded file
        // let newStatus = data.find(
        //   (asset) => asset.status && statusNames.indexOf(asset.status) === -1
        // );
        // if (newStatus) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(
        //     `Invalid status - '${newStatus.status}' found in one or more rows`
        //   );
        //   return;
        // }

        // // Checking for new pallet number in uploaded file
        // let newPalletNumber = data.find(
        //   (asset) =>
        //     asset.pallet_number &&
        //     palletNumbers.indexOf(asset.pallet_number) === -1
        // );

        // console.log('pallet numbers', data, palletNumbers, newPalletNumber);
        // if (newPalletNumber) {
        //   setSuccess(true);
        //   setFileUploadError(true);
        //   setFileUploadErrorMessage(
        //     `Invalid pallet number - '${newPalletNumber.pallet_number}' found in one or more rows`
        //   );
        //   return;
        // }

        // // Checking for empty quanity in uploaded file
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

  return (
    <Modal
      animation="zoom"
      maskAnimation="fade"
      width={640}
      forceRender
      visible={showModalDialog}
      title="FILE UPLOAD"
      size={'large'}
      footer={[
        <Button key="submit" type="primary" >
          Finish
        </Button>,
      ]} destroyOnClose
      bodyStyle={{
        padding: '32px 30px 48px',
      }}
      onOk={() => onToggleViewDialog()}
      onCancel={() => onToggleViewDialog()}
    >
      <>
        <div>
          {/* <Button className="upload-wrap"> */}
          <input
            type='file'
            ref={fileUploader}
            style={{ display: 'none' }}
            accept={'.csv, .xls, .xlsx'}
            onChange={(e) => handleFileUpload(e)}
          />
          <div
            onClick={(e) => fileUploader.current.click()}
            className={styles.uploadArea}
          >
            <UploadOutlined className={styles.uploadIcon} />
            <div className={styles.stepsText}>Select a file</div>
            <div className={styles.stepsSubText}>
              (.csv, .xls, .xlsx. Also, limit)
                </div>
          </div>
          {loading && (
              <Spin
                // icon={faSpinner}
                // spin
                // className={clsx(classes.uploadArea, classes.uploadIcon)}
              />
            )}
          {/* <input className="file-uploader" type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e)} /> */}
          {/* <span className="upload-text">Upload files</span> */}
          {/* </Button> */}
          {/* <p className="upload-tip">Supports files in .xlsx, .xls format</p> */}
        </div>
        {/* <Upload {...propss}>
          <Button icon={<UploadOutlined />}>File to Upload</Button>
        </Upload> */}
      </>
    </Modal>
  );
};

export default FileUpload;
