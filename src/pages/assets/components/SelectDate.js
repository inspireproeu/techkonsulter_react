import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS, PROJECT_STATUS } from '../../../utils/constants'
import { fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import TextField from '@material-ui/core/TextField';

export default forwardRef((props, ref) => {
    // console.log("props",props)
    const [selectedValue, setSelectedValue] = useState(props?.data?.date_nor);

    async function handleChange(d) {
        setSelectedValue(d.value);
        fetchPut(`${DATAURLS.ASSETS.url}/${props.data.asset_id}`, { date_nor: d.target.value ? d.target.value : null }, getAccessToken())
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
            name={'date_nor'}
            onChange={handleChange}
            value={selectedValue}
        />
    )
});

