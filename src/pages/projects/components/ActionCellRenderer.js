// import { makeStyles, createStyles } from '@material-ui/core/styles';
import { DeleteFilled, EditFilled, CommentOutlined, FileAddOutlined, ProjectOutlined, CameraOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'umi';
import { useHistory, useLocation } from 'react-router-dom'

const ActionCellRenderer = (props) => {
  // console.log('action cell ', props);
  // const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser } = props;
  const history = useHistory()

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

  const handleNotestOpen = (type = null) => {
    let tempProps = props;
    tempProps.data.file_type = type
    props.handleNotestOpen(tempProps);
  };


  const handleFilePrintProdReport = (type) => {
    props.handleFilePrintProdReport(props, type);
  };

  const showImages = () => {
    props.showImages(props);
  };

  return (
    <div className={styles.root}>
      {
        ((currentUser.userType === 'ADMIN' || currentUser.userType === 'ASSOCIATE') || ((currentUser.userType !== 'ADMIN' || currentUser.userType !== 'ASSOCIATE') && currentUser?.id === props.node.data.user_created)) &&
        <> <Link target="_self" to={`/updateproject/${props.node.data.id}`}>
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

        </>
      }

      {(currentUser.userType === 'ADMIN' || currentUser.userType === 'ASSOCIATE') && <>
        <CommentOutlined
          style={{ marginLeft: '10px' }}
          className={[styles.addlead, styles.cmtBtn, `${props.node.data?.handling_comments?.length > 0 ? styles.deleteBtn : ''}`].join(' ')}
          onClick={() => handleNotestOpen('')}
        />
        {/* <FileAddOutlined
          style={{ marginLeft: '10px' }}
          className={[styles.addlead, styles.cmtBtn].join(' ')}
          onClick={() => handleFileExportOpen(props.node)}
        /> */}
        {
          props.userRole !== 'Associate' &&
          <Link className={[styles.addlead, styles.cmtBtn].join(' ')} to="#"
            onClick={() => {
              history.push(`/project-cost/${props.node.data.id}`)
            }}>
            <ProjectOutlined
              style={{ marginLeft: '10px' }}
              className={[styles.addlead, styles.cmtBtn].join(' ')}
            // onClick={() => handleFileExportOpen(props.node)}
            />
          </Link>
        }
      </>
      }
      {
        currentUser.userType == 'FINANCIAL' &&
        <Link className={[styles.addlead, styles.cmtBtn].join(' ')} to="#"
          onClick={() => {
            history.push(`/project-cost/${props.node.data.id}`)
          }}>
          <ProjectOutlined
            style={{ marginLeft: '10px' }}
            className={[styles.addlead, styles.cmtBtn].join(' ')}
          // onClick={() => handleFileExportOpen(props.node)}
          />
        </Link>
      }
      {
        (props.userRole !== 'Associate' && currentUser.userType !== 'FINANCIAL') && <>
          {(props.node.data.project_status !== 'ORDER') && <>
            <Link style={{ marginLeft: '10px' }} to="#" onClick={() => handleFilePrintProdReport('P')}>
              <span className="fw-bolder">P</span>
            </Link>
            <Link style={{ marginLeft: '10px', color: 'green' }} to="#" onClick={() => handleFilePrintProdReport('PE')}>
              <span className="fw-bolder">PE</span>
            </Link>
          </>
          }
          {
            ((currentUser.userType === 'ADMIN' || currentUser.userType === 'ASSOCIATE') && (props.node.data.project_type !== 'PURCHASE')) && <Link style={{ marginLeft: '10px', color: 'green' }} to="#" onClick={() => handleFilePrintProdReport('F')}>
              <span className="fw-bolder">F</span>
            </Link>
          }
          {
            ((currentUser.userType === 'ADMIN') && (props.node.data.project_type !== 'PURCHASE')) && <Link style={{ marginLeft: '10px', color: 'green' }} to="#" onClick={() => handleFilePrintProdReport('FT')}>
              <span className="fw-bolder">FT</span>
            </Link>
          }
          {
            (props.node.data.project_status === 'PROCESSING FINISHED' || props.node.data.project_status === 'REPORTING' || props.node.data.project_status === 'CLOSED') &&
            < Link style={{ marginLeft: '10px', color: 'green' }} to="#" onClick={() => handleFilePrintProdReport('E')}>
              <span className="fw-bolder">E</span>
            </Link>
          }
        </>
      }
      {
        currentUser.userType !== 'FINANCIAL' &&
        <FileAddOutlined
          style={{ marginLeft: '10px' }}
          className={[styles.addlead, styles.cmtBtn].join(' ')}
          onClick={() => handleNotestOpen('file_upload')}
        />
      }
      {
        props?.node?.data?.total_images &&
        <CameraOutlined
          // icon={faDownload}
          // title='Export'
          className={[styles.addlead, styles.editBtn].join(' ')}
          // onClick={() => handleExport()}
          onClick={() => showImages()}
        />
      }
    </div >
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user.currentUser,
}))(ActionCellRenderer);