import React from 'react';
import { Form, Row, Col, Modal, Button, Select } from 'antd';
import { CustomInput } from '@/uikit/Input';
import { CustomSelect } from '@/uikit/Select';
import QueueAnim from 'rc-queue-anim';
const { Option } = Select;

const zoomAnmation = {
  appear: true,
  type: ['right', 'left'],
  component: 'div',
  interval: [200, 0],
  duration: [750, 0],
  ease: ['easeOutCirc', 'easeOutCirc'],
  animConfig: [{ x: [0, 0], scale: [1, 0] }, { x: [0, 0], scale: [0, 1] }]
};
const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { assetStatusNames, modalVisible, onCancel, loading, onSubmit, columnDefinitions } = props;
  // console.log("assetStatusNames", assetStatusNames)
  const handleFinish = (values) => {
    if (onSubmit && (values.project_id && values.project_id.trim() || values.manufacturer || values.model || values.status || values.client || values.storage_license || values.sample_co2 || values.storage_id)) {
      onSubmit(values);
    }
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  // const checkValues = () =>{
  //   console.log("form.getFieldsValue()",form.getFieldsValue())
  //   //if (form.getFieldsValue())
  //   // values.project_id || values.manufacturer || values.model || values.status || values.client || values.storage_license || values.sample_co2 || values.storage_id
  // }
  return (
    <Modal
      destroyOnClose
      animation="zoom"
      maskAnimation="fade"
      width={800}
      forceRender
      size={'large'}
      title="BULK UPDATE"
      visible={modalVisible}
      maskClosable={false}
      onCancel={() => onCancel()}
      footer={[
        <Button key="submit" style={{ background: 'red', borderColor: 'red', color: 'white' }} type="primary" loading={loading} onClick={() => onCancel()}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => handleSubmit()}>
          Submit
        </Button>,
      ]}
    >
      {
        <Form name="assetForm" form={form} onFinish={handleFinish}>
          <Row gutter={16}>
            {
              columnDefinitions && columnDefinitions.map((item, i) => (
                <>
                  {
                    item.bulk_update ?
                      <Col className="gutter-row" span={12}>
                        {
                          item.type === 'text' && <CustomInput
                            key={item.field}
                            label={item.header_name}
                            name={item.field}
                            inputprops={{
                              placeholder: ""
                            }}
                          />
                        }
                        {
                          item.type === 'dropdown' && <CustomSelect
                          key={item.field}
                          label={item.header_name}
                          name={item.field}
                          options={assetStatusNames}
                        />
                        }
                      </Col> : null
                  }
                </>

              ))
            }
          </Row>
          <Row gutter={16}>
            
          </Row>
        </Form>
      }

    </Modal>
  );
};

export default CreateForm;
