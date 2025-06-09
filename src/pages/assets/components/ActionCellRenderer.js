// import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  DeleteFilled,
  EditFilled,
  CheckCircleFilled,
  DownloadOutlined,
  CameraOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../style.less';
import { Modal } from 'antd';

const ActionCellRenderer = (props) => {
  // const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEditMode(
      props.api.getEditingCells().length > 0
        ? props.api.getEditingCells()[0].rowIndex === props.rowIndex
        : false
    );
    let hdd = props?.data?.hdd || null;
    let dataDestruction = props.data && props.data.data_destruction ? props.data?.data_destruction.toLowerCase() : '';
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
      rowIndex: props.rowIndex,
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

  const downloadPdf = () => {
    props.downloadPdf(props);
  };

  const showImages = () => {
    props.showImages(props);
  };

  const types = ['COMPUTER', 'MOBILE', 'MOBILE DEVICE']

  return (
    <div className={styles.root}>
      {
        props.userType === 'ADMIN' && <>

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
        </>
      }
      {
        (props?.node?.data?.asset_type && types.includes(props.node.data.asset_type)) && props.node.data.data_destruction && props.node.data.data_destruction.includes("Erased") && <DownloadOutlined
          // icon={faDownload}
          // title='Export'
          className={[styles.addlead, styles.editBtn].join(' ')}
          // onClick={() => handleExport()}
          onClick={() => downloadPdf()}
        />
      }
      {
        props?.node?.data?.total_file_upload &&
        <CameraOutlined
          // icon={faDownload}
          // title='Export'
          className={[styles.addlead, styles.editBtn].join(' ')}
          // onClick={() => handleExport()}
          onClick={() => showImages()}
        />
      }
    </div>
  );
};

export default ActionCellRenderer;
