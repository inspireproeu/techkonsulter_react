// import { makeStyles, createStyles } from '@material-ui/core/styles';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'umi';

const ActionCellRenderer = (props) => {
  // console.log('action cell ', props);
  // const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser } = props;

  useEffect(() => {
    setEditMode(
      props.api.getEditingCells().length > 0
        ? props.api.getEditingCells()[0].rowIndex === props.node.rowIndex
        : false,
    );
  }, [props]);

  const handleOpen = () => {
    // console.log('handleopen', props.colDef.cellRendererParams);
    Modal.confirm({
      title: 'Delete',
      content: 'are you sure you want to delete this project ?',
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
      {
        ((currentUser.userType === 'ADMIN' || currentUser.userType === 'ASSOCIATE') || ((currentUser.userType !== 'ADMIN' || currentUser.userType !== 'ASSOCIATE') && currentUser?.id === props.node.data.user_created)) &&
        <>
          {/* <EditFilled
            className={[styles.addlead, styles.editBtn].join(' ')}
            color="primary"
            onClick={() => handleEdit()}
          /> */}
          <DeleteFilled
            className={[styles.addlead, styles.deleteBtn].join(' ')}
            onClick={() => handleOpen()}
          />

        </>
      }
    </div>
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user.currentUser,
}))(ActionCellRenderer);