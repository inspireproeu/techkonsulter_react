import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { PageHeader, Spin } from 'antd';
import { useMobile } from '@/utils/utils';
import { ExcelDownload } from '@/utils/generateExcel';
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
import logoDark from '../../assets/iteron_logo.png';
import CustomGoBackButton from '../../uikit/GoBack';
import { useLocation } from 'react-router-dom'

const Login = (props) => {
    const isMobile = useMobile();
    const [downloadData, setDownloadData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(null)

    const location = useLocation()
    const [currentwarehouse, setcurrentwarehouse] = useState('SE')
    useEffect(() => {
        if (location) {
            let currentpage = location.pathname.split("/")
            setPage(currentpage[1])
        }
    }, [location]);

    const download = async (action) => {
        setLoading(true)
        let apiurl = 'BROKERBIN';
        let file_name = apiurl;
        // let cols = columns
        let excelCoumns = []
        if (action === 'broker-bin') {
            apiurl = file_name = 'BROKERBIN'
            excelCoumns = ["Part Number", "Condition", "Description", "Manufacturer", "Price", "Quantity"]
        } else if (action === 'general-se' || action === 'general-nl') {
            apiurl = file_name = `GENERALSTOCKLIST`
            excelCoumns = ["project_id", "asset_id", "asset_id_nl", "asset_type", "form_factor", "part_no", "quantity", "manufacturer", "model", "imei", "serial_number", "processor", "memory", "hdd", "graphic_card", "battery", "keyboard", "screen", "grade", "complaint", "target_price", "pallet_number", "storage_id"];
        } else if (action === 'mobile-se' || action === 'mobile-nl') {
            apiurl = file_name = `MOBILESTOCKLIST`
            excelCoumns = ["project_id", "asset_id", "asset_id_nl", "asset_type", "form_factor", "manufacturer", "model", "imei", "serial_number", "hdd", "battery", "grade", "complaint", "target_price", "pallet_number", "storage_id"];
        } else if (action === 'computer-se' || action === 'computer-nl') {
            apiurl = file_name = `COMPUTERSTOCKLIST`
            excelCoumns = ["project_id", "asset_id", "asset_id_nl", "asset_type", "form_factor", "manufacturer", "model", "serial_number", "processor", "memory", "hdd", "graphic_card", "battery", "keyboard", "grade", "complaint", "target_price", "pallet_number", "storage_id"];
        } else if (action === 'customer-stocklist') {
            apiurl = 'CUSTOMERSTOCKLIST';
            file_name = 'itreon_SE01_stock'
            excelCoumns = ["asset_type", "form_factor", "Part_No", "manufacturer", "grade", "description", "quantity"]
        }
        if (currentwarehouse === 'SE') {
            excelCoumns = excelCoumns.filter(e => e !== 'asset_id_nl');
        }
        let queryParam = `&warehouse=${currentwarehouse}01`
        fetchGetWithoutLogin(`${DATAURLS[apiurl].url}?type=web${queryParam}`)
            .then((response) => {
                setLoading(false)
                let data = response.data
                setDownloadData(data)
                if (data?.length) {
                    file_name = `${file_name} - ${currentwarehouse}`
                    ExcelDownload(excelCoumns, data, file_name);
                }


            })
            .catch((err) => {
                throw err;
            });
    }

    useEffect(() => {
        if (page === 'customer-stocklist') {
            download(page)
        }
        if (page === 'computer-nl' || page === 'mobile-nl' || page === 'general-nl') {
            setcurrentwarehouse('NL')
        }
    }, [page])


    return (
        <div>
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
                                    <span style={{ fontSize: 20 }}>{`If the download of Itreon ${page?.replace("-", "")} doesn't start automatically, click here`}</span><br />
                                    <CustomGoBackButton to={`assets`} color="warning" title='Go Back' />
                                    <Button className={styles.buttonTypes} onClick={() => download(page)} >
                                        <DownloadOutlined /> Download {page?.split("-")[0]} {currentwarehouse} stocklist
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
