import jsPDF from "jspdf";
import 'jspdf-autotable';
import logoDark from '../assets/logo_new.png';
import itreon_logo_white from '../assets/itreon_logo_white.png';
import './Montserrat-bold';
import './Montserrat-medium-bold';
import './worksans';
import './kanit_semibold';
import './kani-regular';

import * as moment from 'moment';
import _ from "lodash";
import { APIPREFIX } from './constants';
import { getAccessToken } from '@/utils/authority';

const Capitalize = (str) => {
    return str ? str.toLowerCase().charAt(0).toUpperCase() + str.slice(1) : '';
}

const imageUrl = logoDark;

export const printDocument = async (projdata) => {
    // console.log("projdata",projdata)
    // console.log('Show all font in jsPDF',pdf.getFontList());
    const pdf = new jsPDF('l', 'mm', 'a3')
    pdf.setFillColor(100, 11, 0, 69);

    // Create a new jsPDF instance
    // Set document properties
    pdf.setProperties({
        title: `Product report - ${projdata.id}`
    })
    let partner_logo = projdata?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${projdata.partner.partner_logo.id}?access_token=${getAccessToken()}` : imageUrl;
    // Add images and text to the PDF
    pdf.addImage(`${partner_logo}`, 'PNG', 7, 8, 50, 12);
    pdf.setFont('Kanit-SemiBold', 'bold');
    // Generate the vendor-specific content
    pdf.setFontSize(12);
    pdf.text(`Product Report`, 150, 12);
    pdf.setFontSize(10);
    pdf.setFont('WorkSans-VariableFont_wght', 'bold');
    pdf.text(`Project ID - ${projdata.id}`, 310, 12);
    pdf.text(`Client name - ${projdata?.client?.client_name || ''}`, 310, 17)
    pdf.text(`Partner name -  ${projdata?.partner?.partner_name || ''}`, 310, 22);
    pdf.text(`Client ref -  ${projdata?.client_ref || ''}`, 310, 27);

    // Generate AutoTable for item details
    const itemDetailsRows = projdata.assets?.map((item, index) => [
        Capitalize(item.asset_type),
        item.quantity?.toString(),
        `${item.manufacturer ? Capitalize(item.manufacturer?.toLowerCase()) : ''} ${item.model ? Capitalize(item.model?.toLowerCase()) : ''}`,
        item.serial_number?.toLocaleString(),
        item.grade?.toLocaleString(),
        item.complaint ? item.complaint?.toLocaleString() : item.complaint_from_app?.toLocaleString(),
    ]);
    const itemDetailsHeaders = ['Type', 'QTY', 'Product', 'Serial', 'Grade', 'Complaint'];
    const columnWidths = [50, 15, 70, 60, 30, 'auto']; // Adjust column widths as needed
    // Define table styles
    const headerStyles = {
        fillColor: [240, 240, 240],
        textColor: [0],
        fontFamily: 'Kanit-SemiBold'
    };
    const itemDetailsYStart = 35;

    pdf.setFont('Kanit-SemiBold', 'bold');
    pdf.autoTable({
        head: [itemDetailsHeaders],
        body: itemDetailsRows,
        startY: itemDetailsYStart, // Adjust the Y position as needed    
        // didParseCell: enhanceWordBreak,


        headStyles: {
            fillColor: headerStyles.fillColor,
            textColor: headerStyles.textColor,
            fontStyle: headerStyles.fontStyle,
            fontSize: 12, // Adjust the font size as needed
            font: 'Kanit-SemiBold', // Set the font family
            align: 'left',
        },
        styles: { cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify' },
        columnWidth: 'wrap',

        columnStyles: {
            0: { cellWidth: columnWidths[0] }, // Adjust column widths as needed
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] },
            3: { cellWidth: columnWidths[3] },
            4: { cellWidth: columnWidths[4] },
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        bodyStyles: {
            fontSize: 9, // Adjust the font size for the body
            font: 'WorkSans-VariableFont_wght', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: [0, 0, 0], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { left: 4, right: 4 },
    });
    // Get the number of pages
    const pageCount = pdf.internal.getNumberOfPages();
    // For each page, print the page number and the total pages
    for (var i = 1; i <= pageCount; i++) {
        // Go to page i
        pdf.setPage(i);
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.setFontSize(9);
        pdf.text(`For more information login and download complete report`, 270 - 20, 320 - 30, null, null, "right");
    }
    pdf.save(`Product report - ${projdata.id}`);
    return true

};

export const printFinancialDocument = async (projdata, report) => {

    // let contact_attn_name = projdata.contact_attn ? projdata.contact_attn.first_name : ''
    let client_name = projdata.client ? projdata.client.client_name : ''
    let partner_contact_attn_name = projdata.partner_contact_attn ? projdata.partner_contact_attn.first_name : ''
    let partner_name = projdata.partner ? projdata.partner.partner_name : ''
    let invoice_by_client = projdata.invoice_by_client ? Math.round(projdata.invoice_by_client) : 0;
    let currency = '';
    if (projdata.warehouse === 'SE01' || projdata.warehouse === 'SE02') {
        currency = ' SEK'
    } else if (projdata.warehouse === 'NL01') {
        currency = ' €'
    } else if (projdata.warehouse === 'NO01') {
        currency = ' NOK'
    }
    // let partner_logo = projdata?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${projdata.partner.partner_logo.id}?access_token=${getAccessToken()}` : itreon_logo_white;
    let partner_logo = itreon_logo_white;
    // Sample items data
    const itemsData = [
        { itemName: 'The amount to invoice for this project.', amount: invoice_by_client },
    ];

    // Create a new jsPDF instance
    const pdf = new jsPDF();
    // Set document properties
    pdf.setProperties({
        title: "Financial information"
    })
    // Add summary and page numbers

    let summaryYStart = pdf.internal.pageSize.getHeight() - 130;

    pdf.setFontSize(20);
    // Add images and text to the PDF
    pdf.addImage(`${partner_logo}`, 'PNG', 150, 10, 50, 12);

    pdf.setTextColor('#004750');

    pdf.setFont('Kanit-Regular', 'bold')
    pdf.text(`Financial information - ${client_name ? client_name : ''}`, 6, 34, { lineHeightFactor: 1.5 });


    // // Line width in units (you can adjust this)
    // pdf.setLineWidth(.4);

    // // Line color (RGB)
    // pdf.setDrawColor(220, 220, 220);
    // pdf.line(6, 23, 200, 23)
    // // -------------
    pdf.setFontSize(11);
    pdf.setFont('WorkSans-VariableFont_wght', 'bold')
    pdf.text(moment().format('YYYY-MM-DD'), 6, 42, { lineHeightFactor: 1.5 });

    pdf.text('Project no : ', 6, 48)
    // -------------
    pdf.setFont('WorkSans-VariableFont_wght', 'bold');

    pdf.text(`${projdata.id}`, 30, 48)

    // -------------
    pdf.setFont('WorkSans-VariableFont_wght', 'bold')
    pdf.text('Net 30 payment terms', 6, 54, { lineHeightFactor: 1.5 });
    // -------------
    pdf.setFontSize(14);
    pdf.text('Client', 6, 64)
    // -------------

    pdf.setFont('WorkSans-VariableFont_wght', 'bold')
    pdf.setFontSize(10);

    pdf.text(`${client_name}`, 6, 72)
    // -------------
    pdf.setFontSize(14);
    pdf.text('Partner', 100, 64)
    // -------------
    pdf.setFontSize(10);

    pdf.setFont('WorkSans-VariableFont_wght', 'bold')
    pdf.text(`${partner_name}`, 100, 72)
    pdf.text(`${partner_contact_attn_name}`, 100, 78)

    // Generate AutoTable for item details
    const itemDetailsRows = itemsData?.map((item, index) => [
        (index + 1).toString(),
        item.itemName.toString(),
        item.amount?.toString() + (currency),
    ]);
    const itemDetailsHeaders = ['No', 'INFORMATION', 'AMOUNT'];
    const columnWidths = [15, 150, 35]; // Adjust column widths as needed
    // Define table styles
    const headerStyles = {
        fillColor: ["#004750"],
        textColor: ["#BBC6C3"],
        fontFamily: 'Kanit-SemiBold',
        fontStyle: 'bold',
    };

    pdf.setFont('WorkSans-VariableFont_wght');
    const itemDetailsYStart = 92;
    // console.log([itemDetailsHeaders], "body 11111", itemDetailsRows)

    pdf.autoTable({
        head: [itemDetailsHeaders],
        body: itemDetailsRows,
        startY: itemDetailsYStart, // Adjust the Y position as needed
        // foot: [["", "Total sum", "60"]],
        headStyles: {
            fillColor: headerStyles.fillColor,
            textColor: headerStyles.textColor,
            fontStyle: headerStyles.fontStyle,
            fontSize: 10, // Adjust the font size as needed
            font: 'Kanit-SemiBold', // Set the font family
            halign: 'left',
        },
        columnStyles: {
            0: { cellWidth: columnWidths[0] }, // Adjust column widths as needed
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] }
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        bodyStyles: {
            fontSize: 10, // Adjust the font size for the body
            font: 'WorkSans-VariableFont_wght', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: ['#004750'], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { top: 10, left: 6 },
    });

    pdf.setFontSize(8);
    pdf.setFont('WorkSans-VariableFont_wght', 'bold');
    pdf.text(`On the invoice, refer to the project number above. The invoice should be sent to the email address below.`, 6, summaryYStart - 36, {
        maxWidth: 84,
        align: 'justify'
    });

    pdf.setFontSize(12);
    pdf.setFont('Kanit-Regular', 'bold')

    pdf.text('Total sum', 160, summaryYStart - 34, {
        align: 'right'
    });
    pdf.text(`${invoice_by_client} ${currency}`, 190, summaryYStart - 34, {
        align: 'right'
    });
    //-------------
    pdf.setFont('WorkSans-VariableFont_wght', 'bold');

    pdf.setLineWidth(1);
    pdf.setDrawColor('#e3e3e3');
    pdf.line(6, summaryYStart - 29, 220, summaryYStart - 28)
    // -------------
    pdf.setFontSize(10);
    summaryYStart = summaryYStart + 15
    if (projdata.warehouse === 'SE01' || projdata.warehouse === 'SE02') {
        pdf.text('Invoice to: ', 6, summaryYStart - 32)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');

        pdf.text("Itreon Global Remarketing AB", 67, summaryYStart - 32)
        // -------------
        pdf.text("Gustavlundsvägen 147", 155, summaryYStart - 32)
        //-------------

        pdf.text('Org no / VAT no: ', 6, summaryYStart - 27)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');

        pdf.text("559189-1592 / SE559189159201", 67, summaryYStart - 27)
        // -------------
        pdf.text("167 51  BROMMA", 155, summaryYStart - 27)
        //-------------
        pdf.text('Web: ', 6, summaryYStart - 22)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text("www.itreon.se", 67, summaryYStart - 22)
        // -------------
        pdf.text("Sweden", 155, summaryYStart - 22)
        // -------------
        // pdf.text("167 51  BROMMA", 155, summaryYStart - 17)
        //-------------
        pdf.text('E-mail for invoice: ', 6, summaryYStart - 17)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        // -------------
        pdf.text("gr.invoice@itreon.se", 67, summaryYStart - 17)
        //-------------
        pdf.text('Payment ref: ', 6, summaryYStart - 12)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text(`${projdata.id} ${client_name ? ', ' + client_name : ''}`, 67, summaryYStart - 12)

    } else if (projdata.warehouse === 'NL01') {

        pdf.text('Invoice to: ', 6, summaryYStart - 32)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');

        pdf.text("Itreon B.V", 67, summaryYStart - 32)
        // -------------
        pdf.text("Johan Huizingalaan 763 A", 155, summaryYStart - 32)
        //-------------

        pdf.text('Org no / VAT no: ', 6, summaryYStart - 27)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');

        pdf.text("NL866904335B01", 67, summaryYStart - 27)
        // -------------
        pdf.text("1066VH Amsterdam", 155, summaryYStart - 27)
        //-------------
        pdf.text('Chamber of Commerce: ', 6, summaryYStart - 22)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text("94823715", 67, summaryYStart - 22)
        // -------------
        pdf.text("Netherland", 155, summaryYStart - 22)
        //-------------
        pdf.text('Bank Account: ', 6, summaryYStart - 17)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        // -------------
        pdf.text("NL71 RABO 0386 2724 68", 67, summaryYStart - 17)

        pdf.text('E-mail for invoice: ', 6, summaryYStart - 12)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        // -------------
        pdf.text("Itreon@inkoopfacturen.nl", 67, summaryYStart - 12)
        //-------------
        pdf.text('Payment ref: ', 6, summaryYStart - 7)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text(`${projdata.id} ${client_name ? ', ' + client_name : ''}`, 67, summaryYStart - 7);
    } else if (projdata.warehouse === 'NO01') {

        pdf.text('Invoice to: ', 6, summaryYStart - 32)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');

        pdf.text("Itreon Norway AS", 67, summaryYStart - 32)
        // -------------
        pdf.text("Jens Zetlitz' gate 47", 155, summaryYStart - 32)
        //-------------

        pdf.text('Org no / VAT no: ', 6, summaryYStart - 27)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');

        pdf.text("NL866904335B01", 67, summaryYStart - 27)
        // -------------
        pdf.text("4008 Stavanger", 155, summaryYStart - 27)
        //-------------
        pdf.text('Chamber of Commerce: ', 6, summaryYStart - 22)
        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text("933 838 013", 67, summaryYStart - 22)
        // -------------
        pdf.text("Norway", 155, summaryYStart - 22)
        //-------------
        pdf.text('Bank Account: ', 6, summaryYStart - 17)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        // -------------
        pdf.text("NO4960750592042", 67, summaryYStart - 17)

        pdf.text('E-mail for invoice: ', 6, summaryYStart - 12)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        // -------------
        pdf.text("eirik.paulsen@itreon.no", 67, summaryYStart - 12)
        //-------------
        pdf.text('Payment ref: ', 6, summaryYStart - 7)
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text(`${projdata.id} ${client_name ? ', ' + client_name : ''}`, 67, summaryYStart - 7);
    }


    // -------------
    //-------------
    pdf.setLineWidth(1);
    pdf.setDrawColor('#e3e3e3');
    pdf.line(6, (summaryYStart + 10) - 8, 220, (summaryYStart + 10) - 8)
    // -------------

    let tempval = _.groupBy(projdata.assets, (item) => item.asset_type.trim());
    let groupedArr = []
    //To group by grade and asset type
    _.forEach(tempval, function (value, key) {
        // console.log(key, "valllllllllll", value)
        let val = _(value)
            .groupBy('grade')
            .map(group => ({
                asset_type: group[0]?.asset_type,
                grade: group[0]?.grade,
                "quantity": _.sumBy(group, x => x.sum ? parseFloat(x.quantity) : 0),
            }))
            .value();
        groupedArr.push(val)
        // console.log("ddddddddddddd", dd)
    });
    // console.log("groupedArr", groupedArr)
    // let values = groupBy1(projdata.assets)

    // return

    let body = [];
    var tifOptions = [];
    // console.log("values", values)
    // console.log("groupedArr", groupedArr)
    // console.log("groupedArr",groupedArr)
    groupedArr.forEach(function (key, i) {
        // console.log("keyyyyyyyy", groupedArr[i])
        //  return
        let A_value = (groupedArr[i]?.[0]?.grade === 'A')
        let B_value = (groupedArr[i]?.[0]?.grade === 'B' || groupedArr[i]?.[1]?.grade === 'B')
        let C_value = (groupedArr[i]?.[0]?.grade === 'C' || groupedArr[i]?.[1]?.grade === 'C' || groupedArr[i]?.[2]?.grade === 'C')
        let D_value = (groupedArr[i]?.[0]?.grade === 'D' || groupedArr[i]?.[1]?.grade === 'D' || groupedArr[i]?.[2]?.grade === 'D' || groupedArr[i]?.[3]?.grade === 'D')
        let E_value = (groupedArr[i]?.[0]?.grade === 'E' || groupedArr[i]?.[1]?.grade === 'E' || groupedArr[i]?.[2]?.grade === 'E' || groupedArr[i]?.[3]?.grade === 'E' || groupedArr[i]?.[4]?.grade === 'E')

        //B grade values
        let Bsumvalues0 = groupedArr[i]?.[0] ? (groupedArr[i]?.[0]?.grade === 'B' && Number(groupedArr[i]?.[0]?.quantity)) : 0;
        let Bsumvalues1 = groupedArr[i]?.[1] ? (groupedArr[i]?.[1]?.grade === 'B' && Number(groupedArr[i]?.[1]?.quantity)) : 0;
        let BTotalvalues = Bsumvalues0 + Bsumvalues1;


        //C grade values
        let Csumvalues0 = groupedArr[i]?.[0] ? (groupedArr[i]?.[0]?.grade === 'C' && Number(groupedArr[i]?.[0]?.quantity)) : 0;
        let Csumvalues1 = groupedArr[i]?.[1] ? (groupedArr[i]?.[1]?.grade === 'C' && Number(groupedArr[i]?.[1]?.quantity)) : 0;
        let Csumvalues2 = groupedArr[i]?.[2] ? (groupedArr[i]?.[2]?.grade === 'C' && Number(groupedArr[i]?.[2]?.quantity)) : 0;
        let cTotalvalues = Csumvalues0 + Csumvalues1 + Csumvalues2;

        //D grade values
        let Dsumvalues0 = groupedArr[i]?.[0] ? (groupedArr[i]?.[0]?.grade === 'D' && Number(groupedArr[i]?.[0]?.quantity)) : 0;
        let Dsumvalues1 = groupedArr[i]?.[1] ? (groupedArr[i]?.[1]?.grade === 'D' && Number(groupedArr[i]?.[1]?.quantity)) : 0;
        let Dsumvalues2 = groupedArr[i]?.[2] ? (groupedArr[i]?.[2]?.grade === 'D' && Number(groupedArr[i]?.[2]?.quantity)) : 0;
        let Dsumvalues3 = groupedArr[i]?.[3] ? (groupedArr[i]?.[3]?.grade === 'D' && Number(groupedArr[i]?.[3]?.quantity)) : 0;
        let DTotalvalues = Dsumvalues0 + Dsumvalues1 + Dsumvalues2 + Dsumvalues3;
        //E grade values
        let Esumvalues0 = groupedArr[i]?.[0] ? (groupedArr[i]?.[0]?.grade === 'E' && Number(groupedArr[i]?.[0]?.quantity)) : 0;
        let Esumvalues1 = groupedArr[i]?.[1] ? (groupedArr[i]?.[1]?.grade === 'E' && Number(groupedArr[i]?.[1]?.quantity)) : 0;
        let Esumvalues2 = groupedArr[i]?.[2] ? (groupedArr[i]?.[2]?.grade === 'E' && Number(groupedArr[i]?.[2]?.quantity)) : 0;
        let Esumvalues3 = groupedArr[i]?.[3] ? (groupedArr[i]?.[3]?.grade === 'E' && Number(groupedArr[i]?.[3]?.quantity)) : 0;
        let Esumvalues4 = groupedArr[i]?.[4] ? (groupedArr[i]?.[4]?.grade === 'E' && Number(groupedArr[i]?.[4]?.quantity)) : 0;
        let ETotalvalues = Esumvalues0 + Esumvalues1 + Esumvalues2 + Esumvalues3 + Esumvalues4;

        // console.log("Csumvalues0 ***", groupedArr[i]?.[0])
        // console.log("Csumvalues1", Csumvalues1)
        // console.log("Csumvalues1", Csumvalues1)
        let A = A_value ? Number(groupedArr[i]?.[0].quantity) : 0
        let B = B_value ? BTotalvalues : 0
        let C = C_value ? cTotalvalues : 0
        let D = D_value ? DTotalvalues : 0
        let E = E_value ? ETotalvalues : 0
        tifOptions.push({
            asset_type: groupedArr[i]?.[0].asset_type.trim(),
            A: A,
            B: B,
            C: C,
            D: D,
            E: E,
            total: Number(A) + Number(B) + Number(C) + Number(D) + Number(E)
        });
    });

    const headers = ['Asset type / Qty', 'A', 'B', 'C', 'D', 'E', 'Total'];
    // console.log([headers], "bodyyyyyyyyyyy", body)
    const columnWidths1 = [40, 15, 15, 15, 15, 15, 25]; // Adjust column widths as needed
    // console.log("tifOptions", tifOptions)
    // return
    body = tifOptions.map(o => [o.asset_type, o.A, o.B, o.C, o.D, o.E, o.total])
    // console.log("body", body)
    // return
    pdf.autoTable({
        head: [headers],
        body: body,
        startY: 200, // Adjust the Y position as needed
        // tableWidth: 150,
        // columnWidth: 'wrap',
        // tableLineColor: [189, 195, 199],
        // tableLineWidth: 0.33,
        theme: 'grid',
        // foot: [["",   "0",  "1"]],
        headStyles: {
            fillColor: headerStyles.fillColor,
            textColor: headerStyles.textColor,
            fontStyle: headerStyles.fontStyle,
            fontSize: 12, // Adjust the font size as needed
            font: 'Kanit-SemiBold', // Set the font family
            halign: 'left',
        },
        columnStyles: {
            0: { cellWidth: columnWidths1[0] }, // Adjust column widths as needed
            1: { cellWidth: columnWidths1[1] },
            2: { cellWidth: columnWidths1[2] },
            3: { cellWidth: columnWidths1[3] },
            4: { cellWidth: columnWidths1[4] },
            5: { cellWidth: columnWidths1[5] }
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        bodyStyles: {
            fontSize: 9, // Adjust the font size for the body
            font: 'WorkSans-VariableFont_wght', // Set the font family for the body
            cellPadding: { top: 2, right: 5, bottom: 2, left: 2 }, // Adjust cell padding
            textColor: ['#004750'], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { top: 6, left: 10, right: 10 },
    });
    //page 2
    if (report === 'FT') {
        pdf.addPage();
        pdf.setProperties({
            title: "Financial information"
        })
        // Add summary and page numbers

        pdf.setFontSize(20);
        // Add images and text to the PDF
        pdf.addImage(`${partner_logo}`, 'PNG', 150, 10, 50, 12);

        pdf.setTextColor('#004750');

        pdf.setFont('Kanit-Regular', 'bold')
        pdf.text(`Financial information - ${client_name ? client_name : ''}`, 6, 34, { lineHeightFactor: 1.5 });


        // // Line width in units (you can adjust this)
        // pdf.setLineWidth(.4);

        // // Line color (RGB)
        // pdf.setDrawColor(220, 220, 220);
        // pdf.line(6, 23, 200, 23)
        // // -------------
        pdf.setFontSize(11);
        pdf.setFont('WorkSans-VariableFont_wght', 'bold')
        pdf.text(`${moment().format('YYYY-MM-DD')} | Project no : ${projdata.id}`, 6, 42, { lineHeightFactor: 1.5 });

        // -------------
        pdf.setFont('WorkSans-VariableFont_wght', 'bold');
        pdf.text('Net 30 payment terms', 6, 50, { lineHeightFactor: 1.5 });

        let sales = Math.round(parseFloat(projdata.revenue || 0) - parseFloat(projdata.kickback_revenue || 0));
        let order_revenue = projdata.order_revenue || 0;
        let buyout = projdata.buyout || 0;
        let total_project_value = (sales + order_revenue + buyout) || 0;
        let handling = projdata.handling || 0;
        let logistics = projdata.logistics || 0;
        let software = projdata.software || 0;
        let commision = projdata.commision || 0;
        let other = projdata.other || 0;
        let total_project_cost = Math.round(handling + logistics + software + commision + other)
        //------------------------------------------------
        pdf.text('Project details below', 6, 64)
        pdf.setFont('Kanit-Regular', 'bold')
        pdf.setFontSize(10);

        pdf.text('PROJECT VALUE', 10, 78)

        let headers_fin = [["INFORMATION", "AMOUNT"]];
        let proj_value = [
            [`Total value of sold equipment in project #${projdata.id}`, `${sales}${currency}`],
            ["Reservations total sales value of reserved equipment", `${order_revenue}${currency}`],
            ["Value for unsold equipment based on FMV and competition purchase price", `${buyout}${currency}`],
        ];
        const columnWidths1 = [150, 30]; // Adjust column widths as needed
        pdf.autoTable({
            head: headers_fin,
            body: proj_value,
            startY: 88, // Adjust the Y position as needed
            theme: 'grid',
            // foot: [["",   "0",  "1"]],
            headStyles: {
                fillColor: headerStyles.fillColor,
                textColor: headerStyles.textColor,
                fontStyle: headerStyles.fontStyle,
                fontSize: 12, // Adjust the font size as needed
                font: 'Kanit-SemiBold', // Set the font family
                halign: 'left',
            },
            columnStyles: {
                0: { cellWidth: columnWidths1[0] }, // Adjust column widths as needed
                1: { cellWidth: columnWidths1[1] },
                2: { cellWidth: columnWidths1[2] }
            },
            alternateRowStyles: { fillColor: [255, 255, 255] },
            bodyStyles: {
                fontSize: 10, // Adjust the font size for the body
                font: 'WorkSans-VariableFont_wght', // Set the font family for the body
                cellPadding: { top: 2, right: 5, bottom: 2, left: 2 }, // Adjust cell padding
                textColor: ['#004750'], // Set text color for the body
                rowPageBreak: 'avoid', // Avoid row page breaks
            },
            margin: { top: 6, left: 10, right: 10 },
        });
        pdf.setFont('Kanit-Regular', 'bold')
        pdf.setFontSize(10);
        pdf.text('Total remarketing value', 20, 126)
        pdf.text(`${total_project_value}${currency}`, 160, 126)


        //second table

        pdf.setFont('Kanit-Regular', 'bold')
        pdf.text('PROJECT COSTS', 10, 144)

        let headers_fin1 = [["INFORMATION", "AMOUNT"]];
        let proj_value1 = [
            [`Handling costs; receiving, sorting, recycling, deidentifying, tagging, wiping, test,grading, packing material for sales, storage, sending and administrative costs but also unlocking, reprocessing, handling of dangerous goods and physical destruction of not wiped media`, `${handling}${currency}`],
            ["Logistics costs; freight costs, rent for trolleys, packing material and onsite packing costs", `${logistics}${currency}`],
            ["Software", `${software}${currency}`],
            ["Itreon sales commission", `${commision}${currency}`],
            ["Other costs related to this project", `${other}${currency}`],
        ];
        const columnWidths2 = [150, 30]; // Adjust column widths as needed
        pdf.autoTable({
            head: headers_fin1,
            body: proj_value1,
            startY: 155, // Adjust the Y position as needed
            theme: 'grid',
            // foot: [["",   "0",  "1"]],
            headStyles: {
                fillColor: headerStyles.fillColor,
                textColor: headerStyles.textColor,
                fontStyle: headerStyles.fontStyle,
                fontSize: 12, // Adjust the font size as needed
                font: 'Kanit-SemiBold', // Set the font family
                halign: 'left',
            },
            columnStyles: {
                0: { cellWidth: columnWidths2[0] }, // Adjust column widths as needed
                1: { cellWidth: columnWidths2[1] },
                2: { cellWidth: columnWidths2[2] }
            },
            alternateRowStyles: { fillColor: [255, 255, 255] },
            bodyStyles: {
                fontSize: 10, // Adjust the font size for the body
                font: 'WorkSans-VariableFont_wght', // Set the font family for the body
                cellPadding: { top: 2, right: 5, bottom: 2, left: 2 }, // Adjust cell padding
                textColor: ['#004750'], // Set text color for the body
                rowPageBreak: 'avoid', // Avoid row page breaks
            },
            margin: { top: 6, left: 10, right: 10 },
        });
        pdf.setFont('Kanit-Regular', 'bold')
        pdf.setFontSize(10);
        pdf.text('Total project costs', 20, 225)
        pdf.text(`${total_project_cost}${currency}`, 160, 225)
        //------------------------------------------------
        pdf.setFontSize(14);
    }
    // Save the PDF 
    pdf.save(`Financial information - ${projdata.id}`);
}