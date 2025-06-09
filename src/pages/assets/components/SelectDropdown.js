import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from 'react-select';
import { components } from "react-select";
import ReactDOM from "react-dom";
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
} from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';

// import DateFnsUtils from '@date-io/date-fns';
// import { format } from 'date-fns';
import moment from "moment";

export default forwardRef((props, ref) => {
  const [assetTypes, setAssetTypes] = useState([])

  const [selectedValue, setSelectedValue] = useState(null);

  function handleChange(d) {
    setSelectedValue(d.value.toUpperCase());
  }

  useEffect(() => {
    // Fetching Asset Types
    useEffect(() => {
      // Fetching Asset Types
      fetchGet(DATAURLS.STATUS_CODES.url, getAccessToken())
        .then((response) => {
          let type = []
          response.status_codes.forEach((item) => {
            type.push({ label: item.status_name.toUpperCase(), value: item.status_name.toLowerCase() })
          });
          // console.log("assetNames", assetNames)
          setTypes(type);
        })
        .catch((err) => {
          throw err;
        });
    }, []);
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
      <Select
        onChange={handleChange}
        value={selectedValue && assetTypes && assetTypes.find(obj => obj.value.toUpperCase() === selectedValue.toUpperCase())}
        options={assetTypes}
        styles={styles}
      // formatCreateLabel={this.formatCreate}
      // createOptionPosition={"first"}
      // ref={ref => {
      //   this.SelectRef = ref;
      // }}
      />
    </div>
  )
});

