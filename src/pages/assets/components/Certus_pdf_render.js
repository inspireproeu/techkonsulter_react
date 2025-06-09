
import React from 'react';
import styles from '../style.less';
import { Link } from 'umi';

const PdfCellRenderer = (props) => {
  // const classes = useStyles();


  const downloadPdf = () => {
    props.downloadPdf(props);
  };
  const types = ['COMPUTER', 'MOBILE', 'MOBILE DEVICE']
  return (
    <div className={styles.root}>
      {
        (props?.node?.data?.asset_type && types.includes(props.node.data.asset_type) && props?.node?.data?.data_destruction && props.node?.data?.data_destruction.includes("Erased")) ? <Link to="#" onClick={() => downloadPdf()}><span>{props.node.data.data_destruction}</span></Link> : props?.node?.data?.data_destruction || null
      }
    </div>
  );
};

export default PdfCellRenderer;
