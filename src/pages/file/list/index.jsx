import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect, useCallback } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import CustomDropdown from '../../assets/components/CustomDropdown';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
    fetchGet,
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useLocation } from 'react-router-dom';
import ActionCellRenderer from '../components/ActionCellRenderer';
import { connect, history } from 'umi';
import * as moment from 'moment';



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
                cellRenderer:
                    index === 0
                        ? 'ActionCellRenderer' : false,
                checkboxSelection: false,
                field: columnDef.field,
                // editable: columnDef.editable,
                filter: index === 0 ? false : true,
                sortable: true,
                resizable: true,
                hide: false,
                valueFormatter: (params) => {
                    if (columnDef.type === 'date' && params.value) {
                      return params.value ? moment(params.value).format('YYYY-MM-DD HH:MM') : null;
                    }
                }
            };
           
            return columnDefinition;
        });
    };

    const frameworkComponents = {
        ActionCellRenderer: ActionCellRenderer
    };

    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(100);
    const [rowData, setRowData] = useState([]);
    const [columnDefs] = useState([{
        "field": "actions",
        "header_name": "Actions",
    },
    {
        "field": "uploaded_by.first_name",
        "header_name": "Uploaded By",
    }, {
        "field": "uploaded_on",
        "header_name": "Uploaded Date",
        "type":'date'
    }, {
        "field": "filename_download",
        "header_name": "File name",
    }

    ]);
    const [gridApi, setGridApi] = useState();
    const [quickFilterText] = useState('');
    const { currentUser } = props;
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
        let fields = '?limit=2000&sort=-uploaded_on&fields=uploaded_by.first_name,uploaded_on,filename_download,id,filename_disk'
        fetchGet(`${DATAURLS.FILES.url}${fields}`, getAccessToken())
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
        // gridApi.sizeColumnsToFit();
    };

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
    }, []);

    return (
        <div className={classes.root}>
            <div className={'sectionHeader'}>
                Files
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
                    rowBuffer={500}
                    debounceVerticalScrollbar={true}
                    columnDefs={buildColumnDefinitions(columnDefs)}
                    components={frameworkComponents}
                    // suppressDragLeaveHidesColumns={true}
                    onGridReady={onGridReady}
                    rowSelection='multiple'
                    enableCellTextSelection={true}
                    editType='fullRow'
                    overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                    // getNewData={getNewData}
                    pagination={true}
                    floatingFilter={true}
                    paginationPageSize={pageSize}
                    suppressRowClickSelection={true}
                    alwaysShowVerticalScroll={true}
                    quickFilterText={quickFilterText}
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
            </div>
        </div>
    );
};

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Complain);