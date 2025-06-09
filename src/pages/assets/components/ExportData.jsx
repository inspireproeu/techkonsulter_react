import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

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
            fontSize: '14px',
            color: '#5d799c'
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
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        inputControl: { fontSize: '1rem' },
    })
);

const Export = ({
    open,
    setOpen,
    lists,
    parentGridApi,
    totalRows,
    tempFieldsList,
    isDownloaded,
    datasource
}) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(-1);

    useEffect(() => {
        setLimit();
    }, [open]);
    useEffect(() => {
        setLimit();
        setLoading(false);
        setOpen(false);
    }, [isDownloaded]);

    const handleSubmit = async () => {
        setLoading(true);
        lists(datasource, parentGridApi, false, true, limit ? limit : -1, tempFieldsList, '', false, 1)

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
                <div className={classes.dialogTitleText}>{'Export data'}</div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={classes.successArea}>
                    <div>

                        <p className={classes.stepsText}>Exporting {totalRows} items within Assets.</p>
                        {
                            totalRows > 15000 ? <p className={classes.stepsText}>Due to the large number of items this takes few minutes.</p> : null
                        }
                        <p className={classes.stepsText}>This export will be processed, and once completed, the excel file will be downloaded.</p>
                    </div>
                    {loading && <Spin color='#004750' size={50} />}

                </div>
                {/* <div className={classes.inputGroup}>
                    <FormControl className={classes.formControl}>
                        <TextField
                            inputProps={{ className: classes.inputControl }}
                            value={limit}
                            onChange={(event) => setLimit(event.target.value)}
                            variant='outlined'
                            placeholder='Unlimited'
                            required
                            fullWidth
                            id='info'
                            label='Limit'
                            autoFocus
                        />
                    </FormControl>

                </div> */}
            </DialogContent>
            <DialogActions>

                <div className={classes.buttonContainer}>
                    <Button
                        variant='contained'
                        onClick={() => setOpen(false)}
                        color='secondary'
                        // disabled={loading}
                        className={classes.button}
                    >
                        Cancel
            </Button>
                    <Button
                        variant='contained'
                        onClick={() => handleSubmit()}
                        color='primary'
                        className={classes.button}
                    >
                        Export Data
              {loading && (
                            <CircularProgress
                                size='1rem'
                                className={classes.buttonProgress}
                            />
                        )}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default Export;
