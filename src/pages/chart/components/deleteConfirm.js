
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({
  open,
  setOpen,
  title,
  content,
  tableName,
  deleteId,
  setIsDeleted,
  parentGridApi,
  location,
  loggeduser,
  urlParams
}) {
  //   const [open, setOpen] = React.useState(false);

  function handleClose() {
    setOpen(false);
  }

  async function handleDelete() {
    // if (tableName === 'Asset' || tableName === 'aggrement') {
    //   let ids = (deleteId.map((item) => item.id))
    //   deleteData(tableName, ids)
    //     .then((data) => {
    //       setTimeout(() => {
    //         let agreementIds = []
    //         if (tableName === 'Asset') {
    //           agreementIds = (deleteId.map((item) => item.aggrement.id));
    //         } else {
    //           agreementIds = (deleteId.map((item) => item.id))
    //         }
    //         let result = groupByAgreement(agreementIds.toString())
    //         setIsDeleted(urlParams, location, loggeduser)
    //         setOpen(false);
    //       }, 0)

    //       // setLoading(false)
    //       // setOpen(true)
    //       // setSuccessMsg("Partner created Successfully.")
    //     })
    //     .catch(() => {
    //       // setErrorMsg("Failed to create.")
    //       // setLoading(false)
    //       // setSubmitting(false)
    //       // setStatus('Registration process has broken')
    //     })
    // } else {
    //   deleteData(tableName, deleteId)
    //     .then(() => {
    //       // console.log("dataaa", data)
    //       setTimeout(() => {
    //         setIsDeleted(urlParams, location, loggeduser)
    //         setOpen(false);

    //       }, 0)
    //       // setLoading(false)
    //       // setOpen(true)
    //       // setSuccessMsg("Partner created Successfully.")
    //     })
    //     .catch(() => {
    //       // setErrorMsg("Failed to create.")
    //       // setLoading(false)
    //       // setSubmitting(false)
    //       // setStatus('Registration process has broken')
    //     })
    // }

    // setOpen(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
