import React, { useState, useEffect } from 'react';
import { getAccessToken } from '@/utils/authority';
import {
    fetchPut,
    fetchGet
} from '@/utils/utils';
import { Form, Space, Modal, Spin } from 'antd';
import {CheckCircleFilled, CloseOutlined } from '@ant-design/icons';
import BarcodeReader from 'react-barcode-reader';
import { DATAURLS } from '../../../utils/constants';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './styles.css'

export const InStorage = (props) => {
    const {
        setShowInStorageModalDialog,
        getNewData,
        parentGridApi,
        showModalDialog,
    } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarType, setSnackBarType] = useState('success');
    const [showInstorageSubmitType, setShowInstorageSubmitType] = useState();
    const [formValues, setFormValues] = useState([{ asset_id: "" }])
    const [storageId, setStorageId] = useState('');
    const [pallet_number, setPallet_number] = useState('');
    const [updateRecordsCount, setUpdateRecordsCount] = useState(0);
    const [assetIdsList, setAssetIdsList] = useState([]);

    useEffect(() => {
        if (showModalDialog) {
            lists()
        }
    }, [showModalDialog])

    const lists = async () => {
        let fields = `?limit=-1&sort=-asset_id&fields[]=asset_id`
        fetchGet(`${DATAURLS.ASSETS.url}${fields}`, getAccessToken())
            .then((response) => {
                setAssetIdsList(response.data);
            })
            .catch((err) => {
                throw err;
            });
    }

    const onFinish = async (values) => {
        //let selectedData = formValues;
        // setInStorageSubmitType(type);
        // console.log("showInstorageSubmitTypes", showInstorageSubmitTypes)
        // console.log(storageId, "valuessss", formValues)
        let updateSuccess = '';
        try {
            if (!formValues || formValues.length == 0) {
                setSnackBarOpen(true);
                setSnackBarMessage('Please enter atleast one Asset');
                setSnackBarType('error');
                return
            }
            let selectedData = [];
            selectedData = formValues.map((row) => {
                if (row.asset_id) {
                    let obj = {
                        asset_id: row.asset_id,
                        storage_id: storageId
                    }
                    if (pallet_number) {
                        obj.pallet_number = pallet_number;
                    }
                    return obj;
                }
            });
            selectedData = selectedData.filter(function (element) {
                return element !== undefined;
            });
            if (selectedData.length === 0) {
                setSnackBarOpen(true);
                setSnackBarMessage('Please enter atleast one Asset');
                setSnackBarType('error');
                return
            }
            setLoading(true);
            let filterassetIDRows = selectedData;
            // console.log("selectedData",selectedData)
            for (let i = 0; i <= selectedData.length; i++) {
                if (filterassetIDRows.length > 0 && filterassetIDRows[i] && filterassetIDRows[i].asset_id) {
                    // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
                    if (updateRecordsCount === filterassetIDRows.length) {
                        break
                    }
                    updateSuccess = await fetchPut(
                        `${DATAURLS.ASSETS.url}/${filterassetIDRows[i].asset_id}`,
                        filterassetIDRows[i],
                        getAccessToken()
                    )
                    setUpdateRecordsCount(i + 1);
                }
            }
            if (updateSuccess?.data?.asset_id) {
                // console.log("updateSuccess", updateSuccess)
                setLoading(false);
                setUpdateRecordsCount(0)
                form.resetFields()
                if (showInstorageSubmitType === 'single') {
                    //setShowInStorageModalDialog(false);
                    onToggleViewDialog()
                } else if (showInstorageSubmitType === 'next') {
                    setShowInStorageModalDialog(true);
                    setSnackBarOpen(true);
                    setSnackBarMessage('Storage ID updated');
                    setSnackBarType('success');

                }

            } else {
                setSnackBarOpen(true);
                setSnackBarMessage('Failed to update');
                setSnackBarType('error');
                setLoading(false);

            }
        } catch (err) {
            throw err
        }
    };

    const onToggleViewDialog = async () => {
        setShowInStorageModalDialog(false);
        getNewData(parentGridApi);
    };
    const handleScan = async (data) => {
        // console.log("dataa", data)
    }
    const handleSubmit = (type) => {
        setShowInstorageSubmitType(type)
        if (!form) return;
        form.submit(type);
    };

    useEffect(() => {
        if (formValues && formValues.length > 0) {
            let selectedData = [];
            selectedData = formValues.map((row) => {
                if (row.asset_id) {
                    return { asset_id: row.asset_id };
                }
            });
            selectedData = selectedData.filter(function (element) {
                return element !== undefined;
            });
            // setFormValues((prev) => [...prev, {'asset_id': ''}]);
        }
    }, [formValues]);

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        let assetsId = e.target.value.replace(/[^\w\s]/gi, "");
        newFormValues[i][e.target.name] = assetsId;
        // const alreadyAssetExist = handlecheckAssetExists(assetsId) ? 'true' : 'false'
        newFormValues[i]['isAssetExist'] = handlecheckAssetExists(assetsId)
        setFormValues(newFormValues);
        if (handlecheckAssetExists(assetsId)) {
            let datas = formValues.filter(function (e) { return e.asset_id != ""; });
            setFormValues([...datas, { asset_id: "" }])
        }

    }

    // console.log("formValues", formValues)
    const handlecheckAssetExists = (value) => {
        let currentMapping = assetIdsList.find(
            (mapping) => mapping.asset_id === value
        );
        // setFormValues([...formValues, { asset_id: "" }])
        return currentMapping && currentMapping.asset_id ? true : false
    };

    let handleStorageChange = (i, e) => {
        setStorageId(e.target.value);
    }

    let addFormFields = () => {
        setFormValues([...formValues, { asset_id: "" }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

    return (
        <Modal
            animation="zoom"
            maskAnimation="fade"
            width={600}
            forceRender
            visible={showModalDialog}
            title="IN STORAGE"
            size={'large'}
            maskClosable={false}
            footer={[
                <button className="button submit" type="submit" onClick={() => handleSubmit('single')}>
                    {'Save'} {loading && (
                        <Spin
                            size='1rem'
                            style={{ marginLeft: 5, color: 'white' }}
                        />
                    )}</button>,
                <button className="button submit" type="submit" onClick={() => handleSubmit('next')}>
                    {'Save & Next'} {loading && (
                        <Spin
                            size='1rem'
                            style={{ marginLeft: 5, color: 'white' }}
                        />
                    )}
                </button>,
                <button className="button remove" type="button" onClick={() => setShowInStorageModalDialog(false)}>Cancel</button>
            ]}
            destroyOnClose
            bodyStyle={{
                padding: '32px 30px 48px',
            }}
            onOk={() => onToggleViewDialog()}
            onCancel={() => setShowInStorageModalDialog(false)}
        >
            <Form name="dynamic_form_nest_item" form={form} onFinish={onFinish} autoComplete="off">
                <BarcodeReader
                    //   onError={this.handleError}
                    onScan={handleScan}
                />
                <Space style={{ display: 'grid', marginBottom: 8 }} align="baseline">
                    {/* <Form.List name="asset_info1"> */}
                    {/* <Form.Item
                        name={'asset_id'}
                    >
                        <Input placeholder="Asset Id" />
                    </Form.Item> */}
                    {/* <Form.Item
                        label={'Storage ID'}
                        name={'storage_id'}
                        rules={[{ required: true, message: 'Please enter Storage ID' }]}
                    >
                        <Input placeholder="Storage Id" onChange={() => setSnackBarOpen(false)} />
                    </Form.Item> */}
                    {/* </Form.List> */}
                    <div className="form-inline">
                        <label>Pallet Number</label>
                        <input type="text" value={pallet_number} name="pallet_number" onChange={e => setPallet_number(e.target.value.replace(/[^\w\s]/gi, ""))} />
                    </div>
                    <div className="form-inline">
                        <label>Storage ID</label>
                        <input type="text" value={storageId} name="storage_id" onChange={e => setStorageId(e.target.value.replace(/[^\w\s]/gi, ""))} />
                    </div>
                </Space>
                {formValues.map((element, index) => (
                    <>
                        <div className="form-inline" key={index}>
                            <label>Asset Id&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <input type="text" name="asset_id" value={element.asset_id || ""} onChange={e => handleChange(index, e)} />
                            {element.isAssetExist && <CheckCircleFilled style={{ color: 'green' }} />}
                            {
                                index ? <>
                                    <button type="button" className="button remove" onClick={() => removeFormFields(index)}>Remove</button>
                                    {/* <button className="button add" type="button" onClick={() => addFormFields()}>Add</button> */}
                                </>
                                    : null
                            }
                        </div>
                        <div className="form-inline" key={`${index}-1`}>
                            {element.asset_id && !element.isAssetExist && <span style={{ color: 'red' }}>Asset ID not in the list</span>}
                        </div>
                    </>
                ))}
                <div className="button-section">
                    <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>


                    {/* <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
                    <button className="button submit" type="submit">Save</button>
                    <button className="button remove" type="button" onClick={() => setShowInStorageModalDialog(false)}>Cancel</button> */}
                </div>
                {/* <Form.List name="asset_info" key="asset_info">
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
                                            <Input placeholder="Asset Id" onChange={()=> setSnackBarOpen(false)} />

                                        </Form.Item>
                                        <Form.Item
                                            shouldUpdate={() => true}>
                                            {({ getFieldValue, setFieldsValue }) => {
                                                let reflects = getFieldValue('asset_info')
                                                if (handlecheckAssetExists(reflects[key] && reflects[key]['asset_id'])) {
                                                    setDisableBtn(false)
                                                    // add()
                                                    return <CheckCircleFilled style={{ color: 'green' }} />
                                                } else if (reflects[key] && reflects[key]['asset_id'] && !handlecheckAssetExists(reflects[key] && reflects[key]['asset_id'])) {
                                                    setDisableBtn(true)
                                                    // add()
                                                    return <span style={{ color: 'red' }}>Asset ID not in the list</span>
                                                }
                                            }}
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(name)}
                                            />
                                        ) : null}
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
                </Form.List> */}
            </Form>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackBarOpen(snackBarType === 'error' ? true : false)
                }
            >
                <MuiAlert
                    elevation={6}
                    variant='filled'
                    onClose={() => setSnackBarOpen(false)}
                    severity={snackBarType}
                >
                    {snackBarMessage}
                </MuiAlert>
            </Snackbar>
        </Modal>

    );
};

export default InStorage;
