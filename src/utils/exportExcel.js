import React from 'react'
import { Button, Tooltip } from 'antd';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { DownloadOutlined } from '@ant-design/icons';
// import { makeStyles, createStyles } from '@material-ui/core/styles';
// const useStyles = makeStyles((theme) =>
// createStyles({
//   even: {
//           background: '#ecf0f1'
//       },
//   bg: {
//       background: '#00a591'
//   },
//   button: {
//       background: '#00a591',
//       color: '#fff',
//       padding: '5px',
//       borderRadius: '8px',
//       marginBottom: '10px'
//   }
// })
// );
const ExportExcel = ({ csvData, fileName }) => {
    // const classes = useStyles();
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'stock': ws }, SheetNames: ['stock'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (

        <Tooltip placement="topLeft" title="Export Asset">
            <Button style={{
                background: '#004750',
                color: '#fff',
                // padding: '5px',
                // borderRadius: '8px',
                // marginBottom: '10px'
            }} variant="warning" onClick={(e) => exportToCSV(csvData, fileName)}><DownloadOutlined /></Button>
        </Tooltip>

    )
}
export default ExportExcel