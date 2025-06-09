import React from 'react';
import { Link } from 'react-router-dom';
import { calculateDays } from '@/utils/utils';
import { Badge } from 'antd';

const ActionCellRenderer = (props) => {
  let red = '';
  let id = props?.node?.data?.id ? props.node.data.id : props.node?.data?.asset_id_nl ? props?.node?.data?.asset_id_nl : '';
  let urlPage = props.urlpage;
  let fieldName = props.colDef.field;
  if (props.node?.data?.asset_id_nl  && fieldName === 'asset_id_nl') {
    id = props?.node?.data?.asset_id_nl;
  } else if (props.node?.data?.asset_id && fieldName === 'asset_id') {
    id = props?.node?.data?.asset_id;
  } else if (props.node?.data?.id) {
    id = props?.node?.data?.id;
  }
  if ((props.userType === 'ADMIN' && fieldName === 'asset_id')) {
    urlPage = 'asset-history'
  }
  if (props.node.data && props.node?.data?.project_status === 'PROCESSING FINISHED' && props.node?.data?.finish_date) {
    let daysDiff = calculateDays(props.data.finish_date);
    if (daysDiff > 30) {
      red = 'red'
    }
  }
  return (
    <div>
      {
        ((props.userType === 'ADMIN' && props.page === 'Assets' && props.node?.data?.asset_id)
          || (props.page === 'Assets' && props.node?.data?.asset_id_nl) ||
          (props.page === 'projects' && props.node?.data?.id)) ? <Link className="linkbtn" target="_blank" to={`/${urlPage}/${id}`}>
          {id} {red &&
            <Badge dot={true} color="red" size="large" style={{ fontSize: '16px' }}>
            </Badge>
          }
        </Link> : id
      }

    </div >
  );
};

export default ActionCellRenderer;
