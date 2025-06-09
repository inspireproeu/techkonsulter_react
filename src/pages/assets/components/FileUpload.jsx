import {
  FileAddOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from "moment";
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
  FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE,
  FILE_UPLOAD_EMPTY_FILE_MESSAGE,
  PROJECT_MISMATCH,
  HEADER_MISMATCH1,
  HEADER_MISMATCH
} from '../../../utils/constants';

const useStyles = makeStyles((theme) =>
  createStyles({
    lgDialog: {
      width: '50%'
    },
    dialogRoot: {
      width: '100%',
      height: '500px',
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
      textAlign: 'center'
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
      width: '100%',
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
    },
    errIcon: {
      color: 'red',
      marginBottom: '15px',
    },
  })
);

const FileUploadDialog = ({
  open,
  title,
  setOpen,
  getNewData,
  parentGridApi,
  currentUser,
  tempFieldsList,
  projectId,
  columnFields,
  datasource
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
  const [duplicateAssetIDRows, setDuplicateAssetIDRows] = useState([]);
  const [nonAssetIDRows, setNonAssetIDRows] = useState([]);
  const [importId, setImportId] = useState('')
  const [clientId, setClientId] = useState(null);
  const [importFiles, setImportFiles] = useState([])
  const [alreadySoldAssetIDRows, setAlreadySoldAssetIDRows] = useState([]);
  const [alreadySoldResStatus, setAlreadySoldResStatus] = useState(false);
  const [showWarning, setshowWarning] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [closedProjects, setClosedProjects] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [nerdFixData, setNerdFixData] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser?.role?.name === 'client_admin' || currentUser?.role?.name === 'client_cio' || currentUser?.role?.name === 'client_sales') {
      let client = currentUser.client ? currentUser.client.id : null;
      setClientId(client)
    }
    handleReset();
    if (open) {
      setImportId(Math.floor(Math.random() * 90000) + 10000)
    }
    lists()
    projlists()
    getColumnDefinitions()
  }, [open]);

  useEffect(() => {
    if (!success) {
      return;
    }
    let allAssetIDs = allAssets.map((asset) => asset.asset_id);

    let soldallAssetIDsFilter = allAssets.filter((asset) => (asset?.status?.toUpperCase() === 'SOLD') || (asset?.status?.toUpperCase() === 'RESERVATION') || (asset?.status?.toUpperCase() === 'RETURNED'));
    let soldallAssetIDs = soldallAssetIDsFilter.map((asset) => asset.asset_id);

    let asset_data = data.filter((row) => allAssetIDs.indexOf('' + row.asset_id) !== -1)
    let sold_asset_data = data.filter((row) => soldallAssetIDs.indexOf('' + row.asset_id) !== -1)

    //     let uniqdata = _.uniq(data, 'asset_id');
    //To fin closed Projects
    let result = data.filter(o1 => allProjects.some(o2 => o1.project_id === o2.id));
    let closedProjects = _.uniq(result, 'project_id')
    closedProjects = closedProjects.map((itm) => itm.project_id);
    setClosedProjects(closedProjects)

    setAssetIDRows(
      asset_data
    );
    setDuplicateAssetIDRows(
      asset_data.map(
        (item) => item.asset_id
      )
    );
    setAlreadySoldAssetIDRows(
      sold_asset_data.map(
        (item) => item.asset_id
      )
    );
    setNonAssetIDRows(
      data.filter((row) => allAssetIDs.indexOf('' + row.asset_id) === -1)
    );

    //Finding nerdfix bulk data
    let assetsData = []
    asset_data.forEach((item) => {
      if (item.asset_id && item.asset_id_nl && item.status === 'RESERVATION' && item.sold_order_nr) {
        assetsData.push(item)
      }
    })
    setNerdFixData(assetsData)
    //endd

  }, [success, allAssets]);

  useEffect(() => {
    if (alreadySoldAssetIDRows && alreadySoldAssetIDRows.length > 0) {
      setAlreadySoldResStatus(true)
    }
  }, [alreadySoldAssetIDRows])

  const lists = async () => {
    let fields = `?limit=-1&sort=-asset_id&fields[]=asset_id,status`
    fetchGet(`${DATAURLS.ASSETS.url}${fields}`, getAccessToken())
      .then((response) => {
        setAllAssets(response.data);
      })
      .catch((err) => {
        throw err;
      });
  }


  const getColumnDefinitions = async () => {
    let fields1 = `?limit=-1&sort=order_by_id&&fields[]=field`
    // Fetching column definition
    fetchGet(`${DATAURLS.COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
      .then((response) => {
        let definitions = []
        response.data.forEach((itm) => {
          if (itm.field !== "actions") {
            definitions.push(itm)
          }
        })
        let columns = definitions.map((obj) => obj.field);
        setColumnDefs(columns);
      })
      .catch((err) => {
        throw err;
      });
  }

  const projlists = async () => {
    let fields = `?limit=-1&sort=-id&filter={"_and":[{"_and":[{"project_status":{"_eq":"CLOSED"}}]}]}&fields[]=id,project_status`
    fetchGet(`${DATAURLS.PROJECT.url}${fields}`, getAccessToken())
      .then((response) => {
        setAllProjects(response.data);
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
    setshowWarning(false)
    setCurrentStep((prev) => prev + 1);
  };

  // console.log(objToString(data1).slice(0, -1));
  const handlePrevious = () => {
    setshowWarning(false)
    setCurrentStep((prev) => prev - 1);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('title', `${importId}-Assets - ${importFiles[0].name}`);
    formData.append('file', importFiles[0]);
    await fetchPost(
      `${DATAURLS.FILE.url}`,
      formData
    )
  }

  const handleUpdate = async () => {
    let summaryOffset = 0;
    // await uploadFile();
    setLoading(true);
    try {
      let updateSuccess = '';
      try {
        let filterassetIDRows = assetIDRows;
        // console.log("filterassetIDRows", filterassetIDRows)
        for (let i = 0; i <= filterassetIDRows.length; i++) {
          if (assetIDRows.length > 0 && filterassetIDRows[i] && filterassetIDRows[i].asset_id) {
            // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
            if (updateRecordsCount === filterassetIDRows.length) {
              break
            }
            if (clientId) {
              filterassetIDRows[i].client = clientId;
            }
            if (projectId) {
              filterassetIDRows[i].project_id = projectId;
            }
            updateSuccess = await fetchPut(
              `${DATAURLS.ASSETS.url}/${filterassetIDRows[i].asset_id}?fields=asset_id`,
              filterassetIDRows[i],
              getAccessToken()
            )
            setUpdateRecordsCount(i + 1);

          }
        }

        // console.log("updated success", updateSuccess)
        if (updateSuccess?.data?.asset_id) {
          // console.log("updateSuccess", updateSuccess)
          summaryOffset += filterassetIDRows.length;
          setUpdateRecordsCount(summaryOffset);
        }
        // }
      } catch (err) {
        console.log('update error', err);
        // setLoading(false);
        // setError(false);
        // setFileUploadErrorMessage(err.message);
        throw err;
      }
      setLoading(false);
      setUpdateRecordsCount(0)
      if (updateSuccess?.data?.asset_id) {
        setSuccess(true);
        await uploadFile();
        await nerdFixBulkUpdate(nerdFixData)
      } else {
        await uploadFile();
        summaryOffset = 0;
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage("Failed to update. Try after something");
      }
    } catch (err) {
      await uploadFile();
      console.log('update error', err);
      setLoading(false);
      setError(false);
      setFileUploadErrorMessage(err.message);
      throw err;
    }
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

    try {
      let tempassetIDRows = dataWithoutAssetIds;
      // tempassetIDRows = _.uniq(tempassetIDRows, 'asset_id');

      let insertSuccess = "";
      let noofRequests = 25;
      let summaryOffset = 0;

      for (let i = 0; i <= tempassetIDRows.length; i += 25) {
        if (tempassetIDRows.length > 0 && tempassetIDRows[i]) {
          // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
          if (insertRecordsCount === tempassetIDRows.length) {
            break
          }
          // let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
          if (clientId) {
            tempassetIDRows[i].client = clientId;
          }
          if (projectId) {
            tempassetIDRows[i].project_id = projectId;
          }
          if (!tempassetIDRows[i].status) {
            tempassetIDRows[i].status = 'IN STOCK'
            if (tempassetIDRows[i].grade) {
              tempassetIDRows[i].grade = tempassetIDRows[i].grade.toLowerCase()
            }
            if (tempassetIDRows[i].grade === 'a' || tempassetIDRows[i].grade === 'b' || tempassetIDRows[i].grade === 'c' || tempassetIDRows[i].grade === 'd') {
              tempassetIDRows[i].status = 'IN STOCK';
            } else if (tempassetIDRows[i].grade === 'e') {
              tempassetIDRows[i].status = "RECYCLED";
            } else {
              tempassetIDRows[i].status = 'IN STOCK';
            }
          }
          if (tempassetIDRows[i].data_generated) {
            tempassetIDRows[i].data_generated = tempassetIDRows[i].data_generated.toUpperCase()
          } else {
            tempassetIDRows[i].data_generated = "MANUAL"
          }

          let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
          insertSuccess = await fetchPost(
            DATAURLS.ASSETS.url,
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
        setSuccess(true);
        setNonAssetIDRows([])
        setTimeout(() => {
          getNewData(parentGridApi, null, false, null, tempFieldsList)
          setOpen(false);
        }, 600);
        await uploadFile();

      } else {
        await uploadFile();
        setError(true);
        setLoading(false);
        setFileUploadErrorMessage("Failed to inser");
      }
    } catch (err) {
      await uploadFile();
      setLoading(false);
      setError(false);
      setFileUploadErrorMessage("Something went wrong");
      throw err;
    }
  };

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
          if (item.date_nor) {
            item.date_nor1 = item.date_nor;
            item.date_nor = item.date_nor && moment(item.date_nor).format('YYYY-MM-DD') !== 'Invalid date' ? moment(item.date_nor).format('YYYY-MM-DD') : moment(ExcelDateToJSDate(item.date_nor)).format('YYYY-MM-DD');
          }
          item.import_id = importId;
        })
        let unknownFields = []
        //omit fields statrting from  _ (undescrore)
        let assets = []
        data = _.map(data, function (itm) {
          if(itm.asset_id){
            assets.push(itm.asset_id);
          }
          return _.omit(itm, function (value, key) {
            if (key != 'import_id' && key != 'date_nor1' && !columnDefs.includes(key)) {
              unknownFields.push(key)
            }
            return key.charAt(0) == "_";
          });
        });
        if (assets?.length > 0) {
          data = _.uniq(data, 'asset_id'); // remove duplicate values
        }
        setData(data);
        setCols(make_cols(ws['!ref']));
        // console.log('resetting load');

        setLoading(false);
        if (projectId && data.length > 0) {
          // check project number mismatch while uploading particular project
          const result = data.filter(item => Number(item.project_id) !== Number(projectId));
          if (result?.length > 0) {
            setSuccess(true);
            setFileUploadError(true);
            setFileUploadSuccess(false);
            setFileUploadErrorMessage(`${PROJECT_MISMATCH} - ${projectId}`);
            return;
          }
        }
        if (unknownFields) {
          if (unknownFields?.length > 0) {
            setSuccess(true);
            setFileUploadError(true);
            setFileUploadSuccess(false);
            setFileUploadErrorMessage(`${HEADER_MISMATCH} "${unknownFields.toString()}" ${HEADER_MISMATCH1}`);
            return;
          }
        }

        // checking all file upload errors here
        if (data.length === 0 || !data) {
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

  const showAlreadySoldResv = () => {
    setshowWarning(true)
  }
  const nerdFixBulkUpdate = async (assetsData) => {
    let tempval = _.groupBy(assetsData, (item) => item.sold_order_nr);
    let groupedArr = {}
    _.forEach(tempval, async function (value, key) {
      let asset_id_nl_lists = value.map((row) => row.asset_id_nl);
      groupedArr.sold_order_nr = key;
      groupedArr.products = asset_id_nl_lists;
      await fetchPost(
        `${DATAURLS.NERDFIXBULKUPDATE.url}`,
        groupedArr
      ).then((response) => {
        console.log("responsee", response)
      })
        .catch((err) => {
          throw err;
        });

    })


  }

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
                  (.csv, .xls, .xlsx.)
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
                {closedProjects?.length === 0 && !fileUploadError && (
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

                {(closedProjects?.length > 0 || fileUploadError) && (
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
                {
                  closedProjects?.length > 0
                }
                {closedProjects?.length > 0 && (
                  <div style={{ width: '100%' }}>
                    <div className={classes.stepsText} style={{ color: 'red' }}>
                      Alert: Closed projects detected. Please remove them before importing.
                    </div>
                    <div className={"asset_text"}>
                      Asset id : {closedProjects.toString()}
                    </div>
                  </div>
                )}
                {closedProjects?.length === 0 && !fileUploadError && (
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
            { showWarning && !loading && !success && alreadySoldAssetIDRows?.length > 0 && (
              <div style={{ width: '100%' }}>
                <div className={classes.stepsText}>
                  <strong>Update assets.</strong>
                </div>
                <div className={classes.stepsText}>
                  Are you sure you want to update following assets.
                </div>
                <div className={"asset_text"}>
                  Asset id : {alreadySoldAssetIDRows.toString()}
                </div>
              </div>
            )}

            {!showWarning && !loading && !success && alreadySoldAssetIDRows?.length > 0 && (
              <div style={{ width: '100%' }}>
                <div className={classes.stepsText}>
                  <strong>{alreadySoldAssetIDRows.length} records already in reservation / Sold / Returned.</strong>
                </div>
                <div className={"asset_text"}>
                  Asset id : {alreadySoldAssetIDRows.toString()}
                </div>
              </div>
            )}
            {!showWarning && !loading && !success && (
              <div style={{ width: '100%' }}>
                <div className={classes.stepsText}>
                  {assetIDRows.length} records with a matching Asset ID
                  </div>
                {
                  assetIDRows?.length > 0 && <div className={"asset_text"}>
                    Asset id : {duplicateAssetIDRows.toString()}
                  </div>
                }
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
                  {
                    nonAssetIDRows?.length > 0 && <div className={"asset_text"}>
                      New Assets : {nonAssetIDRows.map((item) => item.asset_id).toString()}
                    </div>
                  }
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
      maxWidth='lg'
    // className={classes.lgDialog}
    >
      <div className={classes.dialogRoot}>
        <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
          <div className={classes.dialogTitleText}>
            <div>{title} - Import Id {importId}</div>
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

            {(closedProjects?.length === 0) && currentStep !== 2 && (
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
              </Button>
            )}

            {currentStep === 1 && !success && assetIDRows.length > 0 && (
              <Button
                variant='contained'
                onClick={() => alreadySoldResStatus && !showWarning ? showAlreadySoldResv() : handleUpdate()}
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
                    getNewData(datasource, parentGridApi, false, false, null, tempFieldsList, '', false, 1)
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
