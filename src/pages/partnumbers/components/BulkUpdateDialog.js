import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Progress } from 'antd';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { CheckCircleFilled } from '@ant-design/icons';
import clsx from 'clsx';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import { DATAURLS } from '../../../utils/constants';
import { fetchPut } from '../../../utils/utils';
// const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload
import { getAccessToken } from '@/utils/authority';
import Select from 'react-select';

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
    uploadIcon: {
      fontSize: '80px',
    },
    animatedItem: {
      animation: `$myEffect 300ms ${theme.transitions.easing.easeInOut}`,
    },
    successIcon: {
      color: '#004750',
      marginBottom: '15px',
    },
    uploadArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // color: '#ababab',
      '&:hover': {
        color: '#004750',
        cursor: 'pointer',
      },
    },
    successArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    buttonProgress: { marginLeft: '5px' },
  }),
);

const BulkUpdateDialog = ({
  open,
  setOpen,
  parentGridApi,
  getNewData,
  columnDefs,
  title,
  assetTypes
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  // const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [selectedUpdateData, setSelectedUpdateData] = useState([]);
  const [updateRecordsCount, setUpdateRecordsCount] = useState(0);
  const [columnDefsData, setcolumnDefsData] = useState([]);
  
  useEffect(()=>{
    setUpdateRecordsCount(0)
  },[])
    
  useEffect(()=>{
    setcolumnDefsData(columnDefs)
  },[columnDefs])
  

  const buildColumnDefinitions = () => {
    return [
      {
        headerName: 'Column',
        field: 'header_name',
        // checkboxSelection: true,
        resizable: true,
      },
      { headerName: 'field', field: 'field', hide: true, resizable: true },
      {
        headerName: 'Value',
        field: 'value',
        editable: true,
        cellEditorSelector: (params) => {
          if (params.data.field === 'status') {
            return {
              component: 'agSelectCellEditor',
              params: {
                values: ['Choose one','APPROVED', 'NOT APPROVED'],
              },
            };
          }

          if (params.data.field === 'asset_type') {
            return {
              component: 'agSelectCellEditor',
              params: {
                values: assetTypes,
              },
            };
          }
          if (params.data.field === 'action') {
            return {
              component: 'agSelectCellEditor',
              params: {
                values: ['CTRL', 'REUSE', 'RECYCLE', 'HARVEST'],
              },
            };
          }
        },
      },
    ];
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    setGridApi(params.api);
    // setEnableSubmission(false);
  };

  const onCellEditingStarted = (params) => {
    // setEnableSubmission(true);
  };
  const onCellEditingStopped = (params) => {
    // console.log("params", params)
    gridApi.stopEditing();
    // handleSubmit(gridApi.rowModel.rowsToDisplay)
    // let checkValue = columnDefs.filter((column) => column.value);
    // setEnableSubmission(checkValue.length > 0 ? true : false);
  };

  const resetColmndef=()=>{
    let temp = columnDefsData;
    temp.forEach((itm)=>{
      delete itm.value
    })
    setcolumnDefsData(temp)
  }
  const handleSubmit = async (rows) => {
    gridApi.stopEditing();
    let selectedRowNodes = rows.filter((node) => node.data.value && node.data.value !== 'Choose one');
    let selectedRows = selectedRowNodes.map((node) => node.data);
    if(selectedRows?.length === 0){
      return
    }
    setLoading(true);
    let summaryOffset = 0;
    let updateSuccess = null;

    try {
      let updateObject = {};
      selectedRows.forEach((row) => {
        if (row.field === 'status') {
          if (row.value === 'APPROVED') {
            row.value = 'published'
          } else if (row.value === 'NOT APPROVED') {
            row.value = 'draft'
          }
        }
        updateObject[row.field] = row.value;
      });

      let selectedData = [];

      selectedData = parentGridApi.getSelectedRows().map((row) => {
        return { id: row.id, ...updateObject };
      });
      setSelectedUpdateData(selectedData);
      let filterassetIDRows = selectedData;
      for (let i = 0; i <= selectedData.length; i++) {
        if (filterassetIDRows.length > 0 && filterassetIDRows[i] && filterassetIDRows[i].id) {
          // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
          if (updateRecordsCount === filterassetIDRows.length) {
            break;
          }

          updateSuccess = await fetchPut(
            `${DATAURLS.PARTNUMBERS.url}/${filterassetIDRows[i].id}`,
            filterassetIDRows[i],
            getAccessToken(),
          );
          setUpdateRecordsCount(i + 1);
        }
      }
      if (updateSuccess?.data?.id) {
        // console.log("updateSuccess", updateSuccess)
        setSuccess(true);
        setLoading(false);
        summaryOffset += filterassetIDRows.length;
        setUpdateRecordsCount(0);
        updateSuccess = null
        selectedData=[]
        //reset column def values
          resetColmndef()
      } else {
        setLoading(false);
        setSuccess(false);
        setError(true);
        updateSuccess = null;
        resetColmndef();
      }
    } catch (err) {
      console.log('errrr', err)
      throw err;
    }
    setLoading(false);
    // setUpdateRecordsCount(0)
    if (updateSuccess?.data?.id) {
      setSuccess(true);
    } else {
      summaryOffset = 0;
      setError(true);
      setLoading(false);
      // setFileUploadErrorMessage(updateSuccess.message.split('-')[1]);
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
        <div className={classes.successArea}>
          {success && (
            <CheckCircleFilled
              className={clsx(
                classes.uploadArea,
                classes.uploadIcon,
                classes.successIcon,
                classes.animatedItem,
              )}
            />
          )}
          {success && <div style={{ fontSize: 24 }}>Update Successful</div>}
        </div>
        {!success && (
          <div>
            <DialogContentText id="alert-dialog-description">
              Select columns to update{' '}
              {parentGridApi && (
                <span>- {parentGridApi.getSelectedRows().length} rows selected</span>
              )}
            </DialogContentText>
            <div
              className="ag-theme-quartz"
              style={{
                width: '600px',
                height: '300px',
                boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
              }}
            >
              <AgGridReact
                rowData={columnDefsData.filter((column) => column.bulk_update)}
                columnDefs={buildColumnDefinitions()}
                onCellEditingStopped={onCellEditingStopped}
                onCellEditingStarted={onCellEditingStarted}
                onGridReady={onGridReady}
                singleClickEdit={true}
                editType="fullRow"
              // stopEditingWhenGridLosesFocus={true}
              ></AgGridReact>
            </div>
          </div>
        )}
        {loading && (
        // <CircularProgress
        //   size='1rem'
        //   className={classes.buttonProgress}
        // />
        <Progress
          size="1rem"
          type="circle"
          style={{ paddingTop: '30px', margin: '0 auto', fontSize: '15px' }}
          strokeColor={{ '0%': '#f80059', '100%': '#87d068' }}
          percent={Math.round((updateRecordsCount * 100) / selectedUpdateData.length)}
        />
      )}
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
              onClick={() => handleSubmit(gridApi.rowModel.rowsToDisplay)}
              color="primary"
               disabled={loading}
              className={classes.button}
            >
              Update
              
            </Button>
          </div>
        )}
        
      </DialogActions>
      
    </Dialog>
  );
};

export default BulkUpdateDialog;
