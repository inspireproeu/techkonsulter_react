import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DATAURLS } from '../../../utils/constants'
import { fetchPut } from '../../../utils/utils';
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
    const [selectedValue, setSelectedValue] = useState(props?.data?.asset_type ? props.data.asset_type : null);
    async function handleChange(val) {
        try {
            let obj = {}
            obj.id = props.data.asset_id
            obj.asset_type = val;
            props.data.asset_type = val;
            props.gridApi.showLoadingOverlay();

            fetchPut(`${DATAURLS.ASSETS.url}/${props.data.asset_id}?fields=asset_id,asset_type`, obj, getAccessToken())
                .then((response) => {
                    props.gridApi.hideOverlay();

                    if (response.data.asset_id) {
                        let temp = props.rowData
                        temp[props.node.id].asset_type = val;
                        props.dataSourceparams.successCallback(temp, temp.length);
                        props.successCall("Asset type")
                    }
                })
                .catch((err) => {
                    props.gridApi.hideOverlay();

                    throw err;
                });
        } catch (err1) {
            props.gridApi.hideOverlay();

            throw err1;
        }
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
console.log("props?.data?.asset_type",props?.data?.asset_type)
    return (
        <Autocomplete
            className="auto_complete"
            id="auto-complete"
            classes={{ paper: classes.paper }}
            value={selectedValue ? props?.assetTypes.find(v => v === selectedValue) : props?.data?.asset_type ? props.data.asset_type : null}
            getOptionLabel={((option) => option) || null}
            options={props?.assetTypes}
            onChange={handleChange}
            onChange={(e, option) => {
                if (option) {
                    setSelectedValue(option);
                    handleChange(option, true)
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={"standard"}
                    className="auto-complete"
                />
            )}
        />
    )
});

