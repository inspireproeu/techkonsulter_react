// import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  SearchOutlined,
  OrderedListOutlined,
  EditFilled,
  DownOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../style.less';
import { message, Col, Modal, Upload, Button, Icon, Spin } from 'antd';

// import CustomDialog from './CustomDialog';

// const useStyles = makeStyles((theme) =>
//   createStyles({
//     root: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100% !important',
//       width: '100%',
//       color: 'red',
//     },
//     icon: {
//       height: '15px',
//     },
//     // editIcon: {
//     //   color: theme.primary,
//     // },
//     deleteIcon: {
//       color: 'red',
//       height: '20px',
//     },
//   })
// );
const ActionCellRenderer = (props) => {
  // console.log('action cell ', props);
  // const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEditMode(
      props.api.getEditingCells().length > 0
        ? props.api.getEditingCells()[0].rowIndex === props.node.rowIndex
        : false
    );
    let hdd = props.node.data.hdd;
    let dataDestruction = props.node.data && props.node.data.data_destruction ? props.node.data?.data_destruction.toLowerCase() : '';
    let bg = false
    if (
      dataDestruction === "erasure in progress"
      || dataDestruction === "not erased/not erased/not erased"
      || dataDestruction === "not erased/not erased"
      || dataDestruction.includes("erased with warnings (failed to identify")
      || dataDestruction.includes("erased with warnings (reallocated sectors not erased")
      || dataDestruction.includes("not erased (")
      && hdd) {
      bg = true
    }
    setBgColor(bg)
  }, [props]);

  const handleEdit = () => {
    setEditMode(true);
    props.api.startEditingCell({
      rowIndex: props.node.rowIndex,
      colKey: props.colDef.cellRendererParams.colKey
        ? props.colDef.cellRendererParams.colKey
        : 'quantity',
    });
  };

  const handleDone = () => {
    setEditMode(false);
    props.api.stopEditing();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    // console.log('handleopen', props.colDef.cellRendererParams);
    Modal.confirm({
      title: 'Delete',
      content: 'are you sure you want to delete this asset ?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDelete(),
    });
    if (
      props.colDef.cellRendererParams &&
      props.colDef.cellRendererParams.deleteConfirmation
    ) {
      let proceedWithDeletion = props.colDef.cellRendererParams.deleteConfirmation(
        props.data,
        props.colDef.cellRendererParams.allAssets
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

  return (
    <div className={styles.root}>
      {!editMode && (
        <EditFilled
          className={[styles.addlead, styles.editBtn].join(' ')}
          color='primary'
          onClick={() => handleEdit()}
        />
      )}
      {editMode && (
        <CheckCircleFilled
        className={[styles.addlead, styles.editBtn].join(' ')}
        color='primary'
          onClick={() => handleDone()}
        />
      )}
      <DeleteFilled className={[styles.addlead, styles.deleteBtn, bgColor ? styles.rowBgColor : ''].join(' ')} onClick={() => handleOpen()} />

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
