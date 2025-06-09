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
import { fetchPost, fetchGet, fetchPut, ExportExcel } from '../../../utils/utils';
import { printDocument, printFinancialDocument } from '@/utils/generatePdf';
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

import { useReactToPrint } from 'react-to-print';
import ComponentToPrint from './toPdf';
import PDF_FILE from './toPdf_js';

// import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import PageLoader from '../../components/pageloader/PageLoader';
// import { BarChart } from '@mui/x-charts/BarChart';
// import logoDark from '../../../assets/logo_dark.png';

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

    const [remarketRecycled, setRemarketRecycled] = useState(null)
    const [savedCO2, setSavedCO2] = useState([])
    const [equipemetCategory, setEquipemetCategory] = useState(null)
    const [equipemetCategoryTotal, setEquipemetCategoryTotal] = useState(0)
    const [consumedco2, setconsumedco2] = useState(null)
    const [reportloading, setreportloading] = useState(false)
    const [totalConsumeCo2, settotalConsumeCo2] = useState(null)
    const [totalSavedCo2, settotalSavedCo2] = useState(null)

    const [isPrinting, setIsPrinting] = useState(false);
    const promiseResolveRef = useRef(null);
    const [printView, setPrintView] = useState(false);
    const [projValues, setProjValues] = useState(null);
    const [assetTypesList, setassetTypesList] = useState([]);
    const [pdfProjectData, setPdfProjectData] = useState(null);
    const [pdfReportType, setPdfReportType] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);


    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    useEffect(() => {
        if (urlParams && urlParams.id) {
            setPage('UPDATE')
            setProjectId(urlParams.id);
            getProjectDetail(urlParams.id);
            getAssetTypes()
        }
    }, [urlParams]);

    const componentRef = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const onBeforeGetContentResolve = useRef();

    // const handleOnBeforeGetContent = () => {
    //     return new Promise((resolve) => { // `react-to-print` will wait for this Promise to resolve before continuing
    //         // Load data
    //         console.log("loaded dataaa")
    //         onBeforeGetContentResolve.current = resolve;
    //         setDataLoaded(true); // When data is done loading
    //     });
    // };

    useEffect(() => {
        if (dataLoaded) {
            // Resolves the Promise, telling `react-to-print` it is time to gather the content of the page for printing
            onBeforeGetContentResolve.current();
        }
    }, [dataLoaded, onBeforeGetContentResolve]);
    const handlePrint1 = useReactToPrint({
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
        print2: async (printIframe) => {
            const document = printIframe.contentDocument;
            if (document) {
                const html = document.getElementsByClassName("pdf-page")[0];
                const options = {
                    margin: 0,
                    filename: "the-joys-of-buying-over-building.pdf",
                };
                const exporter = new Html2Pdf(html, options);
                await exporter.getPdf(options);
            }
        },
        print11: async (printIframe) => {
            const document = printIframe.contentDocument;
            if (document) {
                const html = document.getElementsByTagName('html')[0];
                // try {
                //     const pdf = await PdfDocument.fromHtml(html);
                //     await pdf.saveAs('generated_pdf.pdf');
                //     alert('PDF generated successfully!');
                // } catch (error) {
                //     console.error('Error generating PDF:', error);
                // }
                console.log(html);
                // const options = {
                //     filename: 'my-document.pdf',
                //     margin: 1,
                //     image: { type: 'jpeg', quality: 0.98 },
                //     jsPDF: {
                //         unit: 'mm',
                //         format: 'letter',
                //         orientation: 'portrait',
                //     },
                // };
                get_PDF_in_base64(html)
                // const exporter = new Html2Pdf(html,{filename:"Note.pdf"});
                // await exporter.getPdf(true);
                // savePdf()
                // await html2pdf().set().from(html).save();

            }
        }
        // removeAfterPrint
    });

    // function savePdf() {
    //     const domElement = document.querySelector('#container')
    //     html2canvas(domElement, {
    //         onclose: (document) => {
    //         }
    //     })
    //         .then((canvas) => {
    //             const img = canvas.toDataURL('image/jpeg')
    //             const pdf = new jsPDF('l', 'mm', 'a3')
    //             // pdf.addImage(imgData, 'JPEG', 0, 0, width, height)
    //             pdf.save('filename.pdf')
    //         })
    // }

    const get_PDF_in_base64 = async (htmldoc) => {
        if (htmldoc) {
            let ppp = {
                orientation: 'p',
                unit: 'pt',
                format: 'a4',
                compress: false,
                fontSize: 10,
                lineHeight: 1,
                autoSize: false,
                printHeaders: true,
            };

            const pdf = new jsPDF(ppp)
            if (pdf) {
                //   domtoimage.toJpeg(htmldoc, { quality: 0.95,scale: 0.8 })
                //     .then(imgData => {
                //         pdf.addImage(
                //             imgData,
                //             'JPEG', 0, 0, pdf.internal.pageSize.width, 200
                //         );
                //     //  pdf.addImage(imgData, 'PNG', 10, 10);
                //       pdf.save('download.pdf');
                //     });
            }
            pdf.html(htmldoc, {
                html2canvas: { scale: 0.8 },
                // pagesplit: true,

                callback: () => {
                    html2canvas(document.querySelector('#container'), {
                        useCORS: true,
                        letterRendering: 1, allowTaint: true,
                    }).then((canvas) => {
                        let imgWidth = 208;
                        let imgHeight = canvas.height * imgWidth / canvas.width;
                        const imgData = canvas.toDataURL('image/jpeg');
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                        // pdf.addImage(
                        //     canvas.toDataURL('image/jpeg'),
                        //     'JPEG', 1.0, 0, pdf.internal.pageSize.width, 200
                        // );
                        // pdf.addImage(canvas.toDataURL('image/jpeg'), 0, 0, pdf.internal.pageSize.width, 200);
                        pdf.save(`download1111.pdf`);
                        // };
                    });
                }

            })
        }
        //     const canvas = await html2canvas(htmldoc,{
        //         width:500,
        //         fon
        //     })

        //     pdf.setFontSize(10);
        //     // pdf.setTextColor(255, 0, 0);
        //     pdf.addImage(
        //         canvas.toDataURL('image/jpeg'),
        //         'JPEG',
        //         5,
        //         5,
        //         500,
        //         200
        //     );
        //     pdf.save();
        //     // const pdfBase64 = pdf.output('dataurlstring');
        //     // console.log("888888888",pdfBase64);
        //     // pdf.html(htmldoc).then(() => {
        //     //     pdf.save();
        //     //     window.open(pdf.output("bloburl"));
        //     // })
        // }
    }


    // const handlePrint1 = () => {
    //     const content = componentRef.current;

    //     const options = {
    //         filename: 'my-document.pdf',
    //         margin: 1,
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: {
    //             unit: 'in',
    //             format: 'letter',
    //             orientation: 'portrait',
    //         },
    //     };

    //     html2pdf().set(options).from(content).save();

    // }


    const getProjectDetail = async (id, isPrint = null) => {
        setLoading(true);
        fetchGet(`${DATAURLS.PROJECT.url}/${id}?fields=id,equipments,sales_ref,process_end_date,project_recieved,comments,project_type,client_ref,project_name,client_ref,project_info,delivery_info,delivery_address,project_status,partner.id,partner.partner_name,contact_attn.phone_number,partner_contact_attn.id,partner_contact_attn.email,partner_contact_attn.first_name,contact_attn.email,contact_attn.id,client.phone_number,client.address2,client.postal_code,client.city,client.id,client.postal_address,client.client_name,tk_project_access.*,priority,process_start_date,status_color,project_financial_access.*,product_report_access.*,tk_trigger.*,project_env_access.*,warehouse`, getAccessToken())
            .then(async (response) => {
                setLoading(false)
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
                projData.tk_project_access = data?.tk_project_access;
                projData.tk_trigger = data?.tk_trigger;
                projData.product_report_access = data?.product_report_access;
                projData.project_financial_access = data?.project_financial_access;
                projData.project_env_access = data?.project_env_access;
                projData.sales_ref = data?.sales_ref
                projData.id = data.id ? data.id : '';
                setValues(projData);
                if (data.partner) {
                    getPartnerusers(data.partner, projData)

                }
                if (data.client) {
                    getClient(data.client, projData)
                }
                // if (isPrint) {
                // }
                // await equipemet_Category(id)
                // setLoading(false);
            })
            .catch((err) => {
                throw err;
            });
    };

    const fetchProjects = async (report) => {
        setPageLoading(true)
        let fields = ''
        fields = 'delivery_address.sub_org,contact_attn.first_name,partner_contact_attn.first_name,invoice_by_client,client_ref,id,partner.partner_name,client.id,client.client_name'

        if (report === 'P') {
            fields = 'client_ref,id,partner.partner_name,client.client_name,partner.partner_logo.id'
        } else if (report === 'PE') {
            fields = 'delivery_address.sub_org,client_ref,id,client.client_name'

        } else if (report === 'F') {
            fields = 'finish_date,project_status,delivery_address.sub_org,contact_attn.first_name,partner_contact_attn.first_name,invoice_by_client,client_ref,id,partner.partner_name,client.client_name,partner.partner_logo.id'

        } else if (report === 'E') {
            fields = 'partner_contact_attn.first_name,id,partner.partner_name,client.client_name,partner.partner_logo.id'
        }
        let queryparam = `filter[id][_eq]=${projectId}&limit=-1&sort=-id&fields=${fields}`;
        await getProjects(queryparam, report)
    }


    const getProjects = async (queryparam, report) => {

        setPdfProjectData(null)
        setPdfReportType(null)
        queryparam = `${queryparam}`
        fetchGet(`${DATAURLS.PROJECT.url}?${queryparam}`, getAccessToken())
            .then(async (response) => {
                setPdfProjectData(response.data[0])
                setPdfReportType(report);

                setLoading(false);
            })
            .catch((err) => {
                throw err;
            });
    }

    useEffect(() => {
        if (pdfProjectData && pdfReportType) {
            handleProductReportOpen(pdfProjectData, pdfReportType)
        }
    }, [pdfProjectData, pdfReportType])

    const handleProductReportOpen = async (params, report) => {

        setPageLoading(true)
        setSnackBarOpen(false)
        //-------------------------
        let fields = '';
        let filter = `&filter={"_and":[{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}}]}`;
        let queryParams = `fields=${fields}${filter}&limit=-1`;

        if (report === 'P') {
            fields = 'asset_id,asset_type,quantity,manufacturer,model,serial_number,processor,memory,hdd,grade,complaint'
            queryParams = `fields=${fields}${filter}&limit=-1`;

        } else if (report === 'PE') {
            fields = 'project_id, asset_id, asset_type, form_factor, Part_No, quantity, manufacturer, model, imei, serial_number, processor, memory, hdd, hdd_serial_number, optical, graphic_card, battery, keyboard, screen, grade, complaint, erasure_ended, data_destruction, wipe_standard, sample_co2, sample_weight'
            queryParams = `fields=${fields}${filter}&limit=-1`;

        } else if (report === 'F') {
            // await printFinancialDocument(params);
            let filter1 = `{"_and":[{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}},{"grade":{"_in":"A,NEW,NOB,AV,A+,AB,B,BV,C,CV,D,DV,E,DV,EV,DA"}}]}`
            if (params.project_status === 'CLOSED') {
                filter1 = `{"_and":[{"created_at":{"_lte":"${params.finish_date}"}},{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}},{"grade":{"_in":"A,NEW,NOB,AV,A+,AB,B,BV,C,CV,D,DV,E,DV,EV,DA"}}]}`
            }
            filter = `&filter=${filter1}&groupBy=asset_type,grade&aggregate={"sum":"quantity"}`;
            queryParams = `${filter}&limit=-1`;

        } else if (report === 'E') {
            await equipemet_Category(params)
            return
        }

        fetchGet(`${DATAURLS.ASSETS.url}?${queryParams}`, getAccessToken())
            .then(async (response) => {
                params.assets = response.data;
                if (report === 'P') {
                    if (response.data?.length > 0) {
                        const isGenerated = await printDocument(params); //product report
                        if (isGenerated) {
                            setPdfProjectData(null)
                            setPdfReportType(null)
                            setPageLoading(false)
                            setSnackBarOpen(true);
                            setSnackBarMessage("Your pdf generated and downloaded.");
                            setSnackBarType('success');
                        }
                    } else {
                        setPdfProjectData(null)
                        setPdfReportType(null)
                        setPageLoading(false)
                        setSnackBarOpen(true);
                        setSnackBarMessage("No records found.");
                        setSnackBarType('error');
                    }
                } else if (report === 'PE' && response.data?.length > 0) {
                    response.data.forEach((obj) => {
                        obj.client_ref = params.client_ref
                        obj.client_name = params.client ? params.client.client_name : ''
                        obj.suborg_name = params.delivery_address ? params.delivery_address?.sub_org : ''
                        if (obj.manufacturer && obj.manufacturer.toUpperCase() === "HEWLETT-PACKARD") {
                            obj.manufacturer = "HP";
                        }
                        let form_factor = null
                        let currentAssetType = ''
                        if (obj.asset_type && obj.form_factor && obj.form_factor !== '') {
                            form_factor = obj.form_factor.trim().toLowerCase()
                            currentAssetType = assetTypesList.filter(
                                (asset) => ((asset.Asset_Name.toLowerCase() === obj.asset_type.toLowerCase()) && asset.formfactor?.trim().toLowerCase() === form_factor)
                            );
                        } else if (obj.asset_type) {
                            currentAssetType = assetTypesList.filter(
                                (asset) => ((asset.Asset_Name.toLowerCase() === obj.asset_type.toLowerCase()) && asset.formfactor === null)
                            );
                        }

                        if (currentAssetType?.length > 0) {
                            obj.sample_co2 = currentAssetType[0]?.sampleco2 || '';
                            obj.sample_weight = currentAssetType[0]?.sample_weight || '';
                        }

                    })
                    await ExportExcel(response.data, `Product report - ${params.id}`)
                    setPageLoading(false)
                } else if (report === 'F') {
                    let AGrade = ['A', 'NEW', 'NOB', 'AV', 'A+', 'AB']
                    let BGrade = ['B', 'BV']
                    let CGrade = ['C', 'CV']
                    let DGrade = ['D', 'DV', 'DA']
                    let EGrade = ['E', 'EV']
                    response.data.forEach((obj) => {
                        if (AGrade.includes(obj.grade)) {
                            obj.grade = 'A'
                        }
                        if (BGrade.includes(obj.grade)) {
                            obj.grade = 'B'
                        }
                        if (CGrade.includes(obj.grade)) {
                            obj.grade = 'C'
                        }
                        if (DGrade.includes(obj.grade)) {
                            obj.grade = 'D'
                        }
                        if (EGrade.includes(obj.grade)) {
                            obj.grade = 'E'
                        }
                        obj.quantity = obj.sum?.quantity
                    })
                    params.assets = response.data;
                    await printFinancialDocument(params);
                    setPageLoading(false)
                } else if (response.data?.length === 0) {
                    setPdfProjectData(null)
                    setPdfReportType(null)
                    setPageLoading(false)
                    setSnackBarOpen(true);
                    setSnackBarMessage("No records found");
                    setSnackBarType('error');

                }
            })
            .catch((err) => {
                setPageLoading(false);
                throw err;
            });
    };



    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Environment report - ${projValues?.id}`,
        removeAfterPrint: true,
        onBeforePrint: () => setreportloading(false),
        onAfterPrint: () => { reset() },
        // print: () => { reset() },
    });

    const reset = () => {
        setEquipemetCategory([])
        setEquipemetCategoryTotal(0)
        setSavedCO2([])
        settotalSavedCo2(0)
        setconsumedco2([]);
        setPdfProjectData(null);
        setProjValues(null);
        setPrintView(false)
        setLoading(false);

    }

    let otherTypes = ['MOUSE', 'ADAPTER', 'CABLE', 'PARTS COMPUTER', 'DOCKING', 'HDD', 'COMPONENTS', 'PARTS MOBILE', 'PARTS SERVER']
    let mainTypes = ['COMPUTER', 'TELECOM & VIDEOCONFERENCE', 'MOBILE DEVICE', 'NETWORK', 'MONITOR', 'MISC', 'POS', 'SERVER & STORAGE', 'PROJECTOR', 'PRINTER', 'SWITCH']


    const equipemet_Category = async (params) => {
        // console.log("params", params.id)
        let fields = `limit=-1&page=1&filter={"_and":[{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}},{"grade":{"_nnull":true}}]}&groupBy=asset_type,grade&aggregate={"sum":"quantity"}`;
        fetchGet(`${DATAURLS.ASSETS.url}?${fields}`, getAccessToken())
            .then(async (response) => {
                if (response?.data?.length > 0) {
                    let mainType = []
                    let other_Type = []
                    response.data.forEach((item) => {
                        // console.log("item",item)
                        // console.log("other gradeee",otherGrade.includes(item.grade))
                        // console.log("other typeeeeeeeeee",otherTypes.includes(item.asset_type))

                        if (!otherTypes.includes(item.asset_type)) {

                            mainType.push({
                                value: Number(item.sum.quantity),
                                type: item.asset_type
                            })
                        } else if (otherTypes.includes(item.asset_type)) {
                            // console.log("item",item)

                            other_Type.push({
                                value: Number(item.sum.quantity),
                                type: 'OTHERS'
                            })
                        }
                    })
                    // console.log("other_Type",other_Type)
                    let otherValue = other_Type.reduce((total, { value }) => total + parseInt(value), 0)
                    let joinTypes = [...mainType]
                    if (other_Type?.length > 0) {
                        joinTypes = [...mainType, { value: otherValue, type: 'OTHERS' }]
                    }
                    joinTypes = _(joinTypes)
                        .groupBy('type')
                        .map(group => ({
                            type: group[0]?.type,
                            "value": (_.round(_.sumBy(group, x => x.value ? parseFloat(x.value) : 0), 0)),
                        }))
                        .value();
                    let totalValue = joinTypes.reduce((total, { value }) => total + parseInt(value), 0)

                    // console.log("joinTypes", joinTypes)
                    joinTypes = [...joinTypes].sort((a, b) => b.value - a.value);
                    setEquipemetCategory(joinTypes);
                    setEquipemetCategoryTotal(totalValue)
                    // setPageLoading(false)
                    await totalco2(params)
                } else {
                    setEquipemetCategory([])
                    setEquipemetCategoryTotal(0)
                    setSavedCO2(0)
                    settotalSavedCo2(0)
                    setconsumedco2(0)
                    setPdfProjectData(null)
                    setPdfReportType(null)
                    setPageLoading(false)
                    setSnackBarOpen(true);
                    setSnackBarMessage("No records found.");
                    setSnackBarType('error');
                }

            })
            .catch((err) => {
                throw err;
            });
    }

    const getAssetTypes = async () => {
        let fields3 = '?limit=-1&sort=Asset_Name&fields=Asset_Name,formfactor,sample_weight,sampleco2&filter[Asset_Name][_nnull]=true';

        fetchGet(`${DATAURLS.ASSETTYPES.url}${fields3}`, getAccessToken())
            .then(async (response) => {
                setassetTypesList(response.data)
            })
            .catch((err) => {
                throw err;
            });
    }

    const totalco2 = async (params) => {
        let fields = `limit=-1&page=1&fields=asset_id,form_factor,asset_type,sample_co2,quantity,grade&filter={"_and":[{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}}]}`;
        fetchGet(`${DATAURLS.ASSETS.url}?${fields}`, getAccessToken())
            .then(async (response) => {
                let consumed_co2 = [];
                let total_co2 = 0;
                let tempData = response.data
                let recycled = [];
                let remarketed = [];

                let SelGrade = []
                if (response?.data?.length > 0) {
                    response.data.forEach((item) => {
                        let status = ''
                        let form_factor = null
                        let currentAssetType = ''
                        if (item.form_factor) {
                            form_factor = item.form_factor.trim().toLowerCase();
                            currentAssetType = assetTypesList.filter(
                                (asset) => ((asset.Asset_Name.toLowerCase() === item.asset_type.toLowerCase()) && asset.formfactor?.trim().toLowerCase() === form_factor)
                            );
                        }
                        if (currentAssetType?.length > 0) {
                            item.sample_co2 = currentAssetType[0]?.sampleco2 || '';
                        }
                        // console.log("currentAssetType",currentAssetType)
                        let mainGrade = ['A', 'B', 'C', 'NEW', 'NOB', 'AV', 'A+', 'AB', 'BV', 'CV']
                        let otherGrade = ['D', 'DV', 'DA', 'E', 'EV']
                        let combinegrade = [...mainGrade, ...otherGrade]
                        if (item.grade && combinegrade.includes(item.grade)) {
                            if (mainTypes.includes(item.asset_type.trim().toUpperCase()) && mainGrade.includes(item.grade)) {
                                status = 'Remarketing'
                                remarketed.push({
                                    status: status,
                                    quantity: Number(item.quantity),
                                    asset_type: item.asset_type,
                                    sample_co2: Number(item.sample_co2),
                                    grade: item.grade
                                })
                            } else if (otherTypes.includes(item.asset_type.trim().toUpperCase()) && otherGrade.includes(item.grade)) {
                                status = 'Recycling'
                                // console.log("itemmmm", item)
                                recycled.push({
                                    status: status,
                                    quantity: Number(item.quantity),
                                    asset_type: item.asset_type,
                                    sample_co2: Number(item.sample_co2),
                                    grade: item.grade
                                })
                            } else if (mainTypes.includes(item.asset_type.trim().toUpperCase()) && otherGrade.includes(item.grade)) {
                                status = 'Recycling'
                                // console.log("itemmmm", item)
                                recycled.push({
                                    status: status,
                                    quantity: Number(item.quantity),
                                    asset_type: item.asset_type,
                                    sample_co2: Number(item.sample_co2),
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
                                quantity: item.quantity,
                                asset_type: item.asset_type,
                                status: item.status,
                                sample_co2: Number(item.quantity) * Number(item.sample_co2),
                                sample_co2_50: ((Number(item.quantity) * Number(item.sample_co2)) / 100) * 50,
                                grade: item.grade
                            })
                        } if (otherTypes.includes(item.asset_type.trim().toUpperCase())) {
                            other_Type.push({
                                quantity: item.quantity,
                                asset_type: 'OTHERS',
                                status: item.status,
                                sample_co2: Number(item.quantity) * Number(item.sample_co2),
                                sample_co2_50: ((Number(item.quantity) * Number(item.sample_co2)) / 100) * 50,
                                grade: item.grade
                            })
                        }
                    })

                    recycled.forEach((item) => {
                        if (mainTypes.includes(item.asset_type.trim().toUpperCase())) {
                            main_Type1.push({
                                quantity: item.quantity,
                                asset_type: item.asset_type,
                                status: item.status,
                                sample_co2: Number(item.quantity) * Number(item.sample_co2),
                                sample_co2_50: ((Number(item.quantity) * Number(item.sample_co2))),
                                grade: item.grade
                            })
                        } if (otherTypes.includes(item.asset_type.trim().toUpperCase())) {
                            other_Type1.push({
                                quantity: item.quantity,
                                asset_type: 'OTHERS',
                                status: item.status,
                                sample_co2: Number(item.quantity) * Number(item.sample_co2),
                                sample_co2_50: ((Number(item.quantity) * Number(item.sample_co2))),
                                grade: item.grade
                            })
                        }
                    })


                    //--- recycled or remarketed
                    // remarketed = [...main_Type,...main_Type1]
                    // recycled = [...other_Type,...other_Type1]
                    // console.log("AGrade", AGrade)
                    // console.log("other_Type", other_Type)
                    remarketed = [...main_Type]
                    if (other_Type?.length > 0) {
                        remarketed = [...main_Type, ...other_Type]
                    }
                    recycled = [...main_Type1, ...other_Type1]
                    if (other_Type1?.length > 0) {
                        recycled = [...main_Type1, ...other_Type1]
                    }
                    // console.log("main_Type1", main_Type1)
                    // console.log("other_Type1", other_Type1)

                    //--- recycled or remarketed
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
                    let remarketedrecycled = [...remarketedrecycled1, ...remarketedrecycled2]

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
                    saved_co2.forEach((item) => {
                        if (item.type === 'OTHERS-RECYCLING' || item.type === 'OTHERS-REMARKET') {
                            item.type = 'OTHERS'
                        }
                    })
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
                    consumed_co2.forEach((item) => {
                        if (item.type === 'OTHERS-RECYCLING' || item.type === 'OTHERS-REMARKET') {
                            item.type = 'OTHERS'
                        }
                    })
                    setconsumedco2(consumed_co2)

                    total_co2 = _.round(_.sumBy(consumed_co2, x => x.value ? (parseFloat(x.value)) : 0), 0)
                    settotalConsumeCo2(total_co2)
                }

                setProjValues(params)
                setPrintView(true)

                setPageLoading(false)
                // await remarket_recycled(id)
            })
            .catch((err) => {
                setSavedCO2(0)
                settotalSavedCo2(0)
                setconsumedco2(0)

                throw err;
            });
    }

    useEffect(() => {
        if (projValues && printView && equipemetCategory && consumedco2 && savedCO2 && remarketRecycled) {
            setTimeout(() => {
                handlePrint();
            }, [2000])
            // setPrintView(false)
            // setPageLoading(false)
        }
    }, [projValues, printView, equipemetCategory, consumedco2, savedCO2, remarketRecycled])


    const getPartnerusers = (partner, proj_data) => {
        if (partner) {
            let fields = `limit=-1&sort=first_name&filter={"_and":[{"status":{"_neq":"suspended"}},{"email":{"_nnull":true}},{"partner":{"_eq":"${partner}"}}]}&fields=isDefault,role_name,first_name,last_name,role.description,email,id,role.id,userType,partner.id,client.id,access,role.name`;
            fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
                .then((response) => {
                    if (response?.data?.length > 0) {
                        if (!proj_data.partner_contact_attn) {
                            let defaultUser = response.data.filter((item) => item.isDefault)
                            if (defaultUser?.length > 0) {
                                let val = {
                                    partner_contact_attn: defaultUser[0].id,
                                    partner: partner
                                };
                                setValues({ ...proj_data, ...val });
                            }
                        }

                    }


                    setPartnerUsers(response.data)
                })
                .catch((err) => {
                    throw err;
                });
        }
    }



    const getAdminusers = () => {
        let filter = `{"_and":[{"role":{"description":{"_eq":"Administrator"}}},{"email":{"_nnull":true}},{"status":{"_neq":"suspended"}}]}`

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
        let fields4 = 'limit=-1&sort=client_name&fields=delivery_info,phone_number,address2,postal_code,postal_address,city,id,country,client_org_no,client_name';
        let fields = 'limit=-1&sort=partner_name&fields=id,commission,partner_name,partner_org_no';
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
            if (values?.tk_project_access?.length > 0) {
                let tk_project_access = values.tk_project_access
                users.forEach((item) => {
                    if (tk_project_access && tk_project_access.length > 0) {
                        item.checked = tk_project_access.some(el => el.projects_users_id === item.id);
                    } if (item.isDefault) {
                        item.checked = true
                    }
                })

                let chkd = users.filter((item) => item.checked)
                chkd = chkd.map((item) => item.id)
                chkd = _.uniq(chkd)
                setChecked(chkd)
            } else {
                users.forEach((item) => {
                    if (item.isDefault) {
                        item.checked = true
                    }
                })
                let chkd = users.filter((item) => item.checked)
                chkd = chkd.map((item) => item.id)
                chkd = _.uniq(chkd)
                setChecked(chkd)
            }
            if (values?.project_financial_access?.length > 0) {
                let project_financial_access = values.project_financial_access
                users.forEach((item) => {
                    if (project_financial_access && project_financial_access.length > 0) {
                        item.checked = project_financial_access.some(el => el.projects_users_id === item.id);
                    }
                })
                let chkd1 = users.filter((item) => item.checked)
                chkd1 = chkd1.map((item) => item.id)
                chkd1 = _.uniq(chkd1)
                setFinancialReportChecked(chkd1)
            }
            if (values?.project_env_access?.length > 0) {
                let project_env_access = values.project_env_access
                users.forEach((item) => {
                    if (project_env_access && project_env_access.length > 0) {
                        item.checked = project_env_access.some(el => el.env_users_id === item.id);
                    }
                })
                let chkd1 = users.filter((item) => item.checked)
                chkd1 = chkd1.map((item) => item.id)
                chkd1 = _.uniq(chkd1)
                setEnvReportChecked(chkd1)
            }

            if (values?.product_report_access?.length > 0) {
                let product_report_access = values.product_report_access
                users.forEach((item) => {
                    if (product_report_access && product_report_access.length > 0) {
                        item.checked = product_report_access.some(el => el.project_users_id === item.id);
                    }
                })
                let chkd2 = users.filter((item) => item.checked)
                chkd2 = chkd2.map((item) => item.id)
                chkd2 = _.uniq(chkd2)
                setProductReportChecked(chkd2)
            }

            if (values?.tk_trigger?.length > 0) {
                let tk_trigger = values.tk_trigger;
                // console.log("tk_trigger===>",tk_trigger)

                users.forEach((item) => {
                    if (tk_trigger && tk_trigger.length > 0) {
                        item.tk_trigger_checked = tk_trigger.some(el => el.project_users_id === item.id);
                    }
                })
                let chkd3 = users.filter((item) => item.tk_trigger_checked)
                chkd3 = chkd3.map((item) => item.id)
                chkd3 = _.uniq(chkd3)
                // console.log("chkd3===>",chkd3)

                setTKTriggerChecked(chkd3)
            }

            if (values.tk_project_access?.length === 0) {

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

    const getClient = (client, proj_data) => {
        if (client) {
            // getClientAddress(client);
            let fields = `limit=-1&sort=first_name&filter={"_and":[{"status":{"_neq":"suspended"}},{"email":{"_nnull":true}},{"client":{"_eq":"${client}"}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,partner.id,client.id,access,role.name`;
            fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
                .then((response) => {
                    // let val = {
                    //   contact_email: '',
                    //   contact_phone_number: ''
                    // }
                    response.data.forEach((item) => {
                        item.checked = false;
                    })

                    if (values.tk_project_access && values.tk_project_access.length > 0) {
                        let selectedUseres = values.tk_project_access.map(
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
            setValues({ ...proj_data });
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

        setLoading(true);

        if (projectId) {
            let existingAccess = values.tk_project_access;
            // delete values.id;
            // delete values.contact_attn;
            values.id = projectId;
            delete values.user_created;
            delete values.user_updated;
            delete values.tk_project_access;
            let tk_project_access = [];
            let actions = {};
            if (checked && checked.length > 0) {
                for (var i = 0; i < checked.length; i++) {
                    let val = {
                        project_id: projectId,
                        projects_users_id: {
                            id: checked[i],
                        },
                    };

                    tk_project_access.push(val);
                }
                let ids = []
                if (existingAccess?.length > 0) {
                    ids = existingAccess.map(
                        (col) => col.id
                    );
                }
                actions.create = tk_project_access;
                actions.delete = ids;
            }
            values.tk_project_access = actions;
            //--------------------------
            let extkAccess = values.tk_trigger;

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
            values.tk_trigger = tkactions;
            //-------------------------
            let exprodAccess = values.product_report_access;

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
            values.product_report_access = prodactions;
            //-------------------------
            let exfinAccess = values.project_financial_access;

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
            values.project_financial_access = finactions;

            //------------------- ENV ACCESS
            let exenvAccess = values.project_env_access;

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
            values.project_env_access = envactions;

            //-------------------
            // console.log("valuesss", values.tk_trigger)
            // return
            delete values.commision_percentage
            delete values.order_commission
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
            //set 
            if (!values.commision_percentage) {
                delete values.order_commission
            }

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
            values.tk_project_access = actions;
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
            values.tk_trigger = tkactions;
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
            values.product_report_access = prodactions;
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
            values.project_financial_access = finactions;
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
            values.project_env_access = envactions;
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


    const handleGeneratePdf = () => {
        const doc = new jsPDF('p', 'pt', 'a3')


        // Adding the fonts.
        // doc.setFont('Montserrat-Medium', 'bold');
        // doc.setFontSize(22);
        // doc.setTextColor(255, 0, 0);
        // doc.text(20, 20, 'This is a title');

        // doc.setFontSize(16);
        // doc.setTextColor(0, 255, 0);
        // doc.text(20, 30, 'This is some normal sized text underneath.');
        // doc.setFillColor(0, 0, 255);
        doc.html(componentRef.current, {
            async callback(doc) {
                // console.log("resultttt")
                await doc.save('document.pdf');
            },
        });
    };


    return (
        <>
            <PageLoader pageLoaderOpen={pageLoading} setPageLoaderOpen={setPageLoading} content='Please wait. Your file is preparing to download.' />

            <div className="go-back">
                <CustomGoBackButton to={`projects${values?.id ? "/" + values.id : ''}`} color="warning" title='Go Back' />
                {urlParams && urlParams.id && <CustomGoBackButton color="primary" target="blank" title='Show assets' to={`projectassets/${values.id}`} />}
            </div>
            <div>
                {/* //style={{ display: 'none' }} */}
                {printView && projValues?.id && <div id="container" className="pdf-page" style={{ display: 'none' }} >
                    {/* <PDF_FILE

                        totalSavedCo2={totalSavedCo2}
                        totalConsumeCo2={totalConsumeCo2}
                        printView={printView}
                        consumedco2={consumedco2}
                        loading={loading}
                        values={projValues}
                        remarketRecycled={remarketRecycled}
                        equipemetCategory={equipemetCategory}
                        equipemetCategoryTotal={equipemetCategoryTotal}
                        savedCO2={savedCO2}
                    /> */}
                    <ComponentToPrint
                        ref={componentRef}
                        totalSavedCo2={totalSavedCo2}
                        totalConsumeCo2={totalConsumeCo2}
                        printView={printView}
                        consumedco2={consumedco2}
                        loading={loading}
                        values={projValues}
                        remarketRecycled={remarketRecycled}
                        equipemetCategory={equipemetCategory}
                        equipemetCategoryTotal={equipemetCategoryTotal}
                        savedCO2={savedCO2}
                    />

                </div>
                }
                {/* <div ref={componentRef}>
                    <ReportTemplate />
                </div> */}
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
                                <h3 className={"card_label"}>{urlParams && urlParams.id ? `Project Number - ${urlParams.id}` : 'Create Project'}</h3>
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
                                                        (urlParams?.id) && <div style={{ float: 'left' }}>
                                                            {
                                                                (values.project_status !== 'ORDER') && <>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={() => { fetchProjects('P') }}>{
                                                                            reportloading && <CircularProgress />
                                                                        }<span className='indicator-label'>{'Product report'}</span></Button> &nbsp;
                                                                    </>
                                                            }
                                                            {
                                                                (values.project_status === 'PROCESSING FINISHED' || values.project_status === 'REPORTING' || values.project_status === 'CLOSED') &&
                                                                <>
                                                                    <Button variant="contained"
                                                                        onClick={() => { fetchProjects('E') }}
                                                                        color="primary">{
                                                                            reportloading && <CircularProgress />
                                                                        }<span className='indicator-label'>{'Environment report'}</span></Button> &nbsp;
                                                                    </>
                                                            }
                                                            {
                                                                (currentUser.userType === 'ADMIN' || currentUser.userType === 'ASSOCIATE') && <>
                                                                    <Button variant="contained"
                                                                        onClick={() => { fetchProjects('F') }}
                                                                        color="primary"><span className='indicator-label'>{'Financial report'}</span></Button> &nbsp;&nbsp;
                                                                    </>
                                                            }
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