import { Form, Input, Button, Space, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import BarcodeReader from 'react-barcode-reader';
import React, { useRef, useState } from 'react';

export const InStorage = (props) => {
    const { showInstorageSubmitType, submitting, showModalDialog, handleCancel, assetIdsList, storageData, checkAssetExists } = props;
    const [form] = Form.useForm();
    const myFormRef = useRef(null);
    const [initialValues, setInitialValues] = useState([{ asset_id: ''}])
    // console.log("assetIdsList", assetIdsList)
    const onFinish = (values) => {
        if (storageData) {
            storageData(values);
        }
        // storageData(values)
    };
    const handlecheckAssetExists = e => {
        checkAssetExists(e.target.value)
        let currentMapping = assetIdsList.find(
            (mapping) => mapping.asset_id === e.target.value
          );
    
        // console.log('currentMapping:', currentMapping);
    };
    
    const onToggleViewDialog = async () => {
        handleCancel(false);
    };
    const handleScan = async (data) => {
        // console.log("dataa", data)
    }
    const handleSubmit = (type) => {
        // if(type === 'next') {
        //     showModalDialog(false)
        // }
        showInstorageSubmitType(type)
		if (!form) return;
		form.submit(type);
	};
    return (
        <Modal
            animation="zoom"
            maskAnimation="fade"
            width={440}
            forceRender
            visible={showModalDialog}
            title="IN STORAGE"
            size={'small'}
            footer={[
                <Button key="submit" type="primary" loading={submitting} onClick={() =>handleSubmit('single')}>
                  {'Save'}
                </Button>,
                <Button key="savenext" type="primary" loading={submitting} onClick={() =>handleSubmit('next')}>
                {'Save & Next'}
              </Button>,
              <Button key="cancel" type="danger" onClick={() =>onToggleViewDialog()}>
              {'Cancel'}
            </Button>,
              ]}  
            destroyOnClose
            bodyStyle={{
                padding: '32px 30px 48px',
            }}
            onOk={() => onToggleViewDialog()}
            onCancel={() => onToggleViewDialog()}
        >
            <Form name="dynamic_form_nest_item" form={form} onFinish={onFinish} autoComplete="off">
                <BarcodeReader
                    //   onError={this.handleError}
                    onScan={handleScan}
                />
                <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                {/* <Form.List name="asset_info1"> */}
                    {/* <Form.Item
                        name={'asset_id'}
                    >
                        <Input placeholder="Asset Id" />
                    </Form.Item> */}
                    <Form.Item
                        // label={'Storage ID'}
                        name={'storage_id'}
                    >
                        <Input placeholder="Storage Id" />
                    </Form.Item>
                {/* </Form.List> */}
                </Space>
                <Form.List name="asset_info">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <>
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        // label={'Asset Id'}
                                        name={[name, 'asset_id']}
                                        fieldKey={[fieldKey, 'asset_id']}
                                    // rules={[{ required: true, message: 'Missing first name' }]}
                                    >
                                        <Input placeholder="Asset Id"/>
                                    </Form.Item>
                                    {/* <Form.Item
                                        {...restField}
                                        // label={'Storage ID'}
                                        name={[name, 'storage_id']}
                                        fieldKey={[fieldKey, 'storage_id']}
                                    // rules={[{ required: true, message: 'Missing last name' }]}
                                    >
                                        <Input placeholder="Storage Id" />
                                    </Form.Item> */}
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                    {/* <div style={{color: 'red', fontWeight: 'bold'}}>{assetExistOrNot && assetExistOrNot.count == '0' ? 'Given asset not in the list' : ''}</div> */}

                                </Space>

                                </>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    More
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                {/* <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Save and Next
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Cancel
                    </Button>
                </Form.Item> */}
            </Form>
        </Modal>

    );
};

export default InStorage;
