import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from 'react-select';
import {
  fetchPut
} from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';

export default forwardRef((props, ref) => {
  const [types, setTypes] = useState()

  const [selectedValue, setSelectedValue] = useState(null);

  function handleChange(d) {
    // fetchPut(
    //   `${DATAURLS.ASSETS.url}/${props.data.asset_id}`,
    //   {
    //     client: d.value
    //   },
    //   getAccessToken()
    // ).then((response) => {
    //   // props.data.client.client_org_no = d.value
    //   console.log("props.node", props.node)
    // })
    setSelectedValue(d.value);
  }

  useEffect(() => {
    if (props.clientFieldMapping) {
      let type = []
      props.clientFieldMapping.forEach((item) => {
        type.push({ label: item.client_name, value: item.client_name })
      });
      // console.log("assetNames", assetNames)
      setTypes(type);
    }

  }, [props.clientFieldMapping]);

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
  // console.log("selectedDate", selectedDate)

  return (
    <Select
      onChange={handleChange}
      value={selectedValue && types && types.find(obj => obj.value === selectedValue)}
      options={types}
    // formatCreateLabel={this.formatCreate}
    // createOptionPosition={"first"}
    // ref={ref => {
    //   this.SelectRef = ref;
    // }}
    />
  )
});

