import React, { useState, useEffect } from 'react';
import styles from '../style.less';

const MatchCellRenderer = (props) => {
  const [bgColor, setBgColor] = useState(false);

  useEffect(() => {
    if (props.node.data.match) {
      setBgColor(true)
    }
  }, [props]);

  return (
    <div className={styles.root}>
      <span className={[bgColor ? 'greencolor' : ''].join(' ')}>
        {props.value}
      </span>
    </div>
  );
};

export default MatchCellRenderer;
