import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
    Button,
    Tooltip
} from 'antd';
import EstimateSettings from '../components/EstimateSettings';
import Editor from 'react-simple-wysiwyg';

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
        '<span class="ag-overlay-loading-center">loading... please wait..</span>';

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
                minWidth: columnDef.width,
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
            "header_name": "Form factor",
            width: 120,
        },
        {
            "field": "manufacturer",
            "header_name": "Manufacturer",
            width: 140,
        },
        {
            "field": "model_cpu",
            "header_name": "Model / CPU",
            width: 350,
        },
        {
            "field": "grade",
            "header_name": "Grade",
            width: 160,
        },
        {
            "field": "last_60_days_sold",
            "header_name": "Estimated value",
            width: 180,
        },
        {
            "field": "last_6months_grade",
            "header_name": "Grade (%)",
            width: 100,
        },
        {
            "field": "last_60_days_qty_sold",
            "header_name": "QTY sold",
            width: 100,
        }
    ]);
    const [gridApi, setGridApi] = useState();
    const [quickFilterText] = useState('');
    const { currentUser } = props;
    const [allColumns, setAllColumns] = useState([]);
    const [openSettings, setOpenSettings] = useState(false);
    const [settingsValues, setsettingsValues] = useState();
    const [projects, setProjects] = useState([]);
    const [currencyCode, setcurrencyCode] = useState('€');

    useEffect(() => {
        if (location && currentUser) {
            let currentpage = location.pathname.split("/");
            if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'estimate_values') {
                history.push({
                    pathname: '/projects'
                });
            }

            if (currentUser.userType !== 'ADMIN') {
                if (currentUser?.client?.country === 'NORWAY' || currentUser?.partner?.country === 'NORWAY') {
                    setcurrencyCode('NOK')
                } else {
                    setcurrencyCode('SEK')
                }
                setColumnDefs(columnDefs.filter(
                    (col) => !(col.field === 'last_6months_grade' || col.field === 'last_60_days_qty_sold')
                ))
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
        if (gridApi && settingsValues) {
            getNewData(gridApi, settingsValues, projects)
        }
    }, [gridApi, settingsValues, projects])

    const fetchTechSettings = () => {
        let queryParams = '?limit=-1&sort=-id&fields=agrade_text,bgrade_text,cgrade_text,text,euro_sek,euro_nok'
        fetchGet(`${DATAURLS.ESTIMATE_VALUES_SETTINGS.url}?${queryParams}`)
            .then((response) => {
                let result = response.data;
                setsettingsValues(result[0])
                // getNewData(gridApi, result[0])

            })
            .catch((err) => {
                setLoading(false);
                throw err;
            });
    }

    const getAssetValues = (val, settings_value) => {
        let grade = ''
        if (val === 'A') {
            grade = 'agrade_text'
        } else if (val === 'B') {
            grade = 'bgrade_text'
        } else if (val === 'C') {
            grade = 'cgrade_text'
        }
        return settings_value[grade]
    }

    const getNewData = async (gridApi, settings_value, projects) => {
        setLoading(true);
        gridApi.showLoadingOverlay();
        let params = `?limit=-1`

        fetchGet(`${DATAURLS.ESTIMATE_VALUES_BY_COMPUTER.url}${params}`, getAccessToken())
            .then((response) => {
                response.data.forEach(async (itm) => {
                    let form_factor = itm.form_factor.toLowerCase();
                    // console.log("itm.grade", itm.grade)
                    let currenyValue = 0
                    if (currencyCode === 'SEK') {
                        currenyValue = Number(settings_value.euro_sek.replace(",", "."))
                    }
                    itm.last_6months_grade = Number(itm.last_6months_grade) ? itm.last_6months_grade : 'N/A'
                    itm.grade = getAssetValues(itm.grade, settings_value)
                    if (itm.mobile_info && (form_factor === 'phone' || form_factor === 'tablet')) {
                        itm.model_cpu = itm.model + ' ' + JSON.parse(itm.mobile_info).toString();
                    } if (itm.computer_info && (form_factor === 'desktop' || form_factor === 'laptop')) {
                        itm.model_cpu = itm.model + ' ' + JSON.parse(itm.computer_info).toString();
                    }
                    if (itm.last_60_days_sold) {
                        let estimate_values = itm.last_60_days_sold;
                        if (currentUser.userType === 'ADMIN') {
                            itm.last_60_days_sold = `${(Math.round(Number(estimate_values) - ((Number(estimate_values) / 100) * 10)))} - ${(Math.round(parseInt(Number(estimate_values)) + parseInt((Number(estimate_values) / 100) * 5)))} ${currencyCode}`;
                        } else {
                            itm.last_60_days_sold = `${Math.round(((Number(estimate_values) - ((Number(estimate_values) / 100) * 10))) * currenyValue)} - ${Math.round(((parseInt(Number(estimate_values)) + parseInt((Number(estimate_values) / 100) * 5))) * currenyValue)} ${currencyCode}`;
                        }

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

    // const getProjectUsers = () => {
    //     let params_1 = `limit=-1&sort=-id`;
    //     let parms = `&filter={"_and":[{"project_id":{"_nnull":true}}]}`
    //     // &filter={"_and":[{"projects_users_id":{"_eq":"bf5b0f79-aa5e-4b67-874e-2177c047189c"}}]}
    //     params_1 = `${params_1}${parms}`;
    //     fetchGet(`${DATAURLS.PROJECTUSERSIDS.url}?${params_1}`, getAccessToken())
    //         .then((response) => {
    //             let projs = [];
    //             if (response && response?.data?.length > 0) {
    //                 projs = response.data.map(
    //                     (obj) => obj.project_id
    //                 );
    //                 setProjects(projs)
    //                 // console.log("projs", projs)
    //                 //getNewData(gridApi,projs)
    //             }
    //         })
    //         .catch((err) => {
    //             throw err;
    //         });
    // }

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
        // getProjectUsers()
        fetchTechSettings()
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

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            // minWidth: 160,
            floatingFilter: true,
        };
    }, []);


    return (
        <div className={classes.root}>
            <div className={'sectionHeader'}>
                TechValuator
                <div className={classes.actionArea}>
                    {
                        currentUser.userType === 'ADMIN' && <Button style={{ verticalAlign: 'bottom', background: 'red', color: 'white' }} onClick={() => setOpenSettings(true)}>
                            <span className="instorage">Settings</span>
                        </Button>
                    }
                </div>
            </div>
            <div style={{ display: 'flex', background: 'white', }}>
                {/* AG Grid */}
                <div
                    className='ag-theme-quartz'
                    style={{
                        width: currentUser.userType === 'ADMIN' ? '98%' : '70%',
                        height: '80vh',
                        boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
                    }}
                >
                    <AgGridReact
                        rowData={rowData}
                        rowBuffer={500}
                        defaultColDef={defaultColDef}
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
                    >
                    </AgGridReact>
                </div>
                {
                    currentUser.userType !== 'ADMIN' && settingsValues?.text ?
                        <div style={{ marginLeft: '30px',marginTop: '10px', background: 'white', width: "30%" }}>
                            <div className="editor-container1">
                                <div>
                                    <div dangerouslySetInnerHTML={{ __html: settingsValues?.text }} />
                                </div>

                                {/* <Editor
                                    value={settingsValues?.text}
                                    style={{ height: '100%' }}
                                /> */}
                            </div>
                        </div> : null
                }
            </div>
            {
                openSettings &&
                <EstimateSettings
                    open={openSettings}
                    setOpen={setOpenSettings}
                />
            }
        </div>
    );
};

export default connect(({ loading, user }) => ({
    currentUser: user.currentUser,
}))(Complain);