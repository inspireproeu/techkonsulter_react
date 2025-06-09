import React, { useState, useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { DATAURLS } from '../../../utils/constants';
import { fetchPost, fetchGet, fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import _ from "underscore"
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function Step1({
    values,
    partnersList,
    setErrValues,
    setValues,
    errValues,
    setPartnerUsers,
    partnerUsers
}) {
    const handleChange = (name) => (event) => {
        let targetvalues = event.target.value ? event.target.value : '';
        setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })
        // values.contact_phone_number = '';
        // values.contact_email = '';
        setValues({ ...values, [name]: targetvalues });
        if (name === 'partner') {
            // getPartnerusers(targetvalues)
        }
        if (name === 'partner_contact_attn') {
            getPartnerContact(targetvalues)
        }
    };

    useEffect(() => {
        if (values && values.id && values.partner) {
            getPartnerusers(values.partner)
        }
    }, []);

    const getPartnerContact = (partner) => {
        if (partnerUsers) {
            let Values = partnerUsers.find((row) => row.id === partner);
            if (Values) {
                let val = {
                    partner_contact_attn: Values.id
                };
                setValues({ ...values, ...val });
            }
        }
    }

    const getPartnerusers = (partner) => {
        if (partner) {
            let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"partner":{"_eq":"${partner}"}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
            fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
                .then((response) => {
                    setPartnerUsers(response.data)
                })
                .catch((err) => {
                    throw err;
                });
        }
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <InputLabel shrink id="demo-simple-select-outlined-label">
                                Partner
                            </InputLabel>
                            <Autocomplete
                                id="size-small-standard"
                                value={values && values?.partner ? partnersList.find(v => v.id === values.partner) : null}
                                getOptionLabel={((option) => option.partner_name) || {}}
                                options={partnersList}
                                onChange={(e, option) => {
                                    if (option) {
                                        setValues({ ...values, ['partner']: option.id });
                                        getPartnerusers(option.id, true)
                                    }
                                }}
                                // onChange={handleChange('client')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant={"outlined"}
                                        label="Partner"
                                    />
                                )}
                            />
                            {/* <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={values.partner ? values.partner : null}
                                name="partner"
                                onChange={handleChange('partner')}
                                label="Partner"
                                notched
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {partnersList &&
                                    partnersList.map((item) => (
                                        <MenuItem value={item.id}>{item.partner_name}</MenuItem>
                                    ))}
                            </Select> */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <InputLabel shrink id="demo-simple-select-outlined-label">
                                Partner Contact
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={values.partner_contact_attn ? values.partner_contact_attn : null}
                                name="partner_contact_attn"
                                onChange={handleChange('partner_contact_attn')}
                                label="Partner Contact"
                                notched
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {partnerUsers &&
                                    partnerUsers.map((item) => (
                                        <MenuItem value={item.id}>{item.first_name ? item.first_name : '' + "" + item.last_name ? item.last_name : ''}</MenuItem>
                                    ))}
                            </Select>

                        </FormControl>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>

    )
}