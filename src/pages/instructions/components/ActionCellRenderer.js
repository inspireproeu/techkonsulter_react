// import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  DeleteFilled,
  EditFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Modal } from 'antd';


const ActionCellRenderer = (props) => {
  // console.log('action cell ', props, props.api.getEditingCells());
  // const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEditMode(
      props.api.getEditingCells().length > 0
        ? props.api.getEditingCells()[0].rowIndex === props.node.rowIndex
        : false
    );
  }, [props]);

  const handleEdit = () => {
    setEditMode(true);
    props.gotoEdit(props);

    // props.api.startEditingCell({
    //   rowIndex: props.node.rowIndex,
    //   colKey: props.colDef.cellRendererParams.colKey
    //     ? props.colDef.cellRendererParams.colKey
    //     : 'quantity',
    // });
  };

  const handleDone = () => {
    setEditMode(false);
    props.api.stopEditing();
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const editAndDelete = () => {
  //     Modal.confirm({
  //       title: 'Delete',
  //       content: 'are you sure you want to delete this asset ?',
  //       okText: 'Yes',
  //       cancelText: 'No',
  //       onOk: () => handleDelete(),
  //     });
  // };

  const handleOpen = () => {
    // console.log('handleopen', props.colDef.cellRendererParams);
    Modal.confirm({
      title: 'Delete',
      content: 'are you sure you want to delete this Instructions ?',
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
      <DeleteFilled className={[styles.addlead, styles.deleteBtn].join(' ')} onClick={() => handleOpen()} />

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
