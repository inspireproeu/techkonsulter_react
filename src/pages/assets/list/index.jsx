import {
  PlusOutlined,
  DeleteFilled,
  OrderedListOutlined,
  UploadOutlined,
  DownloadOutlined,
  SyncOutlined,
  CopyFilled
} from '@ant-design/icons';
import {
  Button,
  Tooltip
} from 'antd';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getAccessToken } from '@/utils/authority';
import InStorage from '../components/Instorage';
import OrderStatus from '../components/OrderStatus';

import { connect } from 'umi';
import * as moment from 'moment';
import clsx from 'clsx';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
import BulkUpdateDialog from '../components/BulkUpdateDialog';
import CurrencyEditor from '../components/CurrencyEditor';
// import CustomDropdown from '../../components/CustomDropdown';
import DialogEditor from '../components/DialogEditor';
import FileUpload from '../components/FileUpload';
import NumericEditor from '../components/NumericEditor';
import CustomDialog from '../components/CustomDialog';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import styles from '../style.less';
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
  FormatFilterValues
} from '@/utils/utils';
import AssetTypesEditor from '../components/AssetTypes';
import StatusEditor from '../components/StatusTypes';
import { useParams, useLocation } from 'react-router-dom'
import ExportModal from '../components/ExportData';
import Drawer from '../../components/sidedrawer';
import PageLoader from '../../components/pageloader/PageLoader';
import MatchCellRenderer from '../components/MatchCellRenderer';
import Card from '@mui/material/Card';
import ClientFileUpload from '../components/ClientFileUpload';
import { generateExcelWLogin, importdownloadTemplate, generateExcelNew } from '@/utils/generateExcel';
import CustomGoBackButton from '../../../uikit/GoBack';
import ReactGA from "react-ga4";
import _ from "underscore"
import SelectDate from '../components/SelectDate'
import Exportpdf from '../components/ExportPdf';
import PdfCellRenderer from '../components/Certus_pdf_render';
import ShowImages from '../components/ImagesDialog';
import LinkCellRenderer from '../../components/LinkCellRenderer';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '95vw',
      height: '100vh',
      // marginLeft: '4vw',
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
      // marginTop: '20px',
      width: '100%',
      height: '40px',
      boxShadow: '0px 0px 5px #222',
      paddingLeft: '10px',
      background:
        'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
    },
    actionArea: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '54%',
    },
    actionIconDisabled: {
      color: '#aaa',
      cursor: 'not-allowed',
    },
    actionIcon: {
      fontSize: '1rem',
      cursor: 'pointer',
      color: 'white',
    },

    textRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
      height: '30px',
    },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  })
);

let dateFilterParams = {
  filterOptions: ['equals', 'inRange', 'blank', 'notBlank'],
  debounceMs: 200,
  maxNumConditions: 1,
};

let TextFilterParams = {
  filterOptions: ['contains', 'notContains', 'oneOfThe', 'equals', 'blank', 'notBlank'],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ç/g, 'c')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/[òóôõö]/g, 'o')
      .replace(/œ/g, 'oe')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y');
  },
  debounceMs: 200,
  maxNumConditions: 1,
};

let EqualFilterParams = {
  filterOptions: ['equals', 'blank', 'notBlank'],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ç/g, 'c')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/[òóôõö]/g, 'o')
      .replace(/œ/g, 'oe')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y');
  },
  debounceMs: 200,
  maxNumConditions: 1,
};

const frameworkComponents = {
  //   CustomCellEditor: CustomCellEditor,
  ActionCellRenderer,
  NumericEditor,
  CurrencyEditor,
  DialogEditor,
  AssetTypesEditor,
  StatusEditor,
  MatchCellRenderer,
  SelectDate,
  PdfCellRenderer,
  TextFilterParams,
  EqualFilterParams,
  dateFilterParams,
  LinkCellRenderer
};

const Assets = (props) => {
  const { dispatch } = props;
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span className="ag-overlay-loading-center">Please wait while update in progress</span>';
  const overlayLoadingTemplate1 =
    '<span class="ag-overlay-loading-center">No records found.</span>';

  function suppressNavigation(params) {
    var KEY_A = 'A';
    var KEY_C = 'C';
    var KEY_V = 'V';
    var KEY_D = 'D';

    var KEY_PAGE_UP = 'PageUp';
    var KEY_PAGE_DOWN = 'PageDown';
    var KEY_TAB = 'Tab';
    var KEY_LEFT = 'ArrowLeft';
    var KEY_UP = 'ArrowUp';
    var KEY_RIGHT = 'ArrowRight';
    var KEY_DOWN = 'ArrowDown';
    var KEY_F2 = 'F2';
    var KEY_BACKSPACE = 'Backspace';
    var KEY_ESCAPE = 'Escape';
    var KEY_SPACE = ' ';
    var KEY_DELETE = 'Delete';
    var KEY_PAGE_HOME = 'Home';
    var KEY_PAGE_END = 'End';

    var event = params.event;
    var key = event.key;

    var keysToSuppress = [
      KEY_PAGE_UP,
      KEY_PAGE_DOWN,
      KEY_TAB,
      KEY_F2,
      KEY_ESCAPE,
    ];

    var editingKeys = [
      KEY_LEFT,
      KEY_RIGHT,
      KEY_UP,
      KEY_DOWN,
      KEY_BACKSPACE,
      KEY_DELETE,
      KEY_SPACE,
      KEY_PAGE_HOME,
      KEY_PAGE_END,
    ];

    if (event.ctrlKey || event.metaKey) {
      keysToSuppress.push(KEY_A);
      keysToSuppress.push(KEY_V);
      keysToSuppress.push(KEY_C);
      keysToSuppress.push(KEY_D);
    }

    if (!params.editing) {
      keysToSuppress = keysToSuppress.concat(editingKeys);
    }

    if (
      params.column.getId() === 'country' &&
      (key === KEY_UP || key === KEY_DOWN)
    ) {
      return false;
    }

    var suppress = keysToSuppress.some(function (suppressedKey) {
      return suppressedKey === key || key.toUpperCase() === suppressedKey;
    });

    return suppress;
  }

  function suppressUpDownNavigation(params) {
    var key = params.event.key;

    return key === 'ArrowUp' || key === 'ArrowDown';
  }

  const buildColumnDefinitions = (columnDefs, assetTypes) => {
    return columnDefs.map((columnDef, index) => {
      let field = columnDef.field;
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer: currentUser?.userType !== 'ADMIN' && field === 'date_nor' ? false : columnDef.component,
        cellRendererParams: {
          // onRowEditingStopped: (params) => onRowEditingStopped(params),
          downloadPdf: (params) => downloadPdf(params),
          handleDelete: (params) => handleDelete(params),
          showImages: (params) => showImages(params),
          userType: currentUser?.userType,
          urlpage: 'nerdfix-history',
          page: 'Assets'
        },
        // headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: currentUser?.userType === "ADMIN" ? columnDef.editable : false,
        filter: index !== 0 ? columnDef.filter : false,
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        minWidth: field === 'asset_type' ? 250 : 160,
        filterParams: index !== 0 ? (columnDef.op_type === 'numericColumn' || columnDef.op_type === 'number') ? EqualFilterParams : columnDef.op_type === 'date' ? dateFilterParams : TextFilterParams : false,
        filterType: index !== 0 ? columnDef.op_type === 'numericColumn' ? 'number' : columnDef.op_type : false,
        suppressKeyboardEvent: suppressNavigation,
        suppressHeaderKeyboardEvent: suppressUpDownNavigation,
        valueGetter: (params) => {
          // console.log("columnDef.field",columnDef.field)
          // console.log("params.data,",params)
          if (params.data) {
            if (columnDef.field === 'project_id') {
              params.data.project_id_obj = params.data.project_id;
              let proj_id = params.data.project_id?.id ? params.data.project_id?.id : params.data.project_id
              return proj_id;
            }
            if (columnDef.field === 'project_id.client.client_name') {
              return params.data.project_id?.client?.client_name
            }
            if (columnDef.field === 'project_id.client.client_org_no') {
              return params.data.project_id?.client?.client_org_no
            }
            if (columnDef.field === 'project_id.partner.partner_name') {
              return params.data.project_id?.partner?.partner_name
            }
            if (columnDef.field === 'project_id.partner.partner_org_no') {
              return params.data.project_id?.partner?.partner_org_no;
            }
            if (columnDef.field === 'warehouse') {
              return params.data.project_id?.warehouse;
            }
            if (columnDef.field === 'created_by') {
              return params.data?.user_created?.email;
            }
            if (columnDef.field === 'updated_by') {
              return params.data?.user_updated?.email;
            }
            if (columnDef.field === "memory") {
              if (params.data.asset_type && (params.data.asset_type.toUpperCase() === 'COMPUTER')) {
                let complaint = params.data?.complaint ? params.data.complaint.toLowerCase() : null
                let complaint_1 = params.data?.complaint_1 ? params.data.complaint_1.toLowerCase() : null
                if ((complaint && complaint.includes('no ram')) || (complaint_1 && complaint_1.includes('no ram'))) {
                  params.data.memory = 'N/A'
                }
              }
            }
            if (columnDef.field === "graphic_card") {
              if (params.data.graphic_card && (params.data.data_generated === 'CERTUS')) {
                var text = params.data.graphic_card
                var regex = /\[([^\][]*)]/g;
                var results = [], m;
                while (m = regex.exec(text)) {
                  results.push(m[1]);
                }
                // params.data.graphic_card = results.toString();
              }

            }
            // lid: scr;min,screen: kbd imprints;min,chassi: dent;med,chassi: tag;min
            if (params?.data?.battery && params?.data?.battery && params?.data?.form_factor && params?.data?.form_factor.toLowerCase() === 'laptop') {
              let temp = params.data.battery.split(':')
              if (temp[1]?.includes('%')) {
                temp.forEach((item) => {
                  if (item.includes('%')) {
                    let value = item.split('%')[0] ? Math.round(item.split('%')[0].trim()) : null
                    if (value < 50) {
                      // console.log("paramssss", params.data)
                      params.data.battery = "def/low % battery";
                      params.data.complaint = params.data.complaint + " def bat";
                    } else {
                      params.data.battery = ""
                    }
                  }
                })
              }

              // console.log("battery", params.data.battery.split(':'))
            }
            if (columnDef.field === "hdd") {
              if (params.data.asset_type && (params.data.asset_type.toUpperCase() === 'COMPUTER')) {
                let hddtext = ["no hdd", "hdd rem", "hdd crash", "hdd fail"]
                let complaint = params.data?.complaint ? params.data.complaint.toLowerCase() : null
                let complaint_1 = params.data?.complaint_1 ? params.data.complaint_1.toLowerCase() : null;
                let isComplaintTrue = false;
                let isComplaint_1True = false;
                hddtext.forEach((item) => {
                  if (complaint && complaint.includes(item)) {
                    isComplaintTrue = true;
                  }
                  if (complaint_1 && complaint_1.includes(item)) {
                    isComplaint_1True = true;
                  }
                })
                if (params.data.hdd && (params.data.hdd !== 'N/A' && !params.data.hdd.includes('/') && (isComplaintTrue || isComplaint_1True))) {
                  params.data.hdd = 'N/A'
                }
                else if (!params.data.hdd && (isComplaintTrue || isComplaint_1True)) {
                  params.data.hdd = 'N/A'
                }
              }
            }
            // if ((columnDef.field === 'asset_type' || columnDef.field === 'sample_co2')) {
            //   let form_factor = null
            //   let asset_type = params.data?.asset_type ? params.data.asset_type.trim().toLowerCase() : null;
            //   if (asset_type) {
            //     let currentAssetType = ''
            //     if (params.data.form_factor && (params.data.form_factor !== '' || params.data.form_factor !== null)) {
            //       form_factor = params.data.form_factor.trim().toLowerCase()
            //       currentAssetType = assetTypeFieldMappingCo2.filter(
            //         (asset) => ((asset.Asset_Name.toLowerCase() === asset_type) && asset.formfactor?.trim().toLowerCase() === form_factor)
            //       );
            //     } else {
            //       currentAssetType = assetTypeFieldMappingCo2.filter(
            //         (asset) => ((asset.Asset_Name.toLowerCase() === asset_type) && (asset.formfactor === null || asset.formfactor === ''))
            //       );
            //     }
            //     if (currentAssetType?.length > 0) {
            //       params.data.sample_co2 = ((params.data.quantity || 1) * Number(currentAssetType[0]?.sampleco2)) || '';
            //       params.data.sample_weight = ((params.data.quantity || 1) * Number(currentAssetType[0]?.sample_weight)).toFixed(1) || '';
            //     }
            //   }
            // }
            if (params.data?.complaint_from_app && !params.data?.complaint) {
              params.data.complaint = params.data?.complaint_from_app
            }
            //Add a sold price per unit in the system
            if (params.data.sold_price) {
              let qty_sold = 0
              if (params.data.qty_sold) {
                qty_sold = params.data.qty_sold
              }
              if ((Number(params.data.qty_sold) === 0) && params.data.quantity) {
                qty_sold = params.data.quantity
              }
              params.data.sold_price_total = Number(qty_sold) * Number(params.data.sold_price);
            }
            if (params.data.costprice && (!params.data.target_price || Number(params.data.target_price) <= 0) && params.data.status !== 'RESERVATION' && params.data.status !== 'SOLD') {
              let costprice = params.data.costprice;
              params.data.target_price = Math.round(parseInt(costprice) + ((parseInt(costprice) / 100) * 20));
            }
            return params.data[columnDef.field];

          }
        },
        valueFormatter: (params) => {
          if (params.value === 'NULL') {
            return ''
          }
          if (columnDef.field === "manufacturer") {
            return params.value ? params.value.toUpperCase() === "HEWLETT-PACKARD" ? "HP" : params.value.toUpperCase() : ''
          }
          if (columnDef.op_type === 'date' && params.value) {
            return params.value ? moment(params.value).format('YYYY-MM-DD') : null;
          }

          if (columnDef.field === 'asset_type' || columnDef.field === 'status') {
            return params.value ? params.value?.toUpperCase() : ''
          }
          if (columnDef.field === 'quantity') {
            return params.value ? params.value : 1
          }
          if ((columnDef.field === 'complaint_from_app') && params.value) {
            var complaint_from_app = params.value
            complaint_from_app = complaint_from_app.replace(/;/g, " ");
            return complaint_from_app
          }
          if ((columnDef.field === 'complaint') && params.value) {
            var complaint_from_app = params.value
            complaint_from_app = complaint_from_app.replace(/;/g, " ");
            return complaint_from_app
          }
        },
      };
      if (columnDef.field === 'client_cost'
        || columnDef.field === 'asset_id'
        || columnDef.field === 'project_id'
        || columnDef.field === 'target_price'
        || columnDef.field === 'sold_price'
        || columnDef.field === 'quantity'
        || columnDef.field === 'qty_sold'
        || columnDef.field === 'costprice') {
        columnDefinition.cellEditor = 'agNumberCellEditor';
      }
      if (columnDef.field === 'status') {
        columnDefinition.cellEditor = 'DialogEditor';
        columnDefinition.cellEditorParams = {
          values: statusNames,
        };
      }
      if (columnDef.field === 'pallet_number') {
        columnDefinition.cellEditor = 'agRichSelectCellEditor';
        columnDefinition.cellEditorParams = {
          values: palletNumbers.sort((a, b) => (a > b ? -1 : 1)),
          filterList: true,
          searchType: "match",
          allowTyping: true,
          valueListMaxHeight: 220,
        };
      }
      if (columnDef.field === 'asset_type') {
        columnDefinition.cellEditor = 'agRichSelectCellEditor';
        columnDefinition.cellEditorParams = {
          values: assetTypes,
          filterList: true,
          searchType: "match",
          allowTyping: true,
          valueListMaxHeight: 220,
        };
      }
      if (columnDef.op_type === 'numericColumn') {
        columnDefinition.cellEditor = 'NumericEditor';
      }
      if (columnDef.op_type === 'currencyColumn') {
        columnDefinition.cellEditor = 'CurrencyEditor';
      }
      return columnDefinition;
    });
  };

  const {
    currentUser } = props;

  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(2000);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [customDeleteDialog, setCustomDeleteDialog] = useState(false);
  const [customDialogTitle, setCustomDialogTitle] = useState('');
  const [customDialogMessage, setCustomDialogMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [tempColumnDefs, setTempColumnDefs] = useState([]);
  const [tempColumns, setTempColumns] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assetTypeFieldMapping, setAssetTypeFieldMapping] = useState([]);
  const [statusCodes, setStatusCodes] = useState([]);
  const [statusNames, setStatusNames] = useState([]);
  const [palletNumbers, setPalletNumbers] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState('All');
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [enableBulkUpdates, setEnableBulkUpdates] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [gridApiClient, setGridApiClient] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const externalFilterRef = useRef(null);
  const [showInStorageModalDialog, setShowInStorageModalDialog] = useState(false);
  const [showOrderStatusModalDialog, setShowOrderStatusModalDialog] = useState(false);
  const [newRowAdded, setNewRowAdded] = useState();
  const [bulkupdatedData, setBulkupdatedData] = useState([]);
  const [projectdata, setProjectData] = useState();
  const [filterValues, setFilterValues] = useState({
    _and:
      [{
        "asset_status": {
          _eq: 'not_archived'
        }
      }]
  });
  const [values, setValues] = useState([]);
  const [totalRowDatas, setTotalRowDatas] = useState(0)
  const [assetTypeColumns, setAssetTypeColumns] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(2000);
  const [showExport, setShowExport] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [presetId, setPresetId] = useState()
  const [isSelect, setIsSelect] = useState(true)
  const urlParams = useParams();
  const location = useLocation()
  const [clientRowData, setClientRowData] = useState([]);
  const [userType, setUserType] = useState('');
  const [page, setPage] = useState('')
  const [clientFileUploadOpen, setClientFileUploadOpen] = useState(false);
  const [tempFieldsList, setTempFieldsList] = useState([])
  const [enableBulkUpdatesCl, setEnableBulkUpdatesCl] = useState(false);
  const [customDeleteDialogCl, setCustomDeleteDialogCl] = useState(false);
  const gridRef = useRef();
  const [sortValues, setSortValues] = useState('-date_created');
  const [filterModalField, setFilterModalField] = useState({});
  const [assetTypeFieldMappingCo2, setAssetTypeFieldMappingCo2] = useState([]);
  const [showExportPdf, setshowExportPdf] = useState(false);
  const [assetdata, setAssetdata] = useState(null);
  const [dataSourceparams, setDataSourceparams] = useState(null);
  const [openImages, setOpenImages] = useState(false);

  useEffect(() => {
    ReactGA.initialize("UA-268157654-1");
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [])

  useEffect(() => {
    if (location && userType) {
      let currentpage = location.pathname.split("/")
      setPage(currentpage[1])
      if (userType === 'FINANCIAL') {
        history.push({
          pathname: '/financials'
        });
      }
    }
  }, [location, userType]);

  useEffect(() => {
    if (!gridApi) {
      return;
    }

    let allColumnIds = gridApi.columnModel.gridColumns.map(
      (col) => col.colId
    );
    let currentMapping = assetTypeFieldMappingCo2.find(
      (mapping) => mapping.Asset_Name.toUpperCase() === selectedAssetType.toUpperCase()
    );

    let columnsToShow = currentMapping ? currentMapping.Fields1 : [];

    if (!columnsToShow || columnsToShow.length === 0) {
      gridApi.columnModel.setColumnsVisible(allColumnIds, true);
      return;
    }
    if (columnsToShow.length > 0) {
      columnsToShow.push('actions', 'asset_id');
    }
    setAssetTypeColumns(columnsToShow)

    gridApi.columnModel.setColumnsVisible(allColumnIds, false);
    gridApi.columnModel.setColumnsVisible(columnsToShow, true);
  }, [gridApi, assetTypeFieldMappingCo2, selectedAssetType]);

  useEffect(() => {
    if (gridApi && rowData.length === 0) {
      gridApi.showLoadingOverlay();
    }
  }, [gridApi, rowData])

  useEffect(() => {
    if (bulkupdatedData && bulkupdatedData.length > 0) {
      let tempRowData = rowData.map((row) => {
        bulkupdatedData.map((arr2) => {
          if (row.asset_id == arr2.asset_id) {
            row.project_id = arr2.project_id;
          }
        })
        return row;
      });
      setRowData(tempRowData);
      setRowDataAPI(JSON.parse(JSON.stringify(tempRowData)));
      // setState({})
    }
  }, [bulkupdatedData]);


  useEffect(() => {
    gridApi && gridApi.onFilterChanged();
  }, [selectedAssetType]);


  const getProjectsAssets = () => {
    if (urlParams && urlParams.id) {
      fetchGet(`${DATAURLS.PROJECT.url}/${urlParams.id}?fields=${DATAURLS.PROJECTFIELDS.toString()}`, getAccessToken())
        .then((response) => {
          let result = response.data;
          if (result?.client?.id) {
            clientlists(urlParams.id)
          }
          setProjectData(result)
        })
        .catch((err) => {
          throw err;
        });
    }
  }



  const getDuplicateSerialNumber = async () => {
    fetchGet(`${DATAURLS.DUPLICATESERIALNUMBER.url}`, getAccessToken())
      .then(async (response) => {
        let result = response.data;
        let serialnumbers = result.map(
          (obj) => obj.serial_number.toUpperCase()
        );
        await fetchLatestAssets(serialnumbers)
      })
      .catch((err) => {
        throw err;
      });
  }

  const getAssetTypes = () => {
    let fields3 = '?limit=-1&sort=Asset_Name&fields=Fields1,Asset_Name,formfactor,sample_weight,sampleco2&filter[Asset_Name][_nnull]=true';

    fetchGet(`${DATAURLS.ASSETTYPES.url}${fields3}`, getAccessToken())
      .then((response) => {
        let types = []
        response.data.forEach((item) => {
          if (item.Asset_Name) {
            types.push({
              Asset_Name: item.Asset_Name
            })
          }
        })
        let data = types.reduce((unique, o) => {
          if (!unique.some(obj => (obj.Asset_Name.toLowerCase() === o.Asset_Name.toLowerCase()))) {
            unique.push(o);
          }
          return unique;
        }, []);
        setAssetTypeFieldMappingCo2(response.data);
        setAssetTypeFieldMapping(data);
        let assetNames = data.map(
          (assetType) => assetType.Asset_Name.toUpperCase()
        );

        setAssetTypes(assetNames);
      })
      .catch((err) => {
        throw err;
      });
  }
  const getNewData = () => {
    // setLoading(true);
    let fields2 = '?limit=-1&sort=status_name';
    // Fetching Status Codes
    fetchGet(`${DATAURLS.STATUS_CODES.url}${fields2}`, getAccessToken())
      .then((response) => {
        setStatusCodes(
          response.data.sort((a, b) =>
            a.status_id < b.status_id ? -1 : 1
          )
        );
        let statusNames = response.data.map(
          (status) => status.status_name.toUpperCase()
        );
        setStatusNames(statusNames.sort());
        // gridApi.hideOverlay();
      })
      .catch((err) => {
        throw err;
      });
    let queryParam4 = '?limit=-1&sort=-pallet_id&fields=pallet_number,pallet_id,pallet_status,pallet_type'

    // Fetching Pallet Numbers
    fetchGet(`${DATAURLS.PALLETS_IN_PRODUCTION.url}${queryParam4}`, getAccessToken())
      .then((response) => {
        let palletNumbers = response.data.map(
          (pallet) => pallet.pallet_number
        );
        setPalletNumbers(palletNumbers);
        // gridApi.hideOverlay();
      })
      .catch((err) => {
        throw err;
      });
    highlightUnsavedRows();
  };

  const validateRow = (params) => {
    let allRows = [];
    params.api.forEachNode((node) => allRows.push(node.data));

    let duplicateNumberRows = [];

    duplicateNumberRows = allRows.filter(
      (row) => row.asset_id && row.asset_id === params.data.asset_id
    );

    return duplicateNumberRows.length <= 1;
  };

  const onGridReadyClient = (params) => {
    setGridApiClient(params.api);
    getProjectsAssets(params.api)
  };

  const onRowSelected = (event) => {
    if (event.source === 'checkboxSelected') {
      setEnableBulkUpdates(gridApi.getSelectedRows().length > 0 ? true : false);
    }
  };

  const onRowSelectedCl = () => {

    setEnableBulkUpdatesCl(gridApiClient.getSelectedRows().length > 0 ? true : false);
  };

  const onRowDataChanged = (params) => {
    highlightUnsavedRows(params);
  };


  const onRowEditingStarted = (params) => {
    // getRowStyle
    // params.colDef.cellStyle = { color: 'red' };
    gridApi.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };

  const onRowEditingStartedCl = (params) => {
    // getRowStyle(params)
    // params.colDef.cellStyle = { color: 'black' };
    gridApi.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };

  // const removeElements = (params, currentRowFromAPI) => {
  //   let tempParams = currentRowFromAPI ? currentRowFromAPI : params;
  //   delete tempParams.data.project_id?.partner;
  //   delete tempParams.data.project_id?.client;
  //   delete tempParams.data.last_updated_at;
  //   delete tempParams.data.last_updated_by;
  //   delete tempParams.data.project_id_obj;
  //   delete tempParams.data.user_created;
  //   delete tempParams.data.total_file_upload;
  //   delete tempParams.data.target_price;
  //   delete tempParams.data.date_created;
  //   delete tempParams.data.company_cost;
  //   delete tempParams.data.deviations_from_app;
  //   delete tempParams.data.erasure_pdf;
  //   tempParams.data.sample_co2 = tempParams.data.sample_co2 ? tempParams.data.sample_co2.toString() : null;
  //   return tempParams
  // }

  // const removeElements1 = (currentRowFromAPI) => {
  //   let tempParams = currentRowFromAPI;
  //   delete tempParams.project_id?.partner;
  //   delete tempParams.project_id?.client;
  //   delete tempParams.last_updated_at;
  //   delete tempParams.last_updated_by;
  //   delete tempParams.project_id_obj;
  //   delete tempParams.user_created;
  //   delete tempParams.total_file_upload;
  //   delete tempParams.target_price;
  //   delete tempParams.date_created;
  //   delete tempParams.company_cost;
  //   delete tempParams.deviations_from_app;
  //   delete tempParams.erasure_pdf;
  //   tempParams.sample_co2 = tempParams.sample_co2 ? tempParams.sample_co2.toString() : null;
  //   return tempParams
  // }

  const onRowEditingStopped = (params) => {
    gridApi.stopEditing();
    let responseParams = params;
    // let tempParams = removeElements(params);
    let tempParams = (params);
    if (validateRow(params) === true) {
      let currentRowFromAPI = rowDataAPI.find(
        (row) => parseInt(row.asset_id) === parseInt(tempParams.data.asset_id)
      );
      currentRowFromAPI = (currentRowFromAPI)

      if (
        currentRowFromAPI &&
        JSON.stringify(tempParams.data) === JSON.stringify(currentRowFromAPI)
      ) {
        return;
      }
      if (currentRowFromAPI) {
        handleUpdate(tempParams, responseParams);
        return;
      }
      handleSave(tempParams);
    } else {
      setSnackBarOpen(true);
      setSnackBarMessage('Cannot insert duplicate asset number');
      setSnackBarType('error');
      params.api.startEditingCell({
        rowIndex: params.rowIndex,
        colKey: 'asset_id',
      });
    }
  };

  const onCellEditingStopped = (params) => {
    if (params.colDef.field !== 'asset_type') {
      return;
    }
  };

  const handleAddNew = async (data) => {
    if (gridApi) {
      gridApi.paginationGoToFirstPage();
    }
    let newRow = [{ ...data, data_generated: 'MANUAL', quantity: 1, status: 'IN STOCK', project_id: urlParams.id ? urlParams.id : null, manualNerdFixUpdate: true }];
    if (selectedAssetType !== 'All') {
      newRow.map((row) => (row.asset_type = selectedAssetType));
    }
    gridApi.deselectAll();
    setNewRowAdded(true)
    let tempRowdata = [];
    tempRowdata = [...newRow, ...rowData]
    setRowData((prev) => [...newRow, ...prev]);
    dataSourceparams.successCallback(tempRowdata, tempRowdata.length);
    setTimeout(() => {
      gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'quantity',
        keyPress: '1',
      });
    }, 2000);
  };

  const handleUpdate = async (params, responseParams) => {
    Object.keys(params.data).forEach((key) => {
      if (!params.data[key]) {
        params.data[key] = null;
      }
    });
    setLoading(true);
    gridApi.showLoadingOverlay();

    if (params?.data?.project_id && params.data.project_id?.id) {
      params.data.project_id = params.data.project_id.id;
    }
    if (page === 'projectassets' && urlParams?.id) {
      params.data.project_id = urlParams?.id;
    }
    let grade = ''
    if (params.data.grade) {
      grade = params.data.grade.trim().toUpperCase();
      if (grade === 'a' || grade === 'b' || grade === 'c' || grade === 'd') {
        params.data.status = 'IN STOCK';
      } else if (grade === 'e') {
        params.data.status = "RECYCLED";
      }
    }
    params.data.manualNerdFixUpdate = true
    await update(params, responseParams)

  };

  const handleBulkUpdate = (params) => {
    setBulkUpdateOpen(true);
  };

  const update = async (params, responseParams) => {
    try {
      // let fields = `${tempFieldsList?.length > 0 ? tempFieldsList.toString() + ',Part_No,project_id.id,target_price' : 'asset_id,project_id.id,target_price'}`
      let fields = `asset_type,model,form_factor,status,manufacturer,Part_No,project_id.id,target_price,asset_id,project_id.id,project_id.warehouse,asset_id_nl,project_id.client.client_org_no,project_id.client.client_name,project_id.partner.partner_org_no,project_id.partner.partner_name,user_created.email,sold_price_total`
      await fetchPut(
        `${DATAURLS.ASSETS.url}/${params.data.asset_id}?fields=${fields}`,
        params.data,
        getAccessToken()
      )
        .then((response) => {
          if (response?.data?.asset_id) {
            let index = params.node.rowIndex
            // let deleteIndex = rowData.findIndex(obj => obj.asset_id === props.data.asset_id)
            let rowDataCopy = [...rowData];
            let data = responseParams.data;
            data.asset_id = response.data.asset_id;
            data.project_id = response.data.project_id;
            data.Part_No = response.data.Part_No;
            data.asset_type = response.data.asset_type;
            data.model = response.data.model;
            data.form_factor = response.data.form_factor;
            data.manufacturer = response.data.manufacturer;
            data.status = response.data.status;
            data.sold_price_total = response.data.sold_price_total;
            rowDataCopy[index] = data
            // rowDataCopy.splice(deleteIndex, 1);
            setRowData(rowDataCopy);
            setSnackBarOpen(true);
            setSnackBarMessage("Asset updated successfully");
            setSnackBarType('success');
            gridApi.redrawRows({ rowNodes: [params.node] });
          } else {
            setSnackBarOpen(true);
            setSnackBarMessage("Failed to update. Something went wrong.");
            setSnackBarType('error');
            gridApi.startEditingCell({
              rowIndex: params.rowIndex,
              colKey: 'quantity',
            });
          }
          setLoading(false);
          gridApi.hideOverlay();
          setTimeout(() => {
            // highlightUnsavedRows(params);
          }, 600);
        })
        .catch((err) => {
          setLoading(false);
          gridApi.hideOverlay();
          throw err;
        });
    } catch (err) {
      setLoading(false);
      gridApi.hideOverlay();
      setSnackBarOpen(true);
      setSnackBarMessage("Failed to update. Something went wrong.");
      setSnackBarType('error');
      throw err;
    }
  }
  const handleSave = async (params) => {
    setLoading(true);
    gridApi.showLoadingOverlay();
    setNewRowAdded(false)
    if (page === 'projectassets' && urlParams?.id) {
      params.data.project_id = urlParams?.id;
    }
    await addAssets(params)

  };

  const addAssets = async (params) => {
    await fetchPost(
      `${DATAURLS.ASSETS.url}?fields=${tempFieldsList.toString()},Part_No,project_id.id,target_price`,
      params.data,
      getAccessToken()
    )
      .then((response) => {
        // console.log("response", response)
        if (response.data) {
          setSnackBarOpen(true);
          setSnackBarMessage('Asset Created Successfully.');
          setSnackBarType('success');
          // if (response && response.code !== 'update') {
          params.data.asset_id = response.data.asset_id;
          params.data.project_id = response.data.project_id;
          params.data.Part_No = response.data.Part_No;
          params.data.asset_type = response.data.asset_type;
          params.data.model = response.data.model;
          params.data.form_factor = response.data.form_factor;
          params.data.manufacturer = response.data.manufacturer;
          params.data.status = response.data.status;

          let data = [response.data];
          setRowDataAPI((prev) => [...data, ...prev]);

          gridApi.redrawRows({ rowNodes: [params.node] });
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage('Failed to create');
          setSnackBarType('error');
          gridApi.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: 'asset_type',
          });
        }
        setLoading(false);
        gridApi.hideOverlay();
        params.node.setSelected(false);
      })
      .catch((err) => {
        setLoading(false);
        gridApi.hideOverlay();

        throw err;
      });
  }
  const handleExport = (generateData = []) => {
    generateExcelNew(gridApi, `Assets`, generateData, null, assetTypeFieldMappingCo2);
    setEnableBulkUpdates(false);
  };


  const handleCopy = () => {
    if (gridApi) {
      gridApi.paginationGoToFirstPage();
    }
    let selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      return;
    }
    let updatedRows = JSON.parse(JSON.stringify(selectedRows.slice()));
    updatedRows.map((row) => {
      delete row['asset_id'];
    });

    let tempRowdata = [];
    tempRowdata = [...updatedRows, ...rowData]
    setRowData((prev) => [...updatedRows, ...prev]);
    dataSourceparams.successCallback(tempRowdata, tempRowdata.length);
  };

  const handleDelete = async (props) => {
    gridApi.showLoadingOverlay();
    setLoading(true);
    let deleteIndex = rowData.findIndex(obj => obj.asset_id === props.data.asset_id)
    if (!props.data.asset_id) {
      let rowDataCopy = [...rowData];
      rowDataCopy.splice(deleteIndex, 1);
      setRowData(rowDataCopy);
      return;
    }

    fetchDelete(
      DATAURLS.ASSETS.url,
      [props.data.asset_id],
      getAccessToken()
    )
      .then((res) => {
        if (res) {
          let rowDataCopy = [...rowData];
          rowDataCopy.splice(deleteIndex, 1);
          setRowData(rowDataCopy);
          dataSourceparams.successCallback(rowDataCopy, totalRowDatas);

          setLoading(false);
        } else {
          setLoading(false);
          console.log('error', res);
        }
      })
      .catch((err) => {
        console.log('deletion failed', err);
      });

    gridApi.hideOverlay();
  };

  const showImages = (params) => {
    setOpenImages(true);
    setAssetdata(params.data.asset_id)
  }

  const handleOpen = (type) => {
    if (type === 'matched') {
      setCustomDeleteDialogCl(true);
    } else {
      setCustomDeleteDialog(true);
    }
    setCustomDialogTitle('Delete multiple');
    setCustomDialogMessage('Are you sure that you want to delete these assets');
  };

  const handleBulkDelete = async () => {
    let selectedRows = gridApi.getSelectedRows();
    // let selectedAssetIds = selectedRows.map((row) => {
    //   row.asset_id
    // });
    let selectedAssetIds = selectedRows.map(
      (key) => key.asset_id
    );
    // let ss =rowData.filter((row) => selectedAssetIds.indexOf('' + row.asset_id) !== -1);
    // console.log("************", ss)
    // console.log(props,"selectedRows", selectedRows)
    // return

    setLoading(true);
    fetchDelete(
      DATAURLS.ASSETS.url,
      selectedAssetIds,
      getAccessToken()
    )
      .then((res) => {
        setLoading(false);
        if (res) {
          gridApi.deselectAll();
          fetchLatestAssets()
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('bulk update err', err);
        throw err;
      });
  };

  const handleBulkDeleteCl = async () => {
    let selectedRows = gridApiClient.getSelectedRows();
    // let selectedAssetIds = selectedRows.map((row) => {
    //   row.asset_id
    // });
    let selectedAssetIds = selectedRows.map(
      (key) => key.id
    );
    // let ss =rowData.filter((row) => selectedAssetIds.indexOf('' + row.asset_id) !== -1);
    // console.log("************", ss)
    // console.log(props,"selectedRows", selectedRows)
    // return

    setLoading(true);
    fetchDelete(
      DATAURLS.CLIENTASSETS.url,
      selectedAssetIds,
      getAccessToken()
    )
      .then((res) => {
        setLoading(false);
        if (res) {
          gridApiClient.deselectAll();
          clientlists(gridApiClient);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('bulk update err', err);
        throw err;
      });
  };

  const highlightUnsavedRows = (params) => {
    if (!params || rowDataAPI.length === 0) {
      return;
    }
    let missingRowNodes = params.api.rowModel.rowsToDisplay.filter((row) => {
      if (!row.data.asset_id) {
        return row;
      }
    });

    if (missingRowNodes.length > 0) {
      missingRowNodes.map((node) => {
        if (params.node !== node) {
          node.setSelected(true);
        }
      });
    }
  };

  const bgColorDecider = (params, rowDataAPI) => {
    // use this function to change background color of rows based on data
    // leaving it here for future use
    return false;
  };

  const externalFilterChanged = (value) => {
    setSelectedAssetType(value);
  };


  // set background colour on even rows again, this looks bad, should be using CSS classes
  const getRowStyle = params => {
    let match = params.node.data.match;
    if (match && match.toLowerCase() === 'match') {
      return { background: 'green', color: 'white' };
    }
  };

  useEffect(() => {
    if (gridApi && tempColumnDefs && tempColumnDefs.length > 0) {
      // setEnableBulkUpdates(gridApi.getSelectedRows().length > 0 ? true : false);
      const dataSource = {
        getRows: (params) => {
          getPresets(params)
          setDataSourceparams(params);
          // getAssetTypes()

        }
      }
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi, tempColumnDefs]);

  // useEffect(() => {
  //   if (gridApi && tempColumnDefs && tempColumnDefs.length > 0) {
  //     getPresets(gridApi)
  //     getAssetTypes()
  //     // getProjectsLists()
  //   }
  //   //  setData(datas);
  // }, [gridApi, tempColumnDefs]);

  const getColumnDefinitions = async () => {
    let filter = ''
    let order_by_id = 'order_by_id'
    if (currentUser?.role?.name !== 'Administrator' && currentUser?.role?.name !== 'Associate') {
      filter = `&filter[clientview][_eq]=true`;
      order_by_id = 'order_by_id_client'
    }
    if (currentUser?.role?.name === 'Administrator') {
      filter = `&filter[adminview][_eq]=true`
    }
    if (currentUser?.role?.name === 'Associate') {
      filter = `&filter[associateview][_eq]=true`
    }
    //&fields=id,header_name,field,operator,type,editable,filter,component
    let fields1 = `?limit=-1&sort=${order_by_id}${filter}`
    // Fetching column definition
    fetchGet(`${DATAURLS.COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
      .then((response) => {
        let definitions = []
        response.data.forEach((itm) => {
          // if (itm.field !== "actions") {
          definitions.push(itm)
          // }
        })
        setTempColumnDefs(definitions);
      })
      .catch((err) => {
        throw err;
      });
  }
  const getPresets = async (datasource) => {
    //filter={"_and":[{"collection":{"_contains":"Assets"}},{"user":{"_eq":null}}]}
    setLoading(true);
    let param = `?sort=-id&filter={"_and":[{"collection":{"_eq":"Assets"}},{"user":{"id":{"_eq":"${currentUser.id}"}}}]}`
    fetchGet(`${DATAURLS.PRESETS.url}${param}`, getAccessToken())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setPresetId(result.data[0].id)
          if (result.data[0].layout_query?.tabular?.fields?.length > 0) {
            let tempFields = result.data[0].layout_query.tabular.fields;
            // console.log(tempFields,"tempFields",assetTypeColumns)
            // if(assetTypeColumns?.length >0){
            //   tempFields = assetTypeColumns;
            // }
            // let sortString = result.data[0].layout_query.tabular.sort.toString();
            tempFields = ["actions", ...tempFields]
            let val = tempColumnDefs.filter((row) => tempFields.indexOf('' + row.field) !== -1)
            tempColumnDefs.forEach((item) => {
              if (tempFields.some((x) => x == item.field)) {
                item.checked = true;
              } else {
                item.checked = item.field === 'actions' ? true : false;
              }
            })
            setTempColumns(tempColumnDefs)
            setColumnDefs(val);
            setTempFieldsList(tempFields)
            lists(datasource, gridApi, false, false, null, tempFields, '', false, 1)
          } else {
            setLoading(true);
            callLists(datasource);
          }
        } else {
          callLists(datasource);
          setLoading(true);
        }

        // gridApi.hideOverlay();
      })
      .catch((err) => {
        throw err;
      });
  }

  const callLists = (datasource) => {
    let val = [];
    let tempCol = tempColumnDefs

    if (page === 'projectassets') {
      if (currentUser?.userType !== "ADMIN") {
        val = tempCol.filter((row) => row.clientview);
      } else {
        val = tempCol.filter((row) => row.stdview);
      }
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
    })
    setTempColumns(tempCol)
    // let results = tempColumnDefs.filter(o1 => tempFields.some(o2 => o1.field === o2));
    // console.log("tempColumnDefs", val)
    setColumnDefs(val)
    setTempFieldsList(tempFields)

    lists(datasource, gridApi, false, false, null, tempFields, '', false, 1)
    // if (userType === 'CLIENT') {
    //   clientlists(gridApi, null, false, null, tempFields)
    // }
  }
  const submitFilter = async (columns, isStdView = false, sorting = null) => {
    let selectedColumns = []
    if (presetId) {
      if (isStdView) {
        if (currentUser.userType !== 'ADMIN') {
          selectedColumns = tempColumns.filter((row) => row.clientview && row.stdview && row.field !== 'actions');
        } else {
          selectedColumns = tempColumns.filter((row) => row.stdview && row.field !== 'actions');
        }
      } else {
        if (currentUser.userType !== 'ADMIN') {
          selectedColumns = tempColumns.filter((row) => row.checked && row.clientview && row.field !== 'actions');
        } else {
          selectedColumns = tempColumns.filter((row) => row.checked && row.field !== 'actions');

        }
      }
      // console.log(tempColumns,"selected columnss", selectedColumns)
      let filterFields = selectedColumns;
      selectedColumns = selectedColumns.map(
        (status) => status.field
      );
      selectedColumns = ['actions', ...selectedColumns]
      let sort = sorting ? sorting : "-date_created";
      setSortValues(sort)
      let obj = {
        "status": 'published',
        // "role": currentUser.role.id,
        "user": currentUser.id,
        "collection": "Assets",
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
        setTempColumns(tempColumnDefs)
        setColumnDefs(val);
        let filters = [];
        let filterVal = {};
        if (!sorting) {
          setRowsPerPage(2000)
          let tempselectedColumns = selectedColumns
          const index = tempselectedColumns.indexOf('actions');
          if (index > -1) { // only splice array when item is found
            tempselectedColumns.splice(index, 1); // 2nd parameter means remove one item only
          }
          await lists(dataSourceparams, gridApi, null, false, null, tempselectedColumns, null, true, null, filterVal)

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
        "collection": "Assets",
        "layout_query": {
          "tabular": {
            "page": 1,
            "fields": selectedColumns,
            "sort": [
              "-date_created"
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
            lists(dataSourceparams, gridApi, null, false, null, tempFieldsList)
          } else {
            if (sorting) return;
            lists(dataSourceparams, gridApi, null, false, null, tempFieldsList)
          }
          // gridApi.hideOverlay();
        })
        .catch((err) => {
          lists(dataSourceparams, gridApi, null, false, null, tempFieldsList)
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

  const lists = async (request = dataSourceparams, gridApi, type = null, isExport = false, limit = null, displayFields = [], sorting = null, isFilter = false, current_page = null, filterdata = [], serialNumbers = []) => {
    if (!isExport) {
      setLoading(true);
    }
    //name
    gridApi && gridApi.showLoadingOverlay();

    let selectedFilter = {}
    if (filterdata?.length > 0) {
      // console.log("iffff")

      selectedFilter = filterdata;
    } else {
      // console.log("elseeee", filterValues)

      let temp = filterValues
      selectedFilter = temp;
    }
    // console.log("filter selectedFilter", selectedFilter)

    // let displayFields = ["project_id", "asset_type", "imei", "manufacturer", "model", "grade", "complaint", "serial_number"];
    let tempFields = []
    let tempCol = tempColumnDefs
    let disFields = []
    if (currentUser?.userType !== "ADMIN") {
      let val = tempCol.filter((row) => row.clientview);
      disFields = val.map(
        (row) => row.field
      );
    } else {
      disFields = tempCol.map(
        (row) => row.field
      );
    }
    // console.log("tempcolll", tempColumnDefs)

    const currentpage = request ? request.endRow / rowsPerPage : 1;
    let fetchingStatus = 'not_archived'
    if (page === 'archieve-assets') {
      fetchingStatus = 'archived'
    }

    let options = {
      filter: {
        _and: [

        ]
      }
    }
    if (request && Object.keys(request.filterModel).length === 0) {
      options.filter['_and'].push({
        "asset_status": {
          _eq: fetchingStatus
        }
      })
    }
    let fields = `?limit=${isExport ? '-1' : rowsPerPage}${!isExport ? "&page=" + (currentpage) : ''}&meta[]=filter_count&search=${quickFilterText}&fields=${displayFields.toString()},battery,project_id.id,project_id.warehouse,erasure_pdf,user_created.email,total_file_upload,complaint_from_app,user_updated.email,sold_price,qty_sold,quantity`

    if (page === 'projectassets' && urlParams && urlParams.id) {
      if (selectedFilter && selectedFilter._and && selectedFilter._and?.length > 0 && !type) {
        options.filter['_and'].push({
          "project_id": {
            _eq: urlParams.id
          }
        })
      } else {
        let filter = `&filter[project_id][_eq]=${urlParams.id}`
        fields = `${fields}${filter}`
      }
    }
    if (page === 'palletsassets' && urlParams && urlParams.id) {
      if (selectedFilter && selectedFilter._and && selectedFilter._and?.length > 0 && !type) {
        options.filter['_and'].push({
          "pallet_number": {
            _in: urlParams.id
          }
        })

      } else {
        let filter = `&filter[project_id][_eq]=${urlParams.id}`
        fields = `${fields}${filter}`
      }
    }

    if (request && Object.keys(request.filterModel).length > 0) {
      const filterVal = FormatFilterValues(request.filterModel, 'assets');
      let filterParam = options.filter['_and'] ? [...options.filter['_and'], ...filterVal] : [...filterVal];

      options.filter['_and'] = filterParam
    }
    if (selectedFilter && selectedFilter._and && selectedFilter._and) {
      fields = `${fields}&filter=${JSON.stringify(options.filter)}`
    }

    if (currentUser?.role?.name !== 'Administrator') {
      // displayFields = ["user_created", "project_id", "asset_type", "imei", "manufacturer", "model", "grade", "complaint", "serial_number","clie t"];
      fields = `${fields}`;
    }
    //  else {
    //   if (displayFields && displayFields.length > 0) {
    //     fields = `${fields}&fields=${displayFields.toString()}`
    //   }
    // }
    let sort = '-date_created';
    if (request?.sortModel?.length > 0) {
      sort = `${request?.sortModel[0].sort === 'asc' ? '' : '-'}${request?.sortModel[0].colId}`
    }
    if (sort) {
      sort = `&sort=${sort != null ? sort : "-date_created"}`;
      fields = `${fields}${sort}`;
    }
    //Finding duplicate serial number assets
    if (request && Object.keys(request.filterModel).length === 0 && serialNumbers?.length > 0) {
      let filter = `?limit=-1&filter[serial_number][_in]=${serialNumbers}&meta[]=filter_count&sort=${"-serial_number"}`
      fields = `${filter}`;
    }
    fetchGet(`${DATAURLS.ASSETS.url}${fields}`, getAccessToken())
      .then((response) => {
        gridApi && gridApi.hideOverlay();
        if (!isExport) {
          setRowData(response.data);
          setTotalRowDatas(response.meta.filter_count)
          let tempAPI = JSON.parse(JSON.stringify(response.data));
          setRowDataAPI(tempAPI);
          setLoading(false);
          if (response?.data.length > 0 && !type && !isFilter) {
            if (!sorting) {
              // getNewData();
              // getAssets();
            }
          }
          if (response.data.length === 0) {
            setTimeout(() => {
              gridApi && gridApi.hideOverlay();
            }, 2000)
          }
        }
        if (isExport) {
          setIsDownloaded(true)
          setShowExport(false)
          handleExport(response.data)
        }
        request.successCallback(response.data, response.meta.filter_count);
      })
      .catch((err) => {
        setLoading(false);
        gridApi && gridApi.hideOverlay();
        throw err;
      });

  }

  const clearFilters = () => {
    gridApi.setFilterModel(null);
    fetchLatestAssets()

  }

  const handleKeyPress = (event, filter = false) => {
    if (event?.key === 'Enter' || filter) {
      setRowsPerPage(2000)
      fetchLatestAssets();
    }
  }

  useEffect(() => {
    if (page === 'archieve-assets') {
      setFilterValues({
        _and:
          [{
            "asset_status": {
              _eq: 'archived'
            }
          }]
      });
    }
  }, [page]);


  const clientlists = async (id) => {
    let filter = ''
    // if (currentUser?.userType === "CLIENT") {
    //   filter = `,{"client":{"_eq":${projectdata?.client?.id}}}`
    // }
    // if (currentUser?.userType === "PARTNER") {
    //   filter = `,{"partner":{"_eq":${projectdata?.partner?.id}}}`
    // }
    let fields = `?limit=-1&sort=-id&filter={"_and":[{"_and":[{"project_id":{"_eq":${id}}}${filter}]}]}`
    fetchGet(`${DATAURLS.CLIENTASSETS.url}${fields}`, getAccessToken())
      .then((response) => {
        setClientRowData(response.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  const buildColumnDefinitionsClient = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {

      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer: false,
        cellRendererParams: {
          onRowEditingStopped: (params) => onRowEditingStoppedCl(params)
        },
        filterParams: 'TextFilterParams',
        filterType: 'text',
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        filter: index === 0 ? false : 'agTextColumnFilter',
        sortable: true,
        resizable: true,
        hide: false,
        width: index === 0 ? 100 : 'auto',
        title: 'matchedassets',
      };
      return columnDefinition;
    });
  };

  let clientColumn = [
    {
      "field": "id",
      "header_name": "",
      "order_by_id": 0,
    },
    {
      "type": "text",
      "field": "project_id",
      "header_name": "Project ID",
      "order_by_id": 1,
      "hide": true

    },
    {
      "type": "text",
      "field": "model",
      "header_name": "Model",
      "order_by_id": 2,
      "hide": false,
      "editable": true,

    },
    {
      "type": "text",
      "field": "serial_number",
      "header_name": "Serial number",
      "order_by_id": 3,
      "hide": false,
      "editable": true,

    },
    {
      "type": "text",
      "field": "imei",
      "header_name": "IMEI",
      "order_by_id": 4,
      "hide": false,
      "editable": true,

    },
    {
      "type": "text",
      "field": "match",
      "header_name": "Match",
      "order_by_id": 5,
      "hide": true
    },
  ]


  const handleClientExport = (generateData = []) => {
    // return
    generateExcelWLogin(gridApiClient, clientColumn, `client-Assets-${moment().format('YY-MM-DD')}.xlsx`, true, 'clientassets');
  };

  useEffect(() => {
    if (currentUser && currentUser?.userType) {
      setUserType(currentUser?.userType);
    }
  }, [currentUser]);

  const downloadTemplate = () => {
    importdownloadTemplate([], clientColumn, `client-Assets-import-template.xlsx`);
  }

  const handleDeleteMatchedAssets = async (props) => {
    gridApiClient.showLoadingOverlay();
    setLoading(true);
    let deleteIndex = clientRowData.findIndex(obj => obj.id === props.data.id)
    fetchDelete(
      DATAURLS.CLIENTASSETS.url,
      [props.data.id],
      getAccessToken()
    )
      .then((res) => {
        setLoading(false);
        if (res.status) {
          let rowDataCopy = [...clientRowData];
          rowDataCopy.splice(deleteIndex, 1);
          setClientRowData(rowDataCopy);
        } else {
          console.log('error', res);
        }
      })
      .catch((err) => {
        console.log('deletion failed', err);
      });
    gridApiClient.hideOverlay();
    gridApi.hideOverlay();
  };

  const onRowEditingStoppedCl = (params) => {
    gridApiClient.stopEditing();
    delete params.data.match;
    if (validateRow(params) === true) {
      let currentRowFromAPI = rowDataAPI.find(
        (row) => parseInt(row.id) === parseInt(params.data.id)
      );

      if (
        currentRowFromAPI &&
        JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
      ) {

        return;
      }


      if (currentRowFromAPI) {
        handleUpdateCl(params);
        return;
      }
    }
  };

  const handleUpdateCl = (params) => {
    Object.keys(params.data).forEach((key) => {
      if (!params.data[key]) {
        params.data[key] = null;
        params.data['deleted'] = false;
      }
    });
    setLoading(true);
    gridApiClient.showLoadingOverlay();

    fetchPut(
      `${DATAURLS.CLIENTASSETS.url}/${params.data.id}`,
      params.data,
      getAccessToken()
    )
      .then((response) => {
        if (response.data.id) {
          setSnackBarOpen(true);
          setSnackBarMessage("Asset updated successfully");
          setSnackBarType('success');
          gridApiClient.redrawRows({ rowNodes: [params.node] });
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage("Asset updated successfully");
          setSnackBarType('error');
          gridApiClient.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: 'quantity',
          });
        }
        setLoading(false);
        gridApiClient.hideOverlay();
        setTimeout(() => {
          highlightUnsavedRows(params);
        }, 600);
      })
      .catch((err) => {
        throw err;
      });
  };

  const downloadPdf = async (props) => {
    let type = 'COMPUTER';
    let pdfCol = 'cewm.ce.report.erasure.pdf'
    if (props.data.asset_type === 'MOBILE' || props.data.asset_type === 'MOBILE DEVICE') {
      type = 'MOBILE DEVICE';
      pdfCol = 'cewm.cemd.report.erasure.pdf'
    }
    let fields = `?asset_id=${props.data.asset_id}&asset_type=${props.data.asset_type}`
    fetchGet(`${DATAURLS.CERTUSPDFDOWNLOAD.url}${fields}`, getAccessToken())
      .then(async (response) => {
        let result = response.data;
        if (result.length > 0) {
          const linkSource = `data:application/pdf;base64,${result[0][pdfCol]}`;
          const downloadLink = document.createElement("a");
          const fileName = `Certus_erasure_certificate_${props.data.asset_id}`;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      // minWidth: 160,
      floatingFilter: true,
    };
  }, []);

  const onGridReadyNew = useCallback((params) => {
    getColumnDefinitions();
    getNewData();
    getAssetTypes()
    setGridApi(params.api);
  }, []);

  const defaultColDefCl = useMemo(() => {
    return {
      flex: 1,
      minWidth: 140,
      floatingFilter: true,
    };
  }, []);

  const fetchLatestAssets = (serialnumbers = []) => {
    gridApi && gridApi.showLoadingOverlay();
    lists(dataSourceparams, gridApi, false, false, null, tempFieldsList, '', false, 1, [], serialnumbers)
  }

  // const onBtExport = useCallback(() => {
  //   gridRef.current.api.exportDataAsExcel();
  // }, []);

  return (
    <>

      <PageLoader pageLoaderOpen={loading} setPageLoaderOpen={setLoading} />
      {
        <Drawer
          columnDefs={tempColumns}
          setTempColumnDefs={setTempColumns}
          submitFilter={submitFilter}
          onClick={onClick}
          setIsSelect={setIsSelect}
          isSelect={isSelect}
          values={values}
          setValues={setValues}
        />
      }
      <div className={classes.root}>
        {
          projectdata &&
          <div className="proj-container">
            <div>
              <h1 className="project-title" id="HEADING">{projectdata?.project_name ? `${projectdata?.project_name} - ` : ''} {projectdata?.id ? projectdata.id : ''}</h1>
            </div>
            {
              projectdata?.client && <div className="rrPHl hirPY">
                <div className="gZwVG S4 H3 f u ERCyA">
                  <span className="client-title"></span>
                  <span className="oAPmj _S YUQUy PTrfg">
                    <span className="fHvkI PTrfg">{projectdata?.client?.client_name}{projectdata?.client?.phone_number ? ", " + projectdata?.client?.phone_number : ''}{projectdata?.client?.city ? ", " + projectdata?.client?.city : ''}{projectdata?.client?.postal_code ? ", " + projectdata?.client?.postal_code : ''}{projectdata?.client?.delivery_address ? ", " + projectdata?.client?.delivery_address : ''}</span>
                  </span>
                </div>
              </div>
            }
            {
              projectdata?.partner && <div className="rrPHl hirPY">
                <div className="gZwVG S4 H3 f u ERCyA">
                  <span className="partner-title"></span>
                  <span className="oAPmj _S YUQUy PTrfg">
                    <span className="fHvkI PTrfg">{projectdata?.partner?.partner_name}{projectdata?.partner?.phone_number ? ", " + projectdata?.partner?.phone_number : ''}{projectdata?.partner?.city ? ", " + projectdata?.partner?.city : ''}{projectdata?.partner?.postal_code ? ", " + projectdata?.partner?.postal_code : ''}</span>
                  </span>
                </div>
              </div>
            }
            <CustomGoBackButton to={`projects`} color="warning" title='Go Back' />
          </div>
        }
        <div className={'sectionHeader'}>
          Visa tillgångar
          <Paper className={classes.textRoot}>
            <InputBase
              className={classes.input}
              placeholder='Search Assets'
              inputProps={{ 'aria-label': 'Search Assets' }}
              value={quickFilterText}
              name="search"
              onKeyPress={event => handleKeyPress(event)}
              onChange={(event) => {
                // console.log("eventttt", event)
                event.preventDefault();
                event.stopPropagation();
                setQuickFilterText(event.target.value);
              }}
            />
            <IconButton
              // type='submit'
              className={classes.iconButton}
              aria-label='search'
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          <div className={classes.actionArea}>
            {/* <div className="container"> */}
            {
              (currentUser?.userType === "ADMIN") &&
              <Button style={{ verticalAlign: 'bottom', background: 'red' }} className={[styles.btns, styles.reset].join(' ')} onClick={() => getDuplicateSerialNumber()} >
                <span className="instorage">Double Serial No</span>
              </Button>
            }
            <Button style={{ verticalAlign: 'bottom', background: 'red' }} className={[styles.btns, styles.reset].join(' ')} onClick={() => clearFilters()} >
              <span className="instorage">Reset Filter</span>
            </Button>
            {
              (page !== 'archieve-assets' && currentUser?.userType === "ADMIN") ?
                <>
                  {/* // <Button style={{ verticalAlign: 'bottom' }} className={styles.btns} onClick={() => onBtExport} >
                  //   <span className="instorage">Export to Excel</span>
                  // </Button> */}
                  <Button style={{ verticalAlign: 'bottom' }} className={styles.btns} onClick={() => setShowInStorageModalDialog(true)} >
                    <span className="instorage">In Storage</span>
                  </Button>
                  <Button style={{ verticalAlign: 'bottom' }} className={styles.btns} onClick={() => setShowOrderStatusModalDialog(true)} >
                    <span className="instorage">Order Status</span>
                  </Button>
                  <Select
                    value={selectedAssetType}
                    className={classes.select}
                    useRef={externalFilterRef}
                    onChange={(event) => {
                      externalFilterChanged(event.target.value);
                    }}
                  >
                    <MenuItem value='All'>All</MenuItem>
                    {assetTypes.map((type) => (
                      <MenuItem value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  <Tooltip placement="topLeft" title="Bulk Update">
                    <OrderedListOutlined
                      // icon={faTasks}
                      // title='Bulk Update'
                      className={clsx(classes.actionIconDisabled, {
                        [classes.actionIcon]: enableBulkUpdates,
                      })}
                      onClick={() => enableBulkUpdates && handleBulkUpdate(gridApi)}
                    />
                    {/* <Button className={styles.btns} onClick={() => handleAdd()} >
                <PlusOutlined />
              </Button> */}
                  </Tooltip>
                </> : null
            }
            <Divider orientation='vertical' flexItem />
            <Tooltip placement="topLeft" title="Sync">
              <SyncOutlined
                className={clsx(classes.actionIconDisabled, {
                  [classes.actionIcon]: rowData.length == 0 ? false : true,
                })}
                onClick={() => {
                  fetchLatestAssets()
                }}
              />
              {/* <Button className={styles.btns} onClick={() => handleAdd()} >
                <PlusOutlined />
              </Button> */}
            </Tooltip>
            {
              (page !== 'archieve-assets' && currentUser?.userType === "ADMIN") ?
                <>
                  <Tooltip placement="topLeft" title="Add">
                    <PlusOutlined
                      className={clsx(classes.actionIconDisabled, {
                        [classes.actionIcon]: rowData.length == 0 ? false : true,
                      })}
                      onClick={() => handleAddNew()}
                    />
                    {/* <Button className={styles.btns} onClick={() => handleAdd()} >
                <PlusOutlined />
              </Button> */}
                  </Tooltip>
                  <Divider orientation='vertical' flexItem />
                  <Tooltip placement="topLeft" title="Import">
                    <UploadOutlined
                      // icon={faUpload}
                      // title='Import'
                      className={classes.actionIcon}
                      onClick={() => setFileUploadOpen(true)}
                    />
                  </Tooltip>
                  <Tooltip placement="topLeft" title="Export">
                    <DownloadOutlined
                      // icon={faDownload}
                      // title='Export'
                      className={classes.actionIcon}
                      // onClick={() => handleExport()}
                      onClick={() => enableBulkUpdates ? handleExport() : setShowExport(true)}
                    />
                  </Tooltip>
                  <Tooltip placement="topLeft" title="Delete">
                    <DeleteFilled
                      // icon={faTrash}
                      // title='Delete'
                      className={clsx(classes.actionIconDisabled, {
                        [classes.actionIcon]: enableBulkUpdates,
                      })}
                      // onClick={() => enableBulkUpdates && handleBulkDelete()}
                      onClick={() => enableBulkUpdates && handleOpen()}
                    />
                  </Tooltip>
                  <Tooltip placement="topLeft" title="Copy Asset">
                    <CopyFilled
                      // icon={faTrash}
                      // title='Delete'
                      className={clsx(classes.actionIconDisabled, {
                        [classes.actionIcon]: enableBulkUpdates,
                      })}
                      // onClick={() => enableBulkUpdates && handleBulkDelete()}
                      onClick={() => handleCopy()}
                    />
                  </Tooltip>
                </>
                : <>
                  <Tooltip placement="topLeft" title="Export">
                    <DownloadOutlined
                      // icon={faDownload}
                      // title='Export'
                      className={classes.actionIcon}
                      // onClick={() => handleExport()}
                      onClick={() => enableBulkUpdates ? handleExport() : setShowExport(true)}
                    />
                  </Tooltip>
                </>
            }
          </div>

        </div>
        {/* <ScrollMenu className={`${values.length > 5 ? 'scroll-menu' : ''}`}> */}
        <div
          className='ag-theme-quartz'
          style={{
            width: '100%',
            height: rowData.length > 300 ? '90vh' : '70vh',
            // height: '90vh',
            boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
            paddingBottom: '20px'
          }}
        >
          <AgGridReact
            ref={gridRef}
            columnDefs={buildColumnDefinitions(columnDefs, assetTypes)}
            defaultColDef={defaultColDef}
            rowModelType={"infinite"}
            pagination={true}
            cacheBlockSize={10}
            onGridReady={onGridReadyNew}
            applyColumnDefOrder={true}
            getRowHeight={20}
            cacheOverflowSize={100}
            maxConcurrentDatasourceRequests={-1}
            infiniteInitialRowCount={1}
            maxBlocksInCache={rowsPerPage}
            cacheBlockSize={rowsPerPage}
            debounceVerticalScrollbar={true}
            paginationPageSizeSelector={[100, 250, 500, 1000, 2000]}
            // suppressHorizontalScroll={false}

            components={frameworkComponents}
            // suppressDragLeaveHidesColumns={true}
            // // onGridReady={onGridReady}
            rowSelection='multiple'
            onRowEditingStopped={onRowEditingStopped}
            onCellEditingStopped={onCellEditingStopped}
            onRowSelected={onRowSelected}
            onRowDataChanged={onRowDataChanged}
            onRowEditingStarted={onRowEditingStarted}
            editType='fullRow'
            getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
            overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
            // getNewData={getNewData}
            handleDelete={handleDelete}
            enableCellTextSelection={true}
            paginationPageSize={pageSize}
            // suppressRowClickSelection={true}
            // alwaysShowVerticalScroll={true}
            // // quickFilterText={quickFilterText}
            // onModelUpdated={onModelUpdated}
            // doesExternalFilterPass={doesExternalFilterPass}
            // floatingFilter={true}
            // suppressNavigable={true}
            downloadPdf={downloadPdf}
          // userType={currentUser?.userType}

          />
        </div>
        <Card>
          {
            (page === 'projectassets') &&
            <>
              <div className={'sectionHeader'}>
                <span>{`Matched Assets`}</span>
                <div className={classes.actionArea}>
                  <>
                    <Divider orientation='vertical' flexItem />
                    <Tooltip placement="topLeft" title="Sync">
                      <SyncOutlined
                        className={clsx(classes.actionIconDisabled, {
                          [classes.actionIcon]: rowData.length == 0 ? false : true,
                        })}
                        onClick={() => {
                          gridApiClient.deselectAll();
                          clientlists(urlParams.id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip placement="topLeft" title="Import Matching file">
                      <UploadOutlined
                        // icon={faUpload}
                        // title='Import'
                        className={classes.actionIcon}
                        onClick={() => setClientFileUploadOpen(true)}
                      />
                    </Tooltip>
                    <Button style={{ verticalAlign: 'bottom' }} className={styles.btns} onClick={() => downloadTemplate()} >
                      <span className="instorage">Download import Template</span>
                    </Button>
                  </>
                  <Tooltip placement="topLeft" title="Delete">
                    <DeleteFilled
                      // icon={faTrash}
                      // title='Delete'
                      className={clsx(classes.actionIconDisabled, {
                        [classes.actionIcon]: enableBulkUpdatesCl,
                      })}
                      // onClick={() => enableBulkUpdates && handleBulkDelete()}
                      onClick={() => enableBulkUpdatesCl && handleOpen('matched')}
                    />
                  </Tooltip>
                  <Tooltip placement="topLeft" title="Export matching file">
                    <DownloadOutlined
                      // icon={faDownload}
                      // title='Export'
                      className={classes.actionIcon}
                      // onClick={() => handleExport()}
                      onClick={() => handleClientExport(clientRowData)}
                    />
                  </Tooltip>
                </div>
              </div>
              <div
                className='ag-theme-quartz'
                style={{
                  width: '100%',
                  height: clientRowData.length > 100 ? '60vh' : '40vh',
                  boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
                }}
              ><AgGridReact
                rowData={clientRowData}
                getRowStyle={getRowStyle}
                defaultColDef={defaultColDefCl}
                // rowBuffer={500}
                applyColumnDefOrder={true}
                // cacheBlockSize={100}
                // cacheOverflowSize={2}
                // maxConcurrentDatasourceRequests={1}
                // infiniteInitialRowCount={2000}
                // maxBlocksInCache={10}
                debounceVerticalScrollbar={true}
                suppressHorizontalScroll={false}
                columnDefs={buildColumnDefinitionsClient(clientColumn, assetTypes)}
                frameworkComponents={frameworkComponents}
                suppressDragLeaveHidesColumns={true}
                onGridReady={onGridReadyClient}
                rowSelection='multiple'
                onRowEditingStopped={onRowEditingStoppedCl}
                // onCellEditingStopped={onCellEditingStoppedCl}
                onRowSelected={onRowSelectedCl}
                // onRowDataChanged={onRowDataChanged}
                onRowEditingStarted={onRowEditingStartedCl}
                editType='fullRow'
                getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
                overlayLoadingTemplate={clientRowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                getNewData={getProjectsAssets}
                handleDelete={handleDeleteMatchedAssets}
                title="matched assets"
                pagination={true}
                enableCellTextSelection={true}
                paginationPageSize={pageSize}
                suppressRowClickSelection={false}
                alwaysShowVerticalScroll={true}
                floatingFilter={true}
              // stopEditingWhenGridLosesFocus={true}
              ></AgGridReact>
              </div>
            </>
          }
        </Card>
        {/* {
          (page === 'projectassets') &&
          <Pagination
            totalRows={totalRowDatas}
            pageChangeHandler={setCurrentPage}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
          />
        } */}
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

        <OrderStatus
          open={showOrderStatusModalDialog}
          setOpen={setShowOrderStatusModalDialog}
          assetDataList={rowData}
          assetIdsList={rowData}
          parentGridApi={gridApi}
          getNewData={fetchLatestAssets}
        />
        <InStorage
          showModalDialog={showInStorageModalDialog}
          setShowInStorageModalDialog={setShowInStorageModalDialog}
          assetDataList={rowData}
          assetIdsList={rowData}
          parentGridApi={gridApi}
          getNewData={fetchLatestAssets}
        />
        {
          fileUploadOpen &&
          <FileUpload
            open={fileUploadOpen}
            setOpen={setFileUploadOpen}
            allAssets={rowData}
            title='file upload'
            assetTypes={assetTypes}
            palletNumbers={palletNumbers}
            statusNames={statusNames}
            handleCancel={setFileUploadOpen}
            getNewData={fetchLatestAssets}
            parentGridApi={gridApi}
            tempFieldsList={tempFieldsList}
            page={page}
            projectId={urlParams.id ? urlParams.id : null}
            columnFields={tempColumnDefs.map((item) => item.field)}
            datasource={dataSourceparams}
            fetchLatestAssets={fetchLatestAssets}
          />
        }
        {
          page === 'projectassets' && <ClientFileUpload
            open={clientFileUploadOpen}
            setOpen={setClientFileUploadOpen}
            title='Asset match file upload'
            handleCancel={setClientFileUploadOpen}
            getNewData={clientlists}
            parentGridApi={gridApi}
            projectdata={projectdata}
            currentUser={currentUser}
            projectId={urlParams.id ? urlParams.id : null}
          />
        }

        <BulkUpdateDialog
          open={bulkUpdateOpen}
          title='bulk update'
          columnDefs={columnDefs}
          parentGridApi={gridApi}
          getNewData={lists}
          setOpen={setBulkUpdateOpen}
          assetTypes={assetTypes}
          palletNumbers={palletNumbers}
          statusNames={statusNames}
          setUpdatedData={setBulkupdatedData}
          tempFieldsList={tempFieldsList}
          datasource={dataSourceparams}
        />
        <ExportModal
          open={showExport}
          setOpen={setShowExport}
          lists={lists}
          parentGridApi={gridApi}
          filterValues={filterValues}
          totalRows={totalRowDatas}
          isDownloaded={isDownloaded}
          tempFieldsList={tempFieldsList}
          datasource={dataSourceparams}
        />
        <CustomDialog
          open={customDeleteDialog}
          title={customDialogTitle}
          message={customDialogMessage}
          handleAgree={() => {
            handleBulkDelete();
            setCustomDeleteDialog(false);
          }}
          handleDisagree={() => setCustomDeleteDialog(false)}
        />
        <Exportpdf
          open={showExportPdf}
          setOpen={setshowExportPdf}
          assetdata={assetdata}
          setAssetdata={setAssetdata}
        />
        <ShowImages
          showDialog={openImages}
          handleCancel={setOpenImages}
          selectedItem={assetdata}
          currentUser={currentUser}
          collection={"Asset"}
        />

        <CustomDialog
          open={customDeleteDialogCl}
          title={customDialogTitle}
          message={customDialogMessage}
          handleAgree={() => {
            handleBulkDeleteCl('matched');
            setCustomDeleteDialogCl(false);
          }}
          handleDisagree={() => setCustomDeleteDialogCl(false)}
        />
      </div>
    </>
  );
};

export default connect(({ loading, user, assetForm }) => ({
  assetForm,
  submitting: loading.effects['assetForm/updateMultipleAssetById'],
  currentUser: user.currentUser,
  loading: loading.effects['assetForm/fetchAssets'],
}))(Assets);