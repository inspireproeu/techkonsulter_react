import React from 'react';
import { Row, Col, Modal } from 'antd';
import styles from './style.less';
import moment from 'moment';
import { useMobile, useMobileSmall } from '@/utils/utils';

export const ViewDetails = (props) => {
  const { data, showModalDialog, handleCancel, columnDefinitions } = props;
  const isMobile = useMobile();
  const style = { 
    background: 'rgba(0, 0, 0, 0.75)', 
    color: '#ffffff', 
    padding: '8px 8px',
    textAlign: 'left',
    borderRadius: 5,
    fontWeight: 700,
  };
  const style1 = { 
    background: 'rgba(39, 105, 85, 1)', 
    color: '#ffffff', 
    padding: '8px 8px',
    textAlign: 'left',
    borderRadius: 5,
    fontWeight: 700,
  };
  const style3 = {
    background: '#ffffff', 
    color: '#000000', 
    padding: '8px 8px',
    textAlign: 'left',
    borderRadius: 5,
    fontWeight: 700,  
  }
  const onToggleViewDialog = async () => {
        handleCancel(false);
    };    
	return (
		<Modal      
        animation="zoom"
        maskAnimation="fade"
        width={640}
        forceRender
        visible={showModalDialog}
        title=""
        size={'large'}
        footer={false}
        destroyOnClose
        bodyStyle={{
            padding: '32px 30px 48px',
        }}
        onOk={() =>onToggleViewDialog()}
        onCancel={() =>onToggleViewDialog()}
      >
        <>
        {
          
          columnDefinitions.map((item, i) => (
            // Object.keys(data).map((key, i) => (
              <Row key={i} gutter={16}>
                    <Col padding={10} className={styles.gutter_row} xl={8} lg={8}	md={8} sm={24} xs={24}>
                        <div style={isMobile ? style3 : style} className={styles.labelitem}>{item.header_name}</div>
                    </Col>
                    <Col className={styles.gutter_row} xl={16} lg={16}	md={16} sm={24} xs={24}>
                        <div style={style1} className={styles.valueitem}>{data[item.field1] ? data[item.field1] : '-'}</div>
                    </Col>
                </Row>
              // ))
          ))
        }
        </>
      </Modal>
	);
};

export default ViewDetails;
