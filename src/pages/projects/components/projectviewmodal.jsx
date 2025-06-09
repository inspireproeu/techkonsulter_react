
import React, { useRef, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CreateForm from '../components/CreateForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) =>
    createStyles({
        dialogRoot: {
            width: '600px',
            height: '450px',
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
        actionIcon: {
            fontSize: '1.25rem',
            cursor: 'pointer',
        },
    })
);

export default function AssetDialog({
    open,
    setOpen,
    setLoading,
    fieldDisable,
    assetId,
    title,
    setSelectedAsset,
    setShowAssetCreate,
    handleAssetsList,
    userPermission,
    page
}) {
    const classes = useStyles();

    // const [isloading, setIsloading] = useState(true)
    useEffect(() => {
        setLoading(false)
    }, [])

    const handleClose = () => {
        console.log("closeee")
        setSelectedAsset('')
        setOpen(false);
        setLoading(false)
    }


    return (
        <React.Fragment>
            {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open max-width dialog
      </Button> */}
            <Dialog
                fullWidth={'xl'}
                // maxWidth={maxWidth}
                // TransitionComponent={Transition}
                open={open}
                disableBackdropClick
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                maxWidth='xl'
            >
                <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
                    <div className={classes.dialogTitleText}>
                        <div>{title}</div>
                    </div>
                    {/* <i className="fas fa-times" {...props} ref={ref} /> */}
                    <Cancel
                        className={classes.actionIcon}
                        onClick={() => {
                            setSelectedAsset('')
                            setOpen(false)
                        }}
                    />
                </DialogTitle>
                <DialogContent>
                    <CreateForm currentpage={page} userPermission={userPermission} searchAssetId={assetId} page={'searchmodal'} fieldDisable={fieldDisable} setShowAssetCreate={setShowAssetCreate} handleAssetsList={handleAssetsList} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="contained">
                        Close
          </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
