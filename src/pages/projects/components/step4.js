import React from 'react';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import { Form, Row, Col } from 'antd';
import ListSubheader from '@mui/material/ListSubheader';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import _ from "underscore"

export default function Step1({
    usersList,
    checked,
    setChecked,
    setTKTriggerChecked,
    tKTriggerChecked,
    setProductReportChecked,
    productReportChecked,
    setFinancialReportChecked,
    financialReportChecked,
    setEnvReportChecked,
    envReportChecked,
}) {
    const handleToggle = (id, type) => () => {
        let currentIndex = '';
        let newChecked = []
        if (type === 'access') {
            currentIndex = checked.indexOf(id);
            newChecked = [...checked];
            if (currentIndex === -1) {
                newChecked.push(id);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked(newChecked);
        }
        if (type === 'fin') {
            currentIndex = financialReportChecked.indexOf(id);
            newChecked = [...financialReportChecked];
            if (currentIndex === -1) {
                newChecked.push(id);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setFinancialReportChecked(newChecked);
        }
        if (type === 'prod') {
            currentIndex = productReportChecked.indexOf(id);
            newChecked = [...productReportChecked];
            if (currentIndex === -1) {
                newChecked.push(id);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setProductReportChecked(newChecked);
        }
        if (type === 'tk') {
            currentIndex = tKTriggerChecked.indexOf(id);
            newChecked = [...tKTriggerChecked];
            if (currentIndex === -1) {
                newChecked.push(id);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setTKTriggerChecked(newChecked);
        }

        if (type === 'env') {
            currentIndex = envReportChecked.indexOf(id);
            newChecked = [...envReportChecked];
            if (currentIndex === -1) {
                newChecked.push(id);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setEnvReportChecked(newChecked);
        }

    };

    //  console.log("tKTriggerChecked", tKTriggerChecked)
    return (
        // <Card sx={{ minWidth: 275 }}>
        //     <CardContent>

        <div className={'inputGroup'}>
            {(
                <div>
                                                                <Row gutter={16} className="user-list">
                        <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                Env report
                            </Col>
                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                Finanical report
                            </Col>
                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                Product report
                            </Col>
                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                {'TK trigger'}
                            </Col>
                            <Col className="gutter-row" xl={4} lg={4} md={12} sm={12} xs={4}>
                                Access
                            </Col>
                        </Row>
                    <List
                        // subheader={
                        //     <ListSubheader component="div" id="nested-list-subheader">
                        //         Access 
                        //     </ListSubheader>
                        // }
                        sx={{
                            width: '100%',
                            maxHeight: 360,
                            bgcolor: 'background.paper',
                            overflowY: 'scroll',
                        }}
                    >
                        {usersList?.length > 0 ?
                            usersList.map((value, index) => {
                                const labelId = `${value.id}`;
                                let chkd = false
                                return (
                                    <>
                                        <Row gutter={16} className="user-list" >
                                        <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                                <Checkbox
                                                    edge="start"
                                                    onClick={handleToggle(value.id, 'env')}
                                                    checked={envReportChecked?.length > 0 ? envReportChecked.indexOf(value.id) !== -1 : chkd}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </Col>
                                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                                <Checkbox
                                                    edge="start"
                                                    onClick={handleToggle(value.id, 'fin')}
                                                    checked={financialReportChecked?.length > 0 ? financialReportChecked.indexOf(value.id) !== -1 : chkd}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </Col>
                                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                                <Checkbox
                                                    edge="start"
                                                    onClick={handleToggle(value.id, 'prod')}
                                                    checked={productReportChecked?.length > 0 ? productReportChecked.indexOf(value.id) !== -1 : chkd}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </Col>
                                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2}>
                                                <Checkbox
                                                    edge="start"
                                                    onClick={handleToggle(value.id, 'tk')}
                                                    checked={tKTriggerChecked?.length > 0 ? tKTriggerChecked.indexOf(value.id) !== -1 : chkd}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </Col>
                                            <Col className="gutter-row" xl={2} lg={2} md={12} sm={12} xs={2} onClick={handleToggle(value.id, 'access')}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked?.length > 0 ? checked.indexOf(value.id) !== -1 : chkd}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </Col>
                                            <Col className="gutter-row" xl={4} lg={4} md={12} sm={12} xs={4} onClick={handleToggle(value.id, 'access')}>
                                                <div className="list-name">{value.first_name ? value.first_name : '' + " " + value.last_name ? value.last_name : ''}</div>
                                            </Col>
                                            <Col className="gutter-row" xl={4} lg={4} md={12} sm={12} xs={4} onClick={handleToggle(value.id, 'access')}>
                                                <div className="list-name">{value.role?.description}</div>
                                            </Col>
                                            <Col className="gutter-row" xl={4} lg={4} md={12} sm={12} xs={4} onClick={handleToggle(value.id, 'access')}>
                                                <div className="list-name">{value.email}</div>
                                            </Col>
                                        </Row>
                                    </>
                                );
                            })
                            :
                            <div className="no-records"><span><h2>No records found.</h2></span></div>

                        }
                    </List>
                </div>
            )}

        </div>
        //     </CardContent>
        // </Card>

    )
}