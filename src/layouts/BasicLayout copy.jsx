/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.png';
import styles from './BasicLayout.less';
import { useMobile, useMobileSmall } from '@/utils/utils';
import GlobalHeader from '@/components/GlobalHeader/GlobalHeader';
import { getLocale } from 'umi';

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
    console.log(Authorized.check(item.authority, localItem, null),"item.authority", item.authority)
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    currentUser,
    login
  } = props;
  const { logoutMessage } = login;
  const menuDataRef = useRef([]);
  const isMobile = useMobile();
  let page;
	// if (currentUser?.role?.name === 'customer') {
	// 	page = '/dashboard'	
	// } else {
	// 	page = '/customer';
	// }
  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
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
  /**
   * init variables
   */

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const { formatMessage } = useIntl();
  return (
    <>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        {...props}
        {...settings}
        onCollapse={handleMenuCollapse}
        menuRender={(props, dom) => (
          <div
            style={{
              background: '#fff',
              boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
              transition: 'all 0.2s',
              overflow: 'hidden',
              width: props.collapsed ? 0 : props.siderWidth || 256,
            }}
          >
            {dom} 234324324
          </div>
        )}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.ASSETS',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        // footerRender={() => defaultFooterDom}
        // menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
         {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings, user, language,login }) => ({
  collapsed: global.collapsed,
  settings,
  language,
	currentUser: user.currentUser,
  login
}))(BasicLayout);
