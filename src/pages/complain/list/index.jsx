import {
    PlusOutlined,
    DeleteFilled,
} from '@ant-design/icons';
import {
    Modal,
    Tooltip
} from 'antd';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useState, useEffect, useCallback } from 'react';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import AddNew from '../components/AddNew';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
    fetchPut,
    fetchPost,
    fetchGet,
    fetchDelete,
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useParams, useLocation } from 'react-router-dom';
import ActionCellRenderer from '../components/ActionCellRenderer';
import ActionComplaint from '../components/ActionComplaint';
import ActionAssettypes from '../components/ActionAssettypes';
import { connect, history } from 'umi';

import AssetColumnDialog from '../components/AssetColumnDialog';


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


const Complain = (props) => {
    const theme = useTheme(AppTheme);
    const urlParams = useParams();
    const location = useLocation();
    const classes = useStyles(theme);
    const overlayLoadingTemplate =
        '<span class="ag-overlay-loading-center">Please wait while update in progress</span>';

    const overlayLoadingTemplate1 =
        '<span class="ag-overlay-loading-center">No records found.</span>';

    const buildColumnDefinitions = (columnDefs) => {
        return columnDefs.map((columnDef, index) => {
            let columnDefinition = {
                headerName: columnDef.header_name,
                cellRendererParams: {
                    handleEdit: (params) => handleEdit(params),
                    handleDelete: (params) => handleDelete(params),
                },
                cellRenderer:columnDef.component ? columnDef.component : false,
                checkboxSelection: index === 0 ? true : false,
                field: columnDef.field,
                editable: columnDef.editable,
                sortable: true,
                resizable: true,
                hide: columnDef.hide,
                filter: index !== 0 ? 'agTextColumnFilter' : 'none',
                floatingFilter: true,
            };
            return columnDefinition;
        });
    };

    const frameworkComponents = {
        ActionCellRenderer: ActionCellRenderer,
        ActionComplaint: ActionComplaint,
        ActionAssettypes:ActionAssettypes
    };

    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(100);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarType, setSnackBarType] = useState('success');
    const [rowData, setRowData] = useState([]);
    const [rowDataAPI, setRowDataAPI] = useState([]);
    const [columnDefs, setColumnDefs] = useState([{
        "hide": false,
        "field": "actions",
        "header_name": "Actions",
        component:"ActionCellRenderer",
        "order_by": 0,
        "complaintype": false
    },
    {
        "hide": true,
        "field": "id",
        "header_name": "Complaint id",
        
        "order_by": 1,
        "id": 1,
        "complaintype": false
    },
    {
        "hide": false,
        "field": "name",
        "header_name": "Complaint Name",
        
        "order_by": 2,
        "id": 2,
        "complaintype": false
    },
    {
        "hide": false,
        "field": "short_name",
        "header_name": "Short Name",
        
        "order_by": 3,
        "id": 3,
        "complaintype": false
    },
    {
        "hide": false,
        "field": "minor",
        "complaintype": true,
        "header_name": "A-grade - Minor",
        component:"ActionComplaint",
        "order_by": 4,
        "id": 4
    },
    {
        "hide": false,
        "field": "medium",
        "header_name": "B-grade - Med",
        "complaintype": true,
        component:"ActionComplaint",
        "order_by": 5,
        "id": 5
    },
    {
        "hide": false,
        "field": "large",
        "complaintype": true,
        "header_name": "C-grade - Large",
        component:"ActionComplaint",
        "order_by": 6,
        "id": 6
    },
    {
        "hide": false,
        "field": "serious",
        "header_name": "D-grade - Serious",
        "complaintype": true,
        component:"ActionComplaint",
        "order_by": 7,
        "id": 7
    },
    {
        "hide": false,
        "field": "warning",
        "header_name": "E-grade - Warning",
        "complaintype": true,
        component:"ActionComplaint", 
        "order_by": 8,
        "id": 8
    },
        {
            "hide": false,
            "field": "computer",
            "header_name": "LT/DT",
            component:"ActionAssettypes",
            "order_by": 9,
        }, 
        {
            "hide": false,
            "field": "mobile",
            "header_name": "Mobile",
            component:"ActionAssettypes",
            "order_by": 10,
            "id": 3
        },
        {
            "hide": false,
            "field": "serverstorage",
            "header_name": "Server/Storage",
            component:"ActionAssettypes",  
            "order_by": 10,
            "id": 3
        },
        {
            "hide": false,
            "field": "monitor",
            "header_name": "Monitor",
            component:"ActionAssettypes",     
            "order_by": 11,
            "id": 3
        },
        {
            "hide": false,
            "field": "all",
            "header_name": "All",
            component:"ActionAssettypes",  
            "order_by": 12,
            "id": 3
        }
    ]);
    const [enableDelete, setEnableDelete] = useState(false);
    const [gridApi, setGridApi] = useState();
    const [quickFilterText, setQuickFilterText] = useState('');
    const [editData, seteditData] = useState({})
    const [addNewDialog, setAddNewDialog] = useState(false);
    const { currentUser } = props;
    const [paramId, setparamId] = useState('');
    const [row, setRow] = useState();
    const [showAssetColumnDialog, setShowAssetColumnDialog] = useState(false);
    const [allColumns, setAllColumns] = useState([]);
    useEffect(() => {
        if (location && currentUser) {
            let currentpage = location.pathname.split("/")
            if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'complaint') {
                history.push({
                    pathname: '/projects'
                });
            }
            // setPage(currentpage[1])
        }
    }, [location, currentUser]);

    useEffect(() => {
        if (gridApi && rowData.length === 0) {
            gridApi.showLoadingOverlay();
        }
    }, [gridApi, rowData])

    useEffect(() => {
        if (gridApi && currentUser) {
            getNewData(gridApi)
        }
    }, [gridApi, currentUser])

    const getNewData = async (gridApi, id) => {
        setLoading(true);
        gridApi.showLoadingOverlay();
        let fields = '?limit=-1&sort=-id'
        fetchGet(`${DATAURLS.COMPLAINTS.url}${fields}`, getAccessToken())
            .then((response) => {
                setRowData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                throw err;
            });
        setAllColumns(
            columnDefs.filter(
                (col) => !(col.field === 'actions' || col.field === 'id')
            )
        );
        // Fetching column definition
        // let fields1 = '?limit=-1&sort=order_by_id'

        // fetchGet(`${DATAURLS.COMPLAIN_COLUMNDEFINITIONS.url}${fields1}`, getAccessToken())

        //     .then((response) => {
        //         setColumnDefs(response.data);
        //         setLoading(false);
        //     })
        //     .catch((err) => {
        //         throw err;
        //     });
        gridApi.hideOverlay();
        highlightUnsavedRows();
        // gridApi.sizeColumnsToFit();
    };

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
    }, []);

    const onRowSelected = (params) => {
        setEnableDelete(gridApi.getSelectedRows().length > 0);
    };

    const onRowDataChanged = (params) => {
        highlightUnsavedRows(params);
    };

    const onRowEditingStarted = (params) => {
        // console.log('on row editing started', params);
        if (params.columnApi.columnController.allDisplayedColumns) {
            gridApi.refreshCells({
                rowNodes: [params.node],
                columns: [params.columnApi.columnController.allDisplayedColumns[0]],
                force: true,
            });
        }

    };

    const onRowEditingStopped = (params) => {
        let currentRowFromAPI = rowDataAPI.find(
            (row) => row.id === params.data.id
        );

        if (
            currentRowFromAPI &&
            JSON.stringify(params.data) === JSON.stringify(currentRowFromAPI)
        ) {
            console.log('no update done');
            return;
        }
    };

    const handleAddNew = async (data) => {
        setAddNewDialog(true);
        // console.log('add new', gridApi);
        // let newRow = [{ ...data }];
        // setRowData((prev) => [...newRow, ...prev]);
    };

    const handleBulkDelete = async (props) => {
        let selectedRows = gridApi.getSelectedRows();
        let selectedUserIds = []
        if (props?.data?.id) {
            selectedUserIds = [props.data.id]
        } else {
            selectedUserIds = selectedRows.map(
                (row) => row.id
            );
        }

        setLoading(true);

        fetchDelete(
            DATAURLS.COMPLAINTS.url,
            selectedUserIds,
            getAccessToken()
        )
            .then((res) => {
                if (res) {
                    getNewData(gridApi, paramId);
                } else {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Failed to delete complain");
                    setSnackBarType('error');
                }
            })
            .catch((err) => {
                console.log('error deleting record');
                throw err;
            });
    };

    const handleDelete = (params) => {
        handleBulkDelete(params)
    };
    const handleEdit = (params) => {
        seteditData(params.data)
        setAddNewDialog(true)
    };


    const highlightUnsavedRows = (params) => {
        // console.log('highlightUnsavedRows', params);
        if (!params || rowDataAPI.length === 0) {
            return;
        }
        let missingRowNodes = params.api.rowModel.rowsToDisplay.filter((row) => {
            if (!row.data.id) {
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
            title: 'Delete multiple',
            // icon: false,
            content: 'Are you sure that you want to delete these complain',
            okText: 'Yes',
            cancelText: 'No',
            onOk: handleBulkDelete
        });
    }

    const handleOpen = () => {
        confirm()
    };

    const handleFieldsOpen = (props) => {
        setRow(props.data);
        setShowAssetColumnDialog(true);
    }
    const handleFieldColumnCancel = (props) => {
        setRow('');
        setShowAssetColumnDialog(false);
    }

    const handleComplaintColumnSubmit = (values) => {
        fetchPut(`${DATAURLS.COMPLAINTS.url}/${values.id}`, values, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    setLoading(false);
                    // setSuccess(true);
                } else {
                    setLoading(false);
                    // setError(true);
                    // setErrorMessage(response.message);
                }
            })
            .catch((err) => {
                throw err;
            });
    }
    return (
        <div className={classes.root}>
            <div className={'sectionHeader'}>
                Complaints
                <Paper component='form' className={classes.textRoot}>
                    <InputBase
                        className={classes.input}
                        placeholder='Search complaints'
                        inputProps={{ 'aria-label': 'Search complaints' }}
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
                    <PlusOutlined
                        // icon={faPlus}
                        title='Add'
                        className={classes.actionIcon}
                        onClick={() => handleAddNew()}
                    />
                    <DeleteFilled
                        // icon={faTrash}
                        title='Delete'
                        className={classes.actionIconDisabled}
                        onClick={() => handleOpen()}
                    />
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
                    // suppressDragLeaveHidesColumns={true}
                    onGridReady={onGridReady}
                    rowSelection='multiple'
                    onRowEditingStopped={onRowEditingStopped}
                    onRowSelected={onRowSelected}
                    enableCellTextSelection={true}
                    onRowDataChanged={onRowDataChanged}
                    onRowEditingStarted={onRowEditingStarted}
                    editType='fullRow'
                    handleFieldsOpen={handleFieldsOpen}
                    getRowClass={(params) => bgColorDecider(params, rowDataAPI)}
                    overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                    // getNewData={getNewData}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    pagination={true}
                    floatingFilter={true}
                    paginationPageSize={pageSize}
                    suppressRowClickSelection={true}
                    alwaysShowVerticalScroll={true}
                    quickFilterText={quickFilterText}
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
            <AddNew
                open={addNewDialog}
                setOpen={setAddNewDialog}
                title={`${editData?.id ? 'Update ' : 'Add New '}Complaint`}
                page={location.pathname.split("/")}
                urlParams={urlParams}
                getNewData={getNewData}
                parentGridApi={gridApi}
                editData={editData}
                seteditData={seteditData}
                paramId={paramId}
                rowData={rowData}
            />
            {row?.id && (
                <AssetColumnDialog
                    showModalDialog={showAssetColumnDialog}
                    handleCancel={handleFieldColumnCancel}
                    data={row}
                    columnDefinitions={allColumns}
                    onSubmit={handleComplaintColumnSubmit}
                />
            )}
        </div>
    );
};

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Complain);