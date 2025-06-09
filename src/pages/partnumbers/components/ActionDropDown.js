import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { getAccessToken } from '@/utils/authority';
import { fetchPut } from '../../../utils/utils';

import {
    DATAURLS
} from '../../../utils/constants';
export default forwardRef((props, ref) => {

    const [selectedValue, setSelectedValue] = useState(props.data.action);
    const ACTION = ['REUSE', 'RECYCLE', 'HARVEST']
    async function handleChange(d) {
            setSelectedValue(d.value);
            await fetchPut(
                `${DATAURLS.PARTNUMBERS.url}/${props.data.id}`,
                {
                    action: d.target.value
                },
                getAccessToken()
            )
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
        >
            {ACTION.map((option, index) => (
                <option key={index} value={option.value}>
                    {option}
                </option>
            ))}
        </select>
    )
});

