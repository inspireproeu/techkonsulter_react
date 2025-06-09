import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
    fetchGet
} from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';
import { useLocation } from 'react-router-dom';
import { connect, history } from 'umi';
import { Tabs } from 'antd';
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
                // cellRenderer: columnDef.field === 'model_cpu' ? modelCellRenderer : false,
                checkboxSelection: false,
                field: columnDef.field,
                // editable: columnDef.editable,
                filter: true,
                sortable: true,
                resizable: true,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                autoHeight: true,
                valueFormatter: (params) => {
                    if (!params.value) {
                        return 'N/A';
                    }
                },
            };
            return columnDefinition;
        });
    };

    const frameworkComponents = {
        modelCellRenderer,
    };

    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(500);
    const [rowData, setRowData] = useState([]);
    const [rowDataAPI, setRowDataAPI] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        {
            "field": "form_factor",
            "header_name": "Form factor"
        },
        {
            "field": "manufacturer",
            "header_name": "Manufacturer",
        },
        {
            "field": "model_cpu",
            "header_name": "Model / CPU",
        },
        {
            "field": "grade",
            "header_name": "Grade",
        },
        {
            "field": "last_60_days_sold",
            "header_name": "Grade values",
        },
        {
            "field": "last_6months_grade",
            "header_name": "Grade (%)",
        },
        {
            "field": "last_60_days_qty_sold",
            "header_name": "QTY sold",
        }
    ]);
    const [gridApi, setGridApi] = useState();
    const [quickFilterText] = useState('');
    const { currentUser } = props;
    const [allColumns, setAllColumns] = useState([]);
    const [selectedAssetType, setSelectedAssetType] = useState('computer');

    useEffect(() => {
        if (location && currentUser) {
            let currentpage = location.pathname.split("/")
            if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'estimate_values') {
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
        if (gridApi && currentUser && selectedAssetType) {
            getNewData(gridApi,selectedAssetType)
        }
    }, [gridApi, currentUser, selectedAssetType])

    const selectReport = (key) => {
        setSelectedAssetType(key)
        // if (key === 'computer') {
        //     getNewData(gridApi, 'computer')
        // } else if (key === 'mobile') {
        //     getNewData(gridApi, 'mobile');
        //     // getNewMobileData(gridApiMobile)
        // }
    }

    const getNewData = async (gridApi, type) => {
        setLoading(true);
        gridApi.showLoadingOverlay();
        let fields = '?limit=-1&sort=-id'
        let url = `${DATAURLS.ESTIMATEDASSETVALUESCOMPUTER.url}`
        if (type === 'mobile') {
            url = `${DATAURLS.ESTIMATEDASSETVALUESMOBILE.url}`
        }
        fetchGet(`${url}${fields}`, getAccessToken())
            .then((response) => {
                response.data.forEach((itm) => {
                    let form_factor = itm.form_factor.toLowerCase()
                    if (itm.mobile_info && (form_factor === 'phone' || form_factor === 'tablet')) {
                        itm.model_cpu = itm.model + ' ' + itm.mobile_info

                    } if (itm.computer_info && (form_factor === 'desktop' || form_factor === 'laptop')) {
                        itm.model_cpu = itm.model + ' ' + itm.computer_info
                    }
                })
                setRowData(response.data);
                setLoading(false);
                gridApi.hideOverlay();

            })
            .catch((err) => {
                gridApi.hideOverlay();

                throw err;
            });
        setAllColumns(
            columnDefs.filter(
                (col) => !(col.field === 'actions' || col.field === 'id')
            )
        );
        highlightUnsavedRows();
        // gridApi.sizeColumnsToFit();
    };

    const modelCellRenderer = ({ data }) => {

        return <>
            {

                data.temp_info && data.temp_info.map((obj) => (
                    <><span> {data.model}  {obj}</span><br /></>
                ))}
            {

                data.mobtemp_info && data.mobtemp_info.map((obj) => (
                    <><span> {data.model}  {obj}</span><br /></>
                ))}
        </>
    }

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
    }, []);

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



    return (
        <Tabs defaultActiveKey={selectedAssetType} onChange={selectReport}>
            <TabPane
                tab={<span>Estimate Asset value Computer Device</span>}
                key="computer"
            >
                <div className={classes.root}>
                    <div className={'sectionHeader'}>
                        Estimate Asset value Computer
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
                            // debounceVerticalScrollbar={true}
                            columnDefs={buildColumnDefinitions(columnDefs)}
                            frameworkComponents={frameworkComponents}
                            // suppressDragLeaveHidesColumns={true}
                            onGridReady={onGridReady}
                            rowSelection='multiple'
                            enableCellTextSelection={true}
                            editType='fullRow'
                            overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                            paginationPageSizeSelector={[100, 250, 500, 1000, 2000]}
                            pagination={true}
                            floatingFilter={true}
                            paginationPageSize={pageSize}
                            suppressRowClickSelection={true}
                            alwaysShowVerticalScroll={true}
                            quickFilterText={quickFilterText}
                        // onModelUpdated={onModelUpdated}
                        ></AgGridReact>

                    </div>
                </div>
            </TabPane>
            <TabPane
                tab={<span>Estimate Asset value Mobile Device</span>}
                key="mobile"
            >
                <div className={classes.root}>
                    <div className={'sectionHeader'}>
                        Estimate Asset value Mobile
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
                            // debounceVerticalScrollbar={true}
                            columnDefs={buildColumnDefinitions(columnDefs)}
                            frameworkComponents={frameworkComponents}
                            // suppressDragLeaveHidesColumns={true}
                            onGridReady={onGridReady}
                            rowSelection='multiple'
                            enableCellTextSelection={true}
                            editType='fullRow'
                            overlayLoadingTemplate={rowData.length === 0 ? overlayLoadingTemplate1 : overlayLoadingTemplate}
                            paginationPageSizeSelector={[100, 250, 500, 1000, 2000]}
                            pagination={true}
                            floatingFilter={true}
                            paginationPageSize={pageSize}
                            suppressRowClickSelection={true}
                            alwaysShowVerticalScroll={true}
                            quickFilterText={quickFilterText}
                        // onModelUpdated={onModelUpdated}
                        ></AgGridReact>

                    </div>
                </div>
            </TabPane>
        </Tabs>
    );
};

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Complain);