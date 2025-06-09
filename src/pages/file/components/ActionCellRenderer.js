// import { makeStyles, createStyles } from '@material-ui/core/styles';
import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';
import styles from '../../assets/style.less';
import { getAccessToken } from '@/utils/authority';
import { Link } from 'react-router-dom';

const ActionCellRenderer = (props) => {
  const download = () => {
    window.location.href = `https://productionapi.techkonsult.se/assets/${props.node.data.id}?download=&access_token=${getAccessToken()}`
  }
  return (
    <div className={styles.root}>
      <DownloadOutlined
        className={[styles.addlead, styles.editBtn].join(' ')}
        color="primary"
        onClick={() => download()}
      />
    </div>
  );
};

export default ActionCellRenderer;
