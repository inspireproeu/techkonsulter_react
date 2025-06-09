import {
 
  OrderedListOutlined,
  PercentageOutlined,
  EuroCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  Modal,
  Tooltip,
  Spin,
  Button,
  Progress
} from 'antd';
import * as moment from 'moment';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';

import { useState, useEffect, useRef } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import BulkUpdateDialog from '../../components/BulkUpdateDialog';

import ActionCellRenderer from '../../components/ActionCellRenderer';
import DefaultGradingCellRenderer from '../../components/defaultgrading';

import { AppTheme } from '../../../../../utils/Theme';
import { DATAURLS } from '../../../../../utils/constants';
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { Tabs } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import _ from "lodash";

const { TabPane } = Tabs;

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
    root1: {
      //   display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '70vw',
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
      // marginTop: '10px',handleDelete
      width: '95%',
      height: '40px',
      boxShadow: '0px 0px 5px #222',
      paddingLeft: '10px',
      background:
        'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
    },
    actionArea: {
      // display: 'flex',
      // flexDirection: 'row',
      // alignItems: 'center',
      // justifyContent: 'space-evenly',
      width: '8%',
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
    successArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    recordsCount: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      fontSize: '14px',
      marginBottom: '10px'
    }
  })
);

const frameworkComponents = {
  //   CustomCellEditor: CustomCellEditor,
  ActionCellRenderer: ActionCellRenderer,
  DefaultGradingCellRenderer: DefaultGradingCellRenderer
};


const Pricing = () => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';
  let columns = [
      {
      header_name: ``,
      field: 'actions',
      width: 100,
      minWidth: 100,
      maxWidth: 250,
      sortable: false
    },
    {
      header_name: `Type`,
      field: 'asset_type',
      width: 200,
      minWidth: 200,
      maxWidth: 250,
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        if (valueA == valueB) return 0;
        return (valueA > valueB) ? 1 : -1;
    }
    }, {
      header_name: `Brand`,
      field: 'manufacturer',
      width: 200,
      minWidth: 200,
      maxWidth: 250,
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        if (valueA == valueB) return 0;
        return (valueA > valueB) ? 1 : -1;
    }
    }, {
      header_name: `Model`,
      field: 'model',
      width: 200,
      minWidth: 200,
      maxWidth: 250,
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        if (valueA == valueB) return 0;
        return (valueA > valueB) ? 1 : -1;
    }
    }, {
      header_name: `Mhz`,
      field: 'processor',
      width: 200,
      minWidth: 200,
      maxWidth: 250,
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        if (valueA == valueB) return 0;
        return (valueA > valueB) ? 1 : -1;
    }
    }, {
      header_name: `Part No`,
      field: 'Part_No',
      width: 200,
        minWidth: 200,
        maxWidth: 250,
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => valueA - valueB
      }, 
    {
      header_name: `No`,
      field: 'qty',
      width: 200,
      minWidth: 200,
      maxWidth: 250,
      sortable: true,
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => valueA - valueB
    },
    {
      header_name: `A-Grade`,
      field: 'a_grade_values',
      editable: true,
      width: 200,
      minWidth: 200,
      maxWidth: 250,
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => valueA - valueB
    },
    {
      header_name: `Default Grading                             `,
      field: 'default_grade',
      width: 500,
      minWidth: 450,
      maxWidth: 700,
    },
    {
      header_name: `Last Update`,
      field: 'grade_last_update',
      type: 'date',
      width: 220,
      minWidth: 200,
      maxWidth: 250,
    }

  ]

  const overlayLoadingTemplateGrade =
    '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

  let columnsGrade = [{
    header_name: `Action`,
    field: 'actions',
  }, {
    header_name: `Reduction`,
    field: 'reduction',
    editable: true
  }, {
    header_name: `B`,
    field: 'b',
    editable: true,
    type: 'percentage'
  }, {
    header_name: `C`,
    field: 'c',
    editable: true,
    type: 'percentage'
  }, {
    header_name: `D`,
    field: 'd',
    editable: true,
    type: 'percentage'
  }, {
    header_name: `E`,
    field: 'e',
    editable: true,
    type: 'percentage'
  }
  ]
  const Grade =  ['B', 'C', 'D', 'E']

  const buildColumnDefinitionsGrade = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        cellRenderer: index === 0 ? 'ActionCellRenderer' : false,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        // filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        sortable: columnDef.sortable,
        resizable: true,
        hide: columnDef.hide,
        // floatingFilter: true,
        // width: index === 0 ? 150: 'auto',

        valueFormatter: (params) => {
          if (columnDef.type === 'percentage') {
            return params.value ? params.value + ' %' : ' ';
          }
        },
        // cellRenderer: columnDef.header_name === 'Default Grading' ? 'DefaultGradingCellRenderer' : false
      };
      if (columnDef.field === 'reduction_name') {
        columnDefinition.cellEditor = 'agSelectCellEditor';
        columnDefinition.cellEditorParams = {
            values: Grade,
        };
      }
      return columnDefinition;
    });
  };

  const gridRef = useRef();
  const [loading, setLoading] = useState(true);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [pageSize, setPageSize] = useState(1000);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [snackBarOpenGrade, setSnackBarOpenGrade] = useState(false);
  const [snackBarMessageGrade, setSnackBarMessageGrade] = useState('');
  const [snackBarTypeGrade, setSnackBarTypeGrade] = useState('success');
  const [rowData, setRowData] = useState([])
  const [rowDataGrade, setRowDataGrade] = useState([])
  
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [rowDataAPIGrade, setRowDataAPIGrade] = useState([]);
  const [columnDefs, setColumnDefs] = useState(columns);
  const [selectedAssetType, setSelectedAssetType] = useState('Pricing');
  const [gridApi, setGridApi] = useState();
  const [gridApiGrade, setGridApiGrade] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [enableBulkUpdates, setEnableBulkUpdates] = useState(false);
  const [updateRecordsCount, setUpdateRecordsCount] = useState(0);
  const [ pricingAssetIdRows, setPricingAssetIdRows ] = useState([])
  const [reductionData, setReductionData] = useState([]);
  const [ grades, setGrades ] = useState()

  const buildColumnDefinitions = (columnDefs) => {
    return columnDefs.map((columnDef, index) => {
      let columnDefinition = {
        headerName: columnDef.header_name,
        // cellRenderer: columnDef.id === 0 ? 'ActionCellRenderer' : false,
        cellRendererParams: {
           grades: grades && grades,
        },
        // headerCheckboxSelection: index === 0 ? true : false,
        checkboxSelection: index === 0 ? true : false,
        field: columnDef.field,
        editable: columnDef.editable,
        filter: index !== 0 ? 'agTextColumnFilter' : 'none',
        floatingFilter: true,
        sortable: true,
        resizable: true,
        width: index === 0 ? 100 : 'auto',
        hide: columnDef.hide,
        
        // width: index === 0 ? 20 : 'auto',
        cellRenderer: columnDef.field === 'default_grade' ? 'DefaultGradingCellRenderer' : false,
        comparator: columnDef.comparator,
        valueFormatter: function (params) {
          if (params.value && columnDef.type === 'date') {
            return moment(params.value).format('YY-MM-DD')
          }
          if (columnDef.field === 'asset_type') {
            return params.value ? params.value.toUpperCase() : ''
          }
          if (columnDef.field === 'count') {
            return params.value ? Number(params.value) : ''
          }
        }
      };
      return columnDefinition;

    });
  };

  const getNewDataGrade = async (gridApiGrade) => {
    // console.log('gridapi', gridApiGrade);

    // setLoading(true);
    gridApiGrade && gridApiGrade.showLoadingOverlay();

    let fields2 = 'limit=-1&sort=-reduction'
    fetchGet(`${DATAURLS.GRADE.url}?${fields2}`, getAccessToken())
    .then((response) => {
        // let grades = response.reduction.map(
        //   (item) => item.reduction
        // );

        // setGrades(grades);
        setRowDataGrade(response.data);
        setLoading(false);
        let tempAPI = JSON.parse(JSON.stringify(response.data));
        setRowDataAPIGrade(tempAPI);
      })
      .catch((err) => {
        throw err;
      });

      gridApiGrade && gridApiGrade.hideOverlay();
  };

  const getNewData = async (gridApi) => {
    // console.log('gridapi', gridApi);
    setLoading(true);
    gridApi && gridApi.showLoadingOverlay();
    // let fields = `limit=-1&sort[]=asset_type&filter={"_and":[{"status":{"_eq":"IN+STOCK"}},{"grade":{"_neq":"D"}},{"grade":{"_neq":"E"}},{"grade":{"_neq":"NEW"}},{"grade":{"_neq":"NOB"}}]}&fields=status,asset_type,manufacturer,model,processor,part_no,a_grade_values,default_grade,grade_last_update&sort=-grade_last_update&groupBy[]=status,processor,asset_type,manufacturer,model,part_no,a_grade_values,default_grade,grade_last_update&aggregate[count]=*`;
    fetchGet(`${DATAURLS.MAINTANCEASSETS.url}`, getAccessToken())
      .then((response) => {
        setRowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

      // let fields2 = 'limit=-1&sort[]=-reduction'
      fetchGet(DATAURLS.GRADE.url, getAccessToken())
      .then((response) => {
        setReductionData(response.data);
        let gradess = response.data
        .sort((a,b) => b.reduction - a.reduction)
        .map(
          (item) => item.reduction
        );
          // gradess.sort((a, b) =>
          //   a.reduction < b.reduction ? -1 : 1
          // )
          // console.log(response.data,"gradess", gradess)
        setGrades(gradess.sort((a, b) => a[1] - b[1]));
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
      
      gridApi.hideOverlay();

    // gridApi.autoSizeColumns();
  };

  // pricing && 
  // Object.keys(pricing).map(function (element) {
  //   console.log("element", element)
  //    return <tr>
  //      <td>{element}</td>
  //      <td>{element}</td>
  //    </tr>;
  // })

  const onGridReady = (params) => {
    setGridApi(params.api);
    getNewData(params.api);
  };

  const onGridReadyGrade = (params) => {
    setGridApiGrade(params.api);
    getNewDataGrade(params.api);
  };

  const handleSaveGrade = (params) => {
    // console.log("props", params)
    // props.data.default_grade = value
    // console.log('handlesave, params', props);

    // setLoading(true);
    // console.log(reductionData, "params.data", params.data)
    gridApiGrade.showLoadingOverlay();
    let data = {
      reduction: params.data.reduction || 0,
      b: params.data.b || 0,
      c: params.data.c || 0,
      d: params.data.d || 0,
      e: params.data.e || 0,

    }
    fetchPost(DATAURLS.GRADE.url, data, getAccessToken())
      .then((response) => {
        if (response?.data.id) {
          setLoading(false);
          setSnackBarOpenGrade(true);
          setSnackBarMessageGrade("Grade successfully created");
          setSnackBarTypeGrade('success');
          getNewDataGrade(gridApiGrade);
          // set10PricingAssetIdRows(response.assets)
          // handleAssetUpdate(response.assets);
        } else {
          setSnackBarOpenGrade(true);
          setSnackBarMessageGrade("Failed to create");
          setSnackBarTypeGrade('error');
        }

      })
      .catch((err) => {
        console.log('bulk response err', err);
        setLoading(false);
        throw err;
      });
  }


  const handleSave = (props) => {
    // props.data.default_grade = value
    // console.log('handlesave, params', props);

    // setLoading(true);
    // gridApi.showLoadingOverlay();
    // console.log("props.data.a_grade_values", props.data)
    // return;
    gridApi.stopEditing();
    // console.log("new Date().toISOString()", new Date())
    // props.data.grade_last_update = moment().format("YY-MM-DD");
    let asset_type = props.data.asset_type.toUpperCase() || null
    let manufacturer = props.data.manufacturer ? props.data.manufacturer.toUpperCase() : ""
    let processor = props.data.processor ? props.data.processor.toUpperCase() : ""
    let model = props.data.model ? props.data.model.toUpperCase() : ""
    let Part_No = props.data.Part_No ? props.data.Part_No.toUpperCase() : ""
    // let status = 'IN STOCK'
    // let modelquery=""
    // if(model) {
    //   modelquery = `,{"model":{"_eq":"${model}"}}`
    // }
    // let processorquery=""
    // if(processor) {
    //   processorquery = `,{"processor":{"_eq":"${processor}"}}`
    // }
    // let manuquery=""
    // if(manufacturer) {
    //   manuquery = `,{"manufacturer":{"_eq":"${manufacturer}"}}`
    // }
    //,{"manufacturer":{"_eq":"${manufacturer}"}},{"processor":{"_eq":"${processor}"}},
    // let fields = `limit=-1&filter={"_and":[{"_and":[]},{"status":{"_eq":"${status}"}},{"asset_type":{"_eq":"${asset_type}"}}${modelquery}${processorquery}${manuquery}]}&fields=asset_id,grade,status,asset_type,manufacturer,model,processor,part_no,a_grade_values,default_grade,grade_last_update`
    let fields = `asset_type=${asset_type}&processor=${processor}&manufacturer=${manufacturer}&model=${model}&Part_No=${Part_No}`

    fetchGet(`${DATAURLS.PRICINGASSETS.url}?${fields}`, getAccessToken())
      .then((response) => {
        if (response) {
          setLoading(false);
          // setSnackBarOpen(true);
          // setSnackBarMessage(response.message);
          // setSnackBarType('success');
          // getNewData(gridApi);
          setPricingAssetIdRows(response.data)
          handleAssetUpdate(response.data,'', props.data, 'bulk');
        } else {
          setSnackBarOpen(true);
          setSnackBarMessage("Failed to get records.");
          setSnackBarType('error');
        }

      })
      .catch((err) => {
        console.log('bulk response err', err);
        setLoading(false);
        throw err;
      });

  };

    const getGradeValue = (props, reduction= null) => {
      let data
      if (reduction) {
        data = reduction
      } else {
        data = reductionData
      }

      let filtered_array = _.filter(data, 
        { 'reduction': (props.default_grade) }
      );
    return filtered_array[0] ? filtered_array[0][props.grade.toLowerCase()] : 0
  }


  const handleAssetUpdate = async (assetIDRows, reduction = null, propsData = null, type = null) => {
    // setLoading(true);
    // console.log("propsData", propsData)
    assetIDRows.forEach((field) => {

      if (field.grade) {
        // console.log("field.default_grade", propsData.default_grade)
        if (propsData.a_grade_values) {
          field.a_grade_values = propsData.a_grade_values ? propsData.a_grade_values : '' ;
        }else {
          field.a_grade_values = ''
        }
        if (propsData.default_grade) {
          field.default_grade = Number(propsData.default_grade);
        }
        let grade = field.grade.trim().toUpperCase();
        field.grade_last_update = new Date();
        if (grade === 'B' || grade === 'C' || grade === 'D' || grade === 'E') {
          let percentage = getGradeValue(field, reduction);
          let price = null;
          if (field.a_grade_values) {
            price = percentage ? ((parseFloat(propsData.a_grade_values) / 100) * Number(percentage)).toFixed(2) : null
          }
          field.target_price = price;

        } else if ((grade === 'A') || (grade === 'A+')) {
          // field.default_grade = '';
          field.target_price = field.a_grade_values ? parseFloat(field.a_grade_values).toFixed(2) : null;
        }
        // field.grade_last_update = new Date()
      }
      delete field.asset_type;
      delete field.model;
      delete field.processor;
      delete field.manufacturer;
      delete field.status;
    })
    let summaryOffset = 0;
    setShowModalDialog(true);
    gridApi.hideOverlay();

    try {
      let noofRequests = 5;
      // console.log("summaryLoopCount", summaryLoopCount)
      // console.log( "tempassetIDRows", tempassetIDRows)
      let tempassetIDRows = assetIDRows;
      let updateSuccess = '';
      // console.log("assetIDRows", assetIDRows)

      try {
        let filterassetIDRows = assetIDRows;

        for (let i = 0; i <= filterassetIDRows.length; i++) {
          if (assetIDRows.length > 0 && filterassetIDRows[i] && filterassetIDRows[i].asset_id) {
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
          summaryOffset += assetIDRows.length;
          setUpdateRecordsCount(summaryOffset);
          getNewData(gridApi)
        }
      } catch (err) {
        console.log('update error', err);
        setShowModalDialog(false);
        // setError(false);
        setUpdateRecordsCount(0)
        // setFileUploadErrorMessage(err.message);
        throw err;
      }
      // console.log("updateSuccess", updateSuccess)
      if (updateSuccess?.data?.asset_id) {
        setSnackBarOpen(true);
        setSnackBarMessage("Pricing successfully updated.");
        setSnackBarType('success');
        getNewData(gridApi);
        setShowModalDialog(false)
        setUpdateRecordsCount(0)

      }else {
        // summaryOffset = 0;
        // setError(true);
        setShowModalDialog(false);
        setUpdateRecordsCount(0)

        // setFileUploadErrorMessage(updateSuccess.message.split('-')[1]);
      }
    } catch (err) {
      console.log('update error', err);
      // setLoading(false);
      // setError(false);
      // setFileUploadErrorMessage(err.message);
      throw err;
    }
    setShowModalDialog(false);
    gridApi.hideOverlay();

  };
  

  const bgColorDecider = (params, rowDataAPI) => {
    return false;
  };

  const onRowEditingStarted = (params) => {
    gridApi.refreshCells({
      rowNodes: [params.node],
      // columns: [params.columnApi.columnModel.allDisplayedColumns[0]],
      force: true,
    });
  };

  const onRowEditingStopped = (params) => {
    gridApi.stopEditing();
    handleSave(params);
  };

  const onRowEditingStoppedGrade = (params) => {
    gridApiGrade.stopEditing();
       let currentRowFromAPI = rowDataAPIGrade.find(
        (row) => row.reduction === params.data.reduction
    );
    // console.log(rowDataAPIGrade, 'rowediting stopped', currentRowFromAPI);

    if (
        currentRowFromAPI &&
        JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
    ) {
        console.log('no update done');
        return;
    }

    if(currentRowFromAPI && !params.data.id) {
      setSnackBarOpenGrade(true);
      setSnackBarMessageGrade('Given reduction already exist');
      setSnackBarTypeGrade('error');
      return
    }
    if (currentRowFromAPI || params.data.id) {
        handleUpdateGrade(params);
        return;
    }
    if (!currentRowFromAPI) {
      handleSaveGrade(params);
      return
    }

  };
  const handleUpdateGrade = (params) => {
    // console.log('rowediting, update', params);
    Object.keys(params.data).forEach((key) => {
        if (!params.data[key]) {
            params.data[key] = null;
        }
    });

    // console.log('rowediting update data', params.data);
    setLoading(true);
    gridApiGrade.showLoadingOverlay();
    setReductionData([])
    fetchPut(
        `${DATAURLS.GRADE.url}/${params.data.id}`,
        params.data,
        getAccessToken()
    )
    .then((response) => {
        // console.log('response', response.reduction);
      if (response.data.id) {
        setSnackBarOpenGrade(true);
        setSnackBarMessageGrade("Successfully updated");
        setSnackBarTypeGrade('success');
        gridApiGrade.redrawRows({ rowNodes: [params.node] });
        // setReductionData(response.reduction);
        // if(response.assets && response.assets.length > 0) {
        //   setPricingAssetIdRows(response.assets)
        //   handleAssetUpdate(response.assets, response.reduction);
        // }
      } else {
        setSnackBarOpenGrade(true);
        setSnackBarMessageGrade("Failed to update");
        setSnackBarTypeGrade('error');
            // gridApi.startEditingCell({
          //     rowIndex: params.rowIndex,
          //     colKey: 'quantity',
          // });
      }
      setLoading(false);
      gridApiGrade.hideOverlay();
      
    })
    .catch((err) => {
        throw err;
    });
};

  const handleBulkUpdate = (params) => {
    setBulkUpdateOpen(true);
  };

  const onRowSelected = (params) => {
    setEnableBulkUpdates(gridApi.getSelectedRows().length > 0);
  };
  
  const selectReport = (key) => {
    setSelectedAssetType(key)
    if (key === 'Pricing') {
      getNewData(gridApi)
    } else if (key === 'grade') {
      getNewDataGrade(gridApiGrade)
    }
  }

  const handleAddNew = async (data) => {
    // console.log('add new', gridApi);
    let newRow = [{ ...data }];
    setRowDataGrade((prev) => [...newRow, ...prev]);
    setTimeout(() => {
        gridApiGrade.startEditingCell({
          rowIndex: 0,
          colKey: 'reduction',
          keyPress: '1',
        });
      }, 280);
};

const handleDelete = (params) => {
  // console.log('handle delete pallets', params);

  if (params && !params.data.id) {
      let rowDataCopy = [...rowDataGrade];
      rowDataCopy.splice(params.node.rowIndex, 1);
      setRowDataGrade(rowDataCopy);
      return;
  }
        fetchDelete(
          DATAURLS.GRADE.url,
          [params.data.id],
          getAccessToken()
        ).then((res) => {
          if (res) {
            setSnackBarOpenGrade(true);
            setSnackBarMessageGrade("Grade deleted successfully.");
            setSnackBarTypeGrade('success');
            getNewDataGrade(gridApiGrade);
          } else {
              setSnackBarOpenGrade(true);
              setSnackBarMessageGrade("Failed to delete grade.");
              setSnackBarTypeGrade('error');
          }
      })
      .catch((err) => {
          console.log('error deleting record');
          throw err;
      });
};

  return (
    <>
    {/* <Progress percent={30} /> */}
    <Tabs defaultActiveKey={selectedAssetType} onChange={selectReport}>
      <TabPane
        tab={<span><EuroCircleOutlined /> Pricing</span>}
        key="Pricing"
      >
    <div className={classes.root}>
      <div className={'sectionHeader'}>
        Pricing
     
      <div className={classes.actionArea}>
  
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
      </div>
      </div>
      <div
        className='ag-theme-quartz'
        style={{
          width: '95%',
          height: '80vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
        <AgGridReact
          rowData={rowData}
          debounceVerticalScrollbar={true}
          columnDefs={buildColumnDefinitions(columnDefs)}
          components={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onGridReady={onGridReady}
          rowSelection='multiple'
          // onGridColumnsChanged={() => gridApi && gridApi.autoSizeAllColumns()}          
          onRowEditingStopped={onRowEditingStopped}
          onRowSelected={onRowSelected}
          // onRowDataChanged={onRowDataChanged}
          onRowEditingStarted={onRowEditingStarted}
          editType='fullRow'
          rowHeight={50}
          getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
          overlayLoadingTemplate={overlayLoadingTemplate}
          getNewData={getNewData}
          handleSave={handleSave}
          pagination={true}
          enableCellTextSelection={true}
          paginationPageSize={pageSize}
          suppressRowClickSelection={true}
          alwaysShowVerticalScroll={true}
          quickFilterText={quickFilterText}
          paginationPageSizeSelector={[100, 250, 500, 1000]}
          floatingFilter={true}
        ></AgGridReact>
        <BulkUpdateDialog
          open={bulkUpdateOpen}
          title='bulk update'
          // columnDefs={columnDefs}
          parentGridApi={gridApi}
          getNewData={getNewData}
          setOpen={setBulkUpdateOpen}
          reductionData={reductionData}
        // assetTypes={assetTypes}
        // palletNumbers={palletNumbers}
        // statusNames={statusNames}
        // setUpdatedData={setBulkupdatedData}
        />
        <Modal
          animation="zoom"
          maskAnimation="fade"
          width={340}
          forceRender
          visible={showModalDialog}
          title="Progress"
          size={'large'}
          destroyOnClose= {false}
          bodyStyle={{
            padding: '32px 30px 48px',
          }}
          footer={[
            <Button disabled={(updateRecordsCount === pricingAssetIdRows.length) ? false : true } key="submit" type="primary" onClick={() =>setShowModalDialog(false)}>
              Ok
            </Button>,
          ]}
          // onOk={() => setShowModalDialog(false)}
          // onCancel={false}
          // onCancel={() => onToggleViewDialog()}
        >
          <div className={classes.successArea}>
            {<div className={classes.recordsCount}>{updateRecordsCount} of {pricingAssetIdRows.length} records completed.</div>}
            {<Spin color='#004750' size={50} />}
            {<Progress type="circle" style={{ paddingTop: '30px', margin: '0 auto' }} strokeColor={{ '0%': '#f80059', '100%': '#87d068', }} percent={Math.round((updateRecordsCount * 100) / pricingAssetIdRows.length)} />}

            {/* <div style={{textAlign: 'center'}}>
              <CircularProgressWithLabel value={updateRecordsCount} />
            </div> */}
          </div>
        </Modal>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={5000}
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
      </div>

    </div>
    </TabPane>
        <TabPane
          tab={<span><PercentageOutlined /> Grade</span>}
          key="grade"
        >
          <div className={classes.root1}>
          <div className={'sectionHeader'}>
            Grade / Reduction
            <div className={classes.actionArea}>
                <Divider orientation='vertical' flexItem />
                    <Tooltip placement="topLeft" title="Add">
                        <PlusOutlined
                            className={classes.actionIcon}
                            onClick={() => handleAddNew()}
                        />
                    </Tooltip>
                    </div>
          </div>
          <div
            className='ag-theme-quartz'
            style={{
              width: '95%',
              height: '80vh',        // // return;

              boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
            }}
          >
            <AgGridReact
              rowData={rowDataGrade}
              ref={gridRef}
              debounceVerticalScrollbar={true}
              columnDefs={buildColumnDefinitionsGrade(columnsGrade)}
              components={frameworkComponents}
              suppressDragLeaveHidesColumns={true}
              onGridReady={onGridReadyGrade}
              rowSelection='multiple'
              onRowEditingStopped={onRowEditingStoppedGrade}
              // onRowSelected={onRowSelected}
              // onRowDataChanged={onRowDataChanged}
              // onRowEditingStarted={onRowEditingStarted}
              editType='fullRow'
              getRowClass={(params) => bgColorDecider(params, rowDataAPIGrade)}
              overlayLoadingTemplate={overlayLoadingTemplate}
              getNewData={getNewDataGrade}
              handleDelete={handleDelete}
              pagination={true}
              paginationPageSize={pageSize}
              suppressRowClickSelection={true}
              alwaysShowVerticalScroll={true}
              floatingFilter={true}
              // quickFilterText={quickFilterText}
              // onModelUpdated={onModelUpdated}
            ></AgGridReact>
             <Snackbar
              open={snackBarOpenGrade}
              autoHideDuration={5000}
              onClose={() =>
                setSnackBarOpen(snackBarTypeGrade === 'error' ? true : false)
              }
            >
              <MuiAlert
                elevation={6}
                variant='filled'
                onClose={() => setSnackBarOpenGrade(false)}
                severity={snackBarTypeGrade}
              >
                {snackBarMessageGrade}
              </MuiAlert>
            </Snackbar>
          </div>
        </div>
      </TabPane>
    </Tabs>
    </>
  );
};

export default Pricing;
