import React, { useState, useEffect } from 'react';
import styles from '../../assets/style.less';
import { Checkbox } from 'antd';
import {
  fetchPut,
  fetchGet
} from '@/utils/utils';
import { DATAURLS } from '../../../utils/constants';
import { getAccessToken } from '@/utils/authority';
import _ from "underscore"


const ActionCellRenderer = (props) => {
  const [enable, setEnable] = useState(false);
  const [asset_types, setAsset_types] = useState(null);
  useEffect(() => {
    if (props.node.data.asset_types?.length > 0) {
      if (props.node.data.asset_types.includes(props.colDef.field)) {
        setEnable(true)
      }
      setAsset_types(props.node.data.asset_types)
    }
  }, [props])

  const onChange = e => {
    setEnable(e.target.checked);
    let temp = asset_types || [];
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
      // fetchGet(`${DATAURLS.COMPLAINTS.url}/${props.node.data.id}`, getAccessToken())
      //   .then((response) => {
      //     if (response.data.id) {
      // if (response.data.asset_types) {
      //   temp = [...response.data.asset_types, ...temp];
      // }
      fetchPut(`${DATAURLS.COMPLAINTS.url}/${props.node.data.id}`, { asset_types: _.uniq(temp) }, getAccessToken())
        .then((response) => {
          if (response.data.id) {
          }
        })
        .catch((err) => {
          throw err;
        });
      //   } else {
      //     // setLoading(false);
      //     // setError(true);
      //     // setErrorMessage(response.message);
      //   }
      // })
      // .catch((err) => {
      //   throw err;
      // });
    }

  };

  return (
    <div className={styles.root}>
      <Checkbox
        checked={enable}
        onChange={onChange}
        prefixCls="show-error"
      >
        {props.colDef.header_name}
      </Checkbox>
    </div>
  );
};

export default ActionCellRenderer;
