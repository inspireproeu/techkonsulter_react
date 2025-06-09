/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import { LockTwoTone } from '@ant-design/icons';
import React, { useEffect, useMemo } from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import AvatarLogin from '@/components/GlobalHeader/AvatarLogin';
import LeftContent from '@/components/GlobalHeader/LeftContent';
import { getAuthorityFromRouter, useMobile } from '@/utils/utils';
import { getAccessToken } from '@/utils/authority';

import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });


const UserLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */
  const isMobile = useMobile();


  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'language/fetchLanguage'
      });
    }
  }, []);

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const { formatMessage } = useIntl();

  return (
    <>
      <ProLayout
        layout="mix"
        logo={logo}
        formatMessage={formatMessage}
        // onCollapse={handleMenuCollapse}
        // collapsedButtonRender={()=>{return <div/>;}}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        disableMobile="false"
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '/',
        //     breadcrumbName: formatMessage({
        //       id: 'menu.home',
        //     }),
        //   },
        //   ...routers,
        // ]}
        headerHeight={isMobile ? 60 : 80}
        // footerRender={() => defaultFooterDom}
        // menuHeaderRender={() => <LeftContent />}
        // rightContentRender={() => <AvatarLogin menu />}
        contentStyle={{display:'flex', flex:1, alignItems:'center', justifyContent:'center',  overflow:"hidden"}}

        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings, language }) => ({
  collapsed: global.collapsed,
  settings,
}))(UserLayout);
