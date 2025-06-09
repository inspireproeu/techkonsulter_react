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
    const [selectedValue, setSelectedValue] = useState(props.data.user_created?.id ? props.data.user_created.id : null);
    async function handleChange(val) {
        let obj = {}
        obj.user_created = val;
        obj.id = props.data.id
        props.data.user_created= val
        delete obj.user_updated
        fetchPut(`${DATAURLS.PROJECT.url}/${props.data.id}`, obj, getAccessToken())
            .then((response) => {
                if (response.data.id) {
                    // let temp = props.rowData
                    // temp[props.node.id].user_created.id = val;
                    // props.setRowData(temp);
                    // props.successCall()
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
        //     <Autocomplete
        //     {...defaultProps}
        //     id="auto-complete"
        //     autoComplete
        //     includeInputInList
        //     renderInput={(params) => (
        //       <TextField {...params} label="autoComplete" variant="standard" />
        //     )}
        //   />

        <Autocomplete
            className="auto_complete"
            id="auto-complete"
            disabled={props.data.project_status === "CLOSED" ? true : false}
            classes={{ paper: classes.paper }}
            value={selectedValue ? props?.users.find(v => v.id === selectedValue) : null}
            getOptionLabel={((option) => option.first_name + " (" + option.email + ")") || {}}
            options={props?.users}
            onChange={handleChange}
            onChange={(e, option) => {
                if (option) {
                    setSelectedValue(option.id);
                    handleChange(option.id, true)

                }
            }}
            // onChange={handleChange('client')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={"standard"}
                />
            )}
        />

        // <select
        //     onChange={handleChange}
        //     value={selectedValue}
        // >
        //     {props.agGridReact.props?.users.map((option, index) => (
        //         <option key={index} value={option.id}>
        //             {option.first_name}
        //         </option>
        //     ))}
        // </select>
    )
});

