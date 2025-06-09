// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faDownload,
//     faPlus,
//     faTrash,
//     faCopy,
// } from '@fortawesome/free-solid-svg-icons';
import {
  PlusOutlined,
  DeleteFilled,
  OrderedListOutlined,
  UploadOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Modal,
  Tooltip,
} from 'antd';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { useState, useEffect, useContext } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { generateExcel } from '@/utils/generateExcel';
import { getAccessToken } from '@/utils/authority';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import XLSX from 'xlsx';

import ActionCellRenderer from '../../assets/components/ActionCellRenderer';
import CustomDropdown from '../../assets/components/CustomDropdown';
// import AppContext from '../context/AppContext';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
} from '@/utils/utils';

const useStyles = makeStyles((theme) =>
  createStyles({
      root: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '93vh',
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
          background:
              'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
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
  })
);

const frameworkComponents = {
  //   CustomCellEditor: CustomCellEditor,
  ActionCellRenderer: ActionCellRenderer,
};

let columns = [{
  header_name: `Action`,
  field: 'actions',
}, {
  header_name: `Reduction`,
  field: 'reduction_name',
  editable: false
}, {
  header_name: `20`,
  field: '20',
  editable: true
}, {
  header_name: `25`,
  field: '25',
  editable: true
}, {
  header_name: `30`,
  field: '30',
  editable: true
}, {
  header_name: `35`,
  field: '35',
  editable: true
}, {
  header_name: `40`,
  field: '40',
  editable: true
}
]

const Grade = () => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  //   const appContext = useContext(AppContext);
  const overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

      const buildColumnDefinitions = (columnDefs) => {
        return columnDefs.map((columnDef, index) => {
          let columnDefinition = {
            headerName: columnDef.header_name,
            cellRenderer: index === 0 ? 'ActionCellRenderer' : false,
            checkboxSelection: index === 0 ? true : false,
            field: columnDef.field,
            editable: columnDef.editable,
            // filter: index !== 0 ? 'agTextColumnFilter' : 'none',
            sortable: true,
            resizable: true,
            hide: columnDef.hide,
            // floatingFilter: true,
            width: index === 0 ? 20 : 'auto',
            // cellRenderer: columnDef.header_name === 'Default Grading' ? 'DefaultGradingCellRenderer' : false
          };
          return columnDefinition;
        });
      };

  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(25);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarType, setSnackBarType] = useState('success');
  const [rowData, setRowData] = useState([]);
  const [rowDataAPI, setRowDataAPI] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [palletStatusCodes, setPalletStatusCodes] = useState([]);
  const [palletStatusNames, setPalletStatusNames] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [enableCopy, setEnableCopy] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [quickFilterText, setQuickFilterText] = useState('');

  const getNewData = async (gridApi) => {
      setLoading(true);
      gridApi.showLoadingOverlay();

      // Fetching data
      fetchGet(DATAURLS.GRADE_REDUCTION.url, getAccessToken())
          .then((response) => {
              console.log('get new rows rd, rdAPI response', response);
              setRowData(response.reduction);
              setLoading(false);
          })
          .catch((err) => {
              setLoading(false);
              throw err;
          });
      highlightUnsavedRows();
      gridApi.sizeColumnsToFit();
  };

  const deleteConfirmation = (data, allAssets) => {
      // console.log('deleteconfirmation,data', data, allAssets, rowData);
      if (!data.pallet_id) {
          return true;
      }
      const existingAssets = allAssets.filter(
          (asset) => asset.pallet_id === data.pallet_id
      );

      if (existingAssets.length > 0) {
          setSnackBarOpen(true);
          setSnackBarMessage(
              `Cannot delete ${data.pallet_id}. There are assets existing with this pallet id`
          );
          setSnackBarType('error');

          return false;
      }
      return true;
  };

  const onGridReady = (params) => {
      setGridApi(params.api);
      getNewData(params.api);
  };

  const onModelUpdated = (params) => {
      params.api.sizeColumnsToFit();
  };

  const onRowSelected = (params) => {
      setEnableCopy(gridApi.getSelectedRows().length > 0);
  };

  const onRowDataChanged = (params) => {
      highlightUnsavedRows(params);
  };

  const onRowEditingStarted = (params) => {
      // console.log('on row editing started', params);
      gridApi.refreshCells({
          rowNodes: [params.node],
          // columns: [params.columnApi.columnController.allDisplayedColumns[0]],
          force: true,
      });
  };

  const onRowEditingStopped = (params) => {
      // console.log('rowediting stopped');
      let currentRowFromAPI = rowDataAPI.find(
          (row) => row.pallet_id === params.data.pallet_id
      );

      if (
          currentRowFromAPI &&
          JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
      ) {
          console.log('no update done');
          return;
      }

      if (params.data.pallet_id) {
          handleUpdate(params);
          return;
      }
      handleSave(params);
  };

  const handleAddNew = async (data) => {
      // console.log('add new', gridApi);
      let newRow = [{ ...data }];
      console.log("new dataaa", data)

      setRowData((prev) => [...newRow, ...prev]);
      setTimeout(() => {
          gridApi.startEditingCell({
              rowIndex: 0,
              //   colKey: 'quantity',
              keyPress: '1',
          });
      }, 280);
  };

  const handleUpdate = (params) => {
      // console.log('rowediting, update', params);
      Object.keys(params.data).forEach((key) => {
          if (!params.data[key]) {
              params.data[key] = null;
          }
      });

      // console.log('rowediting update data', params.data);

      setLoading(true);
      gridApi.showLoadingOverlay();

      fetchPut(
          DATAURLS.PALLETS.url,
          {
              data: params.data,
              matchBy: 'pallet_id',
          },
          getAccessToken()
      )
          .then((response) => {
              // console.log('response', response);
              if (response.ok) {
                  setSnackBarOpen(true);
                  setSnackBarMessage(response.message);
                  setSnackBarType('success');
                  gridApi.redrawRows({ rowNodes: [params.node] });
              } else {
                  setSnackBarOpen(true);
                  setSnackBarMessage(response.message);
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
  };

  const handleSave = (params) => {
      // console.log('handlesave, params', params);
      setLoading(true);
      gridApi.showLoadingOverlay();

      fetchPost(DATAURLS.PALLETS.url, { data: params.data }, getAccessToken())
          .then((response) => {
              if (response.ok) {
                  setSnackBarOpen(true);
                  setSnackBarMessage(response.message);
                  setSnackBarType('success');
                  params.data.pallet_id = response.rows[0].pallet_id;
                  gridApi.redrawRows({ rowNodes: [params.node] });
              } else {
                  setSnackBarOpen(true);
                  setSnackBarMessage(response.message);
                  setSnackBarType('error');
                  gridApi.startEditingCell({
                      rowIndex: params.rowIndex,
                      colKey: 'pallet_type',
                  });
              }
              setLoading(false);
              gridApi.hideOverlay();
              params.node.setSelected(false);
          })
          .catch((err) => {
              setLoading(false);
              // console.log(rowData);
              throw err;
          });
  };

  const handleExport = () => {
      generateExcel(gridApi, 'Pallets', []);
  };

  const handleCopy = () => {
      let selectedRows = gridApi.getSelectedRows();
      if (selectedRows.length === 0) {
          return;
      }
      let updatedRows = JSON.parse(JSON.stringify(selectedRows.slice()));

      updatedRows.map((row) => {
          delete row['pallet_id'];
      });
      setRowData((prev) => [...updatedRows, ...prev]);
  };

  const handleDelete = (params) => {
      // console.log('handle delete pallets', params);

      if (params && !params.data.asset_id) {
          let rowDataCopy = [...rowData];
          rowDataCopy.splice(params.node.rowIndex, 1);
          setRowData(rowDataCopy);
          return;
      }

      fetchDelete(DATAURLS.PALLETS.url, { data: params.data }, getAccessToken())
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

  const highlightUnsavedRows = (params) => {
      console.log('highlightUnsavedRows', params);
      if (!params || rowDataAPI.length === 0) {
          return;
      }
      let missingRowNodes = params.api.rowModel.rowsToDisplay.filter((row) => {
          if (!row.data.pallet_id) {
              return row;
          }
      });

      console.log('highlightUnsavedRows', missingRowNodes);
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

  return (
      <div className={classes.root}>
          <div className={'sectionHeader'}>
              Pallets
      <Paper component='form' className={classes.textRoot}>
                  <InputBase
                      className={classes.input}
                      placeholder='Search Pallets'
                      inputProps={{ 'aria-label': 'Search Pallets' }}
                      value={quickFilterText}
                      onChange={(event) => setQuickFilterText(event.target.value)}
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
                  {/* <FontAwesomeIcon
                      icon={faDownload}
                      title='Export'
                      className={classes.actionIcon}
                      onClick={() => handleExport()}
                  /> */}
                  <Tooltip placement="topLeft" title="Export">
                      <DownloadOutlined
                          // icon={faDownload}
                          // title='Export'
                          className={classes.actionIcon}
                          onClick={() => handleExport()}
                      />
                  </Tooltip>
                  <Divider orientation='vertical' flexItem />
                  <Tooltip placement="topLeft" title="Add">
                      <PlusOutlined
                          className={classes.actionIcon}
                          onClick={() => handleAddNew()}
                      />
                  </Tooltip>
                  {/* <FontAwesomeIcon
                      icon={faPlus}
                      title='Add'
                      className={classes.actionIcon}
                      onClick={() => handleAddNew()}
                  /> */}
                  {/* <FontAwesomeIcon
          icon={faTrash}
          title='Delete'
          className={classes.actionIcon}
          onClick={() => handleDelete()}
        /> */}
                  <Tooltip placement="topLeft" title="Copy">
                      <CopyOutlined
                          className={classes.actionIcon}
                          onClick={() => handleCopy()}
                      />
                  </Tooltip>

                  {/* <FontAwesomeIcon
                      icon={faCopy}
                      title='Copy'
                      className={classes.actionIcon}
                      onClick={() => handleCopy()}
                  /> */}
              </div>
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
                  debounceVerticalScrollbar={true}
                  columnDefs={buildColumnDefinitions(columns)}
                  components={frameworkComponents}
                  suppressDragLeaveHidesColumns={true}
                  onGridReady={onGridReady}
                  rowSelection='multiple'
                  onRowEditingStopped={onRowEditingStopped}
                  onRowSelected={onRowSelected}
                  onRowDataChanged={onRowDataChanged}
                  onRowEditingStarted={onRowEditingStarted}
                  editType='fullRow'
                  getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
                  overlayLoadingTemplate={overlayLoadingTemplate}
                  getNewData={getNewData}
                  handleDelete={handleDelete}
                  pagination={true}
                  paginationPageSize={pageSize}
                  suppressRowClickSelection={true}
                  alwaysShowVerticalScroll={true}
                  quickFilterText={quickFilterText}
                  onModelUpdated={onModelUpdated}
              ></AgGridReact>

              <CustomDropdown
                  options={[25, 50, 100, 500]}
                  title={'Page Size'}
                  value={pageSize}
                  onChange={(value) => {
                      setPageSize(value);
                      gridApi.paginationSetPageSize(value);
                  }}
              />
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
          </div>
      </div>
  );
};

export default Grade;
