// import { makeStyles, createStyles } from '@material-ui/core/styles';
import { DeleteFilled, EditFilled, CheckCircleFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const ActionCellRenderer = (props) => {
  // console.log('action cell ', props);
  // const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    let status = props.node.data && props.node.data.status ? props.node.data?.status : '';
    let bg = false
    if (
      status === "draft") {
      bg = true
    }
    setBgColor(bg)
  }, [props]);

  const handleOpen = () => {
    // console.log('handleopen', props.colDef.cellRendererParams);
    Modal.confirm({
      title: 'Delete',
      content: 'are you sure you want to delete this Part number ?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDelete(),
    });
    if (props.colDef.cellRendererParams && props.colDef.cellRendererParams.deleteConfirmation) {
      let proceedWithDeletion = props.colDef.cellRendererParams.deleteConfirmation(
        props.data,
        props.colDef.cellRendererParams.allAssets,
      );
      if (proceedWithDeletion) {
        setOpen(true);
      } else {
        setOpen(false);
      }
      return;
    }

    setOpen(true);
  };

  const handleOpenApprove = () => {
    // console.log('handleopen', props.colDef.cellRendererParams);
    Modal.confirm({
      title: 'Approve',
      content: `are you sure you want to Approve this part number (${props.node.data.part_no}) ?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleApprove(),
    });
    if (props.colDef.cellRendererParams && props.colDef.cellRendererParams.deleteConfirmation) {
      let proceedWithDeletion = props.colDef.cellRendererParams.deleteConfirmation(
        props.data
      );
      if (proceedWithDeletion) {
        setOpen(true);
      } else {
        setOpen(false);
      }
      return;
    }

    setOpen(true);
  };

  const handleDelete = () => {
    props.handleDelete(props);
  };

  const handleApprove = () => {
    props.handleApprove(props);
  };

  const handleEdit = () => {
    props.handleEdit(props);
  };

  return (
    <div className={styles.root}>
      {/* <Link to={`/updateclient/${props.node.data.id}`}> */}
      <EditFilled
        className={[styles.addlead, styles.editBtn, bgColor ? styles.rowBgColor : ''].join(' ')}
        color="primary"
        onClick={() => handleEdit()}
      />

      <DeleteFilled
        className={[styles.addlead, styles.deleteBtn, bgColor ? styles.rowBgColor : ''].join(' ')}
        onClick={() => handleOpen()}
      />
      <CheckCircleFilled
        className={[styles.addlead, styles.btnn, bgColor ? styles.rowBgColor : styles.rowGreenBgColor].join(' ')}
        onClick={() => handleOpenApprove()}
      />
      {/* <Button
        variant='contained'
        color='primary'
      // className={classes.button}
      // onClick={() => {
      //   getNewData(parentGridApi);
      //   parentGridApi.deselectAll();
      //   setSuccess(false);
      //   setOpen(false);
      // }}
      >
        Approve
            </Button> */}
      {/* <Button
        className={[styles.approvebtn].join(' ')}
      >Approve</Button> */}
      {/* <CustomDialog
        open={open}
        title='Delete Asset'
        message={`Are you sure you want to delete ${
          props.colDef.cellRendererParams.colKey
            ? props.node.data[props.colDef.cellRendererParams.colKey]
            : 'this asset'
        }`}
        handleDisagree={() => handleClose()}
        handleAgree={() => handleDelete()}
      /> */}
    </div>
  );
};

export default ActionCellRenderer;
