import React, { useState, useEffect } from 'react';
import { Link, connect, history } from 'umi';
import { Spin } from 'antd';
import { useMobile, useMobileSmall } from '@/utils/utils';
import { generateExcelWLogin } from '@/utils/generateExcel';
import * as moment from 'moment';
import styles from '../user/style.less';
import { DATAURLS } from '../../utils/constants';
import {
    fetchGetWithoutLogin
} from '@/utils/utils';
import {
    DownloadOutlined,
} from '@ant-design/icons';
import {
    Button
} from 'antd';
import logoDark from '../../assets/logo_dark.png';

const Login = (props) => {
    const isMobile = useMobile();
    const [downloadData, setDownloadData] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns = [

        {
            "type": "text",
            "field": "project_id",
            "header_name": "Project ID",
            "order_by_id": 1,
            "id": 31,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": null,
            "field": "asset_id",
            "header_name": "Asset ID",
            "order_by_id": 2,
            "id": 3,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "asset_type",
            "header_name": "Asset Type",
            "order_by_id": 3,
            "id": 4,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": null,
            "field": "form_factor",
            "header_name": "Form Factor",
            "order_by_id": 4,
            "id": 9,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": null,
            "field": "part_no",
            "header_name": "Part nr",
            "order_by_id": 5,
            "id": 40,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": "numericColumn",
            "field": "quantity",
            "header_name": "QTY",
            "order_by_id": 6,
            "id": 5,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": "text",
            "field": "manufacturer",
            "header_name": "Manufacturer",
            "order_by_id": 8,
            "id": 6,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": "text",
            "field": "model",
            "header_name": "Model",
            "order_by_id": 9,
            "id": 7,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },

        {
            "type": "text",
            "field": "imei",
            "header_name": "IMEI",
            "order_by_id": 11,
            "id": 2,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "serial_number",
            "header_name": "Serial Number",
            "order_by_id": 12,
            "id": 20,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "processor",
            "header_name": "Processor",
            "order_by_id": 13,
            "id": 10,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "memory",
            "header_name": "Memory",
            "order_by_id": 14,
            "id": 11,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "hdd",
            "header_name": "HDD",
            "order_by_id": 15,
            "id": 12,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "optical",
            "header_name": "Optical",
            "order_by_id": 17,
            "id": 13,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "graphic_card",
            "header_name": "Graphic Card",
            "order_by_id": 18,
            "id": 43,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": null,
            "field": "battery",
            "header_name": "Battery",
            "order_by_id": 19,
            "id": 17,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "keyboard",
            "header_name": "Keyboard",
            "order_by_id": 20,
            "id": 18,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "screen",
            "header_name": "Screen",
            "order_by_id": 21,
            "id": 14,
            "hide": false,
            "bulk_update": true,
            "editable": true
        },
        {
            "type": null,
            "field": "description",
            "header_name": "Description",
            "order_by_id": 22,
            "id": 26,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "grade",
            "header_name": "Grade",
            "order_by_id": 23,
            "id": 24,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "complaint",
            "header_name": "Complaint",
            "order_by_id": 24,
            "id": 25,
            "hide": false,
            "bulk_update": false,
            "editable": true
        },
        {
            "type": null,
            "field": "target_price",
            "header_name": "Target Price",
            "order_by_id": 25,
            "id": 38,
            "hide": false,
            "bulk_update": false,
            "editable": true
        }
    ]
    const download = async () => {
        setLoading(true)
        fetchGetWithoutLogin(`${DATAURLS.EXPORTPRODUCTS.url}`)
            .then((response) => {
                setLoading(false)
                setDownloadData(response.data)
                if (response.data?.length) {
                    generateExcelWLogin(response.data, columns, `Assets-${moment().format('YY-MM-DD')}.xlsx`);
                }

            })
            .catch((err) => {
                throw err;
            });
    }

    // const download = () => {
    //     generateExcelWLogin(downloadData, columns, `Assets-${moment().format('YY-MM-DD')}.xlsx`);
    // };

    useEffect(() => {
        download()
    }, [])


    return (
        <div>
            {/* <div className={styles.header}> */}

            {/* </div> */}
            <div className={styles.container}>
                <div className={[styles.main1, isMobile ? styles.mainmobile : false].join(' ')}>
                    <div className={styles.formsection}>
                        <div className={styles.headerLogoText}>
                            <a className={styles.logo_dark}><img src={logoDark} /></a>
                        </div>
                        {
                            loading ? <><Spin
                                size='1rem'
                                className={styles.buttonProgress}
                            /> <span style={{ fontSize: 20 }}>{'Please wait while download in progress'}</span>
                            </> :
                                <>
                                    <span style={{ fontSize: 20 }}>{"If the download of Tech Konsulter stocklist doesn't start automatically, click here"}</span><br />
                                    <Button className={styles.buttonTypes} onClick={() => download()} >
                                        <DownloadOutlined /> Download
                                    </Button>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div >

    );
};

export default connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login']
}))(Login);
