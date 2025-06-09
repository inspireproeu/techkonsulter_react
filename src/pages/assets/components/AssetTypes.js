import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from 'react-select';
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
    let fields2 = '?limit=-1&sort=Asset_Name'
    fetchGet(`${DATAURLS.ASSETTYPES.url}${fields2}`, getAccessToken())
      .then((response) => {
        let uniqtypes = []
        response.data.forEach((item) => {
          if (item.Asset_Name) {
            uniqtypes.push({
              Asset_Name: item.Asset_Name
            })
          }
        })
        let data = uniqtypes.reduce((unique, o) => {
          if (!unique.some(obj => (obj.Asset_Name.toLowerCase() === o.Asset_Name.toLowerCase()))) {
            unique.push(o);
          }
          return unique;
        }, []);
        let types = [];
        data.forEach((item) => {
          types.push({ label: item.Asset_Name.toUpperCase(), value: item.Asset_Name.toUpperCase() })
        });
        // console.log("assetNames", assetNames)
        setTypes(types.sort());
      })
      .catch((err) => {
        throw err;
      });
  }, []);

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
  // console.log("selectedDate", selectedDate)

  const styles = {
    container: css => ({ ...css, width: '300px' }),
  };
  return (
    <div style={{ width: '100%' }}>
      {/* <Select
        onChange={handleChange}
        value={selectedValue && types && types.find(obj => obj.value.toUpperCase() === selectedValue.toUpperCase())}
        options={types}
        styles={styles}
      /> */}
    </div>
  )
});

