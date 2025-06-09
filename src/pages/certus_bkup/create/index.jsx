import React, { useState, useEffect } from 'react';
import { message, Form, Row, Col } from 'antd';
import styles from '../style.less';
import { Link, connect, FormattedMessage, formatMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { CustomInput } from '@/uikit/Input';
import { TextArea } from '@/uikit/TextArea';
import QueueAnim from 'rc-queue-anim';
import { CustomButton } from '@/uikit/Button';
import { Text } from '@/uikit/Text';
import {
  LeftOutlined
} from '@ant-design/icons';
const FormItem = Form.Item;

const zoomAnmation = {
	appear: true,
	type: [ 'right', 'left' ],
	component: 'div',
	interval: [ 200, 0 ],
	duration: [ 750, 0 ],
	ease: [ 'easeOutCirc', 'easeOutCirc' ],
	animConfig: [ { x: [ 0, 0 ], scale: [ 1, 0 ] }, { x: [ 0, 0 ], scale: [ 0, 1 ] } ]
};

const customerForm = (props) => {
  const [form] = Form.useForm();
  const { dispatch, submitting, customerForm : { customersById }, data, localeLanguage  } = props;
  // const { submitting } = props;
  const { validateFields, getFieldsValue } = form;
  const [formData, setFormData ] = useState();
  const [, setState ] = useState();
  const [pageTitle, setPageTitle ] = useState();
  const [isDisabled, setIsDisabled ] = useState(false);

  const onValidateForm = async () => {
    const values = await validateFields();
    values['status'] = 'active';
    values['name'] = values['first_name'];
    // values['customer_lead'] = 1;
    values['role'] = 4;
    if (dispatch) {
      if (props.match.params.id) {
        dispatch({
          type: 'user/updateCurrent',
          payload: { ...values },
          id: props.match.params.id,
          errorHandler: (e) => {
            message.error(e.data.error.message);
            // dispatch({
            //   type: 'formAndstepFormEdit/setValidationerror',
            //   payload: 'Something Went wrong'
            // });
          }
        });
      } else {
        dispatch({
          type: 'customerForm/submitCustomerForm',
          payload: { ...values },
        });
      }

    }
  };
  useEffect(() => {
		// componentWillMount events
    if (props.match.params.id) {
      let pathname = location.pathname.split("/");
        if(pathname != null){
          setPageTitle(pathname[2]);
          if(pathname[2] === 'view') {
            setIsDisabled(true);
          }
        }
      dispatch({
        type: 'customerForm/fetchCustomersById',
        payload: props.match.params.id
      });
    }    
  }, []);

  useEffect(() => {
		// componentWillMount events
    if (data) {
      setFormData(data)
      setState({})
    }    
  }, [data]);
	// if (!data && pageTitle !== 'create') {
	// 	return null;
	// }
  return (
    <>
      <div className={styles.brandWrapper}>
        <div className={styles.titleSec}>
          <div>
            <div className={styles.createBtn}>
              <Link to="/customer">{<><LeftOutlined style={{paddingRight: 5}} />{localeLanguage.customer_list}</>}</Link>
            </div>
          </div>
        </div>
        <div className={styles.brandSection}>
          <Text style={{ paddingBottom: 20, paddingTop: 15 }} texttype="title" colortype="primary">
            {/* {props.match.params.id ? <FormattedMessage id="customer-form.form.titleview" /> : <><FormattedMessage id="customer-form.form.title" /> <span >{pageTitle}</span></>} */}
            <><span style={{textTransform: 'capitalize'}} >{pageTitle ? localeLanguage.customer_edit : localeLanguage.customer}</span></>
					</Text>
          <Form
            layout="vertical"
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
            form={form}
            name="customerForm"
            initialValues={customersById.data}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            // onValuesChange={onValuesChange}
          >
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"              
            >
              <Row gutter={8} key="1">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="first_name"
                    label={localeLanguage.first_name}
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      }
                    ]}
                    inputprops={{ 
                      disabled: isDisabled ? 'disabled' : '',
                      placeholder: "" 
                    }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="last_name"
                    label={localeLanguage.last_name}
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      }
                    ]}
                    inputprops={{ 
                      placeholder: ""
                    }}
                  />
                </Col>
              </Row>
            </QueueAnim>
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"              
            >
              <Row gutter={8} key="2">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="email"
                    label={localeLanguage.email}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                      {
                        type: 'email',
                        message: `${localeLanguage.invalid_email}`
                      }
                    ]}
                    inputprops={{ 
                      placeholder: ""
                    }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    name="password"
                    // type="borderless"
                    label={localeLanguage.password}
                    className={
                      form.getFieldValue('password') &&
                      form.getFieldValue('password').length > 0 &&
                      styles.password
                    }
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ 
                      type: 'password',
                      placeholder: ""
                  }}
                  />
                </Col>
                
              </Row>
            </QueueAnim>
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"
            >
              <Row gutter={8} key="3">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="phone_number"
                    label={localeLanguage.phone_number}
                    name="phone_number"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="title"
                    label={localeLanguage.title}
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ 
                      placeholder: ""
                    }}
                  />
                </Col>
              </Row>
            </QueueAnim>
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"              
            >
              <Row gutter={8} key="2">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="company_name"
                    label={localeLanguage.company_name}
                    name="company_name"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="org_number"
                    label={localeLanguage.organization_number}
                    name="org_number"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      }
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
              </Row>
            </QueueAnim>
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"
            >
              <Row gutter={8} key="4">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="industry"
                    label={localeLanguage.industry}
                    name="industry"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      }
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="address"
                    label={localeLanguage.address}
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      }
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
              </Row>
            </QueueAnim>
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"
            >
              <Row gutter={8} key="4">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="city"
                    label={localeLanguage.city}
                    name="city"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="country"
                    label={localeLanguage.country}
                    name="country"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
              </Row>
            </QueueAnim>
            <QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"
            >
              <Row gutter={8} key="5">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="postcode"
                    label={localeLanguage.postcode}
                    name="postcode"
                    rules={[
                      {
                        required: true,
                        message: `${localeLanguage.required}`
                      },
                    ]}
                    inputprops={{ placeholder: "" }}
                  />
                </Col>
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <TextArea
                    key="otherinfo"
                    label={localeLanguage.other_info}
                    name="otherinfo"
                    inputprops={{
                      rows: 4,
                      placeholder: ""
                    }}
                  />
                </Col>
              </Row>
            </QueueAnim>
            {
            pageTitle !== 'view' ? 
              <QueueAnim
                {...zoomAnmation}
                forcedReplay
                component="div"
              >
                <Row gutter={8} key="7">
                  <Col style={{ textAlign: 'center' }} span={24} md={{ span: 24 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                    <CustomButton
                      buttontype="type2"
                      //icon={isMobileSmall ? <ArrowLeftOutlined /> : false}
                      htmlType="button"
                      onClick={onValidateForm}
                      size="large"
                    >
                      {localeLanguage?.submit}
                    </CustomButton>
                  </Col>
                </Row>
              </QueueAnim> : null 
            }
          </Form>
        </div>        
      </div>
    </>    
  );
};

export default connect(({ loading, customerForm, language }) => ({
  customerForm,
  submitting: loading.effects['customerForm/submitCustomerForm'],
  data: customerForm.customersById.data,
  localeLanguage: language.localeLanguage

}))(customerForm);
