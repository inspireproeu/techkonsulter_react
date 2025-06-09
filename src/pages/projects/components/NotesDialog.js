
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchPut, fetchPost, fetchGet, fetchDelete } from '@/utils/utils';
import { DATAURLS } from '../../../../src/utils/constants';
import { getAccessToken } from '@/utils/authority';
import {
  DeleteFilled, EditFilled, CloseCircleOutlined,
  DownloadOutlined

} from '@ant-design/icons';
import Grid from '@mui/material/Grid';
import * as moment from 'moment';
import { DropzoneArea } from 'material-ui-dropzone'
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
    width: '650px !important',
    height: '500px',
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
  collection,
  parentGridApi,
  getNewData,
  rowData,
  setRowData,
  currentUser
}) {
  const [description, setDescription] = useState('')
  const [notes, setNotes] = React.useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const classes = useStyles();

  function handleClose() {
    handleCancel(false);
  }

  useEffect(() => {
    if (selectedItem && selectedItem.data.id) {
      // setAssetData(selectedItem.data)
      setEditData({})
      setNotes("")
      setFileList([])
      if (!selectedItem.data.file_type) {
        getNotes(selectedItem.data.id)
      } else if (selectedItem.data.file_type) {
        getFiles(selectedItem.data.id)
      }
    }
  }, [selectedItem])

  const getNotes = async (id) => {
    setLoading(true)
    let fields = `limit=-1&filter={"_and":[{"id":{"_eq":${id}}}]}&fields=handling_comments.*.*`;
    fetchGet(`${DATAURLS.PROJECT.url}?${fields}`, getAccessToken())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setNotes(result.data[0].handling_comments);
          setLoading(false)
        } else {
          setNotes([])
          setLoading(false)
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  const getFiles = async (id) => {
    setLoading(true)
    let fields = `limit=-1&filter={"_and":[{"project_id":{"_eq":${id}}}]}`;
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


  const submit = async () => {
    if (description) {
      // let param = {
      //   description: description,
      //   selected_id: selectedItem.data.id,
      //   collection: collection
      // }
      let param = {
        handling_comments: {

        }
      }
      setLoading(true)
      if (editData && editData.id) {

        param.handling_comments.update = [
          {
            "id": editData.id,
            "notes_id": {
              id: editData.notes_id.id,
              description: description,
              selected_id: selectedItem.data.id,
              collection: collection
            }
          }
        ]
        fetchPut(`${DATAURLS.PROJECT.url}/${selectedItem.data.id}`, param, getAccessToken())
          .then((result) => {
            if (result.data.id) {
              setDescription('');
              setLoading(false)
              getNotes(selectedItem.data.id);
              setEditData({})

            } else {
              setDescription('');
              setLoading(false)
              setEditData({})
            }
          })
          .catch((err) => {
            setEditData({});
            throw err;
          });
      } else {
        param.handling_comments.create = [
          {
            "notes_id": {
              description: description,
              selected_id: selectedItem.data.id,
              collection: collection
            }
          }
        ]
        fetchPut(`${DATAURLS.PROJECT.url}/${selectedItem.data.id}`, param, getAccessToken())
          .then((result) => {
            if (result.data.id) {
              setDescription('');
              getNotes(selectedItem.data.id);
              let index = selectedItem.node.rowIndex
              let rowDataCopy = [...rowData];
              rowDataCopy[index].handling_comments = ['test']
              // rowDataCopy.splice(deleteIndex, 1);
              setRowData(rowDataCopy);
              // parentGridApi.refreshCells()
              getNewData(parentGridApi);
              setEditData({})
              setLoading(false)
            } else {
              setDescription('');
              setEditData({})
              setLoading(false)
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    }

  }

  const deleteNotes = async (id) => {
    let result = ""
    setLoading(true)
    if (id) {
      let param = {
        handling_comments: {
        }
      }
      param.handling_comments.delete = [id]
      fetchPut(`${DATAURLS.PROJECT.url}/${selectedItem.data.id}`, param, getAccessToken())
        .then((res) => {
          if (res) {
            getNotes(selectedItem.data.id);
          }
        })
        .catch((err) => {
          console.log('error deleting record');
          throw err;
        });
    }
  }

  const deleteFile = async (id) => {
    setLoading(true)
    if (id) {
      fetchDelete(`${DATAURLS.FILE.url}`, [id], getAccessToken())
        .then((res) => {
          setLoading(false)
          getFiles(selectedItem.data.id);
        })
        .catch((err) => {
          setLoading(false);
          console.log('error deleting record');
          throw err;
        });
    }
  }

  const edit = (item) => {
    setEditMode(true)
    setEditData(item)
    setDescription(item.notes_id.description)
  }

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', `${files[0].name}`);
    formData.append('project_id', `${selectedItem.data.id}`);
    formData.append('file', files[0]);
    formData.append('folder', '77a77605-0664-4b8b-bac4-b69435f52daa');

    await fetchPost(
      `${DATAURLS.FILE.url}`,
      formData,
      getAccessToken()
    ).then((res) => {
      if (res) {
        getFiles(selectedItem.data.id);
      }
    })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const download = (id) => {
    window.location.href = `https://productionapi.techkonsult.se/assets/${id}?download=&access_token=${getAccessToken()}`
  }


  return (
    <div>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='lg'
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
              <div className="cards card-custom gutter-b">
                {
                  !selectedItem?.data?.file_type && <div className="form-group row notes-s" style={{ width: '100%' }}>
                    <label className='form-label fw-bolder text-dark fs-6'>Handing comments</label>
                    <div className='col-lg-12'>
                      <TextField
                        style={{ width: '100%' }}
                        id="standard-multiline-flexible"
                        required
                        multiline
                        maxRows="10"
                        rows={6}
                        name={'description'}
                        value={description}
                        onChange={(e) => {
                          const { value } = e.target;
                          setDescription(value)
                        }
                        }
                        className={classes.textField}
                      //  margin="normal"
                      />
                    </div>
                  </div>
                }
                {(selectedItem?.data?.file_type) && <div className={classes.steps}>
                  <DropzoneArea
                    // acceptedFiles={['image/*']}
                    maxFileSize="3145728"
                    dropzoneText={"Drag and drop a file here or click"}
                    onChange={(e) => handleFileUpload(e)}
                  />
                </div>
                }

              </div>
            </form>
            <div className='card-body pt-2'>
              <br />
              <>{
                !selectedItem?.data?.file_type &&
                <>
                  {
                    notes?.length > 0 && <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <label className='form-label' style={{ fontWeight: 'bold' }} >Handing comments</label>
                      </Grid>
                      <Grid item xs={6}>
                        <label className='form-label' style={{ fontWeight: 'bold' }} >Created on</label>
                      </Grid>
                    </Grid>
                  }

                  {
                    notes?.length > 0 ? notes.map((item, key) => (
                      <>

                        <Grid container spacing={2} key={key}>

                          <Grid item xs={6}>
                            <div className="description">
                              {item.notes_id.description}
                            </div>
                          </Grid>
                          <Grid item xs={4}>
                            {moment(item.notes_id.date_created).format('YYYY-MM-DD HH:MM')}
                          </Grid>
                          <Grid item xs={2}>
                            <EditFilled
                              color="primary"
                              className="editBtn"
                              onClick={() => edit(item)}
                            />

                            <DeleteFilled
                              className="deleteBtn"
                              onClick={() => deleteNotes(item.id)}
                            />
                          </Grid>
                        </Grid>
                      </>
                    )) : null
                  }
                </>
              }
                {
                  selectedItem?.data?.file_type &&
                  <>
                    {
                      fileList?.length > 0 && <Grid container spacing={2}>
                        <Grid item xs={7}>
                          <label className='form-label' style={{ fontWeight: 'bold' }} >File name</label>
                        </Grid>
                        <Grid item xs={3}>
                          <label className='form-label' style={{ fontWeight: 'bold' }} >Created on</label>
                        </Grid>
                        <Grid item xs={2}>
                          <label className='form-label' style={{ fontWeight: 'bold' }} ></label>
                        </Grid>
                      </Grid>
                    }
                    {loading && (
                      <LinearProgress
                        size='1rem'
                        className={classes.buttonProgress}
                      />
                    )}
                    {
                      fileList?.length > 0 ? fileList.map((item, key) => (
                        <>

                          <Grid container spacing={2} key={key}>

                            <Grid item xs={7}>
                              <div className="description">
                                {item.title}
                              </div>
                            </Grid>
                            <Grid item xs={3}>
                              {moment(item.uploaded_on).format('YYYY-MM-DD')}
                            </Grid>
                            <Grid item xs={2}>
                              <DownloadOutlined
                                className={[styles.addlead, styles.editBtn].join(' ')}
                                color="primary"
                                onClick={() => download(item.id)}
                              />
                              {
                                <DeleteFilled
                                  className={[styles.addlead, styles.deleteBtn].join(' ')}
                                  onClick={() => deleteFile(item.id)}
                                />
                              }
                            </Grid>
                          </Grid>
                        </>
                      )) : null
                    }
                  </>
                }
              </>
            </div>
          </DialogContentText>
        </DialogContent>
        {
          !selectedItem?.data?.file_type && <DialogActions>
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
              <Button
                variant='contained'
                onClick={() => submit()}
                color='primary'
                // disabled={loading || !enableSubmission}
                className={classes.button}
              >
                {editData?.id ? 'Update' : 'Create'}
                {loading && (
                  <CircularProgress
                    size='1rem'
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            }

          </DialogActions>
        }

      </Dialog>
    </div>
  );
}
