import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from 'react-select';

export default forwardRef((props, ref) => {
  const [types, setTypes] = useState([
    // { label: 'Remarketing', value: 'remarketing' },
    { label: 'Logistics', value: 'logistics' },
    { label: 'Handling', value: 'handling' },
    // { label: 'Software', value: 'software' },
    { label: 'Buyout', value: 'buyout' },
    { label: 'Other', value: 'other' }
  ])

  const [selectedValue, setSelectedValue] = useState(props.data.type);

  function handleChange(d) {
    setSelectedValue(d.value.toUpperCase());
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
  // console.log("selectedDate", selectedDate)
  const styles = {
    container: css => ({ ...css, width: '300px' }),
  };
  return (
    <div style={{ width: '100%' }}>
      <Select
        onChange={handleChange}
        value={selectedValue && types && types.find(obj => obj.value.toUpperCase() === selectedValue.toUpperCase())}
        options={types}
        styles={styles}
      />
    </div>
  )
});

