import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';
export default () => (
  <Result
    status="403"
    title="401"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, you don't have access to this page."
    extra={
      <Link to="/user/login">
        <Button type="primary">Go login</Button>
      </Link>
    }
  />
);
