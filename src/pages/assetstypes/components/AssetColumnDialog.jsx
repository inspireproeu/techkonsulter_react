import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Checkbox, Row, Col } from 'antd';
import "./style.less";

export const AssetColumnDialog = (props) => {
  const { data, showModalDialog, handleCancel, columnDefinitions, loading, onSubmit } = props;
  const [allColumnsOptions, setAllColumnsOptions] = useState([]);
  const [fields, setFields] = useState([]);
  const [form] = Form.useForm();

  const onToggleViewDialog = async () => {
    handleCancel(false);
  };

  useEffect(() => {
    setAllColumnsOptions(
      columnDefinitions.map((col) => ({
        field: col.field,
        header_name: col.header_name,
      }))
    );

    let tempFields = data.Fields1 ? JSON.parse(JSON.stringify(data.Fields1)) : [];
    setFields(tempFields);
  }, [columnDefinitions]);

  const onChange = (checkedList) => {
    setFields(checkedList)
  }

  const handleColumnsSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values) => {
    if (onSubmit) {
      let updatedata = {
        Asset_Name: data.Asset_Name,
        Asset_Id: data.Asset_Id,
        Fields1: fields,
      };
      onSubmit(updatedata);
    }
  };
  
  return (
    <Modal
      animation="zoom"
      maskAnimation="fade"
      width={640}
      forceRender
      visible={showModalDialog}
      title={`Columns for - ${data.Asset_Name}`}
      size={'large'}
      footer={[
        <>
          <Button key="canel" type="danger" loading={loading} onClick={() => onToggleViewDialog()}>
          Cancel
        </Button>
        <Button key="submit" type="primary" loading={loading} onClick={() => handleColumnsSubmit()}>
          Submit
        </Button>
        </>
      
      ]}
      destroyOnClose
      bodyStyle={{
        padding: '10px 30px 48px',
      }}
      onOk={() => onToggleViewDialog()}
      onCancel={() => onToggleViewDialog()}
    >
      <div>
        <p style={{
        fontSize: '18px',
        color: 'rgba(0, 0, 0, 0.54)',
        fontWeight: 'bold'
      }}>
        {fields.length} / {allColumnsOptions.length} selected
        </p>
      </div>

      <Form name="assetForm" form={form} onFinish={handleFinish}>

        <Checkbox.Group defaultValue={fields} onChange={onChange} style={{ width: '100%' }}>
          <Row>
            {allColumnsOptions.length > 0 && allColumnsOptions.map((column, index) => {
              return (<Col key={index} span={12}>
                <Checkbox style={{ fontSize: 14, lineHeight: 2 }} value={column.field}>{column.header_name}</Checkbox>
              </Col>)
            })
            }
          </Row>
        </Checkbox.Group>
      </Form>
    </Modal>
  );
};

export default AssetColumnDialog;
