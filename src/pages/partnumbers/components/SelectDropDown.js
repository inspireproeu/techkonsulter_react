import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { getAccessToken } from '@/utils/authority';
import { fetchPut } from '../../../utils/utils';
import Select from 'react-select';
import {
    DATAURLS
} from '../../../utils/constants';

export default forwardRef((props, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.data.status === 'published' ? 'Approved' : 'Not approved');
    const ACTION = ['Not Approved', 'Approved']
    async function handleChange(d) {
        setSelectedValue(d.value);
        let val = d.target.value;
        await fetchPut(
            `${DATAURLS.PARTNUMBERS.url}/${props.data.id}`,
            {
                status: d.target.value === 'Approved' ? 'published' : 'draft',
                id: props.data.id
            },
            getAccessToken()
        ).then((res) => {
            props.setSnackBarOpen(true)
            props.setSnackBarMessage(`Selected part number has been ${val}`)
            props.setSnackBarType("success")
        }).catch((err) => {
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
        <select
            onChange={handleChange}
            value={selectedValue}
            style={{ color: '#000000' }}
        >
            {ACTION.map((option, index) => (
                <option key={index} value={option.value}>
                    {option}
                </option>
            ))}
        </select>
    )
});

