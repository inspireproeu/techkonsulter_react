import React from 'react';
import { Row, Col, Button, Badge } from 'antd';
import styles from '../style.less';
import { useMobile, useMobileSmall } from '@/utils/utils';
import {
  DownloadOutlined,
  LeftOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Link, FormattedMessage } from 'umi';

export const CustomerDetails = (props) => {
  const { localeLanguage, addSales, customerData, onClick, reportDownload, enableBack, path, title, form, page } = props;
	const isMobile = useMobile();
  const isMobileSmall = useMobileSmall();
  const style = { 
    background: 'rgba(0, 0, 0, 0.75)', 
    color: '#ffffff', 
    padding: '8px 0',
    textAlign: 'center',
    borderRadius: 5,
    fontWeight: 700
  };
  const style1 = { 
    background: '#004750ad', 
    color: '#ffffff', 
    padding: '8px 0',
    textAlign: 'center',
    borderRadius: 5,
    fontWeight: 700,
  };
  const style3 = {
    paddingBottom: 10
  }
  const style4 = {
    textTransform: 'capitalize'
  }
	return (
		<>
      {
        isMobile ? <>
            {
            page === 'customerDashboard' && <Row gutter={16} style={style3}>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={8}>
                <div style={style}>{localeLanguage?.title}</div>
            </Col>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={16}>
                <div style={style1}>{customerData?.title && <><span style={style4} className={styles.values}>{customerData?.title}</span></>}</div>
            </Col>
          </Row>
          }
          {
            !page && <Row gutter={16} style={style3}>
            <Col className="gutter-row" xl={8} lg={8}	md={12} sm={12} xs={8}>
                <div style={style}>{localeLanguage?.company_name}</div>
            </Col>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={16}>
                <div style={style1} >{customerData?.company_name && <><span style={style4} className={[styles.values, styles.textOverflow].join('')}>{customerData?.company_name}</span></>}</div>
            </Col>
          </Row>
          }
          <Row gutter={16} style={style3}>
            <Col className="gutter-row" xl={8} lg={8}	md={12} sm={12} xs={8}>
                <div style={style}>{localeLanguage?.industry}</div>
            </Col>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={16}>
                <div style={style1}>{customerData?.industry && <><span style={style4} className={styles.values}>{customerData?.industry}</span></>}</div>
            </Col>
          </Row>
          {
            !page && <Row gutter={16} style={style3}>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={8}>
                <div style={style}>{localeLanguage?.city}</div>
            </Col>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={16}>
                <div style={style1}>{customerData?.city && <><span style={style4} className={styles.values}>{customerData?.city}</span></>}</div>
            </Col>
          </Row>
          }
          {
            page === 'customerDashboard' && <Row gutter={16} style={style3}>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={8}>
                <div style={style}>{localeLanguage?.no_of_leads}</div>
            </Col>
            <Col className="gutter-row"  xl={8} lg={8}	md={12} sm={12} xs={16}>
                <div style={style1}>{customerData?.no_of_leads && <><span style={style4} className={styles.values}>{customerData?.no_of_leads}</span></>}</div>
            </Col>
          </Row>
        }
          <Row gutter={16} style={style3}>
            {
            reportDownload && <Col style={{paddingTop: 8}}  className="gutter-row" span={24}>
            <div style={{textAlign: 'right'}}>
              <span style={{fontSize: 16}}>{localeLanguage?.last_month_report}</span>
                <Badge size="large" count={localeLanguage?.new}>
                <Button
                type="primary"
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                style={{ marginLeft: 10,background: '#000000', borderColor: '#000000' }}
                className={styles.buttons}
                size="small"
                shape="square"
                icon={<DownloadOutlined />}
                >
                <span>{<FormattedMessage id="customer-form.form.report" />} </span>
                </Button>
              </Badge>                    
            </div>
            </Col>
            }
            { 
            enableBack &&
            <Col className="gutter-row" span={24}>
            <div className={styles.createBtn}>
                <Link to={customerData && path !== 'customer' ? `/${path}/${customerData.id }` : '/customer'}>{<><LeftOutlined style={{paddingRight: 5}} /><FormattedMessage id={`${form + '-form.form.' + title}`} /></>}</Link>
            </div>
            </Col>
            }
            {
              reportDownload &&
              <Col className="gutter-row" style={{paddingTop: 10}} span={24}>
                <div style={{textAlign: 'right'}}>
                  <Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        addSales();
                    }}
                    style={{ marginLeft: 10,background: '#000000', borderColor: '#000000' }}
                    className={styles.buttons}
                    size="small"
                    shape="square"
                    icon={<PlusOutlined />}
                    >
                    <span>{localeLanguage?.add_sales_rep_title}</span>
                  </Button>
                </div>
              </Col>
            }
            </Row>
        </> : <>
          <Row gutter={16}>
            {
              page === 'customerDashboard' && <Col className="gutter-row" span={6}>
                <div style={style}>{localeLanguage?.title}</div>
              </Col>
            }
            {
              !page && <Col className="gutter-row" span={6}>
                <div style={style}>{localeLanguage?.company_name}</div>
              </Col>
            }
            <Col className="gutter-row" span={6}>
              <div style={style}>{localeLanguage?.industry}</div>
            </Col>
            {
              !page && <Col className="gutter-row" span={6}>
                <div style={style}>{localeLanguage?.city}</div>
              </Col>
            }
            {
              page === 'customerDashboard' && <Col className="gutter-row" span={6}>
                <div style={style}>{localeLanguage?.no_of_leads}</div>
              </Col>
            }
            {
              reportDownload &&
              <Col className="gutter-row" span={6}>
                <div style={{textAlign: 'right'}}>
                  <Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        addSales();
                    }}
                    style={{ marginLeft: 10,background: '#000000', borderColor: '#000000' }}
                    className={styles.buttons}
                    size="small"
                    shape="square"
                    icon={<PlusOutlined />}
                    >
                    <span>{localeLanguage?.add_sales_rep_title}</span>
                  </Button>
                </div>
              </Col>
            }
          </Row>
          <Row gutter={16} style={{paddingTop: 6, paddingBottom: 6}}>
            {
              page === 'customerDashboard' && <Col className="gutter-row" span={6}>
                <div style={style1}>{customerData?.title && <><span style={style4} className={styles.values}>{customerData?.title}</span></>}</div>
              </Col>
            }
            {
              !page && <Col className="gutter-row" span={6}>
                <div style={style1}>{customerData?.company_name && <><span style={style4} className={styles.values}>{customerData?.company_name}</span></>}</div>
              </Col>
            }                
            <Col className="gutter-row" span={6}>
              <div style={style1}>{customerData?.industry && <><span style={style4} className={styles.values}>{customerData?.industry}</span></>}</div>
            </Col>
            {
              !page && <Col className="gutter-row" span={6}>
              <div style={style1}>{customerData?.city && <><span style={style4} className={styles.values}>{customerData?.city}</span></>}</div>
            </Col>
            }                
            {
              page === 'customerDashboard' && <Col className="gutter-row" span={6}>
              <div style={style1}>{customerData?.no_of_leads && <><span style={style4} className={styles.values}>{customerData?.no_of_leads}</span></>}</div>
            </Col>
            }
            {
            reportDownload && <Col className="gutter-row" span={6}>
            <div style={{textAlign: 'right'}}>
                <span style={{fontSize: 16}}>{localeLanguage?.last_month_report}</span>
                <Badge size="large" count={localeLanguage?.new}>
                  <Button
                  type="primary"
                  onClick={(e) => {
                      e.preventDefault();
                      onClick();
                  }}
                  style={{ marginLeft: 10,background: '#000000', borderColor: '#000000' }}
                  size="small"
                  shape="square"
                  className={styles.buttons}
                  icon={<DownloadOutlined />}
                  >
                  <span>{localeLanguage?.report} </span>
                  </Button>
              </Badge>
                
            </div>
            </Col>
            }
            { 
            enableBack &&
            (<Col className="gutter-row" span={6}>
            <div className={styles.createBtn}>
                <Link to={customerData && path !== 'customer' ? `/${path}/${customerData.id }` : '/customer'}>{<><LeftOutlined style={{paddingRight: 5}} />{localeLanguage.customer_list}</>}</Link>
            </div>
            </Col>)
            }   
        </Row>
        </>
        }
    </>
	);
};

export default CustomerDetails;
