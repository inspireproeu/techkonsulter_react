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
    const [selectedValue, setSelectedValue] = useState(props?.data?.pallet_number ? props.data.pallet_number : null);
    async function handleChange(val) {
        let obj = {}
        obj.id = props.data.asset_id
        obj.pallet_number = val;
        props.data.pallet_number = val;
        try {
            props.gridApi.showLoadingOverlay();
            fetchPut(`${DATAURLS.ASSETS.url}/${props.data.asset_id}?fields=asset_id,pallet_number`, obj, getAccessToken())
                .then((response) => {
                    if (response.data.asset_id) {
                        props.gridApi.hideOverlay();

                        let temp = props.rowData
                        temp[props.node.id].pallet_number = val;
                        props.dataSourceparams.successCallback(temp, temp.length);
                        props.successCall("Part number")
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

    return (
        <Autocomplete
            className="auto_complete"
            id="auto-complete"
            classes={{ paper: classes.paper }}
            value={selectedValue ? props?.palletNumbers.find(v => v === selectedValue) : null}
            getOptionLabel={((option) => option) || null}
            options={props?.palletNumbers}
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
                />
            )}
        />
    )
});

