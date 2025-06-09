import jsPDF from "jspdf";
import 'jspdf-autotable';
import logoDark from '../assets/logo_dark.png';
import './Montserrat-bold';
import './Montserrat-medium-bold';
import './Montserrat-bold';
import * as moment from 'moment';
import _ from "lodash";
import { APIPREFIX } from './constants';
import { getAccessToken } from '@/utils/authority';

const Capitalize = (str) => {
    return str ? str.toLowerCase().charAt(0).toUpperCase() + str.slice(1) : '';
}

const imageUrl = logoDark;

export const printFinancialDocument = async (projdata) => {

    // console.log("projdata", projdata)
    let contact_attn_name = projdata.contact_attn ? projdata.contact_attn.first_name : ''
    let client_name = projdata.client ? projdata.client.client_name : ''
    let partner_contact_attn_name = projdata.partner_contact_attn ? projdata.partner_contact_attn.first_name : ''
    let partner_name = projdata.partner ? projdata.partner.partner_name : ''
    let invoice_by_client = projdata.invoice_by_client;
    let partner_logo = projdata?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${projdata.partner.partner_logo.id}?access_token=${getAccessToken()}` : imageUrl;
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
    pdf.setFontSize(13);

    pdf.setFont('Montserrat-Medium', 'bold')
    pdf.text(`Financial information - ${projdata.id} ${client_name ? ', ' + client_name : ''}`, 6, 19, { lineHeightFactor: 1.5 });

    // Add images and text to the PDF
    pdf.addImage(partner_logo, 'PNG', 186, 4, 18, 18);

    // // Line width in units (you can adjust this)
    pdf.setLineWidth(.4);

    // Line color (RGB)
    pdf.setDrawColor(220, 220, 220);
    pdf.line(6, 23, 200, 23)
    // -------------
    pdf.setFontSize(8);
    pdf.setFont('Montserrat-Medium', 'bold')
    pdf.text(moment().format('YYYY-MM-DD'), 6, 28, { lineHeightFactor: 1.5 });
    pdf.setLineWidth(0.4);
    pdf.setDrawColor('#e3e3e3');
    pdf.line(6, 30, 160, 30)
    // -------------
    pdf.setFont('Montserrat-Medium', 'bold')
    pdf.text('Net 30 payment terms', 6, 36, { lineHeightFactor: 1.5 });
    // -------------

    pdf.setLineWidth(0.4);
    pdf.setDrawColor('#e3e3e3');
    pdf.line(6, 39, 200, 39)
    // -------------

    pdf.setFontSize(10);
    pdf.setFont('Montserrat-Bold', 'bold')
    pdf.text('Client', 6, 44)
    // -------------

    pdf.setFont('Montserrat-Medium', 'bold')
    pdf.setFontSize(8);

    pdf.text(`${client_name}`, 6, 50)
    pdf.text(`${contact_attn_name}`, 6, 55)
    // -------------

    pdf.setFontSize(10);
    pdf.setFont('Montserrat-Bold', 'bold')
    pdf.text('Partner', 100, 44)
    // -------------

    pdf.setFont('Montserrat-Medium', 'bold')
    pdf.setFontSize(8);
    pdf.text(`${partner_name}`, 100, 50)
    pdf.text(`${partner_contact_attn_name}`, 100, 55)

    // Generate AutoTable for item details
    const itemDetailsRows = itemsData?.map((item, index) => [
        (index + 1).toString(),
        item.itemName.toString(),
        item.amount?.toString(),
    ]);
    const itemDetailsHeaders = ['No', 'INFORMATION', 'AMOUNT'];
    const columnWidths = [15, 150, 35]; // Adjust column widths as needed
    // Define table styles
    const headerStyles = {
        fillColor: [240, 240, 240],
        textColor: [0],
        fontFamily: 'Montserrat-Medium',
        fontStyle: 'bold',
    };

    pdf.setFont('Montserrat-Medium');
    const itemDetailsYStart = 64;
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
            font: 'Montserrat-Medium', // Set the font family
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
            font: 'Montserrat-Medium', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: [0, 0, 0], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { top: 10, left: 6 },
    });

    // Add summary and page numbers
    let summaryYStart = pdf.internal.pageSize.getHeight() - 130;
    pdf.setFontSize(8);
    pdf.setFont('Montserrat-Medium', 'bold');
    pdf.text(`On the invoice, refer to the project number above. The invoice should be sent to the email address below.`, 6, summaryYStart - 47, {
        maxWidth: 110,
        align: 'justify'
    });

    pdf.setFontSize(10);
    pdf.text('Total sum', 170, summaryYStart - 40, {
        align: 'right'
    });
    pdf.setFontSize(10);
    pdf.text(`${invoice_by_client}`, 190, summaryYStart - 40, {
        align: 'right'
    });
    //-------------
    pdf.setLineWidth(0.4);
    pdf.setDrawColor('#e3e3e3');
    pdf.line(6, summaryYStart - 37, 220, summaryYStart - 37)
    // -------------
    summaryYStart = summaryYStart + 3
    pdf.setFontSize(9);
    pdf.setFont('Montserrat-Medium', 'bold')
    pdf.text('Invoice to: ', 6, summaryYStart - 32)
    // -------------
    pdf.text("Tech Konsulter AB", 67, summaryYStart - 32)
    // -------------
    pdf.text("Gustavlundsvägen 147", 155, summaryYStart - 32)
    //-------------
    pdf.text('Org no / VAT no: ', 6, summaryYStart - 27)
    // -------------
    pdf.text("559189-1592 / SE559189159201", 67, summaryYStart - 27)
    // -------------
    pdf.text("167 51  BROMMA", 155, summaryYStart - 27)
    //-------------
    pdf.text('Web: ', 6, summaryYStart - 22)
    // -------------
    pdf.text("www.techkonsulter.se", 67, summaryYStart - 22)
    // -------------
    pdf.text("Sweden", 155, summaryYStart - 22)
    // -------------
    // pdf.text("167 51  BROMMA", 155, summaryYStart - 17)
    //-------------
    pdf.text('E-mail for invoice: ', 6, summaryYStart - 17)
    // -------------
    pdf.text("inbox.lev.974192@arkivplats.se", 67, summaryYStart - 17)
    //-------------
    pdf.text('Payment ref: ', 6, summaryYStart - 12)
    // -------------
    pdf.text(`${projdata.id} ${client_name ? ', ' + client_name : ''}`, 67, summaryYStart - 12)
    //-------------
    pdf.setLineWidth(0.4);
    pdf.setDrawColor('#e3e3e3');
    pdf.line(6, summaryYStart - 8, 220, summaryYStart - 8)
    // -------------
    //-- Deviation list
    //    console.log("deviation",deviation)
    // let val = [];

    // const valuess = []
    //     valuess = projdata.assets.reduce((catsSoFar, { asset_type, sum }) => {
    //     if (!catsSoFar[asset_type]) catsSoFar[asset_type] = [];
    //     catsSoFar[asset_type].push(grade);
    //     return catsSoFar;
    //   }, {});
    // console.log("pvaluess", valuess)
    // function groupBy1(items) {
    //     return items.reduce((acc, curr) => {
    //         // console.log("curr",curr)
    //         // console.log("accccc",acc)
    //         if (curr.asset_type) {
    //             const { asset_type } = curr;
    //             const currentItems = acc[asset_type];
    //             // console.log(curr, "currentItems", currentItems)
    //             return {
    //                 ...acc,
    //                 [asset_type]: currentItems ? [...currentItems, curr] : [curr]
    //             };
    //         }
    //         return acc;
    //     }, {});
    // }
    /// or 
    // const groupByCategory = projdata.assets.reduce((group, product) => {
    //     const { asset_type } = product;
    //     group[asset_type] = group[asset_type] ?? [];
    //     group[asset_type].push(product);
    //     // console.log("group[asset_type]",group[asset_type])

    //     return group;
    // }, {});
    let tempval = _.groupBy(projdata.assets, (item) => item.asset_type);
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
    console.log("groupedArr", groupedArr)

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
            asset_type: groupedArr[i]?.[0].asset_type,
            A: A,
            B: B,
            C: C,
            D: D,
            E: E,
            total: Number(A) + Number(B) + Number(C) + Number(D) + Number(E)
        });
    });

    // Object.keys(groupedArr).forEach(function (key, i) {
    //     // console.log("keyyyyyyyy", Number(values[key][0]?.sum?.quantity))
    //     let A_value = (values[key][0]?.grade === 'A')
    //     let B_value = (values[key][0]?.grade === 'B' || values[key][1]?.grade === 'B')
    //     let C_value = (values[key][0]?.grade === 'C' || values[key][1]?.grade === 'C' || values[key][2]?.grade === 'C')
    //     let D_value = (values[key][0]?.grade === 'D' || values[key][1]?.grade === 'D' || values[key][2]?.grade === 'D' || values[key][3]?.grade === 'D')
    //     let E_value = (values[key][0]?.grade === 'E' || values[key][1]?.grade === 'E' || values[key][2]?.grade === 'E' || values[key][3]?.grade === 'E' || values[key][4]?.grade === 'E')

    //     //B grade values
    //     let Bsumvalues0 = values[key][0] ? (values[key][0]?.grade === 'B' && Number(values[key][0]?.quantity)) : 0;
    //     let Bsumvalues1 = values[key][1] ? (values[key][1]?.grade === 'B' && Number(values[key][1]?.quantity)) : 0;
    //     let BTotalvalues = Bsumvalues0 + Bsumvalues1;


    //     //C grade values
    //     let Csumvalues0 = values[key][0] ? (values[key][0]?.grade === 'C' && Number(values[key][0]?.quantity)) : 0;
    //     let Csumvalues1 = values[key][1] ? (values[key][1]?.grade === 'C' && Number(values[key][1]?.quantity)) : 0;
    //     let Csumvalues2 = values[key][2] ? (values[key][2]?.grade === 'C' && Number(values[key][2]?.quantity)) : 0;
    //     let cTotalvalues = Csumvalues0 + Csumvalues1 + Csumvalues2;

    //     //D grade values
    //     let Dsumvalues0 = values[key][0] ? (values[key][0]?.grade === 'D' && Number(values[key][0]?.quantity)) : 0;
    //     let Dsumvalues1 = values[key][1] ? (values[key][1]?.grade === 'D' && Number(values[key][1]?.quantity)) : 0;
    //     let Dsumvalues2 = values[key][2] ? (values[key][2]?.grade === 'D' && Number(values[key][2]?.quantity)) : 0;
    //     let Dsumvalues3 = values[key][3] ? (values[key][3]?.grade === 'D' && Number(values[key][3]?.quantity)) : 0;
    //     let DTotalvalues = Dsumvalues0 + Dsumvalues1 + Dsumvalues2 + Dsumvalues3;
    //     //E grade values
    //     let Esumvalues0 = values[key][0] ? (values[key][0]?.grade === 'E' && Number(values[key][0]?.quantity)) : 0;
    //     let Esumvalues1 = values[key][1] ? (values[key][1]?.grade === 'E' && Number(values[key][1]?.quantity)) : 0;
    //     let Esumvalues2 = values[key][2] ? (values[key][2]?.grade === 'E' && Number(values[key][2]?.quantity)) : 0;
    //     let Esumvalues3 = values[key][3] ? (values[key][3]?.grade === 'E' && Number(values[key][3]?.quantity)) : 0;
    //     let Esumvalues4 = values[key][4] ? (values[key][4]?.grade === 'E' && Number(values[key][4]?.quantity)) : 0;
    //     let ETotalvalues = Esumvalues0 + Esumvalues1 + Esumvalues2 + Esumvalues3 + Esumvalues4;

    //     // console.log("Csumvalues0 ***", values[key][0])
    //     // console.log("Csumvalues1", Csumvalues1)
    //     // console.log("Csumvalues1", Csumvalues1)
    //     let A = A_value ? Number(values[key][0].quantity) : 0
    //     let B = B_value ? BTotalvalues : 0
    //     let C = C_value ? cTotalvalues : 0
    //     let D = D_value ? DTotalvalues : 0
    //     let E = E_value ? ETotalvalues : 0
    //     tifOptions.push({
    //         asset_type: key,
    //         A: A,
    //         B: B,
    //         C: C,
    //         D: D,
    //         E: E,
    //         total: Number(A) + Number(B) + Number(C) + Number(D) + Number(E)
    //     });
    // });
    const headers = ['Asset type / Qty', 'A', 'B', 'C', 'D', 'E', 'Total'];
    // console.log([headers], "bodyyyyyyyyyyy", body)
    const columnWidths1 = [40, 15, 15, 15, 15, 15, 25]; // Adjust column widths as needed
    // console.log("tifOptions", tifOptions)
    // return
    body = tifOptions.map(o => [o.asset_type, o.A, o.B, o.C, o.D, o.E, o.total])
    pdf.autoTable({
        head: [headers],
        body: body,
        startY: 170, // Adjust the Y position as needed
        // tableWidth: 150,
        // columnWidth: 'wrap',
        // tableLineColor: [189, 195, 199],
        // tableLineWidth: 0.33,
        theme: 'grid',
        // foot: [["", "1", "1", "0", "1", "1"]],
        headStyles: {
            fillColor: headerStyles.fillColor,
            textColor: headerStyles.textColor,
            fontStyle: headerStyles.fontStyle,
            fontSize: 10, // Adjust the font size as needed
            font: 'Montserrat-Medium', // Set the font family
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
            fontSize: 8, // Adjust the font size for the body
            font: 'Montserrat-Medium', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: [0, 0, 0], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { top: 6, left: 70, right: 6 },
    });

    // Save the PDF 
    pdf.save(`Financial information - ${projdata.id}`);

    // // pdf open in a new tab
    // const pdfDataUri = pdf.output('datauristring');
    // const newTab = window.open();
    // newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
}

export const printDocument = async (projdata) => {
    // console.log("projdata",projdata)
    // console.log('Show all font in jsPDF',pdf.getFontList());
    const pdf = new jsPDF('l', 'mm', 'a3')

    // Create a new jsPDF instance
    // Set document properties
    pdf.setProperties({
        title: `Product report - ${projdata.id}`
    })
    let partner_logo = projdata?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${projdata.partner.partner_logo.id}?access_token=${getAccessToken()}` : imageUrl;
    // Add images and text to the PDF
    pdf.addImage(`${partner_logo}`, 'PNG', 5, 8, 14, 14);
    pdf.setFont('Montserrat-Medium', 'bold');
    // Generate the vendor-specific content
    pdf.setFontSize(12);
    pdf.text(`Product Report`, 150, 12);
    pdf.setFontSize(10);
    pdf.setFont('Montserrat-Medium');
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
        item.complaint?.toLocaleString(),
    ]);
    const itemDetailsHeaders = ['Type', 'QTY', 'Product', 'Serial', 'Grade', 'Complaint'];
    const columnWidths = [50, 15, 70, 60, 30, 'auto']; // Adjust column widths as needed
    // Define table styles
    const headerStyles = {
        fillColor: [240, 240, 240],
        textColor: [0],
        fontFamily: 'Montserrat-Medium'
    };
    const itemDetailsYStart = 35;

    pdf.setFont('Montserrat-Medium');
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
            font: 'Montserrat-Medium', // Set the font family
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
            font: 'Montserrat-Medium', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: [0, 0, 0], // Set text color for the body
            // rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { left: 4, right: 4 },
    });
    // Get the number of pages
    const pageCount = pdf.internal.getNumberOfPages();
    // For each page, print the page number and the total pages
    for (var i = 1; i <= pageCount; i++) {
        // Go to page i
        pdf.setPage(i);
        pdf.setFont('Montserrat-Medium', 'bold');
        pdf.setFontSize(9);
        pdf.text(`For more information login and download complete report`, 270 - 20, 320 - 30, null, null, "right");
    }
    pdf.save(`Product report - ${projdata.id}`);
    return true

};