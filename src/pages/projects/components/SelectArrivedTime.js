import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS } from '../../../utils/constants'
import { fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import TextField from '@material-ui/core/TextField';
import * as moment from 'moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export default forwardRef((props, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.data.arrived_time ? dayjs((props.data.arrived_time)) : null);

    async function handleChange(d) {
        // setSelectedValue((new Date(d)).format());
        let obj = {}
        obj.arrived_time = (moment(new Date(d)).format() || null);
        obj.id = props.data.id
        delete obj.user_created
        delete obj.user_updated
        props.data.arrived_time = moment(new Date(d)).format();

        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    // props.setSnackBarOpen(true)
                    // props.setSnackBarMessage(`Arrived date has been updated for ${response.data.id}`)
                    // props.setSnackBarType("success")
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label={false}
                disabled={props.data.project_status === "CLOSED" ? true : false}
                defaultValue={selectedValue}
                onChange={(newValue) => handleChange(newValue)}
                renderInput={(params) => <TextField {...params} className="myDatePicker" />}
            />
        </LocalizationProvider>
    )
});

