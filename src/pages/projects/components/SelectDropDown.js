import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS, PROJECT_STATUS } from '../../../utils/constants'
import { fetchPut } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import * as moment from 'moment';

export default forwardRef((props, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.data.project_status);
    const [bgColor, setBgColor] = useState('');
    const [status_color, setstatus_color] = useState(props.data.status_color);

    useEffect(() => {
        if (props.data) {
            if (props.data.project_status === 'PROCESSING') {
                setBgColor('redcolor')
            }
            if (props?.data?.project_status === 'PROCESSING FINISHED' && props.data.no_of_assets && props.data.processed_units_sold) {
                let val = Math.round(parseInt(props.data.processed_units_sold) * parseInt(props.data.no_of_assets)) / 100;
                if (val < parseInt(props.data.no_of_assets)) {
                    setBgColor('redcolor')
                }
            }
        }
    }, [props.data])

    async function handleChange(d) {
        // console.log("*****************", d.target.value)
        setSelectedValue(d.value);
        let val = d.target.value
        let obj = {}
        obj.project_status = d.target.value
        obj.id = props.data.id
        props.data.project_status = d.target.value
        if (d.target.value === 'CLOSED') {
            obj.finish_date = props.data.finish_date || null;
        }

        delete obj.user_created
        delete obj.user_updated

        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    if (obj.project_status === 'CLOSED') {
                        let temp = props.rowData
                        temp[props.node.id].finish_date = obj.finish_date;
                        props.setRowData(temp);
                    }
                    props.setSnackBarOpen(true)
                    props.setSnackBarMessage(`Project has been changed to ${val}`)
                    props.setSnackBarType("success")

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

        <select
            onChange={handleChange}
            value={selectedValue}
            className={bgColor ? bgColor : (selectedValue === 'REPORTING' && status_color === 'green') ? 'greencolor' : ''}
        >
            <option key={'00'} value={""}>
                Please choose
                </option>
            {PROJECT_STATUS.map((option, index) => (
                option !== 'Please choose' && <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
});

