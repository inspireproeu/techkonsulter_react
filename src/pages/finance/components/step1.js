import React, { useState, useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import _ from "underscore"
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { PROJECT_STATUS, PROJECT_TYPES } from '../../../utils/constants'


export default function Step1({
    page,
    values,
    userType,
    handleChange,
    errValues
}) {
    // const handleChange = (name) => (event) => {
    //     // let targetvalues = event.target.value ? event.target.value : '';
    //     // setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })
    //     // values.contact_phone_number = ''
    //     // values.contact_email = ''

    //     // setValues({ ...values, [name]: targetvalues });
    // };
    // console.log("permissions", permissions)
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {
                        page === 'CREATE' &&
                        <Grid item xs={4}>
                            <FormControl className={'formControl'}>
                                <TextField
                                    inputProps={{ className: 'inputControl', pattern: "{0,15}" }}
                                    value={values && values.id}
                                    onChange={handleChange('id')}
                                    variant="outlined"
                                    id="id"
                                    name="id"
                                    helperText="Note - Project id accepts Numbers only."
                                    label="Project Id"
                                    // //margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    }
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl' }}
                                value={values && values.project_name}
                                onChange={handleChange('project_name')}
                                variant="outlined"
                                required
                                error={errValues && errValues.project_nameError ? true : false}
                                id="project_name"
                                name="project_name"
                                label="Project Name"
                                // //margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Project Info"
                                multiline
                                rows={3}
                                inputProps={{ className: 'inputControl' }}
                                value={values && values.project_info}
                                onChange={handleChange('project_info')}
                                variant="outlined"
                                name="project_info"
                                //margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {
                        (userType === 'ADMIN') &&
                        <Grid item xs={4}>
                            <FormControl variant="outlined" className={'formControl'}>
                                <InputLabel shrink id="demo-simple-select-outlined-label">
                                    Project Status
                            </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={values && values.project_status ? values.project_status : null}
                                    name="project_status"
                                    onChange={handleChange('project_status')}
                                    label="Project Status"
                                    notched={true}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                    <MenuItem value={''}>{'None'}</MenuItem>
                                    {
                                        PROJECT_STATUS.map((option, index) => (
                                            <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    }
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <InputLabel shrink id="demo-simple-select-outlined-label">
                                Project type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={values && values.project_type ? values.project_type : 'ITAD'}
                                name="project_type"
                                onChange={handleChange('project_type')}
                                label="Project type"
                                notched={true}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {
                                    PROJECT_TYPES.map((option, index) => (
                                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <TextField
                                // variant={isDisable ? "filled" : "standard"}
                                id="date"
                                label="Process end Date"
                                type={"date"}
                                // error={!values.process_start_date ? true : false}
                                name={'process_end_date'}
                                onChange={handleChange('process_end_date')}
                                //error={errValues && errValues.lease_start_dateError ? true : false}
                                value={values.process_end_date}
                                // className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <TextField
                                // variant={isDisable ? "filled" : "standard"}
                                id="date"
                                label="Project recieved"
                                type={"date"}
                                // error={!values.process_start_date ? true : false}
                                name={'project_recieved'}
                                onChange={handleChange('project_recieved')}
                                //error={errValues && errValues.lease_start_dateError ? true : false}
                                value={values.project_recieved}
                                // className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {/* {
                        (userType === 'ADMIN') &&
                        <Grid item xs={4}>
                            <FormControl variant="outlined" className={'formControl project'}>
                                <TextField
                                    id="standard-multiline-flexible"
                                    multiline
                                    maxRows="10"
                                    label="Comments"
                                    rows={6}
                                    name={'comments'}
                                    value={values.comments}
                                    onChange={handleChange('comments')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ padding: '10px' }}
                                //  margin="normal"
                                />
                            </FormControl>
                        </Grid>
                    } */}
                </Grid>
            </CardContent>
        </Card>

    )
}