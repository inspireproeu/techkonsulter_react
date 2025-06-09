import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS } from '../../../utils/constants'
import { fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import TextField from '@material-ui/core/TextField';
import * as moment from 'moment';

export default forwardRef((props, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.data.invoice_date ? moment(props.data.invoice_date).format('YYYY-MM-DD') : null);

    async function handleChange(d) {
        setSelectedValue(d.target.value);
        let obj = {}
        obj.invoice_date = (d.target.value || null);
        obj.id = props.data.id
        delete obj.user_created
        delete obj.user_updated
        props.data.invoice_date= d.target.value
        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {

                } else {
                }
            })
            .catch((err) => {
                throw err;
            });

    }
    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                let dateString = null;
                // if (selectedDate) {
                //     dateString = moment(selectedDate).format('YYYY-MM-DD');
                // }
                return selectedValue;
            },
            isCancelAfterEnd: () => {
                return !selectedValue;
            },
            afterGuiAttached: () => {
                if (!props.value) {
                    return;
                }
                setSelectedValue(props.value);
            }
        };
    });
    return (
        <TextField
            id="date"
            type={"date"}
            name={'invoice_date'}
            onChange={handleChange}
            value={selectedValue}
        />
    )
});

