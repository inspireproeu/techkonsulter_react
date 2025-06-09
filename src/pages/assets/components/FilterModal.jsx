import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState, useEffect, useRef } from 'react';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import {
    Tooltip
} from 'antd';
import Button from '@material-ui/core/Button';
import {
    CloseSquareOutlined
} from '@ant-design/icons';

const useStyles = makeStyles((theme) =>
    createStyles({
        dialogTitle: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '40px',
            background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
            boxShadow: '1px 1px 3px #8e9eab',
        },
        dialogRoot: {
            width: '42% !important',
            height: '35%',
            //   display: 'flex',
            //   flexDirection: 'column',
        },
        stepsText: {
            marginTop: '15px',
            // fontFamily: 'Poppins',
            fontSize: '20px',
        },
        successArea: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        stepsTextError: {
            marginTop: '15px',
            // fontFamily: 'Poppins',
            fontSize: '20px',
            color: 'red',
            textAlign: 'center',
        },
        dialogTitleText: {
            // fontFamily: "'Poppins'",
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.85rem',
        },
        dialogContent: {
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '50%',
            marginBottom: '15px',
            marginRight: '15px',
        },
        button: {
            marginLeft: '15px',
        },
        buttonProgress: { marginLeft: '5px' },
        formControl: {
            width: '70%',
            marginBottom: '15px',
        },
        inputGroup: {
            width: '100%',
            // display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            textAlign: 'center'
        },
        inputControl: { fontSize: '1rem' },
    })
);

const AddNew = ({
    open,
    setOpen,
    setTempColumnDefs,
    values,
    filterModalField,
    setFilterModalField,
    handleKeyPressFilter,
    setFilterValues,
}) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState([])
    const [filterColumns, setFilterColumns] = useState([]);

    useEffect(() => {
        if (open && values) {
            setFilterColumns(values)
        }
    }, [open, values])

    const removeFilter = (index) => {
        let data = [...values];
        data[index]['values'] = '';
        setFilterColumns(data)
        // setTempColumnDefs(data);
    };
    useEffect(() => {
        if (filterColumns && filterColumns.length > 0) {

            let filters = [];
            let filterVal = {};
            (filterColumns).map((item) => {
                // {"_and":[{"asset_type":{"_contains":"COMPUTER"}},{"manufacturer":{"_contains":"HP"}}]}
                if (item.placeholder !== 'Actions' && item.values) {
                    let obj = {};
                    let obj1 = {};
                    if ((item.key || item.field) === "project_id.client.client_name") {
                        obj = {
                            "project_id": {
                                "client": {
                                    "client_name": {
                                        [item.operator]: item.values
                                    }
                                }
                            }
                        }
                    } else if ((item.key || item.field) === "project_id.client.client_org_no") {
                        obj = {
                            "project_id": {
                                "client": {
                                    "client_org_no": {
                                        [item.operator]: item.values
                                    }
                                }
                            }
                        }
                    } else if ((item.key || item.field) === "project_id.partner.partner_name") {
                        obj = {
                            "project_id": {
                                "partner": {
                                    "partner_name": {
                                        [item.operator]: item.values
                                    }
                                }
                            }
                        }
                    } else if ((item.key || item.field) === "project_id.partner.partner_org_no") {
                        obj = {
                            "project_id": {
                                "partner": {
                                    "partner_org_no": {
                                        [item.operator]: item.values
                                    }
                                }
                            }
                        }
                    } else {
                        let comma = ''
                        if (item.operator === '_eq') {
                            if (item.fromdate) {
                                item.values = item.fromdate
                            }
                            if (item.key === 'asset_id' || item.key === 'project_id') {
                                if ((item.values.indexOf(' ') > -1) || (item.values.indexOf(',') > -1)) {
                                    comma = item.values.split(' ') || item.values.split(',')
                                }
                            } else {
                                if (item.values.indexOf(',') > -1) {
                                    comma = item.values.split(',')
                                }
                            }
                            if (comma?.length > 0) {
                                obj = {
                                    [(item.key || item.field)]: {
                                        ['_in']: comma.toString()
                                    }
                                }
                            } else {
                                obj = {
                                    [(item.key || item.field)]: {
                                        [item.operator]: item.values
                                    }
                                }
                            }

                        } else if (item.isSpaceSeperate && (item.operator === '_in' || item.operator === '_nin')) {
                            if (item.values.indexOf(' ') > -1) {
                                comma = item.values.split(' ')
                            }
                            if (comma?.length > 0) {
                                obj = {
                                    [(item.key || item.field)]: {
                                        ['_in']: comma.toString()
                                    }
                                }
                            } else {
                                obj = {
                                    [(item.key || item.field)]: {
                                        [item.operator]: item.values
                                    }
                                }
                            }

                        } else if (item.operator === '_between' || item.operator === '_nbetween') {
                            if (item.fromdate && !item.todate) {
                                item.values = item.fromdate
                            }
                            if (item.fromdate && item.todate) {
                                let dates = [];
                                dates.push(item.fromdate, item.todate)
                                item.values = dates.toString()
                            }
                            if (item.values.indexOf(',') > -1) {
                                comma = item.values.split(',')
                            }
                            if (comma?.length > 0) {
                                obj = {
                                    [(item.key || item.field)]: {
                                        [item.operator]: comma.toString()
                                    }
                                }
                            } else {
                                obj = {
                                    [(item.key || item.field)]: {
                                        [item.operator]: item.values
                                    }
                                }
                            }

                        } else if (item.operator === '_empty' || item.operator === '_null') {
                            obj = {

                                [(item.key || item.field)]: {
                                    ['_null']: true
                                }
                            }
                            obj1 = {
                                [(item.key || item.field)]: {
                                    ['_empty']: true
                                }
                            }
                        } else {
                            if (item.key === 'asset_type' && item.values) {
                                item.values = item.values.replace("&", "%26")
                              }
                            obj = {
                                [(item.key || item.field)]: {
                                    [item.operator]: item.values
                                }
                            }
                        }
                    }
                    filters.push(obj)
                }
                if (filters?.length > 0) {
                    filterVal["_and"] = filters
                }
                setFilterValues(filterVal);
            })
        }
    }, [filterColumns])

    const handleChange = (index, event) => {
        let data = [...values];
        let name = event.target.name;
        let vals = event.target.value;
        let dates = []
        // console.log("nameee", name);
        if (name === 'fromdate' || name === 'todate') {
            dates.push(vals)
            setDate(dates)
            // console.log(values, "dates", dates);
            data[index]['values'] = dates.toString()
            if (name === 'fromdate') {
                // console.log("from date vals", vals);

                data[index]['fromdate'] = vals
            } else if (name === 'todate') {
                // if(item.fromdate) {
                //     item.values = item.fromdate
                // }else if(item.fromdate && item.todate) {
                //     let dates = [];
                //     dates.push(item.fromdate,item.todate)
                //     item.values = dates.toString()
                // }
                // console.log("todate vals", vals);

                data[index]['todate'] = vals
            }

        } else {
            data[index]['values'] = vals;
        }
        setFilterColumns(data)
        // setTempColumnDefs(data);
    }

    const handleChangeOp = (index, event) => {
        let data = [...values];
        let val = event.target.value;
        data[index]['operator'] = val;
        if ((val === '_null' || val === '_empty')) {
            data[index]['values'] = true;
        } else if ((val === '_nnull' || val === '_nempty')) {
            data[index]['values'] = false;
        } else {
            data[index]['values'] = '';
        }
        setFilterColumns(data);
        // setTempColumnDefs(data);
    }
    const handleKeyPress = (event) => {
        if (event?.key === 'Enter') {
            handleKeyPressFilter(null, true);
            setFilterModalField({});
            setOpen(false);
        }
    }
    return (
        <Dialog
            open={open}
            //   onClose={getNewData(p)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth='md'
            className='dialogRoot'
            classes={{ paper: classes.dialogRoot }}
        >
            <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
                <div className={classes.dialogTitleText}>{'Filter'}</div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <ul className="nav flex-column pl-2 pr-2 pt-3 pb-3 mt-4 modal_side_filter">
                    <li className="nav-item mb-2" data-placement="left">
                        <div>
                            <List className="sidebar">
                                {values?.length > 0 && values.map((option, index) => (
                                    (option.key === filterModalField.key) &&

                                    <ListItem key={index}>
                                        {
                                            (option.key !== 'actions') ? <>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={2}>
                                                        <span>
                                                            {option.placeholder}
                                                        </span>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <select
                                                            onChange={event => handleChangeOp(index, event)}
                                                            value={option.operator}
                                                        >
                                                            {
                                                                option?.operator_values2?.map((item, index) => {
                                                                    return <option key={index} value={item.value}>{item.label}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </Grid>
                                                    {/* &nbsp;
                                                    &nbsp; */}
                                                    <Grid item xs={7} className="filterBx">
                                                        {
                                                            option.type === 'date' ? <div className="datessel">
                                                                <TextField
                                                                    id="date"
                                                                    type={"date"}
                                                                    name={"fromdate"}
                                                                    value={option.fromdate}
                                                                    onChange={event => handleChange(index, event)}
                                                                    onKeyPress={event => handleKeyPress(event)}
                                                                />
                                                                {
                                                                    (option.operator === '_between' || option.operator === '_nbetween') &&
                                                                    <TextField
                                                                        id="date"
                                                                        name={"todate"}
                                                                        type={"date"}
                                                                        value={option.todate}
                                                                        onKeyPress={event => handleKeyPress(event)}
                                                                        onChange={event => handleChange(index, event)}
                                                                    />
                                                                }
                                                            </div>
                                                                : <><TextField
                                                                    id={option.key}
                                                                    name={option.key}
                                                                    value={option.values}
                                                                    autoFocus={true}
                                                                    placeholder={(option.operator === '_in' || option.operator === '_nin') ? option.isSpaceSeperate ? 'XXXX XXXX XXXX' : 'XXXX,XXXX,XXXX' : ''}
                                                                    disabled={(option.operator === '_null' || option.operator === '_nnull' || option.operator === '_empty' || option.operator === '_nempty') ? true : false}
                                                                    variant='outlined'
                                                                    onKeyPress={event => handleKeyPress(event)}
                                                                    onChange={event => handleChange(index, event)}
                                                                />
                                                                </>
                                                        }
                                                        <div style={{ margin: '5px' }}>
                                                            <Tooltip placement="topLeft" title="Clear filter">

                                                                <CloseSquareOutlined style={{ fontSize: '20px' }} className="removefilter" onClick={() => removeFilter(index)} fontSize="small" />
                                                            </Tooltip>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </> : null
                                            // 

                                        }
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </li>
                </ul >
                {/* {success && !error && <div>Instruction {`${editData?.id ? 'updation' : 'creation'}`} successful</div>} */}
                {/* {!success && error && <div>{errorMessage}</div>} */}
            </DialogContent>
            <DialogActions>
                {(
                    <div className={classes.buttonContainer}>
                        <Button
                            variant='contained'
                            onClick={() => setOpen(false)}
                            color='secondary'
                            disabled={loading}
                            className={classes.button}
                        >
                            Cancel
                        </Button>
                        {

                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                onClick={() => {
                                    handleKeyPressFilter(null, true);
                                    setFilterModalField({});
                                    setOpen(false);
                                }} >
                                Submit
                                {loading && (
                                    <CircularProgress
                                        size='1rem'
                                        className={classes.buttonProgress}
                                    />
                                )}
                            </Button>
                        }
                    </div>
                )}
            </DialogActions>
        </Dialog >
    );
};

export default AddNew;
