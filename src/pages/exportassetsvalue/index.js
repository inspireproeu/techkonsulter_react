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
import CustomGoBackButton from '../../uikit/GoBack';

const Login = (props) => {
    const isMobile = useMobile();
    const [downloadData, setDownloadData] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            "field": "type",
            "header_name": "type",
        },
        {
            "field": "part_no",
            "header_name": "Part number",

        },
        {
            "field": "Manufacturer",
            "header_name": "manufacturer",

        },
        {
            "field": "model",
            "header_name": "model",

        },
        {
            "field": "cpu",
            "header_name": "cpu",
        },
        {
            "field": "value",
            "header_name": "Working unit from/to value €",

        },
        {
            "field": "avg_value",
            "header_name": "Working unit average value €",

        }
    ]
    const download = async () => {
        setLoading(true)
        fetchGetWithoutLogin(`${DATAURLS.EXPORTASSETVALUES.url}`)
            .then((response) => {
                setLoading(false)
                let data = response.data
                setDownloadData(data)
                if (data?.length) {
                    generateExcelWLogin(data, columns, `Assetsvalue-${moment().format('YY-MM-DD')}.xlsx`);
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
                                    <span style={{ fontSize: 20 }}>{"If the download of Tech Konsulter asset values doesn't start automatically, click here"}</span><br />
                                    <CustomGoBackButton to={`assets`} color="warning" title='Go Back' />

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
