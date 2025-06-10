import { PlusOutlined, DeleteFilled, DownloadOutlined, UploadOutlined, StopOutlined, CloseCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Button } from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Link, useParams, useLocation } from 'react-router-dom'

import { connect, history } from 'umi';
import { generateExcelNew } from '@/utils/generateExcel';
import { printDocument, printFinancialDocument } from '@/utils/generatePdf';


import {
  useState, useEffect, useMemo,
  useRef,
} from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
import LinkCellRenderer from '../../components/LinkCellRenderer';
import * as moment from 'moment';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS, APIPREFIX } from '../../../utils/constants';
// import { DATAURLS } from '../../../utils/font';
import { fetchPut, fetchPost, fetchGet, fetchDelete, ExportExcel, calculateDays } from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import FileUpload from '../components/FileUpload';
import DropDownSelect from '../components/SelectDropDown'
import SelectDropDownOwner from '../components/SelectDropDownOwner'
import SelectDropDownSalesref from '../components/SelectDropDownSalesref'
import SelectDate from '../components/SelectDate'
import SelectFinishDate from '../components/SelectFinishDate'
import SelectInvoiceDate from '../components/SelectInvoiceDate'
import SelectCreatedDate from '../components/SelectCreatedDate'
import styles from '../../assets/style.less';
import NotesDialog from '../components/NotesDialog';
import ProjetcreportDialog from '../components/ProjetcreportDialog';
import NumericEditor from '../../assets/components/NumericEditor';

import PageLoader from '../../components/pageloader/PageLoader';

import 'jspdf-autotable';
import _ from "lodash";
import { useReactToPrint } from 'react-to-print';
import Drawer from '../../components/sidedrawer';
import ComponentToPrintNew from '../components/EnvPdf';
import DateTimeFilter from '../components/DateTimeFilter'
import ShowImages from '../../assets/components/ImagesDialog';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      //   display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '93vh',
      //   marginLeft: '4vw',
      // marginTop: '80px',
    },

    buttonBox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '50%',
    },
    buttonArea: {
      display: 'flex',
    },
    select: {
      color: 'white',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // color: '#212121',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1rem',
      // marginTop: '10px',
      width: '95%',
      height: '40px',
      boxShadow: '0px 0px 5px #222',
      paddingLeft: '10px',
      background: 'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
    },
    actionArea: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '30%',
    },
    actionIcon: {
      fontSize: '1rem',
      cursor: 'pointer',
      color: theme.primary,
    },
    textRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      height: '30px',
    },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    newBtn: {
      color: '#FFFFFF',
    },
  }),
);

const Projects = (props) => {
  const { currentUser } = props;
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';
  const fieldNames = ['process_start_date', 'project_status', 'date_created', 'finish_date', 'user_created', 'sales_ref', 'invoice_date']
  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRendererParams: {
          handleEdit: (params) => handleEdit(params),
          handleDelete: (params) => handleDelete(params),
          handleNotestOpen: (params) => handleNotestOpen(params),
          handleFilePrintProdReport: (params, report) => fetchProjects(params, report),
          users: users,
          userRole: currentUser?.role?.name,
          setSnackBarOpen,
          setSnackBarMessage,
          setSnackBarType,
          rowData: rowData,
          setRowData,
          successCall,
          urlpage: 'projectassets',
          showImages: (params) => showImages(params),
          page: 'projects'
        },
        cellRenderer: index === 0
          ? 'ActionCellRenderer' : columnDef.field === 'id' ? (currentUser?.userType !== 'FINANCIAL' ? 'LinkCellRenderer' : null) : columnDef.component && fieldNames.includes(columnDef.field) && currentUser?.userType === 'ADMIN' ? columnDef.component : false,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: params => params.data.project_status !== 'CLOSED' ? columnDef.editable : (columnDef.field === "invoice_ref" || columnDef.field === "invoice_rec_amount" ? true : false),
        // editable: (params) => page === 'financials' ? (columnDef.field !== 'project_status' ? columnDef.editable : false) : columnDef.editable,
        // editable: columnDef.editable,
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionCurrentPageOnly: true,
        sortable: true,
        resizable: true,
        hide: page === 'financials' ? columnDef.isFinanceHide : columnDef.hide,
        width: index === 0 ? 250 : 'auto',
        floatingFilter: true,
        filter: ('agTextColumnFilter'),
        cellEditor: null,
        filterParams: null,
        valueGetter: (params) => {
          // if (columnDef.field === 'user_created') {
          //   return params.data.user_created
          // }
          if (columnDef.field === 'project_status') {
            // let value = params.data.project_status === 'CLOSED' ? false : true

            columnDefinition.editable = false
          }
          if (columnDef.field === 'client_name') {
            return params?.data?.client?.client_name;
          }
          if (columnDef.field === 'partner_name') {
            return params?.data?.partner?.partner_name;
          }
          if (columnDef.field === 'client_org_no') {
            return params?.data?.client?.client_org_no;
          }
          if (columnDef.field === 'partner_org_no') {
            return params?.data?.partner?.partner_org_no;
          }

          if (columnDef.field === 'user_created') {
            return params?.data?.user_created?.email;
          }
          if (columnDef.field === 'sales_ref') {
            return params?.data?.sales_ref?.email;
          }
          if (columnDef.type === 'numericColumn') {
            return params.data[columnDef.field] ? params.data[columnDef.field] : null;
          }
          if (columnDef.field === 'order_commission' && params?.data?.order_commission) {
            return parseFloat(params?.data?.order_commission);
          }
          if (params?.data?.invoice_by_client && params?.data?.invoice_rec_amount) {
            if (Number(params.data.invoice_rec_amount) > 0) {
              params.data.difference = parseFloat(params.data.invoice_by_client) - parseFloat(params.data.invoice_rec_amount);
            } else {
              params.data.difference = null
            }
          }
          if (columnDef.field === 'delivery_address.sub_org') {
            return params?.data?.delivery_address?.sub_org;
          }

          return params.data[columnDef.field];
        },
        valueFormatter: (params) => {
          if (columnDef.type === 'date' && params.value) {
            return params.value ? moment(params.value).format('YYYY-MM-DD') : null;
          }
          if (columnDef.type === 'datetime' && params.value) {
            return params.value ? moment(params.value).format('YYYY-MM-DD hh:mm') : null;
          }
          if (columnDef.type === 'percentage' && params.value) {
            return params.value ? `${params.value} %` : null;
          }
        },
      };


      if (columnDef.type === 'numericColumn') {
        // columnDefinition.cellEditor = 'NumericEditor';
      }
      return columnDefinition;
    });
  };

  const frameworkComponents = {
    LinkCellRenderer,
    ActionCellRenderer,
    DropDownSelect,
    SelectDate,
    SelectCreatedDate,
    SelectFinishDate,
    SelectInvoiceDate,
    SelectDropDownOwner,
    SelectDropDownSalesref,
    NumericEditor,
    agDateInput: DateTimeFilter
  };
  // const LinkCellRenderer = (params) => {
  //   return <>
  //     12312
  //   </>
  // }
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(100);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [displayFields, setDisplayFields] = useState([]);
  const [enableDelete, setEnableDelete] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [project_params, setProjectparams] = useState('');
  const [project_ids, setprojectids] = useState('');
  const [users, setUsers] = useState([]);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [page, setPage] = useState('')
  const location = useLocation()
  const [showFileExportDialog, setShowFileExportDialog] = useState(false);
  const gridRef = useRef();
  const urlParams = useParams();
  const [pageLoading, setPageLoading] = useState(false);
  const componentRef = useRef(null);
  const [remarketRecycled, setRemarketRecycled] = useState(null)
  const [savedCO2, setSavedCO2] = useState(null)
  const [equipemetCategory, setEquipemetCategory] = useState(null)
  const [equipemetCategoryTotal, setEquipemetCategoryTotal] = useState(0)
  const [consumedco2, setconsumedco2] = useState(null)
  const [reportloading, setreportloading] = useState(false)
  const [totalConsumeCo2, settotalConsumeCo2] = useState(null)
  const [totalSavedCo2, settotalSavedCo2] = useState(null)
  const [pdfProjectData, setPdfProjectData] = useState(null);
  const [pdfReportType, setPdfReportType] = useState(null);
  const [printView, setPrintView] = useState(true);
  const [projValues, setProjValues] = useState(null);
  const [assetTypesList, setassetTypesList] = useState([]);
  const [tempColumns, setTempColumns] = useState([]);
  const [isSelect, setIsSelect] = useState(true)
  const [presetId, setPresetId] = useState()
  const [tempColumnDefs, setTempColumnDefs] = useState(null);
  const [tempFieldsList, setTempFieldsList] = useState([])
  const [values, setValues] = useState([]);
  const [openImages, setOpenImages] = useState(false);

  useEffect(() => {
    if (urlParams && gridApi, page) {
      setQuickFilterText(urlParams.id);
      var refresh = window.location.protocol + "//" + window.location.host + '/' + page;
      window.history.pushState({ path: refresh }, '', refresh);

    }
  }, [urlParams, gridApi, page]);

  useEffect(() => {
    if (location) {
      let currentpage = location.pathname.split("/")
      setPage(currentpage[1])
    }
  }, [location]);

  useEffect(() => {
    if (location && currentUser?.userType) {
      let currentpage = location.pathname.split("/")
      if (currentUser?.userType !== 'ADMIN' && currentUser?.userType !== 'FINANCIAL' && currentpage[1] === 'financials') {
        history.push({
          pathname: '/projects'
        });
      }
    }
  }, [location, currentUser]);


  useEffect(() => {
    if (currentUser && currentUser?.userType === 'CLIENT') {
      setDisplayFields(['actions', 'handling_comments', 'id', , 'delivery_address.sub_org', 'client', 'project_name', 'project_info', 'project_status', 'cabinets', 'priority', 'process_start_date', 'finish_date', 'client_ref', 'no_of_assets_1']);
    }
    if (currentUser && currentUser?.userType === 'PARTNER') {
      setDisplayFields(['actions', 'handling_comments', 'id', 'partner', 'client_name', 'project_name', 'project_info', 'project_status', 'cabinets', 'priority', 'process_start_date', 'finish_date', 'client_ref', 'no_of_assets_1']);
    }
  }, [currentUser]);



  useEffect(() => {
    if (page && displayFields && gridApi) {
      getusers();
      getAssetTypes();
    }
  }, [page && displayFields, gridApi]);

  useEffect(() => {
    if (gridApi && tempColumnDefs) {
      getPresets();
    }
  }, [gridApi, tempColumnDefs]);

  const getColumnDefinitions = () => {
    let order_by = 'order_by'
    if (currentUser.userType === 'PARTNER') {
      order_by = 'order_by_partner'
    }
    if (currentUser.userType === 'CLIENT') {
      order_by = 'order_by_client'
    }
    let filter1 = ''
    if (page === 'projects' && currentUser.userType !== 'ADMIN') {
      filter1 = `&filter[isAdminView][_eq]=false`
    }
    if (page === 'financials' && currentUser?.role?.name === 'Administrator') {
      filter1 = `&filter[isFinanceView][_eq]=true`
    }

    let fields1 = `?limit=-1&sort=${order_by}${filter1}`

    // Fetching column definition
    fetchGet(`${DATAURLS.PROJECTCOLUMNDEFINITION.url}${fields1}`, getAccessToken())
      .then((response) => {
        let result = response.data;
        if (displayFields?.length > 0) {
          result = result.filter((a) => displayFields.includes(a.field));
        }
        setTempColumnDefs(result);
      })
      .catch((err) => {
        throw err;
      });
  }
  const getNewData = async (gridApi) => {
    setLoading(true);
    gridApi && gridApi.showLoadingOverlay();


    let filter = ''
    let params = `limit=-1&sort=-id&fields=isProductReport,isEnvReport,isFinanceReport,id,project_name,project_status,project_info,status,finish_date,process_start_date,client_ref,no_of_assets_1,delivery_address.sub_org`;
    if (currentUser && currentUser?.userType === 'CLIENT') {
      params = `${params}`
      getProjectUsers(params);

    } else if (currentUser && currentUser?.userType === 'PARTNER') {
      params = `limit=-1&sort=-id&fields=client.client_name,isProductReport,isEnvReport,isFinanceReport,id,project_name,project_status,project_info,status,finish_date,process_start_date,client_ref,no_of_assets_1`;

      params = `${params}`
      if (currentUser?.isDefault) {
        getProjects(params, currentUser)
        return
      }
      getProjectUsers(params);
    } else if (currentUser && currentUser?.userType === 'ADMIN') {
      if (page === 'projects') {
        params = `limit=-1&sort=-id&fields=warehouse,isProductReport,isEnvReport,isFinanceReport,component,invoice_ref,process_end_date,project_recieved,comments,project_type,finish_date,client_ref,project_status,project_name,status,project_info,delivery_info,postal_address,id,partner.commission,partner.id,partner.partner_name,partner.partner_org_no,client.id,client.client_name,client.client_org_no,date_created,finish_date,no_of_assets,no_of_assets_1,priority,process_start_date,processed_units_sold,user_created,user_created.email,user_created.first_name,user_created.id,sales_ref.id,sales_ref.email,handling_comments,total_images,arrived_time`;
      } else {
        params = `limit=-1&sort=-id&fields=kickback_percentage,kickback_revenue,isProductReport,isEnvReport,isFinanceReport,invoice_rec_amount,order_commission,order_revenue,difference,invoice_date,remarketing,logistics,commision,revenue,commision_percentage,buyout,handling,software,other,invoice_by_client,invoice_ref,project_type,client_ref,project_status,project_name,status,project_info,id,partner.id,partner.commission,partner.partner_name,partner.partner_org_no,client.id,client.client_name,client.client_org_no,handling_comments,sales_ref.id,sales_ref.email,warehouse`;
      }
      setProjectparams(params)
      getProjects(params, currentUser)
    } else if (currentUser && currentUser?.userType === 'FINANCIAL') {
      params = `limit=-1&sort=-id&fields=kickback_percentage,kickback_revenue,isProductReport,isEnvReport,isFinanceReport,invoice_rec_amount,order_commission,order_revenue,difference,invoice_date,remarketing,logistics,commision,revenue,commision_percentage,buyout,handling,software,other,invoice_by_client,invoice_ref,project_type,client_ref,project_status,project_name,status,project_info,id,partner.id,partner.commission,partner.partner_name,partner.partner_org_no,client.id,client.client_name,client.client_org_no,handling_comments,sales_ref.id,sales_ref.email,warehouse`;

      params = `${params}`
      getProjects(params, currentUser)

      // getProjectUsers(params);
    }
    // fetchGet(`${DATAURLS.PROJECT.url}?${fields4}`, getAccessToken())
    //   .then((response) => {
    //     setRowData(response.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });
    gridApi && gridApi.hideOverlay();
    highlightUnsavedRows();

  };

  const getusers = () => {
    let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"_or":[{"userType":{"_eq":"ADMIN"}}]}]}&fields=first_name,id,email`;
    fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
      .then((response) => {
        setUsers(response.data)
      })
      .catch((err) => {
        throw err;
      });
  }

  const getProjectUsers = (projectparams) => {
    setProjectparams(projectparams)
    let parms = ''
    let params_1 = `limit=-1&sort=-id`;
    parms = `&filter={"_and":[{"project_id":{"_nnull":true}}]}`
    // &filter={"_and":[{"projects_users_id":{"_eq":"bf5b0f79-aa5e-4b67-874e-2177c047189c"}}]}
    params_1 = `${params_1}${parms}`;
    fetchGet(`${DATAURLS.PROJECTUSERSIDS.url}?${params_1}`, getAccessToken())
      .then((response) => {
        let projs = [];
        if (response && response?.data?.length > 0) {
          projs = response.data.map(
            (obj) => obj.project_id
          );
          setprojectids(projs)
          getProjects(projectparams, projs)

        }
      })
      .catch((err) => {
        throw err;
      });
  }

  const getProjects = async (queryparam, projectsIds = [], status = null, isreport = null, project_id) => {

    // await printFinancialDocument();
    // return

    gridApi && gridApi.showLoadingOverlay();
    let filter = ''
    if (!isreport) {
      let cond = ''
      if (status === 'proces_finished') {
        cond = `{"project_status":{"_nin":["PROCESSING+FINISHED","SALES+PERIOD","REPORTING","CLOSED","ONHOLD"]}},{"project_status":{"_nnull":true}}`
      } else if (status === 'CLOSED') {
        cond = `{"project_status":{"_nin":["CLOSED"]}},{"project_status":{"_nnull":true}}`
      } else {
        gridApi && gridApi.setFilterModel(null)
      }
      if (projectsIds?.length > 0) {
        if (currentUser && currentUser?.userType === 'CLIENT') {
          filter = `&filter={"_and":[{"_and":[{"id":{"_in":"${projectsIds.toString()}"}}${cond ? "," + cond : ''}]}]}`
        } else if (currentUser && currentUser?.userType === 'PARTNER') {
          filter = `&filter={"_and":[{"_and":[{"id":{"_in":"${projectsIds.toString()}"}}${cond ? "," + cond : ''}]}]}`
        }
      } else {
        if (currentUser?.userType === 'ADMIN' && cond) {
          filter = `&filter={"_and":[{"_and":[${cond}]}]}`

        }
      }
    }
    // filter = `&filter={"_and":[{"_and":[{"id":{"_in":"111"}}]}]}`

    setPdfProjectData(null)
    setPdfReportType(null)
    queryparam = `${queryparam}`
    fetchGet(`${DATAURLS.PROJECT.url}?${queryparam}${filter}`, getAccessToken())
      .then(async (response) => {
        gridApi.hideOverlay();
        if (!isreport) {

          setRowData(response.data);
          let tempAPI = JSON.parse(JSON.stringify(response.data));
          setRowDataAPI(tempAPI);
        } else if (isreport) {
          setPdfProjectData(response.data[0])
          setPdfReportType(isreport)
        }
        setLoading(false);
      })
      .catch((err) => {
        gridApi.hideOverlay();
        throw err;
      });
  }

  useEffect(() => {
    if (pdfProjectData && pdfReportType) {
      handleProductReportOpen(pdfProjectData, pdfReportType)
    }
  }, [pdfProjectData, pdfReportType])


  const onGridReady = (params) => {
    setGridApi(params.api);
    getColumnDefinitions()

  };

  useEffect(() => {
    if (!gridApi) {
      return;
    }
    let allColumnIds = gridApi.columnModel.gridColumns.map(
      (col) => col.colId
    );
    gridApi.columnModel.setColumnsVisible(allColumnIds, false);
  }, [gridApi]);

  const onRowSelected = (params) => {
    setEnableDelete(gridApi.getSelectedRows().length > 0);
  };

  const handleBulkDelete = async (props) => {
    let selectedRows = gridApi.getSelectedRows();
    let selectedUserIds = selectedRows.map((row) => row.id);
    setLoading(true);

    fetchDelete(DATAURLS.PROJECT.url, selectedUserIds, getAccessToken())
      .then((res) => {
        if (res) {
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage('Faile to delete project');
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const handleDelete = (params) => {
    let ids = [params.data].map((item) => item.id);

    fetchDelete(DATAURLS.PROJECT.url, ids, getAccessToken())
      .then((res) => {
        if (res.ok) {
          getNewData(gridApi);
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage(res.message);
          setSnackBarType('error');
        }
      })
      .catch((err) => {
        console.log('error deleting record');
        throw err;
      });
  };

  const getRefresData = (params) => {
    setRowData(params);
    gridApi.redrawRows({ rowNodes: [params.node] });

  }

  const highlightUnsavedRows = (params) => {
    // console.log('highlightUnsavedRows', params);
    if (!params || rowDataAPI.length === 0) {
      return;
    }
    let missingRowNodes = params.api.rowModel.rowsToDisplay.filter((row) => {
      if (!row.data.pallet_id) {
        return row;
      }
    });

    // console.log('highlightUnsavedRows', missingRowNodes);
    if (missingRowNodes.length > 0) {
      missingRowNodes.map((node) => {
        if (params.node !== node) {
          node.setSelected(true);
        }
      });
    }
  };

  const bgColorDecider = (params, rowDataAPI) => {
    return false;
  };

  function confirm() {
    Modal.confirm({
      header_name: 'Delete multiple',
      // icon: false,
      content: 'Are you sure that you want to delete these projects',
      okText: 'Yes',
      cancelText: 'No',
      onOk: handleBulkDelete,
    });
  }

  const handleOpen = () => {
    confirm();
  };

  const handleExport = (generateData = []) => {
    generateExcelNew(gridApi, `Projects`, generateData);
  };

  const handleNotestOpen = (params) => {
    setShowNotesDialog(true);
    setSelectedItem(params)
  };

  const handleFileExportOpen = (params) => {
    setShowFileExportDialog(true);
    setSelectedItem(params)
  };

  const fetchProjects = async (params, report) => {
    setPageLoading(true)
    let fields = ''
    fields = 'delivery_address.sub_org,contact_attn.first_name,partner_contact_attn.first_name,invoice_by_client,client_ref,id,partner.partner_name,client.id,client.client_name'

    if (report === 'P') {
      fields = 'client_ref,id,partner.partner_name,client.client_name,partner.partner_logo.id'
    } else if (report === 'PE') {
      fields = 'delivery_address.sub_org,client_ref,id,client.client_name,partner.partner_logo.id,project_name'

    } else if (report === 'F') {
      fields = 'delivery_address.sub_org,contact_attn.first_name,partner_contact_attn.first_name,invoice_by_client,client_ref,id,partner.partner_name,client.client_name,project_status,finish_date,partner.partner_logo.id,warehouse'
    } else if (report === 'FT') {
      fields = 'delivery_address.sub_org,contact_attn.first_name,partner_contact_attn.first_name,invoice_by_client,client_ref,id,partner.partner_name,client.client_name,project_status,finish_date,partner.partner_logo.id,revenue,kickback_revenue,order_revenue,buyout,remarketing,handling,logistics,software,commision,other,warehouse'
    } else if (report === 'E') {
      fields = 'partner_contact_attn.first_name,id,partner.partner_name,client.client_name,partner.partner_logo.id'
    }
    let queryparam = `filter[id][_eq]=${params?.data?.id}&limit=-1&sort=-id&fields=${fields},total_images`;
    await getProjects(queryparam, [], null, report, params?.data?.id)
  }



  const handleProductReportOpen = async (params, report) => {

    setPageLoading(true)
    setSnackBarOpen(false)
    //-------------------------
    let fields = '';
    let filter = `&filter={"_and":[{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}}]}`;
    let queryParams = `fields=${fields}${filter}&limit=-1`;

    if (report === 'P') {
      fields = 'asset_id,asset_type,quantity,manufacturer,model,serial_number,processor,memory,hdd,grade,complaint,complaint_from_app'
      queryParams = `fields=${fields}${filter}&limit=-1`;

    } else if (report === 'PE') {
      fields = 'project_id, asset_id, asset_type, form_factor, Part_No, quantity, manufacturer, model, imei, serial_number, processor, memory, hdd, hdd_serial_number, optical,graphic_card, battery, keyboard, screen, grade, complaint, erasure_ended, data_destruction, wipe_standard, sample_co2, sample_weight,complaint_from_app'
      queryParams = `fields=${fields}${filter}&limit=-1`;
      params.complaint = params.complaint ? params.complaint : '';
      let complaint_1 = params.complaint_1 ? params.complaint_1 : '';
      params.complaint_1 = complaint_1 ? params.complaint + ";" + complaint_1 : '';

    } else if (report === 'F' || report === 'FT') {
      // await printFinancialDocument(params);
      let filter = `{"_and":[{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}},{"grade":{"_in":"A,NEW,NOB,AV,A+,AB,B,BV,C,CV,D,DV,E,DV,EV,DA"}}]}`
      if (params.project_status === 'CLOSED') {
        filter = `{"_and":[{"created_at":{"_lte":"${params.finish_date}"}},{"project_id":{"_eq":${params.id}}},{"asset_status":{"_eq":"not_archived"}},{"asset_type":{"_nnull":true}},{"grade":{"_in":"A,NEW,NOB,AV,A+,AB,B,BV,C,CV,D,DV,E,DV,EV,DA"}}]}`
      }
      filter = `&filter=${filter}&groupBy=asset_type,grade&aggregate={"sum":"quantity"}`;
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
            const isGenerated = await printDocument(params);
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
            obj.client_name = params.client ? params.client.client_name : '';
            let proj_name = params.project_name ? params.project_name : '';
            obj.suborg_name = params.delivery_address ? params.delivery_address?.sub_org : proj_name;
            if (obj.manufacturer && obj.manufacturer.toUpperCase() === "HEWLETT-PACKARD") {
              obj.manufacturer = "HP";
            }
            //--------------------sameple co2
            let form_factor = null
            let currentAssetType = ''
            let asset_type = obj?.asset_type ? obj.asset_type.trim().toLowerCase() : null;
            if (asset_type) {
              if (obj.form_factor && (obj.form_factor !== '' || obj.form_factor !== null)) {
                form_factor = obj.form_factor.trim().toLowerCase()
                currentAssetType = assetTypesList.filter(
                  (asset) => ((asset.Asset_Name.toLowerCase() === asset_type) && asset.formfactor?.trim().toLowerCase() === form_factor)
                );
              } else {
                currentAssetType = assetTypesList.filter(
                  (asset) => ((asset.Asset_Name.toLowerCase() === asset_type) && (asset.formfactor === null || asset.formfactor === ''))
                );
              }
              if (currentAssetType?.length > 0) {
                obj.sample_co2 = ((obj.quantity || 1) * Number(currentAssetType[0]?.sampleco2)) || '';
                obj.sample_weight = ((obj.quantity || 1) * Number(currentAssetType[0]?.sample_weight)).toFixed(1) || '';
              }
            }
            //--------------------------------
            if (obj?.complaint_from_app && !obj?.complaint) {
              obj.complaint = obj.complaint_from_app
            }

            //-----------------------------
            if (obj.asset_type && (obj.asset_type.toUpperCase() === 'COMPUTER')) {
              let complaint = obj?.complaint ? obj.complaint.toLowerCase() : null
              let complaints_1 = obj?.complaints_1 ? obj.complaints_1.toLowerCase() : null
              if ((complaint && complaint.includes('no ram')) || (complaints_1 && complaints_1.includes('no ram'))) {
                obj.memory = 'N/A'
              }
            }
            if (obj.graphic_card) {
              if (obj.graphic_card && (obj.data_generated === 'CERTUS')) {
                var text = obj.graphic_card
                var regex = /\[([^\][]*)]/g;
                var results = [], m;
                while (m = regex.exec(text)) {
                  results.push(m[1]);
                }
                obj.graphic_card = results ? results.toString() : '';
              }
            }
            if (obj.asset_type && (obj.asset_type.toUpperCase() === 'COMPUTER')) {
              let hddtext = ["no hdd", "hdd rem", "hdd crash", "hdd fail"]
              let complaint = obj?.complaint ? obj.complaint.toLowerCase() : null
              let complaints_1 = obj?.complaints_1 ? obj.complaints_1.toLowerCase() : null;
              let isComplaintTrue = false;
              let isComplaint_1True = false;
              hddtext.forEach((item) => {
                if (complaint && complaint.includes(item)) {
                  isComplaintTrue = true;
                }
                if (complaints_1 && complaints_1.includes(item)) {
                  isComplaint_1True = true;
                }
              })
              if (obj.hdd && (obj.hdd !== 'N/A' && !obj.hdd.includes('/') && (isComplaintTrue || isComplaint_1True))) {
                obj.hdd = 'N/A'
              }
              else if (!obj.hdd && (isComplaintTrue || isComplaint_1True)) {
                obj.hdd = 'N/A'
              }
            }

          })
          let partner_logo = params?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${params.partner.partner_logo.id}?access_token=${getAccessToken()}` : null;

          await ExportExcel(response.data, `Product report - ${params.id}`, partner_logo)
          setPageLoading(false)
        } else if (report === 'F' || report === 'FT') {
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
          await printFinancialDocument(params, report);
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

  const handleFileExportCancel = async () => {
    setShowFileExportDialog(false);
  };


  const handleNotesCancel = async () => {
    setShowNotesDialog(false);
  };

  // const cellEditingStarted = (params) => {
  //   // getRowStyle
  //   // params.colDef.cellStyle = { color: 'red' };
  //   console.log("params.node",params.node)
  //   if (params.node.data.project_status === 'CLOSED') {
  //     gridApi.stopEditing();
  //     return
  //   }
  //   // const cellDefs = gridApi.getEditingCells(); 

  //   // cellDefs.forEach(cellDef => {
  //   //     console.log(cellDef.rowIndex);
  //   //     console.log(cellDef.column.getId());
  //   //     console.log(cellDef.floating);
  //   // });
  //   gridApi.refreshCells({
  //     columns: ["action"],
  //     rowNodes: [params.node],
  //     force: true
  //   });
  // };

  // const onCellEditingStopped = (params) => {
  //   gridApi.stopEditing();
  //   let currentRowFromAPI = rowDataAPI.find(
  //     (row) => parseInt(row.id) === parseInt(params.data.id)
  //   );
  //   console.log(params, "currentRowFromAPI", currentRowFromAPI)
  //   if (
  //     currentRowFromAPI &&
  //     JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
  //   ) {

  //     return;
  //   }
  //   if (currentRowFromAPI) {
  //     console.log("updateeeeeeeeeeeee")
  //     // handleUpdate(params);
  //     return;
  //   }

  // };

  const onRowEditingStarted = (params) => {
    // getRowStyle
    // params.colDef.cellStyle = { color: 'red' };
    gridApi.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };

  const onRowEditingStopped = (params) => {
    gridApi.stopEditing();
    let currentRowFromAPI = rowDataAPI.find(
      (row) => parseInt(row.id) === parseInt(params.data.id)
    );
    // console.log(params, "currentRowFromAPI", currentRowFromAPI)
    if (
      currentRowFromAPI &&
      JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
    ) {

      return;
    }
    if (currentRowFromAPI) {
      handleUpdate(params);
      return;
    }

  };


  const handleUpdate = (params) => {
    delete params.data.contact_attn
    delete params.data.partner_contact_attn
    delete params.data.user_created;
    delete params.data.user_updated;
    if (page !== 'projects' && params.data.project_status !== 'CLOSED') {
      params.data.remarketing = params.data.remarketing || 0
      params.data.logistics = params.data.logistics || 0
      params.data.handling = params.data.handling || 0
      // let no_of_assets_1 = params?.data.no_of_assets_1 ? params?.data.no_of_assets_1 : 0;
      let software = params.data.software || 0
      params.data.software = software;
      params.data.other = params.data.other || 0
      params.data.revenue = params.data.revenue || 0;
      params.data.buyout = params.data.buyout || 0;
      params.data.order_revenue = params.data.order_revenue || 0
      params.data.order_commission = params.data.order_commission || 0
      params.data.commision_percentage = params.data.commision_percentage || 0;
      let commision_percentage = params.data.commision_percentage;
      // let order_commission = 0
      // if (params.data.order_commission) {
      //   order_commission = parseFloat(params.data.order_commission);
      // }
      let order_commission = 0
      if (Number(params.data.order_commission)) {
        order_commission = params.data.order_commission
      } else if (!params.data.commision_percentage && params.data.order_commission) {
        order_commission = params.data.order_commission;
      } else if (!params.data.commision_percentage && !params.data.order_commission) {
        order_commission = params.data.order_commission = 15
      }

      let order_revenue = 0
      if (params.data.order_revenue) {
        order_revenue = parseFloat(params.data.order_revenue);
      }
      let order_commission_value = 0
      if (order_revenue && order_commission) {
        order_commission_value = Math.round((order_revenue / 100) * order_commission)
      }
      //(commission_percentage*revenue)+(order_commission*order)
      let revenue_value = Math.round((params.data.revenue / 100) * commision_percentage);
      // console.log("order_commission_value",order_commission_value)
      params.data.kickback_revenue = Math.round(parseInt(params.data.kickback_percentage) * ((parseInt(params.data.revenue) + parseInt(order_revenue)) / 100))
      params.data.commision = revenue_value + order_commission_value;
      params.data.remarketing = Math.round((parseFloat(params.data.revenue) + parseFloat(order_revenue) + parseFloat(params.data.buyout)) - params.data.commision - params.data.kickback_revenue);
      // remarketing - logistics - handling - software - other
      let total = (parseFloat(params.data.remarketing) - parseFloat(params.data.logistics) - parseFloat(params.data.handling) - parseFloat(params.data.software) - parseFloat(params.data.other));
      params.data.invoice_by_client = Math.round(total) || null;
      if (params.data.invoice_rec_amount > 0) {
        params.data.difference = parseFloat(params.data.invoice_by_client) - parseFloat(params.data.invoice_rec_amount);
      } else {
        params.data.difference = null
      }
      // //this should be per default 5 more than column B
      // order

    }
    fetchPut(
      `${DATAURLS.PROJECT.url}/${params.data.id}`,
      params.data,
      getAccessToken()
    )
      .then((response) => {
        if (response?.data?.id) {
          setSnackBarOpen(true);
          setSnackBarMessage("Project updated successfully");
          setSnackBarType('success');
          gridApi.redrawRows({ rowNodes: [params.node] });
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage("Project updated successfully");
          setSnackBarType('error');
          gridApi.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: 'id',
          });
        }
        setLoading(false);
        gridApi.hideOverlay();

      })
      .catch((err) => {
        throw err;
      });
  }


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
        setLoading(false);

        setPrintView(true)
        setProjValues(params)
        // setPageLoading(false)
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
        setPageLoading(false)
        handlePrint();
      }, [2500])
      // setPrintView(false)
      // setPageLoading(false)
    }
  }, [projValues, printView, equipemetCategory, consumedco2, savedCO2, remarketRecycled])

  const successCall = (props) => {
    console.log("proppsss", props)
    setSnackBarOpen(true)
    setSnackBarMessage(`Project owner has been updated for `)
    setSnackBarType("success")
  }

  const getPresets = async (gridApi, type = null) => {
    //filter={"_and":[{"collection":{"_contains":"Assets"}},{"user":{"_eq":null}}]}
    setLoading(true);
    let param = `?filter={"_and":[{"collection":{"_eq":"${page === 'financials' ? "financials" : "project"}"}},{"user":{"id":{"_eq":"${currentUser.id}"}}}]}`
    fetchGet(`${DATAURLS.PRESETS.url}${param}`, getAccessToken())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setPresetId(result.data[0].id)
          if (result.data[0].layout_query?.tabular?.fields?.length > 0) {
            let tempFields = result.data[0].layout_query.tabular.fields;
            let sortString = result.data[0].layout_query?.tabular?.sort?.toString();
            let val = tempColumnDefs.filter((row) => tempFields.indexOf('' + row.field) !== -1)
            tempColumnDefs.forEach((item) => {
              if (tempFields.some((x) => x == item.field)) {
                item.checked = true;
              } else {
                item.checked = item.field === 'actions' ? true : false;
              }
              item.hide = page === 'financials' ? item.isFinanceHide : item.hide
            })
            setTempColumns(tempColumnDefs)
            setColumnDefs(val);
            let cols = []
            val.map((item) => {
              let obj = {};
              if (item.field !== 'actions' && !item.hide) {
                obj[item.field] = ""
                obj = {
                  'key': item.field,
                  'values': item.values,
                  'placeholder': item.header_name,
                  'operator': item.operator,
                  'type': item.type,
                  'operator_values': item.operator_values,
                  'operator_values2': item.operator_values2,
                  'sorting': sortString,
                  'isSpaceSeperate': item.isSpaceSeperate
                }
                cols.push(obj)
              }
            })
            setTempFieldsList(tempFields)
            getNewData(gridApi)
          } else {
            setLoading(true);
            callLists(gridApi);
          }
        } else {
          callLists(gridApi);
          setLoading(true);
        }

        // gridApi.hideOverlay();
      })
      .catch((err) => {
        throw err;
      });
  }


  const callLists = (gridApi) => {
    let val = [];
    let tempCol = tempColumnDefs

    if (page === 'financials') {
      val = tempCol.filter((row) => row.finstdview);
    } else {
      val = tempCol.filter((row) => row.stdview);
    }
    let tempFields = val.map(
      (row) => row.field
    );
    tempCol.forEach((item) => {
      if (tempFields.some((x) => x == item.field)) {
        item.checked = true;
      } else {
        item.checked = item.field === 'actions' ? true : false;
      }
      item.hide = page === 'financials' ? item.isFinanceHide : item.hide

    })
    setTempColumns(tempCol)
    // let results = tempColumnDefs.filter(o1 => tempFields.some(o2 => o1.field === o2));
    // console.log("tempColumnDefs", val)
    setColumnDefs(val)

    setTempFieldsList(tempFields)

    getNewData(gridApi)
  }


  const submitFilter = async (columns, isStdView = false, sorting = null) => {
    let selectedColumns = []
    if (presetId) {
      if (isStdView) {
        if (page === 'financials') {
          selectedColumns = tempColumns.filter((row) => row.finstdview && row.field !== 'actions');
        } else {
          selectedColumns = tempColumns.filter((row) => row.stdview && row.field !== 'actions');
        }
      } else {
        selectedColumns = tempColumns.filter((row) => row.checked && row.field !== 'actions');
      }
      // console.log(tempColumns,"selected columnss", selectedColumns)
      let filterFields = selectedColumns;
      selectedColumns = selectedColumns.map(
        (status) => status.field
      );
      selectedColumns = ['actions', ...selectedColumns]
      let sort = sorting ? sorting : "-created_at";
      // setSortValues(sort)
      let obj = {
        "status": 'published',
        // "role": currentUser.role.id,
        "user": currentUser.id,
        "collection": page === 'financials' ? "financials" : "project",
        "layout_query": {
          "tabular": {
            "page": 1,
            "fields": selectedColumns,
            "filterfields": filterFields,
            "sort": [sort],
            "limit": 500
          }
        },
      }
      if (selectedColumns?.length > 0) {
        let tempFields = selectedColumns;
        let val = tempColumnDefs.filter((row) => tempFields.indexOf('' + row.field) !== -1)
        setLoading(true)
        tempColumnDefs.forEach((item) => {
          if (tempFields.some((x) => x == item.field)) {
            item.checked = true;
          } else {
            item.checked = item.field === 'actions' ? true : false;
          }
        })
        let tempValues = values;
        let cols = []
        val.map((item) => {
          let obj = {};
          if (item.field !== 'actions' && !item.hide) {
            obj[item.field] = "";
            let findVal = tempValues.find((x) => x.key == item.field);
            if (findVal?.values) {
              item.values = findVal.values;
            }
            obj = {
              'key': item.field,
              'values': item.values,
              'placeholder': item.header_name,
              'operator': item.operator,
              'type': item.type,
              'operator_values': item.operator_values,
              'operator_values2': item.operator_values2,
              'isSpaceSeperate': item.isSpaceSeperate,
              'sorting': sorting ? sorting : "-created_at" || "-created_at"
            }
            cols.push(obj)
          }
        })
        setTempColumns(tempColumnDefs)
        setColumnDefs(val);
        let filters = [];
        let filterVal = {};
        if (!sorting) {
          // setRowsPerPage(2000)
          await getNewData(gridApi);
        }
      }

      fetchPut(`${DATAURLS.PRESETS.url}/${presetId}`, obj, getAccessToken())
        .then((response) => {
          setLoading(false)
          gridApi.hideOverlay();
        })
        .catch((err) => {
          setLoading(false)
          throw err;
        });
    } else {
      selectedColumns = tempColumns.filter((row) => row.stdview);
      selectedColumns = selectedColumns.map(
        (status) => status.field
      );
      let obj1 = {
        "status": 'published',
        // "role": currentUser.role.id,
        "user": currentUser.id,
        "collection": page === 'financials' ? "financials" : "project",
        "layout_query": {
          "tabular": {
            "page": 1,
            "fields": selectedColumns,
            "sort": [
              "-created_at"
            ],
            "limit": 500
          }
        },
      }
      fetchPost(`${DATAURLS.PRESETS.url}`, obj1, getAccessToken())
        .then((response) => {
          if (response.data) {
            setPresetId(response.data.id);
            if (sorting) return;
            getNewData(gridApi)
          } else {
            if (sorting) return;
            getNewData(gridApi)
          }
          // gridApi.hideOverlay();
        })
        .catch((err) => {
          getNewData(gridApi)
          throw err;
        });
    }

  }
  function onClick(type) {
    setIsSelect(type)
    let temp = tempColumns
    temp.forEach((item) => {
      item.checked = type
    })
    setTempColumns(temp)
  }

  const handleDifference = (gridApi) => {
    setLoading(true);
    gridApi && gridApi.showLoadingOverlay();
    let tempValues = rowData;
    let values = []
    tempValues.forEach((item) => {
      if (item.project_status === 'PROCESSING FINISHED') {
        let diff = calculateDays(item.finish_date)
        if (diff > 30) {
          values.push(item)
        }
      }

    })
    setLoading(false);
    setRowData(values);
    gridApi.redrawRows();

  }

  const showImages = (params) => {
    if (params?.data?.id) {
      setOpenImages(true);
      console.log("params", params.data);
      setSelectedItem(params.data.id)
    }
  }


  return (
    <div className={classes.root}>
      <PageLoader pageLoaderOpen={pageLoading} setPageLoaderOpen={setPageLoading} content='Please wait. Your file is preparing to download.' />
      {
        (currentUser.userType === 'ADMIN' || currentUser.userType === 'ASSOCIATE') &&
        <Drawer
          columnDefs={tempColumns}
          setTempColumnDefs={setTempColumns}
          submitFilter={submitFilter}
          onClick={onClick}
          setIsSelect={setIsSelect}
          isSelect={isSelect}
        />
      }
      <div>
        {/* //style={{ display: 'none' }} */}
        {printView && projValues?.id && <div id="container" className="pdf-page" style={{ display: 'none' }}>
          <ComponentToPrintNew
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
      </div>
      <div className={'sectionHeader'}>
        <span className="page-title">{page}</span>
        <Paper component="form" className={classes.textRoot}>
          <InputBase
            className={classes.input}
            placeholder="Search Project"
            inputProps={{ 'aria-label': 'Search Project' }}
            value={quickFilterText}
            onChange={(event) => setQuickFilterText(event.target.value)}
          />
          <IconButton
            // type='submit'
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <div className={classes.actionArea}>
          {
            // (currentUser && currentUser?.userType === 'ADMIN' || currentUser && currentUser?.userType === 'CLIENT') &&
            <>
              {/* <Button style={{ verticalAlign: 'bottom', background: 'red' }} className={[styles.btns, styles.reset].join(' ')} onClick={() => {
                sizeToFit();
              }} >
                <span className="instorage">Reset Columns</span>
              </Button> */}
              <Button style={{ verticalAlign: 'bottom', background: 'red' }} className={[styles.btns, styles.reset].join(' ')} onClick={() => {
                gridApi && gridApi.setFilterModel(null); gridApi.sizeColumnsToFit();
              }} >
                <span className="instorage">Reset Filter</span>
              </Button>
              {
                page !== 'financials' &&
                <>
                  <Tooltip placement="topLeft" title="clear filter">

                    <CloseCircleOutlined
                      onClick={() => getProjects(project_params, project_ids, '')}
                      className={"clearfilter"}
                    />
                  </Tooltip>
                  <Tooltip placement="topLeft" title="Hide all processed finished projects">

                    <StopOutlined
                      onClick={() => getProjects(project_params, project_ids, 'proces_finished')}
                      className={"stopicon stopicon1"}
                    />
                  </Tooltip>
                  <Tooltip placement="topLeft" title="Hide closed projects">

                    <StopOutlined
                      onClick={() => getProjects(project_params, project_ids, 'CLOSED')}
                      className={"stopicon stopicon2"}
                    />
                  </Tooltip>

                  {currentUser?.userType === 'ADMIN' && <Link to={`/createproject`} className={classes.newBtn}>
                    <PlusOutlined
                      // icon={faPlus}
                      title="Add"
                      className={classes.actionIcon}
                    />
                  </Link>}
                </>
              }
              {currentUser?.userType === 'ADMIN' && <Tooltip placement="topLeft" title="Import">
                <UploadOutlined
                  className={classes.actionIcon}
                  onClick={() => setFileUploadOpen(true)}
                />
              </Tooltip>}
            </>
          }
          {
            <Tooltip placement="topLeft" title="Export">
              <DownloadOutlined
                className={classes.actionIcon}
                onClick={() => handleExport()}
              />
            </Tooltip>
          }
          {
            currentUser?.userType === 'ADMIN' && <DeleteFilled
              // icon={faTrash}
              title="Delete"
              className={classes.actionIconDisabled}
              onClick={() => handleOpen()}
            />
          }
          {
            <SwapOutlined
              // icon={faTrash}
              className={classes.actionIconDisabled}
              onClick={() => gridApi && handleDifference(gridApi)}
            />
          }
        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{
          width: '95%',
          height: rowData.length > 100 ? '90vh' : '60vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          components={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection="multiple"
          onRowSelected={onRowSelected}
          enableCellTextSelection={true}
          onRowEditingStopped={onRowEditingStopped}
          onRowEditingStarted={onRowEditingStarted}
          // onCellEditingStarted={cellEditingStarted}
          editType='fullRow'
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={overlayLoadingTemplate}
          getNewData={getNewData}
          handleDelete={handleDelete}
          setRowData={getRefresData}
          pagination={true}
          floatingFilter={true}
          paginationPageSize={pageSize}
          suppressRowClickSelection={true}
          alwaysShowVerticalScroll={true}
          quickFilterText={quickFilterText}
          users={users}
          parentGridApi={gridApi}
          paginationPageSizeSelector={[100, 250, 500]}
          handleNotestOpen={handleNotestOpen}
          handleFileExportOpen={handleFileExportOpen}
          handleFilePrintProdReport={fetchProjects}
          userRole={currentUser}
        // autoSizeStrategy={autoSizeStrategy}
        ></AgGridReact>

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
      </div>
      {
        fileUploadOpen && <FileUpload
          open={fileUploadOpen}
          setOpen={setFileUploadOpen}
          allAssets={rowData}
          title='Project file upload'
          handleCancel={setFileUploadOpen}
          getNewData={getNewData}
          parentGridApi={gridApi}
          currentUser={currentUser}
        />
      }
      {
        showNotesDialog && <NotesDialog
          handleCancel={handleNotesCancel}
          getNewData={getNewData}
          selectedItem={selectedItem}
          showDialog={showNotesDialog}
          collection="project"
          parentGridApi={gridApi}
          rowData={rowData}
          setRowData={setRowData}
          currentUser={currentUser.userType}
        />
      }
      {
        showFileExportDialog && <ProjetcreportDialog
          handleCancel={handleFileExportCancel}
          // userRole={userRole}
          selectedItem={selectedItem}
          showDialog={showFileExportDialog}
          collection="Project report"
        />
      }
      {
        openImages && <ShowImages
          showDialog={openImages}
          handleCancel={setOpenImages}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          currentUser={currentUser}
          collection={"Project"}
        />
      }
    </div >
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Projects);

