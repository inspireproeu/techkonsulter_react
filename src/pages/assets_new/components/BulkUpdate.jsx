import React from 'react';
import { Form, Row, Col, Modal, Button } from 'antd';
import { CustomInput } from '@/uikit/Input';
import QueueAnim from 'rc-queue-anim';
const zoomAnmation = {
  appear: true,
  type: [ 'right', 'left' ],
  component: 'div',
  interval: [ 200, 0 ],
  duration: [ 750, 0 ],
  ease: [ 'easeOutCirc', 'easeOutCirc' ],
  animConfig: [ { x: [ 0, 0 ], scale: [ 1, 0 ] }, { x: [ 0, 0 ], scale: [ 0, 1 ] } ]
};
const CreateForm = (props) => {
  const [form] = Form.useForm();

  const { modalVisible, onCancel, loading, onSubmit } = props;

  const handleFinish = (values) => {
    // console.log("valuessss", values)
		if (onSubmit) {
		onSubmit(values);
		}
	};

  const handleSubmit = () => {
		if (!form) return;
		form.submit();
	};

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
      onCancel={() => onCancel()}
      footer={[
        <Button key="submit" type="primary" loading={loading} onClick={() =>handleSubmit()}>
          Submit
        </Button>,
      ]}     
      >
      {
        <Form name="assetFormNew" form={form} onFinish={handleFinish}>
          <Row gutter={16}>
            {
              props.children.props.columns.map((item, i) => (
                <>
                  {
                    item.bulk_update ? 
                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          key={item.field}
                          label={item.header_name}
                          name={item.field}
                          inputprops={{
                            placeholder: ""
                          }}
                        />
                      </Col> : null
                  }
                </>
              ))
            }
          </Row> 
        </Form>
      }
      
    </Modal>
  );
};

export default CreateForm;
