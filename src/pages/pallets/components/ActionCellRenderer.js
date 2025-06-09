// import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  DeleteFilled,
  EditFilled,
  CheckCircleFilled,
  OrderedListOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../style.less';
import { Tooltip, Col, Modal, Upload, Button, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom';

const ActionCellRenderer = (props) => {
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
      {(!editMode && !props.colDef.title) && (
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
      <DeleteFilled className={[styles.addlead, styles.deleteBtn, bgColor ? styles.rowBgColor1 : ''].join(' ')} onClick={() => handleOpen()} />
      {
        <Link style={{ color: "#e3e3e3" }} target="_blank" to={`/palletsassets/${props.node.data.pallet_number}`}><Tooltip placement="topLeft" title="List">
          <OrderedListOutlined
          className={[styles.addlead, styles.editBtn].join(' ')}
          />
        </Tooltip>
        </Link>
      }
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
