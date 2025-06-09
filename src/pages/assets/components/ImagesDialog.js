
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { fetchGet, fetchDelete } from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';
import {
  DeleteFilled, CloseCircleOutlined,
} from '@ant-design/icons';
import Grid from '@mui/material/Grid';
import styles from '../../assets/style.less';
import LinearProgress from '@mui/material/LinearProgress';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '60%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '20px'
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  dialogRoot: {
    width: '750px !important',
    height: '600px',
    //   display: 'flex',
    //   flexDirection: 'column',
  },
  menu: {
    width: 200,
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
}));

export default function AlertDialog({
  showDialog,
  selectedItem,
  handleCancel,
  currentUser,
  collection
}) {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const classes = useStyles();

  function handleClose() {
    handleCancel(false);
  }

  useEffect(() => {
    if (collection && selectedItem) {
      getFiles(selectedItem, collection)
    }
  }, [selectedItem, collection])

  const getFiles = async (id, collection) => {
    let fields = `limit=-1&filter={"_and":[{"asset_id":{"_eq":${id}}}]}`;
    if (collection === 'Project') {
      fields = `limit=-1&filter={"_and":[{"project_id":{"_eq":${id}}}]}`;
    }
    setLoading(true)
    fetchGet(`${DATAURLS.FILE.url}?${fields}`, getAccessToken())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setFileList(result.data);
          setLoading(false)
        } else {
          setFileList([])
          setLoading(false)
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  const deleteFile = async (id) => {
    setLoading(true)
    if (id) {
      fetchDelete(`${DATAURLS.FILE.url}`, [id], getAccessToken())
        .then((res) => {
          setLoading(false)
          getFiles(selectedItem,collection);
        })
        .catch((err) => {
          setLoading(false);
          console.log('error deleting record');
          throw err;
        });
    }
  }

  return (
    <div>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='lg'
      // className='dialogRoot'
      // classes={{ paper: classes.dialogRoot }}
      >
        <DialogTitle id="alert-dialog-title text-uppercase">{'App Images '} ({collection} Number - {selectedItem})
          <CloseCircleOutlined
            className={classes.actionIcon}
            onClick={() => {
              handleClose(false);
            }}
          /></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className='card-body pt-2 app-images'>
              <br />
              <>
                {
                  <>
                    {loading && (
                      <LinearProgress
                        size='1rem'
                        className={classes.buttonProgress}
                      />
                    )}
                    <div style={{ paddingBottom: 10, display: 'flex', flexWrap: 'wrap' }}>
                      {
                        fileList?.length > 0 ? fileList.map((item, key) => (
                          <>

                            <div key={key} >

                              <Grid item xs={4}>
                                <div>
                                  <div className="block-icon">
                                    <a target="_blank" href={`https://productionapi.techkonsult.se/assets/${item.id}?fit=cover&width=600&height=600&quality=100&access_token=${getAccessToken()}`}><img src={`https://productionapi.techkonsult.se/assets/${item.id}?fit=cover&width=200&height=200&quality=100&access_token=${getAccessToken()}`} /></a>
                                    {
                                      currentUser.userType === 'ADMIN' && <div className="delete-images">
                                        {
                                          <DeleteFilled
                                            style={{ paddingTop: 10, fontSize: 20 }}
                                            className={[styles.deleteBtn].join(' ')}
                                            onClick={() => deleteFile(item.id)}
                                          />
                                        }
                                      </div>
                                    }
                                  </div>
                                </div>

                              </Grid>


                            </div>
                          </>
                        )) : <div style={{ textAlign: 'center' }}>
                          There are no images found.
                      </div>
                      }
                    </div>
                  </>
                }
              </>
            </div>
          </DialogContentText>
        </DialogContent>
        {
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
          </DialogActions>
        }

      </Dialog>
    </div>
  );
}
