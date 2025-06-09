import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Select from 'react-select';

export default forwardRef((props, ref) => {
  const [types, setTypes] = useState([])

  const [selectedValue, setSelectedValue] = useState(props.data.project_id?.id);
  function handleChange(d) {
    setSelectedValue(d.value);
  }

  useEffect(() => {
    if (props.colDef.cellRendererParams.projectLists) {
      let type = []
      props.colDef.cellRendererParams.projectLists.forEach((item) => {
        type.push({ label: item, value: item })
      });
      // console.log("assetNames", assetNames)
      setTypes(type);
    }
  }, [props.colDef.cellRendererParams.projectLists]);

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
  const styles = {
    container: css => ({ ...css, width: '300px' }),
  };

  return (
    <div style={{ width: '100%' }}>
      <Select
        onChange={handleChange}
        value={selectedValue && types && types.find(obj => obj.value === selectedValue)}
        options={types}
        styles={styles}
      />
    </div>

  )
});

