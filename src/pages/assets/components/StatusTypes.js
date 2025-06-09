import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import {

  fetchGet,
} from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';

export default forwardRef((props, ref) => {
  const [types, setTypes] = useState()

  const [selectedValue, setSelectedValue] = useState(null);

  function handleChange(d) {
    setSelectedValue(d.value.toUpperCase());
  }

  useEffect(() => {
    let fields2 = '?limit=-1&sort=status_name'
    fetchGet(`${DATAURLS.STATUS_CODES.url}${fields2}`, getAccessToken())
      .then((response) => {
        let type = []
        response.data.forEach((item) => {
          type.push({ label: item.status_name.toUpperCase(), value: item.status_name.toUpperCase() })
        });
        // console.log("assetNames", assetNames)
        setTypes(type.sort());
      })
      .catch((err) => {
        throw err;
      });
  }, []);

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
    <select
    onChange={handleChange}
    value={selectedValue}
  >
    {types && types.map((option, index) => (
      <option key={index} value={option}>
        {option.value}
      </option>
    ))}
  </select>
    // <Select
    //   onChange={handleChange}
    //   value={selectedValue && types && types.find(obj => obj.value.toUpperCase() === selectedValue.toUpperCase())}
    //   options={types}
    // // formatCreateLabel={this.formatCreate}
    // // createOptionPosition={"first"}
    // // ref={ref => {
    // //   this.SelectRef = ref;
    // // }}
    // />
  )
});

