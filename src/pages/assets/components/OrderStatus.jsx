import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { getAccessToken } from '@/utils/authority';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Progress, Spin } from 'antd';

import React, { useState, useContext, useEffect } from 'react';

import { DATAURLS } from '../../../utils/constants';
import { fetchGet, fetchPut } from '../../../utils/utils';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
            height: '300px',
            //   display: 'flex',
            //   flexDirection: 'column',
        },
        stepsText: {
            marginTop: '15px',
            // fontFamily: 'Poppins',
            fontSize: '20px',
        },
        successArea: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        stepsTextError: {
            marginTop: '15px',
            // fontFamily: 'Poppins',
            fontSize: '20px',
            color: 'red',
            textAlign: 'center',
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
            // display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            textAlign: 'center'
        },
        inputControl: { fontSize: '1rem' },
    })
);

const AddNew = ({
    open,
    setOpen,
    parentGridApi,
    getNewData
}) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [pageloading, setPageLoading] = useState(false);
    const [ordernumber, setOrdernumber] = useState();
    const [status, setStatus] = useState();

    const [enableSubmission, setEnableSubmission] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [selecetedAssets, setSelecetedAssets] = useState([])
    const allProcess = ["RESERVATION", "SOLD"]
    const [updateRecordsCount, setUpdateRecordsCount] = useState(0);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState('');
    const [isemptyAssets, setisemptyAssets] = useState(false);

    useEffect(() => {
        setOrdernumber();
        setStatus();
        // setUserRole();
        setSuccess(false);
        setError(false);
        setLoading(false);
        setisemptyAssets(false)
    }, [open]);

    const lists = async () => {
        let sold_order_nr = ordernumber.replace(/[^\w\s]/gi, "");

        let fields = `?limit=-1&&fields[]=asset_id&filter={"_and":[{"sold_order_nr":{"_contains":${sold_order_nr}}}]}`
        fetchGet(`${DATAURLS.ASSETS.url}${fields}`, getAccessToken())
            .then((response) => {
                if (response?.data?.length > 0) {
                    response.data.forEach((item) => {
                        item.status = status
                    })
                    setSelecetedAssets(response.data)
                    setEnableSubmission(true);
                    handleSubmit(response.data)
                } else {
                    setisemptyAssets(true);
                }

            })
            .catch((err) => {
                throw err;
            });

    }
    useEffect(() => {
        if (
            status &&
            ordernumber
        ) {
            setEnableSubmission(true);
        }
    }, [status, ordernumber]);


    const handleSubmit = async (values) => {
        setLoading(true);
        setPageLoading(true);
        let updateSuccess = '';

        try {
            for (let i = 0; i <= values.length; i++) {
                if (values[i] && values[i].asset_id) {
                    setUpdateRecordsCount(i + 1);
                    // console.log("values", values.length)
                    if (updateRecordsCount === values.length) {
                        break
                    }
                    updateSuccess = await fetchPut(
                        `${DATAURLS.ASSETS.url}/${values[i].asset_id}`,
                        values[i],
                        getAccessToken()
                    )
                    // result = await directUSAPICall().items('aggrement').updateOne([values[i].id], values[i]);
                }
            }
            setPageLoading(false);
            setLoading(false);
            setUpdateRecordsCount(0)
            if (updateSuccess?.data?.asset_id) {
                setSelecetedAssets([])
                setSuccess(true);
                setUpdateRecordsCount(0)
            } else {
                // summaryOffset = 0;
                setUpdateRecordsCount(0)
                setError(true);
                setLoading(false);
                setPageLoading(false);
                setFileUploadErrorMessage('Order Number successfully updated');
            }
        } catch (err) {
            console.log('update error', err);
            setLoading(false);
            setError(false);
            setPageLoading(false);
            setFileUploadErrorMessage('Failed to update');
            throw err;
        }
        setLoading(true);

    };

    return (
        <Dialog
            open={open}
            //   onClose={getNewData(p)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth='md'
            className='dialogRoot'
            classes={{ paper: classes.dialogRoot }}
        >
            <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
                <div className={classes.dialogTitleText}>{'Update Order Status'}</div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={classes.successArea}>
                    {isemptyAssets && (
                        <div>
                            <div className={classes.stepsText}>
                                Given order number doesn't have assets. Please try again.
                </div>
                        </div>
                    )}
                    {pageloading && !success && (
                        <div>
                            <div className={classes.stepsText}>
                                {selecetedAssets.length} records with a matching Asset ID
                </div>
                        </div>
                    )}
                    {pageloading && updateRecordsCount > 0 && <div className={classes.recordsCount}>{updateRecordsCount} of {selecetedAssets.length} records completed.</div>}
                    {pageloading && <Spin color='#004750' size={50} />}
                    {pageloading && <Progress type="circle" style={{ paddingTop: '30px', margin: '0 auto' }} strokeColor={{ '0%': '#f80059', '100%': '#87d068', }} percent={Math.round((updateRecordsCount * 100) / selecetedAssets.length)} />}
                    {!pageloading && success && (
                        <div>
                            <div className={classes.stepsText}>Update Successful</div>
                        </div>
                    )}
                    {!pageloading && error && (
                        <div>
                            <div className={classes.stepsTextError}>
                                {fileUploadErrorMessage}
                            </div>
                        </div>
                    )}
                </div>
                {!isemptyAssets && !pageloading && !success && !error && (
                    <div className={classes.inputGroup}>
                        <FormControl className={classes.formControl}>
                            <TextField
                                inputProps={{ className: classes.inputControl }}
                                value={ordernumber}
                                onChange={(event) => setOrdernumber(event.target.value)}
                                variant='outlined'
                                required
                                fullWidth
                                id='info'
                                label='Order Number'
                                autoFocus
                            />
                        </FormControl>
                        <FormControl
                            variant='outlined'
                            required
                            className={classes.formControl}
                        >
                            <InputLabel id='demo-simple-select-outlined-label'>
                                Status
          </InputLabel>
                            <Select
                                labelId='demo-simple-select-outlined-label'
                                id='demo-simple-select-outlined'
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                label='Process'
                                variant='outlined'
                            >
                                {allProcess.map((item) => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                )}
                {/* {success && !error && <div>Instruction {`${editData?.id ? 'updation' : 'creation'}`} successful</div>} */}
                {/* {!success && error && <div>{errorMessage}</div>} */}
            </DialogContent>
            <DialogActions>
                {success && (
                    <div className={classes.buttonContainer}>
                        <Button
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            onClick={() => {
                                getNewData(parentGridApi);
                                parentGridApi.deselectAll();
                                setSelecetedAssets([])
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
                            variant='contained'
                            onClick={() => setOpen(false)}
                            color='secondary'
                            disabled={loading}
                            className={classes.button}
                        >
                            Cancel
            </Button>
                        {
                            !isemptyAssets &&
                            <Button
                                variant='contained'
                                onClick={() => lists()}
                                color='primary'
                                disabled={!enableSubmission}
                                className={classes.button}
                            >
                                Submit
              {loading && (
                                    <CircularProgress
                                        size='1rem'
                                        className={classes.buttonProgress}
                                    />
                                )}
                            </Button>
                        }
                    </div>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddNew;
