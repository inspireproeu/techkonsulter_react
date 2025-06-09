import XLSX from 'xlsx';
import moment from "moment";
import * as Excel from "exceljs";

const pickExcelFields = (data, keys) => {
    return Object.keys(data)
        .filter((i) => keys.includes(i))
        .reduce((acc, key) => {
            acc[key] = data[key];
            return acc;
        }, {});
};

function ExcelDateToJSDate(serialDate) {
    var days = Math.floor(serialDate);
    var hours = Math.floor((serialDate % 1) * 24);
    var minutes = Math.floor((((serialDate % 1) * 24) - hours) * 60)
    return new Date(Date.UTC(0, 0, serialDate, hours - 17, minutes));
}

function removeUselessWords(txt) {
    var uselessWordsArray =
        ["project_id.partner.", "project_id.client."];

    var expStr = uselessWordsArray.join("|");
    return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), '')
        .replace(/\s{2,}/g, '');
}
export const generateExcel = (gridApi, fileName, generateData, urlparamsvalue) => {
    let excelColumns = gridApi.columnController
        .getAllDisplayedColumns()
        .map((column) => column.colDef.field);
    let arr = []
    if (fileName === 'Assets') {
        arr = ["project_id.partner.partner_org_no", "project_id.partner.partner_name", "project_id.client.client_name", "project_id.client.client_org_no"];
    }
    if (fileName === 'Projects-finance') {
        arr = ["id"]
    }
    const res = arr.map((el1) => ({
        name: el1,
        match: excelColumns.some((el2) => el2 === el1),
    }))

    let filterCols = res.filter(function (item) {
        return item.match == true;
    }).map(function (obj) {
        return removeUselessWords(obj.name);
    });
    excelColumns = [...filterCols, ...excelColumns, ...arr];
    let currentRowData = [];
    if (generateData.length > 0) {
        currentRowData = generateData;
    } else {
        if (gridApi.getSelectedRows().length === 0) {
            currentRowData = gridApi.rowModel.rowsToDisplay.map((row) => row.data);
        } else {
            currentRowData = gridApi.getSelectedRows().map((row) => row);
        }
    }

    currentRowData.forEach((params) => {
        if (fileName === 'Projects') {
            params.client_org_no = params.client?.client_org_no ? params.client.client_org_no : ''
            params.client_name = params.client?.client_name ? params.client.client_name : ''
            params.partner_org_no = params.partner?.partner_org_no ? params.partner?.partner_org_no : ''
            params.partner_name = params.partner?.partner_name ? params.partner?.partner_name : ''
            params.date_created = params.date_created ? moment(params.date_created).format('YYYY-MM-DD') : '';
            params.user_created = params.user_created ? params.user_created.email : null
            params.remarketing = params?.remarketing + params?.buyout;
            delete params.handling_comments
        }
        if (fileName === 'Projects-finance') {
            params.project_id = params.project_id?.id ? params.project_id?.id : null;
        }
        if (fileName === 'Assets') {
            if (!params.project_id_obj?.id) {
                params.project_id_obj = params.project_id;
            }
            params.project_id = params.project_id?.id ? params.project_id?.id : params.project_id_obj?.id;
            params.client_org_no = params.project_id_obj?.client?.client_org_no ? params.project_id_obj?.client.client_org_no : ''
            params.client_name = params.project_id_obj?.client?.client_name ? params.project_id_obj?.client.client_name : ''
            params.partner_org_no = params.project_id_obj?.partner?.partner_org_no ? params.project_id_obj?.partner?.partner_org_no : ''
            params.partner_name = params.project_id_obj?.partner?.partner_name ? params.project_id_obj?.partner?.partner_name : ''
            params.target_price = params.target_price ? Number(params.target_price) : ''
            params.asset_id = params.asset_id ? Number(params.asset_id) : 0
            params.date_created = params.date_created ? moment(params.date_created).format('YYYY-MM-DD') : '';
            if (moment(ExcelDateToJSDate(params.date_nor)).isValid()) {
                params.date_nor = params?.date_nor ? moment(params?.date_nor).format('YYYY-MM-DD') : "";
            } else {
                params.date_nor = moment(params?.date_nor).format('YYYY-MM-DD')
            }
            params.complaint = params.complaint ? params.complaint : '';
            let complaint_1 = params.complaint_1 ? params.complaint_1 : '';
            params.complaint_1 = complaint_1 ? params.complaint + ";" + complaint_1 : '';
        }
        if (fileName === 'Partnumbers') {
            params.status = params.status && params.status.toLowerCase() === 'published' ? 'Approved' : 'Not approved'
        }

    })
    // console.log("currentRowData", currentRowData)

    let excelData = currentRowData.map((row) =>
        pickExcelFields(row, excelColumns)
    );
    var worksheet = XLSX.utils.json_to_sheet(excelData, {
        header: excelColumns.filter(
            (col) => excelData?.length > 0 ? Object.keys(excelData[0]).indexOf(col) > -1 : excelColumns
        ),
    });

    var new_workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Sheet1');

    XLSX.writeFile(new_workbook, `${fileName} ${urlparamsvalue ? ' - ' + urlparamsvalue : ''}-${moment().format('YY-MM-DD')}.xlsx`, { type: 'file' });
};

export const generateExcelWLogin1 = (gridApi, columns, fileName, field = null) => {
    // let excelColumns = columns
    //     .map((column) => field ? column.field : column.header_name);

    let excelColumns = gridApi.columnController
        .getAllDisplayedColumns()
        .map((column) => column.colDef.field);
    // console.log("gridApi", excelColumns)
    // return

    let currentRowData = []
    if (gridApi.getSelectedRows().length === 0) {
        currentRowData = gridApi.rowModel.rowsToDisplay.map((row) => row.data);
    } else {
        currentRowData = gridApi.getSelectedRows().map((row) => row);
    }
    let excelData = currentRowData.map((row) =>
        pickExcelFields(row, excelColumns)
    );
    var worksheet = XLSX.utils.json_to_sheet(excelData, {
        header: excelColumns.filter(
            (col) => Object.keys(excelData[0]).indexOf(col) > -1
        ),
    });
    var new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Sheet1');
    XLSX.writeFile(new_workbook, fileName, { type: 'file' });
};


export const generateExcelWLogin = (gridApi, columns, fileName, field = null, page) => {
    let excelColumns = columns
        .map((column) => field ? column.field : column.header_name);
    let currentRowData = []

    if (page === 'clientassets') {
        if (gridApi.getSelectedRows().length === 0) {
            currentRowData = gridApi.rowModel.rowsToDisplay.map((row) => row.data);
        } else {
            currentRowData = gridApi.getSelectedRows().map((row) => row);
        }
    } else {
        currentRowData = gridApi
    }
    let excelData = currentRowData.map((row) =>
        pickExcelFields(row, excelColumns)
    );
    var worksheet = XLSX.utils.json_to_sheet(excelData, {
        header: excelColumns.filter(
            (col) => Object.keys(excelData[0]).indexOf(col) > -1
        ),
    });
    // worksheet['A1'].s = {
    //     font: { sz: 1, bold: true, color: '#FF00FF' }
    // };
    var new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Sheet1');
    XLSX.writeFile(new_workbook, fileName, { type: 'file' });
};

export const importdownloadTemplate = (currentRowData, columns, fileName, field = null) => {
    let excelColumns = columns
        .filter((column) => column.field !== 'match' && column.field !== 'id');

    excelColumns = excelColumns
        .map((column) => column.field);
    let excelData = currentRowData.map((row) =>
        pickExcelFields(row, excelColumns)
    );
    var worksheet = XLSX.utils.json_to_sheet(excelData, {
        header: excelColumns.filter(
            (col) => col
        ),
    });
    var new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Sheet1');
    XLSX.writeFile(new_workbook, fileName, { type: 'file' });
};

export const generateExcelNew = (gridApi, fileName, generateData, urlparamsvalue, assetTypeFieldMappingCo2) => {
    let excelColumns = gridApi.columnModel
        .columnDefs
        .map((column) => column.field);


    let arr = []
    if (fileName === 'Assets') {
        arr = ["project_id.partner.partner_org_no", "project_id.warehouse", "user_created.email", "project_id.partner.partner_name", "project_id.client.client_name", "project_id.client.client_org_no", "project_id.warehouse"];
    }
    if (fileName === 'Projects-finance') {
        // arr = ["id"]
    }
    const res = arr.map((el1) => ({
        name: el1,
        match: excelColumns.some((el2) => el2 === el1),
    }))

    let filterCols = res.filter(function (item) {
        return item.match == true;
    }).map(function (obj) {
        return removeUselessWords(obj.name);
    });
    excelColumns = [...filterCols, ...excelColumns, ...arr];
    let currentRowData = [];
    if (generateData.length > 0) {
        currentRowData = generateData;
    } else {
        if (gridApi.getSelectedRows().length === 0) {
            currentRowData = gridApi.rowModel.rowsToDisplay.map((row) => row.data);
        } else {
            currentRowData = gridApi.getSelectedRows().map((row) => row);
        }
    }
    currentRowData.forEach((params) => {
        if (fileName === 'Projects') {
            // params.client_org_no = params.client?.client_org_no ? params.client.client_org_no : ''
            params.client_name = params.client?.client_name ? params.client.client_name : ''
            // params.partner_org_no = params.partner?.partner_org_no ? params.partner?.partner_org_no : ''
            params.partner_name = params.partner?.partner_name ? params.partner?.partner_name : ''
            params.date_created = params.date_created ? moment(params.date_created).format('YYYY-MM-DD') : '';
            params.user_created = params.user_created ? params.user_created.email : null
            params.sales_ref = params.sales_ref ? params.sales_ref.email : '';
            params.remarketing = params?.remarketing;
            params.no_of_assets_1 = params.no_of_assets_1 ? Number(params.no_of_assets_1): 0;
            if (params?.invoice_by_client && params?.invoice_rec_amount) {
                if (params.invoice_rec_amount > 0) {
                    params.difference = parseFloat(params.invoice_by_client) - parseFloat(params.invoice_rec_amount);
                } else {
                    params.difference = null
                }
            }
            delete params.handling_comments
            delete params.client
            delete params.client_org_no
            delete params.partner
            delete params.partner_org_no
            delete params.priority
        }
        if (fileName === 'Projects-finance') {
            params.project_id = params.project_id?.id ? params.project_id?.id : null;
        }
        if (fileName === 'Assets') {
            if (!params.project_id_obj?.id) {
                params.project_id_obj = params.project_id;
            }
            params.project_id = params.project_id?.id ? params.project_id?.id : params.project_id_obj?.id;
            params.warehouse = params.project_id?.warehouse ? params.project_id?.warehouse : params.project_id_obj?.warehouse;
            // params.client_org_no = params.project_id_obj?.client?.client_org_no ? params.project_id_obj?.client.client_org_no : ''
            params.client_name = params.project_id_obj?.client?.client_name ? params.project_id_obj?.client.client_name : ''
            // params.partner_org_no = params.project_id_obj?.partner?.partner_org_no ? params.project_id_obj?.partner?.partner_org_no : ''
            params.partner_name = params.project_id_obj?.partner?.partner_name ? params.project_id_obj?.partner?.partner_name : ''
            params.target_price = params.target_price ? Number(params.target_price) : ''
            params.asset_id = params.asset_id ? Number(params.asset_id) : 0
            params.date_created = params.date_created ? moment(params.date_created).format('YYYY-MM-DD') : '';
            params.created_by = params.user_created ? params.user_created.email : '';
            if (params.asset_type) {
                let form_factor = null
                let asset_type = params?.asset_type ? params.asset_type.trim().toLowerCase() : null;
                if (asset_type) {
                    let currentAssetType = ''
                    if (params.form_factor && (params.form_factor !== '' || params.form_factor !== null)) {
                        form_factor = params.form_factor.trim().toLowerCase()
                        currentAssetType = assetTypeFieldMappingCo2.filter(
                            (asset) => ((asset.Asset_Name.toLowerCase() === asset_type) && asset.formfactor?.trim().toLowerCase() === form_factor)
                        );
                    } else {
                        currentAssetType = assetTypeFieldMappingCo2.filter(
                            (asset) => ((asset.Asset_Name.toLowerCase() === asset_type) && (asset.formfactor === null || asset.formfactor === ''))
                        );
                    }
                    if (currentAssetType?.length > 0) {
                        params.sample_co2 = ((params.quantity || 1) * Number(currentAssetType[0]?.sampleco2)) || '';
                        params.sample_weight = ((params.quantity || 1) * Number(currentAssetType[0]?.sample_weight)).toFixed(1) || '';
                    }
                }
            }
            if (moment(ExcelDateToJSDate(params.date_nor)).isValid()) {
                params.date_nor = params?.date_nor ? moment(params?.date_nor).format('YYYY-MM-DD') : "";
            } else {
                params.date_nor = moment(params?.date_nor).format('YYYY-MM-DD')
            }
            if (params?.complaint_from_app && !params?.complaint) {
                params.complaint = params?.complaint_from_app
            }
            params.complaint = params.complaint ? params.complaint : '';
            let complaint_1 = params.complaint_1 ? params.complaint_1 : '';
            params.complaint_1 = complaint_1 ? params.complaint + ";" + complaint_1 : '';

            //-------------------- excel print
            if (params.Part_No === 'NULL') {
                params.Part_No = ''
            }
            if (params.processor === 'NULL') {
                params.processor = ''
            }
            if (params.model === 'NULL') {
                params.model = ''
            }
            if (params.grade === 'NULL') {
                params.grade = ''
            }
            if (params.complaint_from_app) {
                params.complaint_from_app = params.complaint_from_app.replace(/;/g, " ");
            }
            if (params.complaint) {
                params.complaint = params.complaint.replace(/;/g, " ");
            }
            if (params.asset_type && (params.asset_type.toUpperCase() === 'COMPUTER')) {
                let complaint = params?.complaint ? params.complaint.toLowerCase() : null
                let complaint_1 = params?.complaint_1 ? params.complaint_1.toLowerCase() : null
                if ((complaint && complaint.includes('no ram')) || (complaint_1 && complaint_1.includes('no ram'))) {
                    params.memory = 'N/A'
                }
            }
            if (params.graphic_card && (params.data_generated === 'CERTUS')) {
                var text = params.graphic_card
                var regex = /\[([^\][]*)]/g;
                var results = [], m;
                while (m = regex.exec(text)) {
                    results.push(m[1]);
                }
                params.graphic_card = results.toString();
            }

            if (params.battery && params.complaint && params.form_factor && params.form_factor.toLowerCase() === 'laptop') {
                let temp = params.battery.split(':')
                if (temp[1]?.includes('%')) {
                    temp.forEach((item) => {
                        if (item.includes('%')) {
                            let value = item.split('%')[0] ? Math.round(item.split('%')[0].trim()) : null
                            if (value < 50) {
                                params.battery = "def/low % battery";
                                params.complaint = params.complaint.trim() + " def bat";
                            } else {
                                params.battery = ""
                            }
                        }
                    })
                }

                // console.log("battery", params.battery.split(':'))
            }


            if (params.asset_type && (params.asset_type.toUpperCase() === 'COMPUTER')) {
                let hddtext = ["no hdd", "hdd rem", "hdd crash", "hdd fail"]
                let complaint = params?.complaint ? params.complaint.toLowerCase() : null
                let complaint_1 = params?.complaint_1 ? params.complaint_1.toLowerCase() : null;
                let isComplaintTrue = false;
                let isComplaint_1True = false;
                hddtext.forEach((item) => {
                    if (complaint && complaint.includes(item)) {
                        isComplaintTrue = true;
                    }
                    if (complaint_1 && complaint_1.includes(item)) {
                        isComplaint_1True = true;
                    }
                })
                if (params.hdd && (params.hdd !== 'N/A' && !params.hdd.includes('/') && (isComplaintTrue || isComplaint_1True))) {
                    params.hdd = 'N/A'
                }
                else if (!params.hdd && (isComplaintTrue || isComplaint_1True)) {
                    params.hdd = 'N/A'
                }
            }
            //delete update by and complaint app
            delete params.updated_by
            delete params.complaint_from_app
        }
        //set target price if cost price had value
        if (params.costprice && (!params.target_price || Number(params.target_price) <= 0) && params.status !== 'RESERVATION' && params.status !== 'SOLD') {
            let costprice = params.costprice;
            params.target_price = Math.round(parseInt(costprice) + ((parseInt(costprice) / 100) * 20));
          }
        if (fileName === 'Partnumbers') {
            params.status = params.status && params.status.toLowerCase() === 'published' ? 'Approved' : 'Not approved'
        }
    })
    let excelData = currentRowData.map((row) =>
        pickExcelFields(row, excelColumns)
    );
    var worksheet = XLSX.utils.json_to_sheet(excelData, {
        header: excelColumns.filter(
            (col) => excelData?.length > 0 ? Object.keys(excelData[0]).indexOf(col) > -1 : excelColumns
        ),
    });

    var new_workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Sheet1');

    XLSX.writeFile(new_workbook, `${fileName} ${urlparamsvalue ? ' - ' + urlparamsvalue : ''}-${moment().format('YY-MM-DD')}.xlsx`, { type: 'file' });
};

export const ExcelDownload = async (excelColumnsHeader, currentRowData, fileName) => {
    const wb = new Excel.Workbook()
    const worksheet = wb.addWorksheet(fileName);
    let header = [];
    let headerName = [];
    excelColumnsHeader.map((val) => {
        let width = 16
        if (val) {
            header.push({ key: val, width: width });
            headerName.push(val);

        }
    })
    worksheet.getRow(1).values = headerName;
    worksheet.columns = header // Asign header
    currentRowData.forEach(function (item, index) {
        worksheet.addRow(item)
    })
    wb.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName + `-${moment().format('YY-MM-DD')}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
    });
}