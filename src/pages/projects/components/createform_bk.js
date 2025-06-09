import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Box from '@material-ui/core/Box';
import { history, connect } from 'umi';
import CircularProgress from '@mui/material/CircularProgress'
import { fetchPost, fetchGet, fetchPut } from '../../../utils/utils';
import { printDocument } from '@/utils/generatePdf';
import { getAccessToken } from '@/utils/authority';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { DATAURLS } from '../../../utils/constants';
import { Link } from 'react-router-dom'
import Check from '@material-ui/icons/Check';
import _ from "lodash";
import { useHistory, useParams, useLocation } from 'react-router-dom'
import CustomGoBackButton from '../../../uikit/GoBack';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Form, Row, Col } from 'antd';
import List from '@mui/material/List';
// import {
//     DownloadOutlined,
//     FileExcelOutlined
// } from '@ant-design/icons';
import ButtonGroup from '@mui/material/ButtonGroup';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint from './toPdf';

import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import 'jspdf-autotable';

const useStyles = makeStyles(theme => ({
    labelContainer: {
        "& $alternativeLabel": {
            fontSize: '20px'
        }
    },
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Project Info', 'Client Info', 'Partner Info', 'Access'];
}

const CreateForm = (props) => {
    const classes = useStyles();
    const history = useHistory()
    const urlParams = useParams()
    const [loading, setLoading] = useState(false)
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState(new Set());
    const [skipped, setSkipped] = React.useState(new Set());
    const { pathname } = useLocation();
    const steps = getSteps();
    const [isDisable, setIsDisable] = useState(false);
    const [hideColumns, setHideColumns] = useState(false);
    const [existErrorMsg, setExistErrorMsg] = useState([]);
    const [showFields, setShowFields] = useState(false)
    const [values, setValues] = useState({
        contact_phone_number: '',
        contact_email: '',
        priority: 'MID',
        project_status: 'ORDER',
        project_type: 'ITAD',
        sales_ref: null
    });
    const { currentUser } = props;
    const [clientsAddressList, setClientsAddressList] = useState([]);
    const [projectId, setProjectId] = useState();
    const [clientsList, setClientsList] = useState([]);
    const [partnersList, setPartnersList] = useState([]);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarType, setSnackBarType] = useState('success');
    const [success, setSuccess] = useState(false);
    const [roleName, setRoleName] = useState(null);
    const [checked, setChecked] = React.useState([]);
    const [productReportChecked, setProductReportChecked] = React.useState([]);
    const [financialReportChecked, setFinancialReportChecked] = React.useState([]);
    const [tKTriggerChecked, setTKTriggerChecked] = React.useState([]);
    const [errValues, setErrValues] = useState({});
    const [clientUsers, setClientUsers] = useState([]);
    const [partnerUsers, setPartnerUsers] = useState([]);
    const [deliveryValues, setDeliveryValues] = useState({});
    const [usersList, setUsersList] = useState([]);
    const [permissions, setPermissions] = useState({
        isClientAdmin: false,
        isClientSales: false,
        isClientCio: false,
        isPartnerAdmin: false,
        isPartnerSales: false,
        isAdmin: false
    });
    const [userType, setUserType] = useState('');
    const [mainContact, setMainContact] = useState({});
    const [page, setPage] = useState('CREATE');
    const [enablePermission, setEnablePermission] = useState(true)
    const [adminUsers, setAdminUsers] = useState([]);
    const [envReportChecked, setEnvReportChecked] = useState([]);
    const [reports] = useState([
        { "name": "Product report", "value": "prod" },
        { "name": "Environment report", "value": "env" },
        { "name": "Financial report", "value": "fin" },
    ])
    const [showPdf, setShowPdf] = useState(false);
    const [remarketRecycled, setRemarketRecycled] = useState([])
    const [savedCO2, setSavedCO2] = useState([])
    const [equipemetCategory, setEquipemetCategory] = useState([])
    const [equipemetCategoryTotal, setEquipemetCategoryTotal] = useState(0)
    const [consumedco2, setconsumedco2] = useState([])
    const [reportloading, setreportloading] = useState(false)
    const [totalConsumeCo2, settotalConsumeCo2] = useState(null)
    const [totalSavedCo2, settotalSavedCo2] = useState(null)

    const [isPrinting, setIsPrinting] = useState(false);
    const promiseResolveRef = useRef(null);
    const [printView, setPrintView] = useState(false);
    const [assetTypeFieldMappingCo2, setAssetTypeFieldMappingCo2] = useState([]);


    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    // (async () => {
    //     // Launch the browser and open a new blank page
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();

    //     // Navigate the page to a URL
    //     await page.goto('https://developer.chrome.com/');

    //     // Set screen size
    //     await page.setViewport({width: 1080, height: 1024});

    //     // Type into search box
    //     await page.type('.devsite-search-field', 'automate beyond recorder');

    //     // Wait and click on first result
    //     const searchResultSelector = '.devsite-result-item-link';
    //     await page.waitForSelector(searchResultSelector);
    //     await page.click(searchResultSelector);

    //     // Locate the full title with a unique string
    //     const textSelector = await page.waitForSelector(
    //       'text/Customize and automate'
    //     );
    //     const fullTitle = await textSelector?.evaluate(el => el.textContent);

    //     // Print the full title
    //     console.log('The title of this blog post is "%s".', fullTitle);

    //     await browser.close();
    //   })();

    useEffect(() => {
        if (urlParams && urlParams.id) {
            setPage('UPDATE')
            setProjectId(urlParams.id);
            getProjectDetail(urlParams.id);
        }
    }, [urlParams]);

    const componentRef = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const onBeforeGetContentResolve = useRef();

    const handleOnBeforeGetContent = () => {
        return new Promise((resolve) => { // `react-to-print` will wait for this Promise to resolve before continuing
            // Load data
            console.log("loaded dataaa")
            onBeforeGetContentResolve.current = resolve;
            setDataLoaded(true); // When data is done loading
        });
    };

    useEffect(() => {
        if (dataLoaded) {
            // Resolves the Promise, telling `react-to-print` it is time to gather the content of the page for printing
            onBeforeGetContentResolve.current();
        }
    }, [dataLoaded, onBeforeGetContentResolve]);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Environment report - ${urlParams.id}`,
        onBeforePrint: () => setreportloading(false),
        // // onAfterPrint: () => setShowPdf(false),
        // // removeAfterPrint: true,
        // copyStyles: true,
        // onBeforeGetContent: handleOnBeforeGetContent,

        // onBeforeGetContent: () => {
        //     return new Promise((resolve) => {
        //         promiseResolveRef.current = resolve;
        //         getProjectDetail(urlParams.id, 'print');

        //         // setPrintView(true);
        //     });
        // },
        // onAfterPrint: () => {
        //     // Reset the Promise resolve so we can print again
        //     promiseResolveRef.current = null;
        //     setPrintView(false);
        // },
        // onPrintError: (error) => console.log(error),
        print1: async (printIframe) => {
            const document = printIframe.contentDocument;
            if (document) {
                const html = document.getElementsByTagName('html')[0];
                console.log(html);
                const options = {
                    filename: 'my-document.pdf',
                    margin: 1,
                    image: { type: 'jpeg', quality: 0.98 },
                    jsPDF: {
                        unit: 'mm',
                        format: 'letter',
                        orientation: 'portrait',
                    },
                };
                // get_PDF_in_base64(html)
                // const exporter = new Html2Pdf(html,{filename:"Note.pdf"});
                // await exporter.getPdf(true);
                await html2pdf().set().from(html).save();

            }
        }
        // removeAfterPrint
    });

    const get_PDF_in_base64 = async (htmldoc) => {
        if (htmldoc) {
            const canvas = await html2canvas(htmldoc);
            const pdf = new jsPDF('l', 'mm', 'a3')
            pdf.setFontSize(22);
            pdf.setTextColor(255, 0, 0);
            // pdf.addImage(
            //     canvas.toDataURL('image/jpeg'),
            //     'JPEG',
            //     0,
            //     0,
            //     pdf.internal.pageSize.getWidth(),
            //     pdf.internal.pageSize.getHeight()
            // );

            // const pdfBase64 = pdf.output('dataurlstring');
            // console.log("888888888",pdfBase64);
            pdf.html(htmldoc).then(() => {
                pdf.save();
                window.open(pdf.output("bloburl"));
            })
        }
    }


    const handlePrint1 = () => {
        const content = componentRef.current;

        const options = {
            filename: 'my-document.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait',
            },
        };

        html2pdf().set(options).from(content).save();

    }


    const getProjectDetail = async (id, isPrint = null) => {
        setLoading(true);
        fetchGet(`${DATAURLS.PROJECT.url}/${id}?fields=id,equipments,sales_ref,process_end_date,project_recieved,comments,project_type,client_ref,project_name,client_ref,project_info,delivery_info,delivery_address,project_status,partner.id,partner.partner_name,contact_attn.phone_number,partner_contact_attn.id,partner_contact_attn.email,partner_contact_attn.first_name,contact_attn.email,contact_attn.id,client.phone_number,client.address2,client.postal_code,client.city,client.id,client.postal_address,client.client_name,access.*,priority,process_start_date,status_color,financial_access.*,product_report.*,tk_access.*,env_access.*`, getAccessToken())
            .then(async (response) => {

                let data = response.data;
                let projData = data
                projData.project_name = data.project_name;
                projData.project_status = data.project_status;
                projData.project_info = data.project_info;
                projData.delivery_info = data.delivery_info;
                projData.process_start_date = data.process_start_date || null;
                projData.process_end_date = data.process_end_date || null;
                projData.priority = data.priority;
                projData.project_type = data.project_type || 'ITAD';
                if (data.partner && data.partner.id) {
                    getPartnerusers(data.partner?.id)
                    projData.partner_name = data.partner?.partner_name;
                    projData.partner = data.partner ? data.partner.id : '';

                }
                if (data.client) {
                    getClient(data.client?.id)
                    projData.client_name = data.client?.client_name;
                    projData.client = data.client?.id;
                    projData.postal_address = data.client?.postal_address;
                    projData.city = data.client?.city;
                    projData.postal_code = data.client?.postal_code;
                    projData.address2 = data.client?.address2;
                    projData.phone_number = data.client?.phone_number;
                }
                if (data.contact_attn?.id) {
                    projData.contact_attn = data.contact_attn?.id;
                    projData.contact_phone_number = data.contact_attn?.phone_number;
                    projData.contact_email = data.contact_attn?.email;
                }
                if (data.partner_contact_attn?.id) {
                    projData.partner_contact_name = data.partner_contact_attn?.first_name;
                    projData.contact_email = data.contact_attn?.email;
                }
                projData.delivery_address = data?.delivery_address;
                projData.partner_contact_attn = data.partner_contact_attn?.id
                projData.client_ref = data?.client_ref;
                projData.access = data?.access;
                projData.tk_access = data?.tk_access;
                projData.product_report = data?.product_report;
                projData.financial_access = data?.financial_access;
                projData.env_access = data?.env_access;
                projData.sales_ref = data?.sales_ref
                projData.id = data.id ? data.id : '';
                setValues(projData);
                // if (isPrint) {
                // }
                await equipemet_Category(id)
                // setLoading(false);
            })
            .catch((err) => {
                throw err;
            });
    };
    let otherTypes = ['MOUSE', 'ADAPTER', 'CABLE', 'PARTS COMPUTER', 'DOCKING', 'HDD', 'COMPONENTS', 'PARTS MOBILE', 'PARTS SERVER']
    let mainTypes = ['COMPUTER', 'TELECOM & VIDEOCONFERENCE', 'MOBILE DEVICE', 'NETWORK', 'MONITOR', 'MISC', 'POS', 'SERVER & STORAGE', 'PROJECTOR', 'PRINTER', 'SWITCH']

    const equipemet_Category = async (id) => {
        let fields = `limit=-1&page=1&filter={"_and":[{"project_id":{"_eq":${id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}}]}&groupBy=asset_type&aggregate={"sum":"quantity"}`;
        fetchGet(`${DATAURLS.ASSETS.url}?${fields}`, getAccessToken())
            .then(async (response) => {
                if (response?.data?.length > 0) {
                    let main_Type = []
                    let other_Type = []
                    response.data.forEach((item) => {
                        if (mainTypes.includes(item.asset_type.trim().toUpperCase())) {
                            main_Type.push({
                                value: Number(item.sum.quantity),
                                type: item.asset_type
                            })
                        } if (otherTypes.includes(item.asset_type)) {
                            other_Type.push({
                                value: Number(item.sum.quantity),
                                type: 'OTHERS'
                            })
                        }
                    })
                    let otherValue = other_Type.reduce((total, { value }) => total + parseInt(value), 0)
                    let joinTypes = [...main_Type, { value: otherValue, type: 'OTHERS' }]
                    let totalValue = joinTypes.reduce((total, { value }) => total + parseInt(value), 0)

                    // console.log("joinTypes", joinTypes)
                    joinTypes = [...joinTypes].sort((a, b) => b.value - a.value);
                    setEquipemetCategory(joinTypes);
                    setEquipemetCategoryTotal(totalValue)
                }
                await totalco2(id)
                await getAssetTypes()
            })
            .catch((err) => {
                throw err;
            });
    }
    const getAssetTypes = async () => {
        let fields3 = '?limit=-1&sort=Asset_Name&fields=Asset_Name,formfactor,sample_weight,sampleco2';

        fetchGet(`${DATAURLS.ASSETTYPES.url}${fields3}`, getAccessToken())
            .then((response) => {
                setAssetTypeFieldMappingCo2(response.data);
            })
            .catch((err) => {
                throw err;
            });
    }

    const totalco2 = async (id) => {
        let fields = `limit=-1&page=1&fields=asset_id,form_factor,asset_type,sample_co2,quantity,grade&filter={"_and":[{"project_id":{"_eq":${id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}}]}`;
        fetchGet(`${DATAURLS.ASSETS.url}?${fields}`, getAccessToken())
            .then(async (response) => {
                let consumed_co2 = [];
                let total_co2 = 0;
                let recycled = [];
                let remarketed = [];
                if (response?.data?.length > 0) {
                    response.data.forEach((item) => {
                        let status = ''
                        let form_factor = null
                        let currentAssetType = ''
                        if (item.form_factor) {
                            form_factor = item.form_factor.trim().toLowerCase()
                            currentAssetType = assetTypeFieldMappingCo2.filter(
                                (asset) => ((asset.Asset_Name.toLowerCase() === params.value.toLowerCase()) && asset.formfactor?.trim().toLowerCase() === form_factor)
                            );
                        }
                        if (currentAssetType?.length > 0) {
                            item.sample_co2 = currentAssetType[0]?.sampleco2 || '';
                        }
                        if (item.grade && ['A', 'B', 'C', 'D', 'E', 'AV', 'BV', 'CV', 'DV', 'EV', 'DA'].includes(item.grade)) {
                            if (['A', 'B', 'C'].includes(item.grade)) {
                                status = 'Remarketing'
                                remarketed.push({
                                    status: status,
                                    quantity: Number(item.quantity),
                                    asset_type: item.asset_type,
                                    sample_co2: Number(item.quantity) * Number(item.sample_co2),
                                    sample_co2_50: ((Number(item.quantity) * Number(item.sample_co2)) / 100) * 50,
                                    grade: item.grade
                                })
                            } else if (['D', 'E', 'DV', 'EV', 'DA', 'AV', 'BV', 'CV'].includes(item.grade)) {
                                status = 'Recycling'
                                recycled.push({
                                    status: status,
                                    quantity: Number(item.quantity),
                                    asset_type: item.asset_type,
                                    sample_co2: Number(item.quantity) * Number(item.sample_co2),
                                    sample_co2_100: ((Number(item.quantity) * Number(item.sample_co2)) / 100) * 100,
                                    grade: item.grade
                                })
                            }
                        }
                    })
                    let main_Type = []
                    let other_Type = []
                    let main_Type1 = []
                    let other_Type1 = []
                    remarketed.forEach((item) => {
                        if (mainTypes.includes(item.asset_type.trim().toUpperCase())) {
                            main_Type.push({
                                value: item.quantity,
                                asset_type: item.asset_type,
                                name: item.status
                            })
                        } if (otherTypes.includes(item.asset_type)) {
                            other_Type.push({
                                value: item.quantity,
                                asset_type: 'OTHERS',
                                name: item.status
                            })
                        }
                    })
                    recycled.forEach((item) => {
                        if (mainTypes.includes(item.asset_type.trim().toUpperCase())) {
                            main_Type1.push({
                                value: item.quantity,
                                asset_type: item.asset_type,
                                name: item.status
                            })
                        } if (otherTypes.includes(item.asset_type)) {
                            other_Type1.push({
                                value: item.quantity,
                                asset_type: 'OTHERS',
                                name: item.status
                            })
                        }
                    })


                    //--- recycled or remarketed
                    remarketed = [...main_Type,...main_Type1]
                    recycled = [...other_Type,...other_Type1]
                    let remarketedrecycledJoin = [...remarketed, ...recycled]
                    let remarketedrecycled1 = _(remarketed)
                        .groupBy('asset_type', 'status')
                        .map(group => ({
                            name: group[0]?.status,
                            type: group[0]?.asset_type,
                            "value": (_.round(_.sumBy(group, x => x.quantity ? parseFloat(x.quantity) : 0), 0)),
                        }))
                        .value();
                    let remarketedrecycled2 = _(recycled)
                        .groupBy('asset_type', 'status')
                        .map(group => ({
                            name: group[0]?.status,
                            type: group[0]?.asset_type,
                            "value": (_.round(_.sumBy(group, x => x.quantity ? parseFloat(x.quantity) : 0), 0)),
                        }))
                        .value();
                        console.log("remarketed",remarketed)
                        console.log("main_Type",main_Type1)
                        console.log("other_Type",other_Type1)
                    // let remarketedrecycledfilter = [...main_Type,...main_Type1, ...other_Type,...other_Type1]
                    let remarketedrecycled = [...remarketedrecycled1, ...remarketedrecycled2]
                    // let remarketedrecycledJoin = [...main_Type,...main_Type1, ...other_Type,...other_Type1]

                    // remarketedrecycled = [...remarketedrecycled].sort((a, b) => b.value - a.value);
                    // console.log("recycled", recycled)
                    setRemarketRecycled(remarketedrecycled);
                    //--- end recycled or remarketed

                    //--- saved co2 
                    let saved_co2 = [];
                    saved_co2 = _(remarketed)
                        .groupBy('asset_type')
                        .map(group => ({
                            type: group[0]?.asset_type,
                            "value": (_.round(_.sumBy(group, x => x.sample_co2 ? parseFloat(x.sample_co2) : 0), 0)),
                        }))
                        .value();
                    saved_co2 = [...saved_co2].sort((a, b) => b.value - a.value).slice(0, 4);;
                    let totalsaved_Co2 = 0
                    totalsaved_Co2 = _.round(_.sumBy(saved_co2, x => x.value ? (parseFloat(x.value)) : 0), 0)
                    // console.log("remarketed", remarketed)
                    setSavedCO2(saved_co2)
                    settotalSavedCo2(totalsaved_Co2)
                    //--------------end saved co2 -------------------
                    //Consumed CO2

                    consumed_co2 = _(remarketedrecycledJoin)
                        .groupBy('asset_type')
                        .map(group => ({
                            type: group[0]?.asset_type,
                            "value": (_.round(_.sumBy(group, x => x.sample_co2_50 ? (parseFloat(x.sample_co2_50)) : 0), 0) + _.round(_.sumBy(group, x => x.sample_co2_100 ? (parseFloat(x.sample_co2_100)) : 0), 0)),
                        }))
                        .value();
                    // consumed_co2 = [...consumed_co2].sort((a, b) => b.value - a.value).slice(0, 4);;
                    // console.log("consumed_co2", consumed_co2)
                    setconsumedco2(consumed_co2)

                    total_co2 = _.round(_.sumBy(consumed_co2, x => x.value ? (parseFloat(x.value)) : 0), 0)
                    settotalConsumeCo2(total_co2)
                }
                setLoading(false);

                setPrintView(true)

                // await remarket_recycled(id)
            })
            .catch((err) => {
                throw err;
            });
    }

    const getPartnerusers = (partner) => {
        if (partner) {
            let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"partner":{"_eq":"${partner}"}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
            fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
                .then((response) => {

                    setPartnerUsers(response.data)
                })
                .catch((err) => {
                    throw err;
                });
        }
    }



    const getAdminusers = () => {
        let filter = `{"_and":[{"role":{"description":{"_eq":"Administrator"}}},{"email":{"_nnull":true}}]}`

        let fields = `limit=-1&sort=first_name&filter=${filter}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
        // let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"role.description":{"_eq":"Administrator"}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
        fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
            .then((response) => {
                setAdminUsers(response.data)
            })
            .catch((err) => {
                throw err;
            });
    }



    useEffect(() => {
        if (currentUser) {
            setRoleName(currentUser?.role?.name);
            if (currentUser && currentUser?.role?.name === 'client_admin' || currentUser?.role?.name === 'client_cio' || currentUser?.role?.name === 'client_sales') {
                values.client = currentUser.client ? currentUser.client.id : null;
                setUserType('CLIENT')
                if (currentUser?.role?.name === 'client_admin') {
                    permissions.isClientAdmin = true
                } else if (currentUser?.role?.name === 'client_admin') {
                    permissions.isClientSales = true
                } else if (currentUser?.role?.name === 'client_cio') {
                    permissions.isClientCio = true
                }
                setValues({ ...values });
                setChecked([currentUser.id])
            } else if (currentUser && currentUser?.role?.name === 'partner_admin' || currentUser?.role?.name === 'partner_sales') {
                values.partner = currentUser.partner ? currentUser.partner.id : null;
                setUserType('PARTNER')
                setValues({ ...values });
                setChecked([currentUser.id])
            } else if (currentUser && currentUser?.role?.name === 'Administrator' || currentUser?.role?.name === 'Associate') {
                setUserType('ADMIN')
                getNewData()
                permissions.isAdmin = true;
            }
            setPermissions({ ...permissions });
            getAdminusers() //call admin users
        }
    }, [currentUser]);

    const getNewData = async () => {
        // setLoading(true);
        let fields4 = 'limit=-1&sort=client_name';
        let fields = 'limit=-1&sort=partner_name';
        fetchGet(`${DATAURLS.CLIENT.url}?${fields4}`, getAccessToken())
            .then((response) => {
                setClientsList(response.data);
                // setLoading(false);
            })
            .catch((err) => {
                throw err;
            });
        fetchGet(`${DATAURLS.PARTNER.url}?${fields}`, getAccessToken())
            .then((response) => {
                setPartnersList(response.data);
                // setLoading(false);
            })
            .catch((err) => {
                throw err;
            });
    };



    const handleChange = (name) => (event) => {
        let targetvalues = event.target.value ? event.target.value : '';
        const re = /^[0-9\b]+$/;
        if (targetvalues && name === 'id') {
            if (!(re.test(targetvalues))) {
                values.id = '';
                setValues({ ...values, [name]: '' });
                setSnackBarOpen(true);
                setEnablePermission(false)
                setSnackBarType('error');
                setSnackBarMessage('Project id accepts Numbers only.');
                return
            } else {
                setEnablePermission(true)
                setSnackBarOpen(false);
            }
        }
        setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })
        values.contact_phone_number = ''
        values.contact_email = ''
        setValues({ ...values, [name]: targetvalues });
    };

    useEffect(() => {
        if (partnerUsers || clientUsers || adminUsers) {
            let users = [...partnerUsers, ...clientUsers, ...adminUsers];
            setUsersList(users.sort((a, b) => (a.first_name > b.first_name) ? 1 : -1))
        }
    }, [partnerUsers, clientUsers, adminUsers])

    useEffect(() => {
        if (usersList && values) {
            let users = usersList;
            if (values?.access?.length > 0) {
                let access = values.access
                users.forEach((item) => {
                    if (access && access.length > 0) {
                        item.checked = access.some(el => el.projects_users_id === item.id);
                    }
                })
                let chkd = users.filter((item) => item.checked)
                chkd = chkd.map((item) => item.id)
                chkd = _.uniq(chkd)
                setChecked(chkd)
            }
            if (values?.financial_access?.length > 0) {
                let financial_access = values.financial_access
                users.forEach((item) => {
                    if (financial_access && financial_access.length > 0) {
                        item.checked = financial_access.some(el => el.projects_users_id === item.id);
                    }
                })
                let chkd1 = users.filter((item) => item.checked)
                chkd1 = chkd1.map((item) => item.id)
                chkd1 = _.uniq(chkd1)
                setFinancialReportChecked(chkd1)
            }
            if (values?.env_access?.length > 0) {
                let env_access = values.env_access
                users.forEach((item) => {
                    if (env_access && env_access.length > 0) {
                        item.checked = env_access.some(el => el.env_users_id === item.id);
                    }
                })
                let chkd1 = users.filter((item) => item.checked)
                chkd1 = chkd1.map((item) => item.id)
                chkd1 = _.uniq(chkd1)
                setEnvReportChecked(chkd1)
            }

            if (values?.product_report?.length > 0) {
                let product_report = values.product_report
                users.forEach((item) => {
                    if (product_report && product_report.length > 0) {
                        item.checked = product_report.some(el => el.project_users_id === item.id);
                    }
                })
                let chkd2 = users.filter((item) => item.checked)
                chkd2 = chkd2.map((item) => item.id)
                chkd2 = _.uniq(chkd2)
                setProductReportChecked(chkd2)
            }

            if (values?.tk_access?.length > 0) {
                let tk_access = values.tk_access
                users.forEach((item) => {
                    if (tk_access && tk_access.length > 0) {
                        item.checked = tk_access.some(el => el.project_users_id === item.id);
                    }
                })
                let chkd3 = users.filter((item) => item.checked)
                chkd3 = chkd3.map((item) => item.id)
                chkd3 = _.uniq(chkd3)
                setTKTriggerChecked(chkd3)
            }

            if (values.access?.length === 0) {

                let users = usersList;
                users.forEach((item) => {
                    // item.checked = (item?.role?.name === 'client_admin' || item?.role?.name === 'partner_admin') ? true : false
                    item.checked = (values.contact_attn === item.id) || (values.partner_contact_attn === item.id);
                })

                let chkd = users.filter((item) => item.checked)
                chkd = chkd.map((item) => item.id)
                chkd = _.uniq(chkd)
                setChecked(chkd)
            }
        }

    }, [usersList, values])

    const getClient = (client) => {
        if (client) {
            // getClientAddress(client);
            let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"client":{"_eq":"${client}"}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
            fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
                .then((response) => {
                    // let val = {
                    //   contact_email: '',
                    //   contact_phone_number: ''
                    // }
                    response.data.forEach((item) => {
                        item.checked = false;
                    })

                    if (values.access && values.access.length > 0) {
                        let selectedUseres = values.access.map(
                            (row) => row.projects_users_id
                        );
                        response.data.forEach((item) => {
                            if (selectedUseres.some((x) => x == item.id)) {
                                item.checked = true
                            } else {
                                item.checked = false;
                            }
                        })
                    }
                    // setValues({ ...values, ...val });
                    // setValues({ ...values });
                    setClientUsers(response.data);
                    // setLoading(false);
                })
                .catch((err) => {
                    throw err;
                });
            setValues({ ...values });
            // }
        }
    }
    let DeliveryVals = {
        delievery_address: '',
        address_info: '',
        city: '',
        postal_code: '',
        sub_org: '',
        phone_number: '',
        name: '',
        family_name: '',
        email: ''
    }
    let mainCon = {
        contact_phone_number: '',
        contact_email: ''
    }
    useEffect(() => {
        if (clientsAddressList?.length > 0 && values && values.delivery_address) {

            let datas = clientsAddressList.find((row) => row.id === values.delivery_address);
            // let client_Users = usersList && usersList.filter((row) => row.client === values.client);
            // setClientUsers(client_Users)
            if (datas) {
                DeliveryVals.delievery_address = datas.delievery_address;
                DeliveryVals.address_info = datas.address_info;
                DeliveryVals.city = datas.city;
                DeliveryVals.postal_code = datas.postal_code;
                DeliveryVals.sub_org = datas.sub_org;
                DeliveryVals.phone_number = datas.phone_number;
                DeliveryVals.name = datas.sub_address_contact?.first_name;
                DeliveryVals.email = datas.sub_address_contact?.email;
                setDeliveryValues(DeliveryVals);
            }
        } else {

            setDeliveryValues(DeliveryVals);
            setMainContact(mainCon);
        }
    }, [clientsAddressList, values]);

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <Step1
                    setValues={setValues}
                    values={values}
                    isDisable={isDisable}
                    permissions={permissions}
                    errValues={errValues}
                    hideColumns={hideColumns}
                    showFields={showFields}
                    handleChange={handleChange}
                    userType={userType}
                    page={page}
                    adminUsers={adminUsers}
                    currentUser={currentUser}
                />;
            case 1:
                return <Step2
                    isDisable={isDisable}
                    values={values}
                    hideColumns={hideColumns}
                    showFields={showFields}
                    clientsList={clientsList}
                    partnersList={partnersList}
                    setDeliveryValues={setDeliveryValues}
                    deliveryValues={deliveryValues}
                    setErrValues={setErrValues}
                    errValues={errValues}
                    handleChange={handleChange}
                    setClientUsers={setClientUsers}
                    clientUsers={clientUsers}
                    setValues={setValues}
                    setClientsAddressList={setClientsAddressList}
                    clientsAddressList={clientsAddressList}
                    projectId={urlParams.id}
                    page={page}
                    setMainContact={setMainContact}
                    mainContact={mainContact}
                    DeliveryVals={DeliveryVals}
                />;
            case 2:
                return <Step3
                    projectId={urlParams.id}
                    isDisable={isDisable}
                    values={values}
                    hideColumns={hideColumns}
                    showFields={showFields}
                    clientsList={clientsList}
                    partnersList={partnersList}
                    setErrValues={setErrValues}
                    errValues={errValues}
                    handleChange={handleChange}
                    setValues={setValues}
                    setPartnerUsers={setPartnerUsers}
                    partnerUsers={partnerUsers}
                    getPartnerusers={getPartnerusers}
                />;
            case 3:
                return <Step4
                    projectId={urlParams.id}
                    isDisable={isDisable}
                    values={values}
                    hideColumns={hideColumns}
                    showFields={showFields}
                    clientsList={clientsList}
                    partnersList={partnersList}
                    setErrValues={setErrValues}
                    errValues={errValues}
                    handleChange={handleChange}
                    setValues={setValues}
                    setPartnerUsers={setPartnerUsers}
                    partnerUsers={partnerUsers}
                    usersList={usersList}
                    setChecked={setChecked}
                    checked={checked}
                    setTKTriggerChecked={setTKTriggerChecked}
                    tKTriggerChecked={tKTriggerChecked}
                    setProductReportChecked={setProductReportChecked}
                    productReportChecked={productReportChecked}
                    setFinancialReportChecked={setFinancialReportChecked}
                    financialReportChecked={financialReportChecked}
                    setEnvReportChecked={setEnvReportChecked}
                    envReportChecked={envReportChecked}
                />;
            default:
                return 'Unknown step';
        }
    }

    function totalSteps() {
        return getSteps().length;
    }

    function isStepOptional(step) {
        return step === 1;
    }

    function skippedSteps() {
        return skipped.size;
    }

    function completedSteps() {
        return completed.size;
    }

    function allStepsCompleted() {
        return completedSteps() === totalSteps() - skippedSteps();
    }

    function isLastStep() {
        return activeStep === totalSteps() - 1;
    }

    function handleNext() {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed
                // find the first step that has been completed
                steps.findIndex((step, i) => !completed.has(i))
                : activeStep + 1;

        setActiveStep(newActiveStep);
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleStep = step => () => {
        setActiveStep(step);
    };

    function handleReset() {
        setActiveStep(0);
        setCompleted(new Set());
        setSkipped(new Set());
    }

    function isStepSkipped(step) {
        return skipped.has(step);
    }

    function isStepComplete(step) {
        return completed.has(step);
    }

    const handleSubmit = () => {
        setLoading(true);
        values.partner = values.partner ? values.partner : null;
        if (currentUser && currentUser?.role?.name === 'client_admin' || currentUser?.role?.name === 'client_cio' || currentUser?.role?.name === 'client_sales') {
            values.client = currentUser.client ? currentUser.client.id : null;
        }
        let contact_attn = values.contact_attn ? values.contact_attn : null
        let partner_contact_attn = values.partner_contact_attn ? values.partner_contact_attn : null
        let delivery_address = values.delivery_address?.id ? values.delivery_address.id : values.delivery_address || null
        values.process_start_date = values.process_start_date ? values.process_start_date : null;
        values.contact_attn = contact_attn;
        values.delivery_address = delivery_address;
        values.partner_contact_attn = partner_contact_attn
        values.sales_ref = values.sales_ref ? values.sales_ref : currentUser.id
        if (projectId) {
            let existingAccess = values.access;
            // delete values.id;
            // delete values.contact_attn;
            values.id = projectId;
            delete values.user_created;
            delete values.user_updated;
            delete values.access;
            let access = [];
            let actions = {};
            if (checked && checked.length > 0) {
                for (var i = 0; i < checked.length; i++) {
                    let val = {
                        project_id: projectId,
                        projects_users_id: {
                            id: checked[i],
                        },
                    };

                    access.push(val);
                }
                let ids = []
                if (existingAccess?.length > 0) {
                    ids = existingAccess.map(
                        (col) => col.id
                    );
                }
                actions.create = access;
                actions.delete = ids;
            }
            values.access = actions;
            //--------------------------
            let extkAccess = values.tk_access;

            let tkaccess = [];
            let tkactions = {};
            if (tKTriggerChecked && tKTriggerChecked.length > 0) {

                for (var i = 0; i < tKTriggerChecked.length; i++) {
                    let usr = usersList.find(
                        (obj) => obj.id === tKTriggerChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        project_users_id: {
                            id: tKTriggerChecked[i],
                            email: usr.email
                        },
                    };

                    tkaccess.push(val);
                }
                let tkids = []
                if (extkAccess?.length > 0) {
                    tkids = extkAccess.map(
                        (col) => col.id
                    );
                }

                tkactions.create = tkaccess;
                tkactions.delete = tkids;
            }
            values.tk_access = tkactions;
            //-------------------------
            let exprodAccess = values.product_report;

            let prodaccess = [];
            let prodactions = {};
            if (productReportChecked && productReportChecked.length > 0) {
                for (var i = 0; i < productReportChecked.length; i++) {
                    let usr1 = usersList.find(
                        (obj) => obj.id === productReportChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        project_users_id: {
                            id: productReportChecked[i],
                            email: usr1.email
                        },
                    };

                    prodaccess.push(val);
                }

                let prodids = []
                if (exprodAccess?.length > 0) {
                    prodids = exprodAccess.map(
                        (col) => col.id
                    );
                }
                prodactions.create = prodaccess;
                prodactions.delete = prodids;
            }
            values.product_report = prodactions;
            //-------------------------
            let exfinAccess = values.financial_access;

            let finaccess = [];
            let finactions = {};
            if (financialReportChecked && financialReportChecked.length > 0) {
                for (var i = 0; i < financialReportChecked.length; i++) {
                    let usr2 = usersList.find(
                        (obj) => obj.id === financialReportChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        projects_users_id: {
                            id: financialReportChecked[i],
                            email: usr2.email
                        },
                    };

                    finaccess.push(val);
                }

                let finids = []
                if (exfinAccess?.length > 0) {
                    finids = exfinAccess.map(
                        (col) => col.id
                    );
                }
                finactions.create = finaccess;
                finactions.delete = finids;
            }
            values.financial_access = finactions;

            //------------------- ENV ACCESS
            let exenvAccess = values.env_access;

            let envaccess = [];
            let envactions = {};
            if (envReportChecked && envReportChecked.length > 0) {
                for (var i = 0; i < envReportChecked.length; i++) {
                    let usr2 = usersList.find(
                        (obj) => obj.id === envReportChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        env_users_id: {
                            id: envReportChecked[i],
                            email: usr2.email
                        },
                    };

                    envaccess.push(val);
                }

                let envids = []
                if (exenvAccess?.length > 0) {
                    envids = exenvAccess.map(
                        (col) => col.id
                    );
                }
                envactions.create = envaccess;
                envactions.delete = envids;
            }
            values.env_access = envactions;

            //-------------------
            // console.log("valuesss", values)
            // return
            fetchPut(`${DATAURLS.PROJECT.url}/${projectId}`, values, getAccessToken())
                .then((response) => {
                    if (response.data.id) {
                        setLoading(false);
                        setSnackBarOpen(true);
                        setSnackBarType('success');
                        setSnackBarMessage('Project updated successfully');
                        history.push({
                            pathname: `/projects/${projectId}`,
                        });
                    } else {
                        setLoading(false);
                        setSnackBarOpen(true);
                        setSnackBarType('error');
                        setSnackBarMessage(response.message);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    setSnackBarOpen(true);
                    setSnackBarType('error');
                    setSnackBarMessage('Something went wrong. please try again later.');

                    throw err;
                });
        } else {
            let access = [];
            let actions = {};

            if (checked && checked.length > 0) {
                for (var i = 0; i < checked.length; i++) {
                    let val = {
                        project_id: '+',
                        projects_users_id: {
                            id: checked[i],
                        },
                    };

                    access.push(val);
                }
                actions.create = access;
            }
            values.access = actions;
            //--------------------------
            let tkaccess = [];
            let tkactions = {};
            if (tKTriggerChecked && tKTriggerChecked.length > 0) {

                for (var i = 0; i < tKTriggerChecked.length; i++) {
                    let usr = usersList.find(
                        (obj) => obj.id === tKTriggerChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        project_users_id: {
                            id: tKTriggerChecked[i],
                            email: usr.email
                        },
                    };

                    tkaccess.push(val);
                }
                tkactions.create = tkaccess;
            }
            values.tk_access = tkactions;
            //-------------------------

            let prodaccess = [];
            let prodactions = {};
            if (productReportChecked && productReportChecked.length > 0) {
                for (var i = 0; i < productReportChecked.length; i++) {
                    let usr1 = usersList.find(
                        (obj) => obj.id === productReportChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        project_users_id: {
                            id: productReportChecked[i],
                            email: usr1.email
                        },
                    };

                    prodaccess.push(val);
                }
                prodactions.create = prodaccess;
            }
            values.product_report = prodactions;
            //-------------------------

            let finaccess = [];
            let finactions = {};
            if (financialReportChecked && financialReportChecked.length > 0) {
                for (var i = 0; i < financialReportChecked.length; i++) {
                    let usr2 = usersList.find(
                        (obj) => obj.id === financialReportChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        projects_users_id: {
                            id: financialReportChecked[i],
                            email: usr2.email
                        },
                    };

                    finaccess.push(val);
                }
                finactions.create = finaccess;
            }
            values.financial_access = finactions;
            //------------------------------------- ENV access
            let envaccess = [];
            let envactions = {};
            if (envReportChecked && envReportChecked.length > 0) {
                for (var i = 0; i < envReportChecked.length; i++) {
                    let usr2 = usersList.find(
                        (obj) => obj.id === envReportChecked[i]
                    );
                    let val = {
                        project_id: projectId,
                        env_users_id: {
                            id: envReportChecked[i],
                            email: usr2.email
                        },
                    };

                    envaccess.push(val);
                }
                envactions.create = envaccess;
            }
            values.env_access = envactions;
            //-----------------------
            let queryParams = `filter={"_and":[{"id":{"_eq":"${values.id ? values.id : null}"}}]}&aggregate={"count":["*"]}`
            fetchGet(`${DATAURLS.PROJECT.url}?${queryParams}`, values, getAccessToken())
                .then((response) => {
                    if (parseInt(response.data[0].count) > 0) {
                        setLoading(false);
                        setSnackBarOpen(true);
                        setSnackBarType('error');
                        setSnackBarMessage('Project number already exists. Please try some other number.');
                    } else {
                        if (!values.id) {
                            delete values.id
                        }

                        fetchPost(DATAURLS.PROJECT.url, values, getAccessToken())
                            .then((response) => {
                                if (response.data.id) {
                                    setLoading(false);
                                    setSuccess(true);
                                    setSnackBarOpen(true);
                                    setSnackBarType('success');
                                    setSnackBarMessage('Project created successfully');
                                    history.push({
                                        pathname: `/projects`,
                                    });
                                } else {
                                    setLoading(false);
                                    setSnackBarOpen(true);
                                    setSnackBarType('error');
                                    setSnackBarMessage('Project updated failed.');
                                }
                            })
                            .catch((err) => {
                                throw err;
                            });
                    }
                });
        }
    };


    const downloadReport = async (value) => {
        if (value === 'prod') {
            setreportloading(true)
            let filter = `&filter[project_id][_eq]=${urlParams.id}`
            let fields = 'asset_id,asset_type,quantity,manufacturer,model,serial_number,processor,memory,hdd,grade,complaint'
            let queryParams = `fields=${fields}${filter}&limit=-1`;

            fetchGet(`${DATAURLS.ASSETS.url}?${queryParams}`, getAccessToken())
                .then(async (response) => {
                    if (response.data.length > 0) {
                        values.assets = response.data
                        const isGenerated = await printDocument(values);
                        if (isGenerated) {
                            setreportloading(false)
                            setSnackBarOpen(true);
                            setSnackBarMessage("Your pdf generated and downloaded.");
                            setSnackBarType('success');
                        }
                    } else {
                        setreportloading(true)
                    }
                })
                .catch((err) => {
                    setreportloading(false)
                    setSnackBarOpen(true)
                    setSnackBarType("error")
                    setSnackBarMessage('Failed to generate.')
                    throw err;
                });
            // let param = {
            //     id: urlParams.id,
            //     isSendMail: false
            // }
            // await fetchPost(`${DATAURLS.EXCELEXPORTSENDMAIL.url}`, param, getAccessToken())
            //     .then((result) => {
            //         if (result.data?.length > 0) {
            //             const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            //             const fileExtension = '.xlsx';

            //             const ws = XLSX.utils.json_to_sheet(result.data);
            //             const wb = { Sheets: { 'stock': ws }, SheetNames: ['stock'] };
            //             const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            //             const data = new Blob([excelBuffer], { type: fileType });
            //             FileSaver.saveAs(data, `${item.name}-${urlParams.id}.${fileExtension}`);
            //             setSnackBarOpen(true)
            //             setLoading(false)
            //             setSnackBarType("success")
            //             setSnackBarMessage(result.msg)
            //         } else {
            //             setLoading(false)
            //             setSnackBarOpen(true)
            //             setSnackBarType("error")
            //             setSnackBarMessage(result.msg)
            //         }
            //     })
            //     .catch((err) => {
            //         setLoading(false);
            //         throw err;
            //     });
        } else {
            setreportloading(true)
            handlePrint()
            // setShowPdf(true)
        }

    }

    useEffect(() => {
        if (showPdf && equipemetCategory) {
            // 
        }
    }, [showPdf, equipemetCategory])


    return (
        <>
            <div className="go-back">
                <CustomGoBackButton to={`projects${values?.id ? "/" + values.id : ''}`} color="warning" title='Go Back' />
                {/* <CustomGoBackButton to={`projects`} color="warning" title='Go Back' /> */}
                {urlParams && urlParams.id && <CustomGoBackButton color="primary" target="blank" title='Show assets' to={`projectassets/${values.id}`} />}
            </div>
            <div>
                {/* //style={{ display: 'none' }} */}
                {printView && <div className="pdf-page" style={{ display: 'none' }}>
                    <ComponentToPrint
                        ref={componentRef}
                        totalSavedCo2={totalSavedCo2}
                        totalConsumeCo2={totalConsumeCo2}
                        printView={printView}
                        consumedco2={consumedco2}
                        loading={loading}
                        values={values}
                        remarketRecycled={remarketRecycled}
                        equipemetCategory={equipemetCategory}
                        equipemetCategoryTotal={equipemetCategoryTotal}
                        savedCO2={savedCO2}
                    />
                </div>
                }
            </div>
            <Card sx={{ minWidth: 275 }}>
                <CardContent className="project-1" >

                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                        }}
                        a noValidate
                        autoComplete="off"
                    >
                        <form
                            autoComplete="off"
                            className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                            noValidate
                            id="kt_login_signup_form"
                        // onSubmit={handleSubmit}
                        >
                            <div className={"card_title"}>
                                <h3 className={"card_label"}>{urlParams && urlParams.id ? `Project - ${urlParams.id} (number)` : 'Create Project'}</h3>
                            </div>
                            {
                                existErrorMsg > 0 ? (
                                    <div className='mb-lg-15 alert alert-danger'>
                                        <div className='alert-text font-weight-bold'>{existErrorMsg}</div>
                                    </div>
                                ) : null
                            }
                            <div className={classes.root}>
                                {
                                    (userType === 'ADMIN' || userType === 'ASSOCIATE') &&
                                    <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                                        {steps.map((label, index) => {
                                            const stepProps = {};
                                            const buttonProps = {};
                                            if (isStepSkipped(index)) {
                                                stepProps.completed = false;
                                            }
                                            // if (label === 'Client Info' && userType === 'CLIENT') {
                                            //     return;
                                            // }
                                            // if (label === 'Partner Info' && userType === 'CLIENT') {
                                            //     return;
                                            // }
                                            // if (label === 'Access' && userType === 'CLIENT') {
                                            //     return;
                                            // }
                                            return (
                                                <Step key={label} {...stepProps}>
                                                    <StepButton
                                                        icon={<Check className={[classes.xiconRoot, index === activeStep ? 'activestep' : ''].join(' ')} />}
                                                        onClick={handleStep(index)}
                                                        completed={isStepComplete(index)}
                                                        {...buttonProps}
                                                    >
                                                        <StepLabel
                                                            classes={{
                                                                iconContainer: classes.iconContainer
                                                            }}
                                                        >
                                                            {label}
                                                        </StepLabel>
                                                    </StepButton>
                                                </Step>
                                            );
                                        })}
                                    </Stepper>
                                }
                                <div>
                                    {allStepsCompleted() ? (
                                        <div>
                                            <Typography className={classes.instructions}>
                                                All steps completed - you&apos;re finished
                                            </Typography>
                                            <Button onClick={handleReset}>Reset</Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <form
                                                autoComplete="off"
                                                className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
                                                noValidate
                                                id='kt_login_signup_form'
                                            // onSubmit={handleSubmit}
                                            >
                                                {getStepContent(activeStep)}
                                            </form>
                                            <div className="stepper-btn">
                                                <div className="stepper_btnss">
                                                    {
                                                        (urlParams?.id && printView) && <div style={{ float: 'left' }}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => { downloadReport('prod') }}>{
                                                                    reportloading && <CircularProgress />
                                                                }<span className='indicator-label'>{'Product report'}</span></Button>&nbsp;
                                                            <Button variant="contained"
                                                                onClick={() => { downloadReport('env') }}
                                                                color="primary">{
                                                                    reportloading && <CircularProgress />
                                                                }<span className='indicator-label'>{'Environment report'}</span></Button>&nbsp;
                                                            <Button variant="contained"
                                                                color="primary"><span className='indicator-label'>{'Financial report'}</span></Button>&nbsp;&nbsp;
                                                        </div>
                                                    }
                                                    <div>
                                                        {
                                                            !isDisable ?
                                                                <Link to={`/projects`}>
                                                                    <Button variant="secondary"
                                                                        color="danger" className={[classes.button, 'cancelBtn']}>
                                                                        Cancel
                                                                </Button>
                                                                </Link> : null}

                                                        <Button variant="contained"
                                                            color="warning" disabled={activeStep === 0} onClick={handleBack} className={[classes.button, 'backbtn']}>
                                                            Back
                                                    </Button>
                                                        {
                                                            (activeStep <= 2 && (userType === 'ADMIN')) &&
                                                            <Button
                                                                onClick={() => handleNext()}
                                                                variant="contained"
                                                                color="primary"
                                                                disabled={loading && !enablePermission}
                                                                className={classes.button}
                                                            >
                                                                <span className='indicator-label'>{'Next'}</span>
                                                            </Button>
                                                        }
                                                        {
                                                            !isDisable ? <>
                                                                <Button
                                                                    onClick={() => handleSubmit('savenext')}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    disabled={loading && !enablePermission}
                                                                    className={classes.button}
                                                                >
                                                                    <span className='indicator-label'>{'Save'}</span>
                                                                    {
                                                                        loading && <CircularProgress />
                                                                    }
                                                                </Button>
                                                            </> : <Button
                                                                onClick={() => handleNext()}
                                                                variant="contained"
                                                                color="primary"
                                                                disabled={loading && !enablePermission}
                                                                className={classes.button}
                                                            >
                                                                <span className='indicator-label'>{'Next'}</span>
                                                            </Button>
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Box>
                </CardContent>
                <Snackbar
                    open={snackBarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackBarOpen(snackBarType === 'error' ? true : false)}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={() => setSnackBarOpen(false)}
                        severity={snackBarType}
                    >
                        {snackBarMessage}
                    </MuiAlert>
                </Snackbar>
            </Card>
        </>
    )
}
export default connect(({ user }) => ({
    currentUser: user.currentUser,
}))(CreateForm);