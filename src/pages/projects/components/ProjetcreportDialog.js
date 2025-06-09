
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchPost, fetchPut } from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Row, Col } from 'antd';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '60%'
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  dialogRoot: {
    width: '650px !important',
    height: '300px',
    //   display: 'flex',
    //   flexDirection: 'column',
  },
  menu: {
    width: 200,
  },
}));

export default function AlertDialog({
  showDialog,
  selectedItem,
  handleCancel,
  collection
}) {
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [isProductReport, setisProductReport] = useState(null);
  const [isFinanceReport, setisFinanceReport] = useState(null);
  const [isEnvReport, setisEnvReport] = useState(null);

  const classes = useStyles()
  function handleClose() {
    handleCancel(false);
  }

  useEffect(() => {
    if (selectedItem && selectedItem.data.id) {
      // setAssetData(selectedItem.data)
      setLoading(false);
      setEditData(selectedItem.data)
      setisFinanceReport(selectedItem.data.isFinanceReport)
      setisProductReport(selectedItem.data.isProductReport)
      setisEnvReport(selectedItem.data.isEnvReport)
    }
  }, [selectedItem])


  const submit = async () => {
    setLoading(true)
    let param = {
      id: editData.id,
      isSendMail: true
    }
    await fetchPost(`${DATAURLS.EXCELEXPORTSENDMAIL.url}`, param, getAccessToken())
      .then((result) => {
        if (result.data?.length > 0) {
          setSnackBarOpen(true)
          setLoading(false)
          setSnackBarType("success")
          setSnackBarMessage(result.msg)
        } else {
          setLoading(false)
          setSnackBarOpen(true)
          setSnackBarType("error")
          setSnackBarMessage(result.msg)
        }
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });


  }

  const handleToggle = async (type) => {
    setLoading(true)
    let obj = {
      isProductReport: isProductReport,
      isFinanceReport: isFinanceReport,
      isEnvReport: isEnvReport

    }
    await fetchPut(`${DATAURLS.PROJECT.url}/${editData.id}`, obj, getAccessToken())
      .then(async (response) => {
        if (response.data.id) {
          setSnackBarOpen(true)
          setLoading(false)
          setSnackBarType("success")

          setSnackBarMessage(`Report's saved successfully.`);
          if (type) {
            await submit()
          }
        }
      })
      .catch((err) => {
        throw err;
      });

  }


  return (
    <div>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='sm'
        className='dialogRoot'
        classes={{ paper: classes.dialogRoot }}
      >
        <DialogTitle id="alert-dialog-title text-uppercase">{collection} - ({selectedItem?.data?.id})
        <CloseCircleOutlined
            className={classes.actionIcon}
            onClick={() => {
              handleClose(false);
            }}
          /></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <form
              autoComplete="off"
              className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
              noValidate
              id='kt_login_signup_form'
            // onSubmit={handleSubmit}
            >
              <div>
                <List>
                  <Row gutter={16} className="user-list user-list1" >
                    <Col className="gutter-row" xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Checkbox
                        edge="start"
                        onChange={e => {
                          setisProductReport(e.target.checked)
                        }}
                        checked={isProductReport}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': 1 }}
                      /> Product report
                    </Col>
                  </Row>
                  <Row gutter={16} className="user-list user-list1" >
                    <Col className="gutter-row" xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Checkbox
                        edge="start"
                        onChange={e => {
                          setisEnvReport(e.target.checked)
                        }}
                        checked={isEnvReport}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': 1 }}
                      /> Environment report
                    </Col>
                  </Row>
                  <Row gutter={16} className="user-list user-list1" >
                    <Col className="gutter-row" xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Checkbox
                        edge="start"
                        onChange={e => {
                          setisFinanceReport(e.target.checked)
                        }}
                        checked={isFinanceReport}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': 1 }}
                      /> Financial report
                    </Col>
                  </Row>
                </List>
              </div>
            </form>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() => handleClose(false)}
            color='secondary'
            // disabled={loading}
            className={classes.button}
          >
            Cancel
            </Button>
          {
            <>
              <Button
                variant='contained'
                onClick={() => { handleToggle(null); }}
                color='primary'
                // disabled={loading || !enableSubmission}
                className={classes.button}
              >
                {'Create & Save'}
                {loading && (
                  <CircularProgress
                    size='1rem'
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
              <Button
                variant='contained'
                onClick={() => handleToggle('true')}
                color='primary'
                // disabled={loading || !enableSubmission}
                className={classes.button}
              >
                {'Create, Save & Send'}
                {loading && (
                  <CircularProgress
                    size='1rem'
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </>
          }

        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackBarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackBarOpen(false)}
          severity={snackBarType}
        >
          {snackBarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
