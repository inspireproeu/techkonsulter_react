// import { makeStyles, createStyles } from '@material-ui/core/styles';
import { DeleteFilled, EditFilled, CheckCircleFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';

const ActionCellRenderer = (props) => {
  // console.log('action cell ', props);
  // const classes = useStyles();
  const [open, setOpen] = useState(false);



  const handleOpen = () => {
    // console.log('handleopen', props.colDef.cellRendererParams);
    Modal.confirm({
      title: 'Delete',
      content: 'are you sure you want to delete this Client ?',
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
  const handleDelete = () => {
    props.handleDelete(props);
  };

  return (
    <div className={styles.root}>
      <Link target="_blank" to={`/updateclient/${props.node.data.id}`}>
        <EditFilled
          className={[styles.addlead, styles.editBtn].join(' ')}
          color="primary"
        // onClick={() => handleEdit()}
        />
      </Link>

      <DeleteFilled
        className={[styles.addlead, styles.deleteBtn].join(' ')}
        onClick={() => handleOpen()}
      />
      {
        <><Link target="_self" className={styles.addUserBtn} to={`/clientusersList/${props.node.data.id}`}>
          Users List
      </Link> &nbsp; | &nbsp;</>
      }


      <Link target="_self" className={styles.addUserBtn} to={`/clientsubaddress/${props.node.data.id}`}>
        Sub Address List
      </Link>
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
