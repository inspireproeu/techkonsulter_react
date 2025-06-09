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
import { useState, useEffect, useContext, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { generateExcelNew } from '@/utils/generateExcel';
import { getAccessToken } from '@/utils/authority';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import ActionCellRenderer from '../components/ActionCellRenderer';
// import AppContext from '../context/AppContext';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
    fetchPut,
    fetchPost,
    fetchGet,
    fetchDelete,
} from '@/utils/utils';
import { Link, useLocation } from 'react-router-dom';
import { connect, history } from 'umi';
import * as moment from 'moment';

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

const Pallets = (props) => {
    const theme = useTheme(AppTheme);
    const classes = useStyles(theme);
    //   const appContext = useContext(AppContext);
    const overlayLoadingTemplate =
        '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

    const buildColumnDefinitions = (columnDefs, assetTypes) => {
        return columnDefs.map((columnDef, index) => {
            let columnDefinition = {
                headerName: index !== 0 ? columnDef.header_name : '',
                cellRenderer: index === 0 ? 'ActionCellRenderer' : false,
                cellRendererParams: {
                    onRowEditingStopped: (params) => onRowEditingStopped(params),
                    colKey: 'pallet_type',
                    deleteConfirmation: deleteConfirmation,
                    allAssets: allAssets,
                    handleEdit: (params) => handleEdit(params),
                    handleDelete: (params) => handleDelete(params),

                },
                headerCheckboxSelection: index === 0 ? true : false,
                checkboxSelection: index === 0 ? true : false,
                field: columnDef.field,
                editable: columnDef.editable,
                filter: index !== 0 ? 'agTextColumnFilter' : 'none',
                sortable: true,
                resizable: true,
                hide: columnDef.hide,
                // floatingFilter: true,
                width: index === 0 ? 140 : 'auto',
                valueFormatter: (params) => {
                    if (columnDef.type === 'datetime' && params.value) {
                        return params.value ? moment(params.value).format('YYYY-MM-DD hh:mm') : null;
                    }
                },
            };
            // if (columnDef.field === 'pallet_type') {
            //     columnDefinition.cellEditor = 'agSelectCellEditor';
            //     columnDefinition.cellEditorParams = {
            //         values: assetTypes,
            //     };
            // }
            if (columnDef.field === 'pallet_type') {
                columnDefinition.cellEditor = 'agRichSelectCellEditor';
                columnDefinition.cellEditorParams = {
                    values: assetTypes,
                    filterList: true,
                    searchType: "match",
                    allowTyping: true,
                    valueListMaxHeight: 220,
                };
            }

            if (columnDef.field === 'pallet_status') {
                columnDefinition.cellEditor = 'agSelectCellEditor';
                columnDefinition.cellEditorParams = {
                    values: palletStatusNames,
                };
            }

            return columnDefinition;
        });
    };

    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(1000);
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
    // const [enableCopy, setEnableCopy] = useState(false);
    const [gridApi, setGridApi] = useState();
    const [quickFilterText, setQuickFilterText] = useState('');
    const [seletectedPallets, setSeletectedPallets] = useState([]);
    const location = useLocation();
    const { currentUser } = props;



    useEffect(() => {
        if (location && currentUser) {
            let currentpage = location.pathname.split("/")
            if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'pallets') {
                history.push({
                    pathname: '/projects'
                });
            }
        }
    }, [location, currentUser]);


    const getNewData = async (gridApi) => {
        setLoading(true);
        gridApi.showLoadingOverlay();
        let fields = '?limit=-1&sort=-pallet_id'

        // Fetching data
        fetchGet(`${DATAURLS.PALLETS.url}${fields}`, getAccessToken())
            .then((response) => {
                console.log('get new rows rd, rdAPI response', response);
                setRowData(response.data);
                setLoading(false);
                let tempAPI = JSON.parse(JSON.stringify(response.data));
                setRowDataAPI(tempAPI);
            })
            .catch((err) => {
                setLoading(false);
                throw err;
            });

        // Fetching column definition
        fetchGet(DATAURLS.PALLETS_COLUMNDEFINITIONS.url, getAccessToken())
            .then((response) => {
                setColumnDefs(response.data);
                setLoading(false);
            })
            .catch((err) => {
                throw err;
            });

        // Fetching pallet status codes
        fetchGet(DATAURLS.PALLETS_STATUS_CODES.url, getAccessToken())
            .then((response) => {
                setPalletStatusCodes(response.data);
                let statusNames = response.data.map(
                    (status) => status.status_name
                );
                setPalletStatusNames(statusNames);
                setLoading(false);
            })
            .catch((err) => {
                throw err;
            });

        // Fetching all assets
        let fields1 = '?limit=-1&fields=pallet_number'

        fetchGet(`${DATAURLS.ASSETS.url}${fields1}`, getAccessToken())
            .then((response) => {
                setAllAssets(response.data);
                setLoading(false);
            })
            .catch((err) => {
                throw err;
            });

        // Fetching all asset types
        let fields2 = '?limit=-1&fields=Asset_Name&filter[Asset_Name][_nnull]=true'
        fetchGet(`${DATAURLS.ASSETTYPES.url}${fields2}`, getAccessToken())
            .then((response) => {
                let types = []
                response.data.forEach((item) => {
                    if (item.Asset_Name) {
                        types.push({
                            Asset_Name: item.Asset_Name.toUpperCase()
                        })
                    }
                })
                let data = types.reduce((unique, o) => {
                    if (!unique.some(obj => (obj.Asset_Name.toLowerCase() === o.Asset_Name.toLowerCase()))) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                setAssetTypes(data.map(
                    (obj) => obj.Asset_Name
                ))
            })
            .catch((err) => {
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
            (asset) => asset.pallet_number === data.pallet_id
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
        setSeletectedPallets(gridApi.getSelectedRows().map((row) => row.pallet_number));
    };

    // console.log("seletectedPallets", seletectedPallets.length)

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
        // console.log("new dataaa", data)

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
        setLoading(true);
        gridApi.showLoadingOverlay();
        fetchPut(
            `${DATAURLS.PALLETS.url}/${params.data.pallet_id}`, params.data,
            getAccessToken()
        )
            .then((response) => {
                console.log('response', response);
                if (response?.data?.pallet_id) {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Successfully updated");
                    setSnackBarType('success');
                    gridApi.redrawRows({ rowNodes: [params.node] });
                } else {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Failed to update. Please try again");
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
        fetchPost(DATAURLS.PALLETS.url, params.data, getAccessToken())
            .then((response) => {
                if (response?.data?.pallet_id) {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Successfully created.");
                    setSnackBarType('success');
                    params.data.pallet_id = response.data.pallet_id;
                    gridApi.redrawRows({ rowNodes: [params.node] });
                } else {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Failed to update. Please try again");
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
        generateExcelNew(gridApi, 'Pallets', []);
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

        if (params && !params.data.pallet_id) {
            let rowDataCopy = [...rowData];
            rowDataCopy.splice(params.node.rowIndex, 1);
            setRowData(rowDataCopy);
            return;
        }

        fetchDelete(DATAURLS.PALLETS.url, [params.data.pallet_id], getAccessToken())
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
        if (!params || rowDataAPI.length === 0) {
            return;
        }
        let missingRowNodes = params.api.rowModel.rowsToDisplay.filter((row) => {
            if (!row.data.pallet_id) {
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
        return false;
    };

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 60,
            floatingFilter: true,
        };
    }, []);

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
                    {
                        seletectedPallets?.length > 0 && <Link style={{ color: "#FFFFFF" }} target="_blank" to={`/palletsassets/${seletectedPallets.toString()}`}><Tooltip placement="topLeft" title="Export">
                            <OrderedListOutlined
                                // icon={faDownload}
                                // title='Export'
                                className={classes.actionIcon}
                            />
                        </Tooltip>
                        </Link>
                    }


                    <Divider orientation='vertical' flexItem />
                    <Tooltip placement="topLeft" title="Add">
                        <PlusOutlined
                            className={classes.actionIcon}
                            onClick={() => handleAddNew()}
                        />
                    </Tooltip>
                    <Tooltip placement="topLeft" title="Copy">
                        <CopyOutlined
                            className={classes.actionIcon}
                            onClick={() => handleCopy()}
                        />
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
                    defaultColDef={defaultColDef}
                    debounceVerticalScrollbar={true}
                    columnDefs={buildColumnDefinitions(columnDefs, assetTypes)}
                    components={frameworkComponents}
                    suppressDragLeaveHidesColumns={true}
                    onGridReady={onGridReady}
                    rowSelection='multiple'
                    onRowEditingStopped={onRowEditingStopped}
                    onRowSelected={onRowSelected}
                    onRowDataChanged={onRowDataChanged}
                    onRowEditingStarted={onRowEditingStarted}
                    editType='fullRow'
                    enableCellTextSelection={true}
                    floatingFilter={true}
                    paginationPageSizeSelector={[100, 250, 500, 1000]}
                    getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
                    overlayLoadingTemplate={overlayLoadingTemplate}
                    getNewData={getNewData}
                    handleDelete={handleDelete}
                    pagination={true}
                    enableCellTextSelection={true}
                    paginationPageSize={pageSize}
                    suppressRowClickSelection={true}
                    alwaysShowVerticalScroll={true}
                    quickFilterText={quickFilterText}
                    onModelUpdated={onModelUpdated}
                ></AgGridReact>
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

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Pallets);