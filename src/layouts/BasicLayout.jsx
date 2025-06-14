/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.png';
import defaultProps from './defaultProps';
import defaultPropsPartner from './defaultPropsPartner';
import defaultPropsPartnerSales from './defaultPropsPartnerSales';
import defaultPropsAssociate from './defaultPropsAssociate';
import defaultPropsOther from './defaultPropsOther';

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
  const [toShowEstimateValues, settoShowEstimateValues] = useState(false);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, [dispatch]);



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

  useEffect(() => {
    if (currentUser?.partner) {
      settoShowEstimateValues(currentUser.partner.toShowEstimateValues)
    }
    if (currentUser?.client) {
      settoShowEstimateValues(currentUser.client.toShowEstimateValues)
    }
  }, [currentUser])


  return (
    <>
      {
        currentUser && (currentUser.userType === 'CLIENT') &&
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuDataRender={menuDataRender}

          {...defaultProps}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          menuDataRender={menuDataRender}

          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.name === 'TECHVALUATOR' && !toShowEstimateValues) return null;
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          formatMessage={formatMessage}

          // location={{
          //   pathname: '/projects',
          // }}
          collapsed
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.name === 'TECHVALUATOR' && !toShowEstimateValues) return null;
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
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
      }
      {
        (currentUser && currentUser?.role?.name === 'partner_admin') &&
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuDataRender={menuDataRender}

          {...defaultPropsPartner}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          menuDataRender={menuDataRender}

          menuItemRender={(item, dom) => {
            if (item.path === '/admin' && userRole !== 'admin') return null;
            return dom;
          }}
          formatMessage={formatMessage}

          // location={{
          //   pathname: '/projects',
          // }}
          collapsed
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.name === 'TECHVALUATOR' && !toShowEstimateValues) return null;
            if ((menuItemProps.isUrl || !menuItemProps.path)) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
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
      }
      {
        (currentUser && currentUser?.role?.name === 'partner_sales') &&
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuDataRender={menuDataRender}

          {...defaultPropsPartnerSales}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          menuDataRender={menuDataRender}

          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          formatMessage={formatMessage}

          // location={{
          //   pathname: '/projects',
          // }}
          collapsed
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.name === 'TECHVALUATOR' && !toShowEstimateValues) return null;

            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
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
      }
      {
        (currentUser && currentUser?.role?.name === 'Administrator') &&
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
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
          menuDataRender={menuDataRender}
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
      }
      {
        (currentUser && currentUser?.role?.name === 'Associate') &&
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuDataRender={menuDataRender}

          {...defaultPropsAssociate}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          menuDataRender={menuDataRender}

          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          formatMessage={formatMessage}

          // location={{
          //   pathname: '/projects',
          // }}
          collapsed
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.name === 'TECHVALUATOR' && !toShowEstimateValues) return null;
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
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
      }
      {
        (currentUser && currentUser?.role?.name === 'FINANCIAL') &&
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/project-cost')}
          menuDataRender={menuDataRender}

          {...defaultPropsOther}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          menuDataRender={menuDataRender}

          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          formatMessage={formatMessage}

          // location={{
          //   pathname: '/projects',
          // }}
          collapsed
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.name === 'TECHVALUATOR' && !toShowEstimateValues) return null;
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
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
      }
    </>
  );
};

export default connect(({ global, settings, user, language, login }) => ({
  collapsed: global.collapsed,
  settings,
  language,
  currentUser: user.currentUser,
  login
}))(BasicLayout);
