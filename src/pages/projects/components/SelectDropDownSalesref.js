import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS, PROJECT_STATUS } from '../../../utils/constants'
import { fetchPut, fetchGet } from '../../../utils/utils';
import { getAccessToken } from '@/utils/authority';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    paper: {
        fontSize: "10px"
    }
});

export default forwardRef((props, ref) => {
    const classes = useStyles();
    const [selectedValue, setSelectedValue] = useState(props.data.sales_ref?.id ? props.data.sales_ref.id : null);
    async function handleChange(val) {
        let obj = {}
        obj.sales_ref = val;
        obj.id = props.data.id
        props.data.sales_ref= val

        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    // let temp = props.rowData
                    // temp[props.node.id].sales_ref.id = val;
                    // props.setRowData(temp);
                    // props.successCall()
                    // props.data.sales_ref = val;
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

    // console.log(props.users,"selectedValue",selectedValue)
    return (
        <Autocomplete
            className="auto_complete"
            id="auto-complete"
            classes={{ paper: classes.paper }}
            value={selectedValue ? props?.users.find(v => v.id === selectedValue) : null}
            getOptionLabel={((option) => option.first_name + " (" + option.email + ")") || {}}
            options={props?.users}
            disabled={props.data.project_status === "CLOSED" ? true : false}
            onChange={(e, option) => {
                if (option) {
                    setSelectedValue(option.id);
                    handleChange(option.id, true)
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={"standard"}
                />
            )}
        />
    )
});

