import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS, PROJECT_STATUS } from '../../../utils/constants'
import { fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import TextField from '@material-ui/core/TextField';

export default forwardRef((props, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.data.process_start_date);

    async function handleChange(d) {
        setSelectedValue(d.target.value);
        let obj = {}
        obj.process_start_date = (d.target.value || null);
        obj.id = props.data.id
        delete obj.user_created
        delete obj.user_updated
        props.data.process_start_date= d.target.value

        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    props.setSnackBarOpen(true)
                    props.setSnackBarMessage(`Process start date has been updated for ${response.data.id}`)
                    props.setSnackBarType("success")
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
            disabled={props.data.project_status === "CLOSED" ? true : false}
            type={"date"}
            name={'process_start_date'}
            onChange={handleChange}
            value={selectedValue}
        />
    )
});

