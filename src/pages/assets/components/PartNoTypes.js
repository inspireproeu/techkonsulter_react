import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from 'react-select';

export default forwardRef((props, ref) => {
  const [types, setTypes] = useState()

  const [selectedValue, setSelectedValue] = useState(null);

  function handleChange(d) {
    setSelectedValue(d.value.toUpperCase());
  }
 
  useEffect(() => {
    if (props.partvalues) {
      // console.log("assetNames", assetNames)
      setTypes(props.partvalues);
    }

  }, [props.partvalues]);

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

  return (
    <Select
      onChange={handleChange}
      value={selectedValue && types && types.find(obj => obj.value.toUpperCase() === selectedValue.toUpperCase())}
      options={types}
    // formatCreateLabel={this.formatCreate}
    // createOptionPosition={"first"}
    // ref={ref => {
    //   this.SelectRef = ref;
    // }}
    />
  )
});

