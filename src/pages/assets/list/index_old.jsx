import {
  PlusOutlined,
  DeleteFilled,
  OrderedListOutlined,
  UploadOutlined,
  DownloadOutlined,
  SyncOutlined,
  CopyFilled,
  ArrowUpOutlined,
  ArrowDownOutlined
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

import { connect, history } from 'umi';
import * as moment from 'moment';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';

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
} from '@/utils/utils';
import { generateExcel } from '@/utils/generateExcel';
import AssetTypesEditor from '../components/AssetTypes';
import StatusEditor from '../components/StatusTypes';
import { useParams, useLocation } from 'react-router-dom'
import Pagination from '../../components/paging';
import ExportModal from '../components/ExportData';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import TextField from '@material-ui/core/TextField';
import Drawer from '../../components/sidedrawer';
import PageLoader from '../../components/pageloader/PageLoader';
import MatchCellRenderer from '../components/MatchCellRenderer';
import Card from '@mui/material/Card';
import ClientFileUpload from '../components/ClientFileUpload';
import { generateExcelWLogin, importdownloadTemplate } from '@/utils/generateExcel';
import CustomGoBackButton from '../../../uikit/GoBack';
import ReactGA from "react-ga4";
import FilterModal from '../components/FilterModal';
import _ from "underscore"
import SelectDate from '../components/SelectDate'
import PdfCellRenderer from '../components/Certus_pdf_render';
const types = ['COMPUTER', 'MOBILE', 'MOBILE DEVICE']


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
      width: '42%',
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
  PdfCellRenderer
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
        headerName: index !== 0 ? columnDef.header_name : '',
        cellRenderer: currentUser?.userType !== 'ADMIN' && field === 'date_nor' ? false : columnDef.component,
        // cellRenderer: currentUser?.userType === 'ADMIN' ? (field === 'date_nor' ? 'SelectDate' : false) : (field === 'data_destruction' ? 'PdfCellRenderer' : index === 0 ? 'ActionCellRenderer' : false),
        cellRendererParams: {
          onRowEditingStopped: (params) => onRowEditingStopped(params),
        },
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: currentUser?.userType === "ADMIN" ? columnDef.editable : false,
        filter: 'none',
        sortable: true,
        resizable: true,
        hide: columnDef.hide,
        width: index === 0 ? 150 : 'auto',
        suppressKeyboardEvent: suppressNavigation,
        suppressHeaderKeyboardEvent: suppressUpDownNavigation,
        valueGetter: (params) => {
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
            return params.data.project_id?.partner?.partner_org_no
          }
          if (columnDef.field === "complaint") {
            if (params.data.complaint) {
              let complaint = params.data?.complaint ? params.data.complaint.toLowerCase() : null
              if (complaint && complaint.includes('mdm unlocked')) {
                params.data.complaint = complaint.replace("mdm unlocked", "")
              }
            }
          }
          return params.data[columnDef.field];
        },
        valueFormatter: (params) => {

          if (columnDef.type === 'currencyColumn') {
            return params.value ? '\xA3' + params.value : ' ';
          }
          if (columnDef.field === "manufacturer") {
            return params.value ? params.value.toUpperCase() === "HEWLETT-PACKARD" ? "HP" : params.value.toUpperCase() : ''
          }
          if (columnDef.type === 'date' && params.value) {
            return params.value ? moment(params.value).format('YYYY-MM-DD') : null;
          }
          if (columnDef.field === 'asset_type' && params.value) {
            let query = ''
            let form_factor = null
            let currentAssetType = ''
            if (params.data.form_factor && params.data.form_factor !== '') {
              form_factor = params.data.form_factor.trim().toLowerCase()
              currentAssetType = assetTypeFieldMappingCo2.filter(
                (asset) => ((asset.Asset_Name.toLowerCase() === params.value.toLowerCase()) && asset.formfactor?.trim().toLowerCase() === form_factor)
              );
            } else {
              currentAssetType = assetTypeFieldMappingCo2.filter(
                (asset) => ((asset.Asset_Name.toLowerCase() === params.value.toLowerCase()) && asset.formfactor === null)
              );
            }

            if (currentAssetType?.length > 0) {
              params.data.sample_co2 = currentAssetType[0]?.sampleco2 || '';
              params.data.sample_weight = currentAssetType[0]?.sample_weight || '';
            }
            // if (params.data?.grade) {
            //   let grade = params.data?.grade.toUpperCase();
            //   if (grade === 'D' || grade === 'E') {
            //     params.data.sample_co2 = '';
            //   }
            // }
          }
          if (columnDef.field === 'asset_type' || columnDef.field === 'status') {
            return params.value ? params.value?.toUpperCase() : ''
          }
          if (columnDef.field === 'quantity') {
            return params.value ? params.value : 1
          }
        },
      };
      if (columnDef.field === 'asset_type') {
        columnDefinition.cellEditor = 'AssetTypesEditor';
        columnDefinition.cellEditorParams = {
          values: assetTypes,
        };
      }

      if (columnDef.field === 'pallet_number') {
        columnDefinition.cellEditor = 'DialogEditor';
        columnDefinition.cellEditorParams = {
          values: palletNumbers.sort((a, b) => (a > b ? -1 : 1)),
        };
      }
      if (columnDef.field === 'status') {
        columnDefinition.cellEditor = 'StatusEditor';
        columnDefinition.cellEditorParams = {
          values: statusNames,
        };
      }
      // if (columnDef.field === 'data_destruction') {
      //   columnDefinition.cellEditor = 'StatusEditor';
      //   columnDefinition.cellEditorParams = {
      //     values: dataDestruction,
      //   };
      // }
      if (columnDef.type === 'numericColumn') {
        columnDefinition.cellEditor = 'NumericEditor';
      }
      if (columnDef.type === 'currencyColumn') {
        columnDefinition.cellEditor = 'CurrencyEditor';
      }
      return columnDefinition;
    });
  };


  const { currentUser } = props;

  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(50);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(250);
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
  const [sortValues, setSortValues] = useState('-created_at');
  const [modalopen, setModalopen] = useState(false);
  const [filterModalField, setFilterModalField] = useState({});
  const [assetTypeFieldMappingCo2, setAssetTypeFieldMappingCo2] = useState([]);
  const [showExportPdf, setshowExportPdf] = useState(false);
  const [assetpdfData, setAssetpdfData] = useState(null);

  useEffect(() => {
    ReactGA.initialize("UA-268157654-1");
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [])

  useEffect(() => {
    if (location && userType) {
      let currentpage = location.pathname.split("/")
      if (userType !== 'ADMIN' && currentpage[1] === 'assets') {
        history.push({
          pathname: '/projects'
        });
      }
      setPage(currentpage[1])
    }
  }, [location, userType]);

  // useEffect(() => {
  //   if (!gridApi) {
  //     return;
  //   }
  //   let allColumnIds = gridApi.columnController.gridColumns.map(
  //     (col) => col.colId
  //   );
  //   let currentMapping = assetTypeFieldMapping.find(
  //     (mapping) => mapping.Asset_Name.toUpperCase() === selectedAssetType.toUpperCase()
  //   );

  //   let columnsToShow = currentMapping ? currentMapping.Fields : [];

  //   if (!columnsToShow || columnsToShow.length === 0) {
  //     gridApi.columnController.setColumnsVisible(allColumnIds, true);
  //     return;
  //   }

  //   if (columnsToShow.length > 0) {
  //     columnsToShow.push('actions', 'asset_id');
  //   }

  //   gridApi.columnController.setColumnsVisible(allColumnIds, false);
  //   gridApi.columnController.setColumnsVisible(columnsToShow, true);
  // }, [gridApi, assetTypeFieldMapping, selectedAssetType]);

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



  // const getAssets = async () => {
  //   let fields = `?limit=-1&sort=-asset_id&fields[]=asset_id,project_id`
  //   fetchGet(`${DATAURLS.ASSETS.url}${fields}`, getAccessToken())
  //     .then((response) => {
  //       let assets_ids = response.data.map(
  //         (item) => item.asset_id
  //       );
  //       let project_ids = response.data.map(
  //         (item) => item.project_id
  //       );
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }

  // console.log("assetsIds", assetsIds)

  const getAssetTypes = () => {
    let fields3 = '?limit=-1&sort=Asset_Name&fields=Asset_Name,formfactor,sample_weight,sampleco2&filter[Asset_Name][_nnull]=true';

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
      (row) => row.asset_number && row.asset_number === params.data.asset_number
    );

    return duplicateNumberRows.length <= 1;
  };

  const onGridReady = (params) => {
    getColumnDefinitions();
    setGridApi(params.api);
  };
  const onGridReadyClient = (params) => {
    setGridApiClient(params.api);
    getProjectsAssets(params.api)
  };
  const onRowSelected = () => {

    setEnableBulkUpdates(gridApi.getSelectedRows().length > 0 ? true : false);
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

  const onRowEditingStopped = (params) => {
    gridApi.stopEditing();
    delete params.data.project_id?.partner;
    delete params.data.project_id?.client;
    delete params.data.project_id_obj;

    if (validateRow(params) === true) {
      let currentRowFromAPI = rowDataAPI.find(
        (row) => parseInt(row.asset_id) === parseInt(params.data.asset_id)
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
      handleSave(params);
    } else {
      setSnackBarOpen(true);
      setSnackBarMessage('Cannot insert duplicate asset number');
      setSnackBarType('error');
      params.api.startEditingCell({
        rowIndex: params.rowIndex,
        colKey: 'asset_number',
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
    let newRow = [{ ...data, data_generated: 'MANUAL', status: 'IN STOCK', project_id: urlParams.id ? urlParams.id : null }];
    if (selectedAssetType !== 'All') {
      newRow.map((row) => (row.asset_type = selectedAssetType));
    }
    gridApi.deselectAll();
    setNewRowAdded(true)
    setRowData((prev) => [...newRow, ...prev]);
    setTimeout(() => {
      gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'quantity',
        keyPress: '1',
      });
    }, 900);
  };

  const handleUpdate = (params) => {
    Object.keys(params.data).forEach((key) => {
      if (!params.data[key]) {
        params.data[key] = null;
        params.data['deleted'] = false;
      }
    });
    setLoading(true);
    gridApi.showLoadingOverlay();

    params.data.last_updated_at = new Date().toISOString();
    params.data.last_updated_by = currentUser.user_email;
    if (params?.data?.project_id && params.data.project_id?.id) {
      params.data.project_id = params.data.project_id.id;
    }
    if (page === 'projectassets' && urlParams?.id) {
      params.data.project_id = urlParams?.id;
    }
    // if (params.data && params.data.status && params.data.status.toLowerCase() === 'sold' && !params.data.date_nor) {
    //   params.data.date_nor = new Date().toISOString().slice(0, 10);
    // }
    // if (params.data && params.data.status && params.data.status.toLowerCase() === 'sold') {
    //   params.data.storage_id = '';
    // }
    // if (params.data && params.data.status && params.data.status.toLowerCase() !== 'sold' && params.data.date_nor) {
    //   params.data.date_nor = null;
    // }
    // console.log("paramssss dataa", params.data)

    // return
    let grade = ''
    if (params.data.grade) {
      grade = params.data.grade.trim().toUpperCase();
      if (grade === 'a' || grade === 'b' || grade === 'c' || grade === 'd') {
        params.data.status = 'IN STOCK';
      } else if (grade === 'e') {
        params.data.status = "RECYCLED";
      }
    }
    // fetchPost(
    //   `${DATAURLS.GETTARGETPRICE.url}`,
    //   params.data,
    //   getAccessToken()
    // )
    //   .then((response) => {
    //     if (response.data > 0) {
    //       params.data.target_price = response.data;
    //     }
    //     // addAssets()
    //   }).catch((err) => {
    //     update(params);
    //     throw err;
    //   });
    // return
    update(params)

  };

  const handleBulkUpdate = (params) => {
    setBulkUpdateOpen(true);
  };

  const update = (params) => {
    let fields = `${tempFieldsList?.length > 0 ? tempFieldsList.toString() + ',Part_No,project_id.id,target_price' : 'asset_id,project_id.id,target_price'}`
    fetchPut(
      `${DATAURLS.ASSETS.url}/${params.data.asset_id}?fields=${fields}`,
      params.data,
      getAccessToken()
    )
      .then((response) => {
        if (response?.data?.asset_id) {
          let index = params.node.rowIndex
          // let deleteIndex = rowData.findIndex(obj => obj.asset_id === props.data.asset_id)
          let rowDataCopy = [...rowData];
          rowDataCopy[index] = response.data
          // rowDataCopy.splice(deleteIndex, 1);
          setRowData(rowDataCopy);
          setSnackBarOpen(true);
          setSnackBarMessage("Asset updated successfully");
          setSnackBarType('success');
          gridApi.redrawRows({ rowNodes: [params.node] });
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage("Asset updated successfully");
          setSnackBarType('error');
          gridApi.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: 'quantity',
          });
        }
        setLoading(false);
        gridApi.hideOverlay();
        setTimeout(() => {
          highlightUnsavedRows(params);
        }, 600);
      })
      .catch((err) => {
        throw err;
      });
  }
  const handleSave = async (params) => {
    setLoading(true);
    gridApi.showLoadingOverlay();
    setNewRowAdded(false)
    // if (params.data && params.data.status && params.data.status.toLowerCase() === 'sold' && !params.data.date_nor) {
    //   params.data.date_nor = new Date().toISOString().slice(0, 10);
    // }

    // if (params.data && params.data.status && params.data.status.toLowerCase() !== 'sold' && params.data.date_nor) {
    //   params.data.date_nor = null;
    // }
    // if (params.data && params.data.status && params.data.status.toLowerCase() === 'sold') {
    //   params.data.storage_id = '';
    // }
    params.data.created_by = currentUser.user_email;
    if (page === 'projectassets' && urlParams?.id) {
      params.data.project_id = urlParams?.id;
    }
    // await fetchPost(
    //   `${DATAURLS.GETTARGETPRICE.url}`,
    //   params.data,
    //   getAccessToken()
    // )
    //   .then((response) => {
    //     if (response.data > 0) {
    //       params.data.target_price = 123;
    //     }
    //     // addAssets()
    //   }).catch((err) => {
    //     // addAssets(params);
    //     throw err;
    //   });
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
        throw err;
      });
  }
  const handleExport = (generateData = []) => {
    generateExcel(gridApi, `Assets`, generateData);
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
    setRowData((prev) => [...updatedRows, ...prev]);
    setTimeout(() => {
      gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'quantity',
        keyPress: '1',
      });
    }, 500);
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
        // console.log('responsee delete', res);

        if (res) {
          let rowDataCopy = [...rowData];
          rowDataCopy.splice(deleteIndex, 1);
          setRowData(rowDataCopy);
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
          lists(gridApi, null, false, null, tempFieldsList)
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

  const doesExternalFilterPass = (node) => {
    return node.data.asset_type === externalFilterRef.current.children[1].value;
  };

  // set background colour on even rows again, this looks bad, should be using CSS classes
  const getRowStyle = params => {
    let match = params.node.data.match;
    if (match && match.toLowerCase() === 'match') {
      return { background: 'green', color: 'white' };
    }
  };

  const handleChange = (index, event) => {
    let data = [...values];
    data[index]['values'] = event.target.value;
    setValues(data);
  }
  const handleChange1 = (event, item, id) => {
    console.log("eventt", event)
    let data = [...values];
    data[index]['values'] = event.target.value;
    setValues(data);
    const values = [...focusArea];
    values[index].isEmptyChecked = event.target.checked;
    setFocusArea(values);
  }
  // console.log("valueeee", values)
  // useEffect(() => {
  //   if (values && values.length > 0) {
  //     let filters = [];
  //     let filterVal = {};
  //     (values).map((item) => {
  //       // {"_and":[{"asset_type":{"_contains":"COMPUTER"}},{"manufacturer":{"_contains":"HP"}}]}
  //       if (item.header_name !== 'Actions' && item.values) {
  //         let obj = {};
  //         if ((item.key || item.field) === "project_id.client.client_name") {
  //           obj = {
  //             "project_id": {
  //               "client": {
  //                 "client_name": {
  //                   [item.operator]: item.values
  //                 }
  //               }
  //             }
  //           }
  //         } else if ((item.key || item.field) === "project_id.client.client_org_no") {
  //           obj = {
  //             "project_id": {
  //               "client": {
  //                 "client_org_no": {
  //                   [item.operator]: item.values
  //                 }
  //               }
  //             }
  //           }
  //         } else if ((item.key || item.field) === "project_id.partner.partner_name") {
  //           obj = {
  //             "project_id": {
  //               "partner": {
  //                 "partner_name": {
  //                   [item.operator]: item.values
  //                 }
  //               }
  //             }
  //           }
  //         } else if ((item.key || item.field) === "project_id.partner.partner_org_no") {
  //           obj = {
  //             "project_id": {
  //               "partner": {
  //                 "partner_org_no": {
  //                   [item.operator]: item.values
  //                 }
  //               }
  //             }
  //           }
  //         } else {
  //           if (item.operator === '_eq') {
  //             let comma = ''
  //             if (item.values.indexOf(',') > -1) {
  //               comma = item.values.split(',')
  //             }
  //             if (comma?.length > 0) {
  //               obj = {
  //                 [(item.key || item.field)]: {
  //                   ['_in']: comma.toString()
  //                 }
  //               }
  //             } else {
  //               obj = {
  //                 [(item.key || item.field)]: {
  //                   [item.operator]: item.values
  //                 }
  //               }
  //             }

  //           } else {
  //             obj = {
  //               [(item.key || item.field)]: {
  //                 [item.operator]: item.values
  //               }
  //             }
  //           }
  //         }
  //         filters.push(obj)
  //       }

  //       if (filters?.length > 0) {
  //         filterVal["_and"] = filters
  //       }
  //       setFilterValues(filterVal);
  //     })
  //   }
  // }, [values])

  useEffect(() => {
    if (values && values.length > 0) {

      let filters = [];
      let filterVal = {};
      (values).map((item) => {
        // {"_and":[{"asset_type":{"_contains":"COMPUTER"}},{"manufacturer":{"_contains":"HP"}}]}
        if (item.placeholder !== 'Actions' && item.values) {
          let obj = {};
          let obj1 = {};
          if ((item.key || item.field) === "project_id.client.client_name") {
            obj = {
              "project_id": {
                "client": {
                  "client_name": {
                    [item.operator]: item.values
                  }
                }
              }
            }
          } else if ((item.key || item.field) === "project_id.client.client_org_no") {
            obj = {
              "project_id": {
                "client": {
                  "client_org_no": {
                    [item.operator]: item.values
                  }
                }
              }
            }
          } else if ((item.key || item.field) === "project_id.partner.partner_name") {
            obj = {
              "project_id": {
                "partner": {
                  "partner_name": {
                    [item.operator]: item.values
                  }
                }
              }
            }
          } else if ((item.key || item.field) === "project_id.partner.partner_org_no") {
            obj = {
              "project_id": {
                "partner": {
                  "partner_org_no": {
                    [item.operator]: item.values
                  }
                }
              }
            }
          } else {
            let comma = ''
            if (item.operator === '_eq') {
              if (item.fromdate) {
                item.values = item.fromdate
              }
              if (item.key === 'asset_id' || item.key === 'project_id' || item.field === 'asset_id' || item.field === 'project_id') {
                if ((item.values.indexOf(' ') > -1) || (item.values.indexOf(',') > -1)) {
                  comma = item.values.split(' ') || item.values.split(',')
                }
              } else {
                if (item.values.indexOf(',') > -1) {
                  comma = item.values.split(',')
                }
              }
              if (comma?.length > 0) {
                obj = {
                  [(item.key || item.field)]: {
                    ['_in']: comma.toString()
                  }
                }
              } else {
                obj = {
                  [(item.key || item.field)]: {
                    [item.operator]: item.values
                  }
                }
              }

            } else if (item.isSpaceSeperate && (item.operator === '_in' || item.operator === '_nin')) {
              if (item.values.indexOf(' ') > -1) {
                comma = item.values.split(' ')
              }
              if (comma?.length > 0) {
                obj = {
                  [(item.key || item.field)]: {
                    ['_in']: comma.toString()
                  }
                }
              } else {
                obj = {
                  [(item.key || item.field)]: {
                    [item.operator]: item.values
                  }
                }
              }

            } else if (item.operator === '_between' || item.operator === '_nbetween') {
              if (item.fromdate && !item.todate) {
                item.values = item.fromdate
              }
              if (item.fromdate && item.todate) {
                let dates = [];
                dates.push(item.fromdate, item.todate)
                item.values = dates.toString()
              }
              if (item.values.indexOf(',') > -1) {
                comma = item.values.split(',')
              }
              if (comma?.length > 0) {
                obj = {
                  [(item.key || item.field)]: {
                    [item.operator]: comma.toString()
                  }
                }
              } else {
                obj = {
                  [(item.key || item.field)]: {
                    [item.operator]: item.values
                  }
                }
              }

            } else if (item.operator === '_empty' || item.operator === '_null') {
              obj = {

                [(item.key || item.field)]: {
                  ['_null']: true
                }
              }
              obj1 = {
                [(item.key || item.field)]: {
                  ['_empty']: true
                }
              }
            } else {

              if (item.key === 'asset_type' && item.values) {
                item.values = item.values.replace("&", "%26")
              }
              obj = {
                [(item.key || item.field)]: {
                  [item.operator]: item.values
                }
              }
            }
          }
          filters.push(obj)
        }
        if (filters?.length > 0) {
          filterVal["_and"] = filters
        }
        setFilterValues(filterVal);
      })
    }
  }, [values])


  // useEffect(() => {
  //   getAssetTypes()
  //   getProjectsLists()
  // }, []);

  useEffect(() => {
    if (gridApi && tempColumnDefs && tempColumnDefs.length > 0) {
      getPresets(gridApi)
      getAssetTypes()
      // getProjectsLists()
    }
    //  setData(datas);
  }, [gridApi, tempColumnDefs]);

  const getColumnDefinitions = async () => {
    let filter = ''
    if (currentUser?.role?.name !== 'Administrator' || currentUser?.role?.name !== 'Associate') {
      filter = `&filter[clientview][_eq]=true`
    }
    if (currentUser?.role?.name === 'Administrator') {
      filter = `&filter[adminview][_eq]=true`
    }
    if (currentUser?.role?.name === 'Associate') {
      filter = `&filter[associateview][_eq]=true`
    }
    let fields1 = `?limit=-1&sort=order_by_id${filter}`

    // Fetching column definition
    fetchGet(`${DATAURLS.COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
      .then((response) => {
        setTempColumnDefs(response.data);
      })
      .catch((err) => {
        throw err;
      });
  }
  const getPresets = async (gridApi, type = null) => {
    //filter={"_and":[{"collection":{"_contains":"Assets"}},{"user":{"_eq":null}}]}
    setLoading(true);
    let param = `?filter={"_and":[{"collection":{"_eq":"Assets"}},{"user":{"id":{"_eq":"${currentUser.id}"}}}]}`
    fetchGet(`${DATAURLS.PRESETS.url}${param}`, getAccessToken())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setPresetId(result.data[0].id)
          if (result.data[0].layout_query?.tabular?.fields?.length > 0) {
            let tempFields = result.data[0].layout_query.tabular.fields;
            let sortString = result.data[0].layout_query.tabular.sort.toString();
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
            setValues(cols)
            setTempFieldsList(tempFields)
            lists(gridApi, false, false, null, tempFields, '', false, 1)
          } else {
            setLoading(true);
            callLists();
          }
        } else {
          callLists();
          setLoading(true);
        }

        // gridApi.hideOverlay();
      })
      .catch((err) => {
        throw err;
      });
  }

  const callLists = () => {
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
          'isSpaceSeperate': item.isSpaceSeperate
        }
        cols.push(obj)
      }
    })
    setTempFieldsList(tempFields)

    setValues(cols);
    lists(gridApi, null, false, null, tempFields, '', false, 1)
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
      let sort = sorting ? sorting : "-created_at";
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
        setValues(cols)
        setTempColumns(tempColumnDefs)
        setColumnDefs(val);
        let filters = [];
        let filterVal = {};
        if (!sorting) {
          setRowsPerPage(2000)
          await lists(gridApi, false, false, 2000, tempFieldsList, '', true, null, filterVal);
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
            lists(gridApi, null, false, null, tempFieldsList)
          } else {
            if (sorting) return;
            lists(gridApi, null, false, null, tempFieldsList)
          }
          // gridApi.hideOverlay();
        })
        .catch((err) => {
          lists(gridApi, null, false, null, tempFieldsList)
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

  const lists = async (gridApi, type = null, isExport = false, limit = null, displayFields = [], sorting = null, isFilter = false, current_page = null, filterdata = []) => {
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
      console.log("elseeee", filterValues)

      let temp = filterValues
      selectedFilter = temp;
    }
    // console.log("filter selectedFilter", selectedFilter)

    // let displayFields = ["project_id", "asset_type", "imei", "manufacturer", "model", "grade", "complaint", "serial_number"];
    let sort = ''
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

    let curnPage = current_page ? current_page : currentPage;
    let fields = `?limit=${!limit ? rowsPerPage : limit}${!isExport ? "&page=" + (curnPage) : ''}&meta[]=filter_count&search=${quickFilterText}&fields=${disFields.toString()},project_id.id,erasure_pdf`
    if (selectedFilter && selectedFilter._and && selectedFilter._and && !type && !urlParams.id) {
      fields = `${fields}&filter=${JSON.stringify(selectedFilter)}`
    }
    if (page === 'projectassets' && urlParams && urlParams.id) {
      if (selectedFilter && selectedFilter._and && selectedFilter._and?.length > 0 && !type) {
        let filterVal = selectedFilter;
        filterVal['_and'].push({
          "project_id": {
            _eq: urlParams.id
          }
        })
        fields = `${fields}&filter=${JSON.stringify(filterVal)}`
      } else {
        let filter = `&filter[project_id][_eq]=${urlParams.id}`
        fields = `${fields}${filter}`
      }
    }
    if (page === 'palletsassets' && urlParams && urlParams.id) {
      if (selectedFilter && selectedFilter._and && selectedFilter._and?.length > 0 && !type) {
        let filterVal = selectedFilter;
        filterVal['_and'].push({
          "pallet_number": {
            _in: urlParams.id
          }
        })
        fields = `${fields}&filter=${JSON.stringify(filterVal)}`
      } else {
        let filter = `&filter[project_id][_eq]=${urlParams.id}`
        fields = `${fields}${filter}`
      }
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

    if (sorting) {
      sort = `&sort=${sorting != null ? sorting : "-created_at"}`;
      fields = `${fields}${sort}`;
    } else {
      fields = `${fields}&sort=${sortValues}`;
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
              getNewData();
              // getAssets();
            }
          }
        }

        if (isExport) {
          setIsDownloaded(true)
          setShowExport(false)
          handleExport(response.data)
        }
      })
      .catch((err) => {
        setLoading(false);
        gridApi && gridApi.hideOverlay();
        throw err;
      });

  }

  const clearFilters = () => {
    gridApi.setFilterModel(null);
    let temp = values;
    temp && temp.forEach((item, idx) => {
      item.values = ''
    })
    setValues(temp)
    lists(gridApi, 'clear', false, 250, tempFieldsList)

  }

  const handleKeyPress = (event, filter = false) => {
    if (event?.key === 'Enter' || filter) {
      setRowsPerPage(2000)
      lists(gridApi, false, false, 2000, tempFieldsList, '', true, null)
    }
  }

  const onModelUpdated = (params) => {
    if (!enableBulkUpdates) {
      gridApi && gridApi.deselectAll()
    }
  };

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

  const buildColumnDefinitionsClient = (columnDefs, assetTypes) => {
    return columnDefs.map((columnDef, index) => {

      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer: index === 0 ? 'ActionCellRenderer' : false,
        cellRendererParams: {
          onRowEditingStopped: (params) => onRowEditingStopped(params),
        },
        headerCheckboxSelection: index === 0 ? true : false,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        filter: index === 0 ? false : true,
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
            {/* {
              <Button
                variant="contained"
                color="warning"
                style={{ verticalAlign: 'bottom', background: '#ed6c02', color: '#FFFFFF' }}
                onClick={() => {
                  history.push({
                    pathname: '/projects',
                  });
                }}
                className={"actionbutton"}
              >
                <span className='indicator-label'>{'Go Back'}</span>
              </Button>
            } */}
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
            <Button style={{ verticalAlign: 'bottom', background: 'red' }} className={[styles.btns, styles.reset].join(' ')} onClick={() => clearFilters()} >
              <span className="instorage">Reset Filter</span>
            </Button>
            {
              (page !== 'archieve-assets' && currentUser?.userType === "ADMIN") ?
                <>
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
                  dispatch({
                    type: 'assetForm/resetFormData',
                    payload: {}
                  }); lists(gridApi);
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
        <div className="asset-grid">
          <ScrollMenu className={`${values.length > 5 ? 'scroll-menu' : ''}`}>
            <div
              className='ag-theme-balham'
              style={{
                width: '100%',
                height: rowData.length > 300 ? '90vh' : '70vh',
                // height: '90vh',
                boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
                paddingBottom: '20px'
              }}
            >
              <form noValidate autoComplete="off">
                <div className="filterbox">

                  {
                    values && values.map((item, idx) => {

                      return <div className="filterr">
                        {/* {item.operator} */}
                        <TextField
                          id={item.key}
                          name={item.key}
                          // disabled={true}
                          //disabled={(page === 'projectassets' && item.key === 'project_id' || (item.operator === '_null' || item.operator === '_nnull' || item.operator === '_empty' || item.operator === '_nempty')) ? true : false}
                          placeholder={(!item.values) && (item.type == 'date' ? item.placeholder + " (YYYY-MM-DD)" : item.placeholder)}
                          label={(!item.values) && (item.type == 'date' ? item.placeholder + " (YYYY-MM-DD)" : item.placeholder)}
                          value={(item.values && item.key === 'asset_type') ? item.values.replace("%26", "&") : item.values}
                          onClick={() => { setFilterModalField(item); setModalopen(true); }}
                          onChange={event => handleChange(idx, event)}
                          onKeyPress={event => handleKeyPress(event)}
                          variant='outlined'
                        />
                        {/* <div class="checkbox checkbox-circle checkbox-color-scheme">
                          <label class="checkbox-checked">
                            <input type="checkbox" onChange={event => handleChange(idx, event)} checked={item.isEmptyChecked} /> <span class="label-text">Is empty</span>
                            <input
                              style={{ fontStyle: "normal" }}
                              type="checkbox"
                              id={item.isEmptyChecked}
                              value={item.isEmptyChecked}
                              checked={item.isEmptyChecked}
                              onChange={(e) => handleChange1(e, item, idx)}
                            />
                          </label>
                        </div> */}
                        {/* <input type="checkbox" /> */}
                        {/* <Checkbox
                          edge="start"
                          onChange={event => handleChange(idx, event)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': item.key }}
                        />
                        <span className="instorage">Is empty</span> */}
                        <div className="sortingdiv">
                          <ArrowDownOutlined className={`${(item.sorting === "-" + item.key) ? 'matchedsort' : 'unmatchedsort'}`} onClick={event => {
                            lists(gridApi, null, false, null, tempFieldsList, "-" + item.key);
                            submitFilter(null, false, "-" + item.key)
                          }} />
                          <ArrowUpOutlined className={`${(item.sorting === item.key) ? 'matchedsort' : 'unmatchedsort'}`} onClick={event => {
                            lists(gridApi, null, false, null, tempFieldsList, item.key);
                            submitFilter(null, false, item.key)
                          }} />
                        </div>

                      </div>
                    })
                  }

                </div>
              </form>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                getRowStyle={getRowStyle}
                // rowBuffer={500}
                applyColumnDefOrder={true}
                // cacheBlockSize={100}
                // cacheOverflowSize={2}
                // maxConcurrentDatasourceRequests={1}
                // infiniteInitialRowCount={1000}
                // maxBlocksInCache={10}
                debounceVerticalScrollbar={true}
                suppressHorizontalScroll={false}
                columnDefs={buildColumnDefinitions(columnDefs, assetTypes)}
                frameworkComponents={frameworkComponents}
                suppressDragLeaveHidesColumns={true}
                onGridReady={onGridReady}
                rowSelection='multiple'
                onRowEditingStopped={onRowEditingStopped}
                onCellEditingStopped={onCellEditingStopped}
                onRowSelected={onRowSelected}
                onRowDataChanged={onRowDataChanged}
                onRowEditingStarted={onRowEditingStarted}
                editType='fullRow'
                getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
                overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                getNewData={getNewData}
                handleDelete={handleDelete}
                pagination={false}
                enableCellTextSelection={true}
                paginationPageSize={pageSize}
                suppressRowClickSelection={true}
                alwaysShowVerticalScroll={true}
                // quickFilterText={quickFilterText}
                assetTypeFieldMapping={assetTypeFieldMapping}
                onModelUpdated={onModelUpdated}
                doesExternalFilterPass={doesExternalFilterPass}
                floatingFilter={false}
                suppressNavigable={true}
                downloadPdf={downloadPdf}
                userType={currentUser?.userType}
              ></AgGridReact>
            </div>
          </ScrollMenu>
          <Pagination
            totalRows={totalRowDatas}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            parentGridApi={gridApi}
            tempFieldsList={tempFieldsList}
            lists={lists}
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
                          clientlists(gridApiClient);
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
                className='ag-theme-balham'
                style={{
                  width: '100%',
                  height: clientRowData.length > 100 ? '60vh' : '40vh',
                  boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
                }}
              ><AgGridReact
                rowData={clientRowData}
                getRowStyle={getRowStyle}
                // rowBuffer={500}
                applyColumnDefOrder={true}
                // cacheBlockSize={100}
                // cacheOverflowSize={2}
                // maxConcurrentDatasourceRequests={1}
                // infiniteInitialRowCount={1000}
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
          getNewData={lists}
        />
        <InStorage
          showModalDialog={showInStorageModalDialog}
          setShowInStorageModalDialog={setShowInStorageModalDialog}
          assetDataList={rowData}
          assetIdsList={rowData}
          parentGridApi={gridApi}
          getNewData={lists}
        />
        <FileUpload
          open={fileUploadOpen}
          setOpen={setFileUploadOpen}
          allAssets={rowData}
          title='file upload'
          assetTypes={assetTypes}
          palletNumbers={palletNumbers}
          statusNames={statusNames}
          handleCancel={setFileUploadOpen}
          getNewData={lists}
          parentGridApi={gridApi}
          tempFieldsList={tempFieldsList}
          page={page}
          projectId={urlParams.id ? urlParams.id : null}
          columnFields={tempColumnDefs.map((item) => item.field)}
        />
        <ClientFileUpload
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
        {
          modalopen &&
          <FilterModal
            open={modalopen}
            setOpen={setModalopen}
            columnDefs={tempColumns}
            // setTempColumnDefs={setTempColumns}
            submitFilter={submitFilter}
            onClick={onClick}
            setIsSelect={setIsSelect}
            isSelect={isSelect}
            values={values}
            setValues={setValues}
            filterModalField={filterModalField}
            setFilterModalField={setFilterModalField}
            handleKeyPressFilter={handleKeyPress}
            setFilterValues={setFilterValues}
            filterValues={filterValues}
          />
        }
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