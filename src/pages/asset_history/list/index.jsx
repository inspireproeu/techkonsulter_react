import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
    fetchGet,
    fetchGetWithoutLogin
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useParams, useLocation } from 'react-router-dom';
import { connect, history } from 'umi';
import * as moment from 'moment-timezone';
import { ReactComponent as RefreshIcon } from '@/assets/refresh-ccw.svg';
import {
    DeleteFilled
} from '@ant-design/icons';
import styles from '../../assets/style.less';
import {
    Modal
} from 'antd';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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

const History = (props) => {
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
                cellRenderer: columnDef.field === 'status' ? StatusCellRenderer : (columnDef.field === 'asset_id' ? ActionCellRenderer : false),
                field: columnDef.field,
                sortable: true,
                resizable: true,
                hide: columnDef.hide,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                width: index === 2 ? 300 : 'auto',
                valueGetter: (params) => {
                    if (columnDef.header_name === 'Asset ID') {
                        // var dateObj = moment(params.data.date_created).tz('Europe/Stockholm');
                        // return dateObj.format('YYYY-MM-DD HH:MM:SS');
                    }
                    if (columnDef.field === 'asset_id') {
                        return params.data.item
                    }
                    if (columnDef.field === 'project_id') {
                        return params.data.data.project_id
                    }
                    if (columnDef.field === 'api_request') {
                        return params.data.activity.action
                    }
                    if (columnDef.field === 'user') {
                        return params.data.activity.user.email
                    }
                    if (columnDef.field === 'status') {
                        return params.data.data.status
                    }
                    if (columnDef.field === 'grade') {
                        return params.data.data.grade
                    }
                    if (columnDef.field === 'manufacturer') {
                        return params.data.data.manufacturer
                    }
                    if (columnDef.field === 'model') {
                        return params.data.data.model
                    }
                    if (columnDef.field === 'costprice') {
                        return params.data.data.costprice
                    }
                    if (columnDef.field === 'pallet_number') {
                        return params.data.data.pallet_number;
                    }
                    if (columnDef.field === 'sold_order_nr') {
                        return params.data.data.sold_order_nr
                    }
                    if (columnDef.field === 'sold_price') {
                        return params.data.data.sold_price
                    }
                    if (columnDef.field === 'qty') {
                        return params.data.data.quantity
                    }
                    if (columnDef.field === 'storage_id') {
                        return params.data.data.storage_id
                    }
                    if (columnDef.field === 'complaint') {
                        if (params.data?.data?.complaint_from_app && !params.data?.data?.complaint) {
                            params.data.data.complaint = params.data?.data?.complaint_from_app
                        }
                        return params.data.data.complaint
                    }
                    if (columnDef.field === 'timestamp') {
                        return moment(params.data.activity.timestamp).format('YYYY-MM-DD HH:MM')
                    }
                }
            };
            return columnDefinition;
        });
    };

    const [loading, setLoading] = useState(true);
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState();
    const { currentUser } = props;
    const [columnDefs] = useState([
        {
            "field": "asset_id",
            "header_name": "Asset ID",
        },
        {
            "field": "project_id",
            "header_name": "Project ID",
        },
        {
            "field": "api_request",
            "header_name": "Request",
        },
        {
            "field": "user",
            "header_name": "User",
        },
        {
            "field": "status",
            "header_name": "Status",
        },
        {
            "field": "manufacturer",
            "header_name": "Manufacturer",
        }, {
            "field": "model",
            "header_name": "Model",
        },
        {
            "field": "complaint",
            "header_name": "Complaint",
        },
        {
            "field": "grade",
            "header_name": "Grade",
        },
        {
            "field": "qty",
            "header_name": "Qty",
        },
        {
            "field": "pallet_number",
            "header_name": "Pallet Location",
        },
        {
            "field": "storage_id",
            "header_name": "Storage ID",
        },
        {
            "field": "costprice",
            "header_name": "Cost price",
        },
        {
            "field": "sold_order_nr",
            "header_name": "Sold Order No",
        },
        {
            "field": "sold_price",
            "header_name": "Sold Price",
        },
        {
            "field": "timestamp",
            "header_name": "Timestamp",
        }
    ]);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarType, setSnackBarType] = useState('success');

    const StatusCellRenderer = (params) => {
        return <div className={params.rowIndex === 0 ? 'orange-color' : null}>
            {params.data.data.status} {params.rowIndex === 0 && <RefreshIcon width={10} height={10} />}
        </div>
    }
    
    const ActionCellRenderer = (params) => {
        return <div>
            {params.data.item}{currentUser.userType === 'ADMIN' && <DeleteFilled className={[styles.addlead, styles.deleteBtn].join(' ')} onClick={() => handleOpen(params.data.id)} />}
        </div>
    }

    function confirm(id) {
        Modal.confirm({
            title: 'Delete History',
            content: 'Are you sure that you want to delete these history',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => handleBulkDelete(id),
        });
    }

    const handleOpen = (id) => {
        confirm(id)
    };

    const frameworkComponents = {
        StatusCellRenderer,
        ActionCellRenderer
    }

    useEffect(() => {
        if (location && currentUser) {
            let currentpage = location.pathname.split("/")
            if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'deviation') {
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

    const getNewData = async (gridApi) => {
        setLoading(true);
        gridApi.showLoadingOverlay();
        let fields = `limit=-1&sort=-id&fields=id,activity.user.email,item,data,delta,activity.action,activity.timestamp`
        if (urlParams.id) {
            fields += `&filter[item][_eq]=${urlParams.id}`
        }
        fields += `&filter[is_deleted][_eq]=false`
        fetchGet(`${DATAURLS.ASSETS_HISTORY.url}?${fields}`, getAccessToken())
            .then((response) => {
                setRowData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                throw err;
            });

        gridApi.hideOverlay();
        // gridApi.sizeColumnsToFit();
    };

    const handleBulkDelete = (id) => {
        let obj = {
            is_deleted: true
        }
        fetchGetWithoutLogin(`${DATAURLS.ASSETS_HISTORY_UPDATE.url}?id=${id}`, getAccessToken())
            .then((response) => {
                if (response.status === 200) {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Successfully deleted the history.");
                    setSnackBarType('success');
                    getNewData(gridApi)
                    // setSuccess(true);
                } else {
                    setSnackBarOpen(true);
                    setSnackBarMessage("Failed to delete history");
                    setSnackBarType('error');
                    getNewData(gridApi)
                }
            })
            .catch((err) => {
                throw err;
            });

    };

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
    }, []);

    return (
        <div className={classes.root}>
            <div className={'sectionHeader'}>
                Asset history
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
                    // suppressDragLeaveHidesColumns={true}
                    onGridReady={onGridReady}
                    rowSelection='multiple'
                    enableCellTextSelection={true}
                    editType='fullRow'
                    // overlayNoRowsTemplate={overlayLoadingTemplate}
                    overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                    // getNewData={getNewData}
                    frameworkComponents={frameworkComponents}
                    pagination={true}
                    floatingFilter={true}
                    paginationPageSize={100}
                    suppressRowClickSelection={true}
                    alwaysShowVerticalScroll={true}
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
}))(History);