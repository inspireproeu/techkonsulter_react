import React, { useRef, useState, useEffect, useContext } from 'react';

import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  EditFilled,
  ColumnWidthOutlined
} from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Table, Input, Popconfirm, Form, Typography,
  InputNumber
} from 'antd';
import ProTable, { ProColumns, IntlProvider, enUSIntl } from '@ant-design/pro-table';
import { connect, Link, FormattedMessage, formatMessage } from 'umi';
import styles from '../style.less';
import ViewDetails from '../components/ViewDetails';
import AssetColumnDialog from '../components/AssetColumnDialog';
import CustomDropdown from '../../assets/components/CustomDropdown';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
// import {
//   PlusOutlined,
//   DeleteFilled,
//   OrderedListOutlined,
//   UploadOutlined,
//   DownloadOutlined,
//   SyncOutlined,
//   CopyFilled
// } from '@ant-design/icons';

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
import ActionCellRenderer from '../components/ActionCellRenderer';
import { AppTheme } from '../../../utils/Theme';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { DATAURLS } from '../../../utils/constants';
// import styles from '../style.less';
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
} from '@/utils/utils';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '93vh',
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
      width: '95%',
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
};
const List = (props) => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  const overlayLoadingTemplate =
  '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

const buildColumnDefinitions = (columnDefs, assetTypes) => {
  console.log("******************", columnDefs)
  return columnDefs.map((columnDef, index) => {
  
    let columnDefinition = {
      headerName: index !== 0 ? columnDef.header_name : '',
      cellRenderer: index === 0 ? 'ActionCellRenderer' : false,

      // cellRendererParams: {
      //   onRowEditingStopped: (params) => onRowEditingStopped(params),
      // },
      headerCheckboxSelection: index === 0 ? true : false,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: index === 0 ? true : false,
      field: columnDef.field,
      editable: columnDef.editable,
      filter: index !== 0 ? 'agTextColumnFilter' : 'none',
      sortable: true,
      resizable: true,
      hide: columnDef.hide,
      width: index === 0 ? 100 : 'auto',

    };
    
    return columnDefinition;
  });
};

  const { dispatch, assetsTypesForm: {
    assetsTypesDeleteReponse,
    assetsTypesCreateStatus,
    assetsTypeList,
    assetsTypesUpdateReponse
  },
    assetForm: {
      columnDefinitions,
    },
    currentUser, localeLanguage } = props;
  // console.log("assetTotalCount****", assetTotalCount)
  const [form] = Form.useForm();
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [showAssetColumnDialog, setShowAssetColumnDialog] = useState(false);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [count, setCount] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [selectionType,] = useState('checkbox');
  const [allColumns, setAllColumns] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');
  const externalFilterRef = useRef(null);
  const [pageSize, setPageSize] = useState(25);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [customDeleteDialog, setCustomDeleteDialog] = useState(false);
  const [customDialogheader_name, setCustomDialogheader_name] = useState('');
  const [customDialogMessage, setCustomDialogMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [rowData]);

  const getNewData = async (gridApi) => {
    setLoading(true);
    gridApi.showLoadingOverlay();
    let fields3 = '?limit=-1&sort=Asset_Name'

    // Fetching data
    // console.log("assetsList", assetsList)
      fetchGet(`${DATAURLS.ASSETTYPES.url}${fields3}`, getAccessToken())
      .then((response) => {
        setRowData(response.data);
        // setLoading(false);
        let tempAPI = JSON.parse(JSON.stringify(response.data));
        setRowDataAPI(tempAPI);
        setColumnDefs(columns1)
        // localStorage.setItem('assetsData', tempAPI)
        // dispatch({
        //   type: 'assetForm/storeAssets',
        //   payload: {
        //     data:tempAPI,
        //   },
        // });
        gridApi.hideOverlay();
      })
      .catch((err) => {
        throw err;
      });

    // highlightUnsavedRows();
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    getNewData(params.api);
  };

  const handleCancel = async () => {
    setShowModalDialog(value => !value);
  };

  const handleAssetColumnCancel = async () => {
    setRow('')
    setShowAssetColumnDialog(value => !value);
  };
  const editAndDelete = (key, id) => {
    if (key === 'delete') {
      Modal.confirm({
        header_name: 'Delete',
        content: 'are you sure you want to delete this Asset Type ?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => deleteItem(id),
      });
    }
  };

  const deleteItem = (id) => {
    dispatch({
      type: 'assetsTypesForm/deleteAssetsTypesId',
      payload: [id],
      errorHandler: (e) => {
        message.error(e.data.error.message);
        // dispatch({
        //   type: 'formAndstepFormEdit/setValidationerror',
        //   payload: 'Something Went wrong'
        // });
      }
    });
  };


  useEffect(() => {
    if (assetsTypeList && assetsTypeList.length > 0) {
      assetsTypeList.map((item, i) => {
        item.key = i;
      })
      setDataSource(assetsTypeList)
      setCount(assetsTypeList.length)
    }
  }, [assetsTypeList]);

  useEffect(() => {
    if (columnDefinitions && columnDefinitions.length > 0) {
      setAllColumns(
        columnDefinitions.filter(
          (col) => !(col.field === 'actions' || col.field === 'asset_id')
        )
      );
    }
  }, [columnDefinitions]);


  const handleAssetColumnSubmit = (values) => {
    setShowAssetColumnDialog(false);
    setRow('')
    dispatch({
      type: 'assetsTypesForm/updateAssetType',
      payload: {
        ...values
      },
    });
  };

  const handleSubmit = async (record) => {
    const values = await form.validateFields();
    console.log(values, "record.Asset_Id", record)
    if (record.Asset_Id) {
      dispatch({
        type: 'assetsTypesForm/updateAssetType',
        payload: {
          ...values, Asset_Id: record.Asset_Id
        },
      });
    } else {
      dispatch({
        type: 'assetsTypesForm/submitAssetTypeForm',
        payload: {
          values
        },
      });
    }

  };

  // useEffect(() => {
  //   if (dispatch) {
  //     dispatch({
  //       type: 'assetsTypesForm/fetchAssetsType',
  //       payload: {
  //         limit: 100,
  //         offset: 0
  //       }
  //     });
  //     dispatch({
  //       type: 'assetsTypesForm/resetFormData',
  //       payload: {}
  //     });
  //   }
  // }, [dispatch]);

  useEffect(() => {
    // console.log("assetsTypesDeleteReponse", assetsTypesDeleteReponse)
    if (assetsTypesCreateStatus || assetsTypesDeleteReponse || assetsTypesUpdateReponse) {
      handleModalVisible(false);
      setEditingKey('');
      if (assetsTypesCreateStatus && assetsTypesCreateStatus.status === 'success') {
        message.success("Asset Type created successfully.");
      } else if (assetsTypesCreateStatus && assetsTypesCreateStatus.status === 'error') {
        message.error("Failed to create Asset Type.");
      }
      if (assetsTypesDeleteReponse && assetsTypesDeleteReponse === 'success') {
        message.success("Asset Type deleted successfully.");
      } else if (assetsTypesDeleteReponse && assetsTypesDeleteReponse === 'error') {
        message.error("Failed to delete Asset Type.");
      }
      if (assetsTypesUpdateReponse && assetsTypesUpdateReponse.status === 'success') {
        message.success("Asset Type Update successfully.");
      } else if (assetsTypesUpdateReponse && assetsTypesUpdateReponse.status === 'error') {
        message.error("Failed to Update Asset Type.");
      }
      dispatch({
        type: 'assetsTypesForm/fetchAssetsType',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetForm/fetchAssetsColumns',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetsTypesForm/resetFormData',
        payload: {}
      });
    }

  }, [assetsTypesCreateStatus, assetsTypesDeleteReponse, assetsTypesUpdateReponse]);

  const columns1 = [
    {
      header_name: 'operation',
      field: 'operation',
      fixed: 'left',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Link
              onClick={() => handleSubmit(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Link>
            <Popconfirm header_name="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Link
              disabled={editingKey !== ''}
              onClick={() => {
                setRow(record);
                setShowModalDialog(true);
              }} className={styles.addlead} ><EyeFilled /></Link>
            <Link className={[styles.addlead, styles.editBtn].join(' ')} disabled={editingKey !== ''} onClick={() => edit(record)}>
              <EditFilled />
            </Link>
            <Link to="#" disabled={editingKey !== ''} onClick={() => editAndDelete('delete', record.Asset_Id)} className={[styles.addlead, styles.deleteBtn].join(' ')} ><DeleteFilled /></Link>
          </>
        );
      }
    },
    {
      header_name: 'Asset Type',
      field: 'Asset_Name',
      width: '30%',
      editable: true,
      hideinform: false,
    },
    {
      header_name: 'Form Factor',
      field: 'formfactor',
      width: '20%',
      editable: true,
      hideinform: false,
    },
    {
      header_name: 'Sample CO2',
      field: 'sampleco2',
      editable: true,
    },
    {
      header_name: 'Sample Weight',
      field: 'sample_weight',
      editable: true,
    },
    {
      header_name: 'Columns',
      field: 'fields',
      editable: false,
      render: (_, record) =>
        <Link onClick={() => {
          setRow(record);
          setShowAssetColumnDialog(true);
        }} className={[styles.addlead, styles.editBtn].join(' ')}>
          <ColumnWidthOutlined />
        </Link>
    }
  ];

  const EditableCell = ({
    editing,
    field,
    header_name,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // console.log(record, "editing celll", editing)
    const handleSubmit1 = async (record) => {
      // setShowAddStatusDialog(value => !value);
      console.log(values, "record.Asset_Id", record)
      const values = await form.validateFields();

      if (record.Asset_Id) {
        dispatch({
          type: 'assetsTypesForm/updateAssetType',
          payload: {
            ...values, Asset_Id: record.Asset_Id
          },
        });
      } else {

        dispatch({
          type: 'assetsTypesForm/submitAssetTypeForm',
          payload: {
            ...values
          },
        });
      }
    };
    // console.log(record ? record.key : '', "=== 11111", editingKey)

    const inputNode = <Input ref={actionRef} onPressEnter={() => handleSubmit1(record)} />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={field}
            style={{
              margin: 0,
            }}
          // rules={[
          //   {
          //     required: true,
          //     message: `Please Input ${header_name}!`,
          //   },
          // ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      Asset_Id: '',
      Asset_Name: "",
      sampleco2: "",
      sample_weight: ""
    }
    dataSource.splice(-1, 1);
    setDataSource([newData, ...dataSource])
    edit(newData)
    setCount(count + 1);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns11 = columns1.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        field: col.field,
        header_name: col.header_name,
        editing: isEditing(record),
        // handleSave: handleSubmit(record),
      }),
    };
  });

  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") setDataSource(assetsTypeList);
    else {
      const filteredData = dataSource.filter(item => {
        return Object.keys(item).some(key =>
          item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : ''
        );
      });
      setDataSource(filteredData);
    }
  }
  // console.log("assetsTypeList", assetsTypeList)

  return (
    <div className={classes.root}>
    <div className={'sectionHeader'}>
      Visa tillgångar
        <Paper component='form' className={classes.textRoot}>
        <InputBase
          className={classes.input}
          placeholder='Search Assets'
          inputProps={{ 'aria-label': 'Search Assets' }}
          value={quickFilterText}
          onChange={(event) => {
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
    </div>
    <div
      className='ag-theme-balham'
      style={{
        width: '95%',
        height: '80vh',
        boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
      }}
    >
      <AgGridReact
        rowData={rowData}
        rowBuffer={500}
        debounceVerticalScrollbar={true}
        columnDefs={buildColumnDefinitions(columnDefs, assetTypes)}
        frameworkComponents={frameworkComponents}
        suppressDragLeaveHidesColumns={true}
        onGridReady={onGridReady}
        rowSelection='multiple'
        // onRowEditingStopped={onRowEditingStopped}
        // onCellEditingStopped={onCellEditingStopped}
        // onRowSelected={onRowSelected}
        // onRowDataChanged={onRowDataChanged}
        // onRowEditingStarted={onRowEditingStarted}
        editType='fullRow'
        // getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
        overlayLoadingTemplate={overlayLoadingTemplate}
        getNewData={getNewData}
        // handleDelete={handleDelete}
        pagination={true}
        enableCellTextSelection={true}
        paginationPageSize={pageSize}
        suppressRowClickSelection={true}
        alwaysShowVerticalScroll={true}
        quickFilterText={quickFilterText}
        // quickFilterText={selectedAssetType !== 'All' ? selectedAssetType : ''}
        // isExternalFilterPresent={isExternalFilterPresent}
        // doesExternalFilterPass={doesExternalFilterPass}
        floatingFilter={true}
      // stopEditingWhenGridLosesFocus={true}
      ></AgGridReact>

      <CustomDropdown
        options={[25, 50, 100, 500]}
        header_name={'Page Size'}
        value={pageSize}
        onChange={(value) => {
          setPageSize(value);
          gridApi.paginationSetPageSize(value);
        }}
      />
      {/* <Snackbar
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
      </Snackbar> */}

     
    </div>
  </div>
  );
}
export default connect(({ assetsTypesForm, assetForm, user, language }) => ({
  assetsTypesForm,
  user,
  assetForm,
  currentUser: user.currentUser,
  // loading: loading.effects['assetsTypesForm/fetchAssetsType'],
  localeLanguage: language.localeLanguage
}))(List);
