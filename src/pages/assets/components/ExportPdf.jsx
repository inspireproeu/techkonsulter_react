import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';

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
            marginTop: '20px',
            width: '60% !important',
            height: '800px !important',
            // minHeight: '70vh',
            // minHeight: '60vh',
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
    setpdfdata,
    assetpdfData
}) => {
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            //   onClose={getNewData(p)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth='lg'
            className='dialogRoot'
            classes={{ paper: classes.dialogRoot }}
        >
            <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
                <div className={classes.dialogTitleText}>{'Export pdf'}</div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        height: '750px',
                    }}
                >
                    {/* <Viewer fileUrl={url} /> */}
                    {assetpdfData && <embed download src={`data:application/pdf;base64,${assetpdfData}`} type="application/pdf" width="600" height="900" />}
                </div>

            </DialogContent>
            <DialogActions>

                <div className={classes.buttonContainer}>
                    <Button
                        variant='contained'
                        onClick={() => { setOpen(false); setpdfdata(null); }}
                        color='secondary'
                        // disabled={loading}
                        className={classes.button}
                    >
                        Close
            </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default Export;
