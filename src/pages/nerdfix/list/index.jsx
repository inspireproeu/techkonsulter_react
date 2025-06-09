import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
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
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useParams, useLocation } from 'react-router-dom';
import { connect, history } from 'umi';
import * as moment from 'moment-timezone';

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

const Users = (props) => {
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
                // checkboxSelection: index === 0 ? true : false,
                field: columnDef.field,
                sortable: true,
                resizable: true,
                hide: columnDef.hide,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                width: index === 2 ? 300 : 'auto',
                valueGetter: (params) => {
                    if (columnDef.field === 'date_created') {
                        var dateObj = moment(params.data.date_created).tz('Europe/Stockholm');
                        return dateObj.format('YYYY-MM-DD HH:MM:SS');
                    }
                    return params.data[columnDef.field];
                },
                valueFormatter: (params) => {
                    if (columnDef.field === 'api_request') {
                        return params.value === 'UPDATEPRODUCT_API' ? 'ITREON UPDATE' : 'SOLD ORDER UPDATE';
                    }
                    if (columnDef.field === 'api_response') {
                        let res = params.value ? JSON.parse((params.value)) : '';
                        delete res['token'];
                        delete res['data'];
                        return `${res}`
                    }
                },
            };
            return columnDefinition;
        });
    };

    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(25);
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState();
    const [quickFilterText, setQuickFilterText] = useState('');
    const { currentUser } = props;
    const [columnDefs, setColumnDefs] = useState([
        {
            "field": "asset_id_nl",
            "header_name": "Asset ID NL",
        },
        {
            "field": "api_request",
            "header_name": "API Type",
        }, {
            "field": "api_response",
            "header_name": "Nerdfix Response",
        }, {
            "field": "date_created",
            "header_name": "Date created",
        }, 
        // {
        //     "field": "user_created.email",
        //     "header_name": "Updated by",
        // }
    ]);

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
        let fields = `limit=-1&sort=-id&fields=asset_id_nl,api_request,api_response,date_created,user_created.email`
        if (urlParams.id) {
            fields += `&filter[asset_id_nl][_eq]=${urlParams.id}`
        }
        fetchGet(`${DATAURLS.NERDFIX_HISTORY.url}?${fields}`, getAccessToken())
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

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
    }, []);

    return (
        <div className={classes.root}>
            <div className={'sectionHeader'}>
                Nerdfix history
          <Paper component='form' className={classes.textRoot}>
                    <InputBase
                        className={classes.input}
                        placeholder='Search Nerdfix history'
                        inputProps={{ 'aria-label': 'Search history' }}
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
                    // suppressDragLeaveHidesColumns={true}
                    onGridReady={onGridReady}
                    rowSelection='multiple'
                    enableCellTextSelection={true}
                    editType='fullRow'
                    // overlayNoRowsTemplate={overlayLoadingTemplate}
                    overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                    // getNewData={getNewData}

                    pagination={true}
                    floatingFilter={true}
                    paginationPageSize={pageSize}
                    suppressRowClickSelection={true}
                    alwaysShowVerticalScroll={true}
                    quickFilterText={quickFilterText}
                ></AgGridReact>

            </div>
        </div>
    );
};

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Users);