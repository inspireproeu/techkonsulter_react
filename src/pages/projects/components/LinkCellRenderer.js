import React from 'react';
import styles from '../../assets/style.less';
import { Link } from 'react-router-dom';

const ActionCellRenderer = (props) => {
  return (
    <div className={styles.root}>
      <Link className="linkbtn" target="_blank" to={`/${props.urlpage}/${props.node.data.id}`}>
        {props.node.data.id}
      </Link>
    </div>
  );
};

export default ActionCellRenderer;
