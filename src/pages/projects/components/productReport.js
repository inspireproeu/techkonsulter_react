import React from 'react';
import { Link, connect, history } from 'umi';
import { Spin, Row, Col, Grid, Typography, Image, Divider } from 'antd';
import { Pie, Column, G2, Bar } from '@ant-design/plots';
import logoDark from '../../../assets/logo_dark.png';
import * as moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


class ComponentToPrint extends React.Component {
    constructor(props) {
        super(props);

    }

    render(props) {
        const { projectdata } = this.props;
        // console.log("equipemetCategory", equipemetCategory)
        return (
            <div className="prod-report" style={{ width: "100%", margin: "0 auto" }}>
                <Row>
                    <Col lg={4} sm={4} style={{ paddingTop: 10 }}>
                        <div style={{ textAlign: "center" }}>
                            <Image preview={false} src={logoDark} alt="logo" width={60} />
                        </div>
                    </Col>
                    <Col lg={12} sm={12} style={{ paddingTop: 30 }}>
                        <div className="proj-container">
                            {/* <div>
                                <h2 className="project-title" id="HEADING">{projectdata?.data?.project_name ? `${projectdata?.data?.project_name} - ` : ''} {projectdata?.data?.id ? projectdata?.data.id : ''}</h2>
                            </div> */}
                            <div className="rrPHl hirPY">
                                <div className="gZwVG S4 H3 f u ERCyA">
                                    <span className="project-title"></span>
                                    <span className="oAPmj _S YUQUy PTrfg">
                                        <span className="fHvkI PTrfg">{projectdata?.data?.id ? projectdata?.data.id : ''}</span>
                                    </span>
                                </div>
                            </div>
                            {
                                projectdata?.data?.partner && <div className="rrPHl hirPY">
                                    <div className="gZwVG S4 H3 f u ERCyA">
                                        <span className="partner-title"></span>
                                        <span className="oAPmj _S YUQUy PTrfg">
                                            <span className="fHvkI PTrfg">{projectdata?.data?.partner?.partner_name}</span>
                                        </span>
                                    </div>
                                </div>
                            }
                            {
                                projectdata?.data?.client && <div className="rrPHl hirPY">
                                    <div className="gZwVG S4 H3 f u ERCyA">
                                        <span className="client-title"></span>
                                        <span className="oAPmj _S YUQUy PTrfg">
                                            <span className="fHvkI PTrfg">{projectdata?.data?.client?.client_name}</span>
                                        </span>
                                    </div>
                                </div>
                            }

                        </div>
                    </Col>
                </Row>



                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Asset</TableCell>
                                <TableCell align="left">Type</TableCell>
                                <TableCell align="left">Quantity</TableCell>
                                <TableCell align="left">Product</TableCell>
                                <TableCell align="left">Serial</TableCell>
                                <TableCell align="left">Spec</TableCell>
                                <TableCell align="left">Grade</TableCell>
                                <TableCell align="left">Complaint</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projectdata?.data?.assets?.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.asset_id}
                                    </TableCell>
                                    <TableCell align="left">{row.asset_type}</TableCell>
                                    <TableCell align="left">{row.quantity}</TableCell>
                                    <TableCell align="left">{row.manufacturer} {row.model}</TableCell>
                                    <TableCell align="left">{row.serial_number}</TableCell>
                                    <TableCell align="left">{row.processor} {row.memory} {row.hdd}</TableCell>
                                    <TableCell align="left">{row.grade}</TableCell>
                                    <TableCell align="left">{row.complaint}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>);
    }
}

export default connect(({ user, loading }) => ({
    currentUser: user.currentUser,
    loading: loading.models.user,
}))(ComponentToPrint);
