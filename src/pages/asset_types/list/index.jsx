import {
    PlusOutlined,
    ColumnWidthOutlined
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
import { useState, useEffect, useMemo } from 'react';
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
import AssetColumnDialog from '../components/AssetColumnDialog';


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


const Assetstype = (props) => {
    const theme = useTheme(AppTheme);
    const classes = useStyles(theme);
    //   const appContext = useContext(AppContext);
    const overlayLoadingTemplate =
        '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

    const buildColumnDefinitions = (columnDefs, assetTypes) => {
        return columnDefs.map((columnDef, index) => {
            let columnDefinition = {
                headerName: index !== 0 ? columnDef.header_name : '',
                cellRenderer: columnDef.component ? columnDef.component : false,
                cellRendererParams: {
                    onRowEditingStopped: (params) => onRowEditingStopped(params),
                    handleEdit: (params) => handleEdit(params),
                    handleDelete: (params) => handleDelete(params),
                    setRow: (params) => setRow(params),
                    setShowAssetColumnDialog: (params) => setShowAssetColumnDialog(params),
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
                width: index === 0 ? 60 : 'auto',
            };

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
    const [gridApi, setGridApi] = useState();
    const [quickFilterText, setQuickFilterText] = useState('');
    const location = useLocation();
    const { currentUser } = props;
    const [row, setRow] = useState({});
    const [showAssetColumnDialog, setShowAssetColumnDialog] = useState(false);
    const [assetcolumns, setassetcolumns] = useState([]);

    const LinkComponent = ({ data }) => {
        let props = data
        return (
            <Link onClick={() => {
                setRow(props);
                setShowAssetColumnDialog(true);
            }}>
                <ColumnWidthOutlined />
            </Link>
        );
    }

    const frameworkComponents = {
        //   CustomCellEditor: CustomCellEditor,
        ActionCellRenderer: ActionCellRenderer,
        LinkComponent: LinkComponent
    };

    const columnDefs = [
        {
            header_name: 'Action',
            field: '',
            component: 'ActionCellRenderer'
        },
        {
            header_name: 'Asset Type',
            field: 'Asset_Name',
            editable: true
        },
        {
            header_name: 'Form Factor',
            field: 'formfactor',
            editable: true
        },
        {
            header_name: 'Sample CO2',
            field: 'sampleco2',
            editable: true
        },
        {
            header_name: 'Sample Weight',
            field: 'sample_weight',
            editable: true
        },
        {
            header_name: 'Columns',
            field: 'fields',
            component: 'LinkComponent'
        }
    ];


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
        gridApi && gridApi.showLoadingOverlay();
        let fields = '?limit=-1&sort=Asset_Name'

        // Fetching data
        fetchGet(`${DATAURLS.ASSETTYPES.url}${fields}`, getAccessToken())
            .then((response) => {
                setRowData(response.data);
                setLoading(false);
                let tempAPI = JSON.parse(JSON.stringify(response.data));
                setRowDataAPI(tempAPI);
            })
            .catch((err) => {
                setLoading(false);
                throw err;
            });

        highlightUnsavedRows();
        gridApi.sizeColumnsToFit();
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        getNewData(params.api);
        getColumnDefinitions()
    };

    const onModelUpdated = (params) => {
        params.api.sizeColumnsToFit();
    };

    const onRowSelected = (params) => {
        // setSeletectedPallets(gridApi.getSelectedRows().map((row) => row.pallet_number));
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
            (row) => row.Asset_Id === params.data.Asset_Id
        );

        if (
            currentRowFromAPI &&
            JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
        ) {
            console.log('no update done');
            return;
        }

        if (params.data.Asset_Id) {
            handleUpdate(params.data);
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

    const handleUpdate = (params, fields = null) => {
        // console.log('rowediting, update', params);
        Object.keys(params).forEach((key) => {
            if (!params[key]) {
                params[key] = null;
            }
        });
        setLoading(true);
        gridApi.showLoadingOverlay();
        delete params.Fields
        delete params.Asset_name_Bk

        if (!fields) {
            delete params.Fields1
        }
        fetchPut(
            `${DATAURLS.ASSETTYPES.url}/${params.Asset_Id}`, params,
            getAccessToken()
        )
            .then((response) => {
                if (response?.data?.Asset_Id) {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Successfully updated");
                    setSnackBarType('success');
                    if (!fields) {
                        // gridApi && gridApi.redrawRows({ rowNodes: [params.node] });
                    } else {
                        getNewData(gridApi)
                        handleAssetColumnCancel()
                    }
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
                // if (!fields) {
                //     setTimeout(() => {
                //         highlightUnsavedRows(params);
                //     }, 600);
                // }
            })
            .catch((err) => {
                throw err;
            });
    };

    const handleSave = (params) => {
        // console.log('handlesave, params', params);
        setLoading(true);
        gridApi.showLoadingOverlay();
        fetchPost(DATAURLS.ASSETTYPES.url, params.data, getAccessToken())
            .then((response) => {
                if (response?.data?.Asset_Id) {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Successfully created.");
                    setSnackBarType('success');
                    params.data.Asset_Id = response.data.Asset_Id;
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

    const handleDelete = (params) => {
        // console.log('handle delete pallets', params);

        if (params && !params.data.Asset_Id) {
            let rowDataCopy = [...rowData];
            rowDataCopy.splice(params.node.rowIndex, 1);
            setRowData(rowDataCopy);
            return;
        }

        fetchDelete(DATAURLS.ASSETTYPES.url, [params.data.Asset_Id], getAccessToken())
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
            if (!row.data.Asset_Id) {
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
            minWidth: 40,
            floatingFilter: true,
        };
    }, []);

    const getColumnDefinitions = async () => {

        let fields1 = `?limit=-1&sort=order_by_id&fields=field,header_name`

        // Fetching column definition
        fetchGet(`${DATAURLS.COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())
            .then((response) => {
                let definitions = []
                response.data.forEach((itm) => {
                    if (itm.field !== "actions") {
                        definitions.push(itm)
                    }
                })
                setassetcolumns(definitions);
            })
            .catch((err) => {
                throw err;
            });
    }

    const handleAssetColumnCancel = async () => {
        setRow({})
        setShowAssetColumnDialog(value => !value);
    };

    return (
        <div className={classes.root}>
            <div className={'sectionHeader'}>
                Asset Type and Formfactors
        <Paper component='form' className={classes.textRoot}>
                    <InputBase
                        className={classes.input}
                        placeholder='Search Asset Type and Formfactors'
                        inputProps={{ 'aria-label': 'Search Asset Type and Formfactors' }}
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
                    height: '80vh',
                    boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
                }}
            >
                <AgGridReact
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    debounceVerticalScrollbar={true}
                    columnDefs={buildColumnDefinitions(columnDefs)}
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
                {row?.Asset_Id && (
                    <AssetColumnDialog
                        showModalDialog={showAssetColumnDialog}
                        handleCancel={handleAssetColumnCancel}
                        data={row}
                        columnDefinitions={assetcolumns}
                        onSubmit={handleUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Assetstype);