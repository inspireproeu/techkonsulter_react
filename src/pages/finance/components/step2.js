import React, { useState, useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
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

export default function Step1({
    values,
    clientsList,
    setErrValues,
    setValues,
    errValues,
    setDeliveryValues,
    deliveryValues,
    setClientUsers,
    clientUsers,
    setClientsAddressList,
    clientsAddressList,
    DeliveryVals
}) {

    const handleChange = (name) => (event) => {
        let targetvalues = event.target.value ? event.target.value : '';
        setErrValues({ ...errValues, [`${name}Error`]: targetvalues ? false : true })
        if (name === 'delivery_address') {
            values.contact_phone_number = '';
            values.contact_email = '';
            values.contact_attn = ''
        }
        setValues({ ...values, [name]: targetvalues });
        if (name === 'client') {
            values.access = [];
            values.contact_phone_number = '';
            values.contact_email = '';
            values.contact_attn = '';
            values.delivery_address = ''
            setClientsAddressList([])
            setClientUsers([])
            setDeliveryValues(DeliveryVals)
            getClient(targetvalues, true)
        }
        if (name === 'contact_attn') {
            getClientContacts(targetvalues)
        }
    };

    useEffect(() => {
        if (values && values.id && values.client) {
            getClient(values.client)
        }
    }, []);

    const getClient = (client, delivery_address = false) => {
        // c
        // return
        let val = {
            client: '',
            postal_address: '',
            city: '',
            postal_code: '',
            address2: '',
            phone_number: '',
            delivery_info: ''
        };
        if (client) {

            getClientAddress(client);
            let fields = `limit=-1&sort=first_name&filter={"_and":[{"email":{"_nnull":true}},{"client":{"_eq":"${client}"}}]}&fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name`;
            fetchGet(`${DATAURLS.USERS.url}?${fields}`, getAccessToken())
                .then((response) => {
                    // let val = {
                    //   contact_email: '',
                    //   contact_phone_number: ''
                    // }
                    response.data.forEach((item) => {
                        item.checked = false;
                    })

                    if (values.access && values.access.length > 0) {
                        let selectedUseres = values.access.map(
                            (row) => row.projects_users_id
                        );
                        // response.data.forEach((item) => {
                        //     if (selectedUseres.some((x) => x == item.id)) {
                        //         item.checked = true
                        //     } else {
                        //         item.checked = false;
                        //     }
                        // })
                    }
                    // setValues({ ...values, ...val });
                    // setValues({ ...values });
                    setClientUsers(response.data);
                    // setLoading(false);
                })
                .catch((err) => {
                    throw err;
                });
            let clientValues = clientsList.find((row) => row.id === client);
            // let client_Users = usersList && usersList.filter((row) => row.client === values.client);
            // setClientUsers(client_Users)
            // if (clientValues) {
            // console.log("clientValues", clientValues)

            val.client = client;
            if (clientValues) {
                val.postal_address = clientValues.postal_address || '';
                val.city = clientValues.city || '';
                val.postal_code = clientValues.postal_code || '';
                val.address2 = clientValues.address2 || '';
                val.phone_number = clientValues.phone_number || '';
                val.delivery_info = clientValues.delivery_info || '';
            }
            if (delivery_address) {
                values.delivery_address = null;
                // values.contact_phone_number = null;
                // values.contact_email = null;
                values.contact_attn = null;
            }
            setValues({ ...values, ...val });
            // }
        } else {
            setValues({ ...values, ...val });
        }
    }

    const getClientAddress = async (clientid) => {
        // setLoading(true);
        let param1 = `limit=-1&sort=delievery_address&filter={"_and":[{"client":{"_nnull":true}},{"client":{"_eq":"${clientid}"}}]}&fields=id,delievery_address,address_info,city,postal_code,sub_org,phone_number,sub_address_contact.first_name,sub_address_contact.email`;

        // let fields4 = `limit=-1&sort=-id&?filter[client][_eq]=${clientid}`;
        fetchGet(`${DATAURLS.CLIENTADDRESS.url}?${param1}`, getAccessToken())
            .then((response) => {
                setClientsAddressList(response.data);
            })
            .catch((err) => {
                throw err;
            });
    };
    const getClientContacts = (contact_attn) => {
        if (contact_attn) {
            if (clientUsers) {
                let clientValues = clientUsers.find((row) => row.id === contact_attn);
                if (clientValues) {
                    let val = {
                        contact_email: clientValues.email,
                        contact_phone_number: clientValues.phone_number,
                        contact_attn: contact_attn
                    };

                    setValues({ ...values, ...val });
                }
            }
        }
    }
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Client ref"
                                inputProps={{ className: 'inputControl' }}
                                value={values && values.client_ref}
                                onChange={handleChange('client_ref')}
                                variant="outlined"
                                name="client_ref"
                                // fullWidth
                                //margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <Autocomplete
                                id="size-small-standard"
                                value={values && values.client ? clientsList.find(v => v.id === values.client) || {} : null}
                                getOptionLabel={((option) => option.client_name) || {}}
                                options={clientsList}
                                onChange={(e, option) => {
                                    if (option) {
                                        setValues({ ...values, ['client']: option.id });
                                        values.access = [];
                                        values.contact_phone_number = '';
                                        values.contact_email = '';
                                        values.contact_attn = '';
                                        values.delivery_address = ''
                                        setClientsAddressList([])
                                        setClientUsers([])
                                        setDeliveryValues(DeliveryVals)
                                        getClient(option.id, true)

                                    }
                                }}
                                // onChange={handleChange('client')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant={"outlined"}
                                        label="Client"
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Project Request"
                                multiline
                                rows={3}
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={values && values.delivery_info}
                                variant="filled"
                                name="project_request"
                                //margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <InputLabel shrink id="demo-simple-select-outlined-label">Delivery Address</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={values && values.delivery_address ? values.delivery_address : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                notched
                                onChange={handleChange('delivery_address')}
                                label="Delivery Address"
                                name="delivery_address"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {clientsAddressList &&
                                    clientsAddressList.map((item) => (
                                        <MenuItem value={item.id}>{item.delievery_address}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>


                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={`${deliveryValues?.name ? deliveryValues?.name : ''}`}
                                // onChange={(event) => setUserName(event.target.value)}
                                variant="filled"
                                // fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                id="contact_tfn4"
                                label="Name"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={deliveryValues.sub_org}
                                // onChange={(event) => setUserName(event.target.value)}
                                variant="filled"
                                // fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                id="contact_tfn3"
                                label="Sub org"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={deliveryValues.city}
                                // onChange={(event) => setUserName(event.target.value)}
                                variant="filled"
                                // fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                id="contact_tfn2"
                                label="City"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={deliveryValues.postal_code}
                                // onChange={(event) => setUserName(event.target.value)}
                                variant="filled"
                                // fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                id="contact_tfn1"
                                label="Postal Code"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Delivery Info"
                                multiline
                                rows={3}
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={deliveryValues.address_info}
                                variant="filled"
                                name="delivery_info1"
                                //margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>

                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" className={'formControl'}>
                            <InputLabel shrink id="demo-simple-select-outlined-label">Main Contact</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={values.contact_attn ? values.contact_attn : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                notched={true}
                                onChange={handleChange('contact_attn')}
                                label="Main Contact"
                                name="contact_attn"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {clientUsers &&
                                    clientUsers.map((item) => (
                                        <MenuItem value={item.id}>{item.first_name ? item.first_name : ''} {item.last_name ? item.last_name : ''}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>

                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={values.contact_phone_number ? values.contact_phone_number : ''}
                                // onChange={(event) => setUserName(event.target.value)}
                                variant="filled"
                                // fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                id="contact_tfn"
                                label="Contact telephone"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={'formControl'}>
                            <TextField
                                inputProps={{ className: 'inputControl', disabled: true }}
                                value={values.contact_email ? values.contact_email : ''}
                                variant="filled"
                                // fullWidth
                                id="contact_email"
                                label="Contact E-mail"
                                //margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    )
}