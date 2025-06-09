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
    //     partner: d.value
    //   },
    //   getAccessToken()
    // ).then((response) => {
    //   // props.data.partner.partner_org_no = d.value
    // })
    setSelectedValue(d.value);
  }

  useEffect(() => {
    if (props.partnerFieldMapping) {
      let type = []
      props.partnerFieldMapping.forEach((item) => {
        type.push({ label: item.partner_name, value: item.partner_name })
      });
      setTypes(type);
    }

  }, [props.partnerFieldMapping]);

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
    <Select
      onChange={handleChange}
      value={selectedValue && types && types.find(obj => obj.value === selectedValue)}
      options={types}
    />
  )
});

