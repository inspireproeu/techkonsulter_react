import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Checkbox } from 'antd';
import {
  fetchPut,
  fetchGet
} from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';


const ActionCellRenderer = (props) => {
  const [enable, setEnable] = useState(false);
  const [compaintTypes, setcompaintTypes] = useState(props.node.data.complaint_types);
  useEffect(() => {
    if (props.node.data.complaint_types?.length > 0) {
      if (props.node.data.complaint_types.includes(props.colDef.field)) {
        setEnable(true)
      }
    }
  }, [props])


  const onChange = e => {
    setEnable(e.target.checked);
    let temp = compaintTypes || [];
    if (e.target.checked) {
      temp.push(props.colDef.field)
    } else if (!e.target.checked) {
      // Get the index of element
      var index = temp.indexOf(props.colDef.field);

      if (index > -1) {
        temp.splice(index, 1); // Remove array element
      }
    }
    if (temp?.length > 0) {
      fetchPut(`${DATAURLS.COMPLAINTS.url}/${props.node.data.id}`, { complaint_types: temp }, getAccessToken())
        .then((response) => {
          if (response.data.id) {
            setcompaintTypes(temp)
          } else {
            // setLoading(false);
            // setError(true);
            // setErrorMessage(response.message);
          }
        })
        .catch((err) => {
          throw err;
        });
    }

  };

  return (
    <div className={styles.root}>
      <Checkbox
        checked={enable}
        onChange={onChange}
      >
        {props.colDef.header_name}
      </Checkbox>
      {/* <span className="complainval" >
        {enable ? <CheckOutlined /> : <CloseOutlined />}
      </span> */}
      {/* <Button style={{ verticalAlign: 'bottom', background: 'red' }} onClick={() => handleFieldsOpen(props.node)} >
        <span className="instorage">Edit</span>
      </Button> */}
      {/* <Link className="complainedit" onClick={() => handleFieldsOpen(props.node)} >Edit</Link> */}
    </div>
  );
};

export default ActionCellRenderer;
