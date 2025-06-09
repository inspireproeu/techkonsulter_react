import pathRegexp from 'path-to-regexp';

let extraRoutes = [
	{
		path: '/overview',
        name: '数据总览',
        redirect: '/forms/byggnadskreditiv',
		children: [
			{
				path: '/overview/daily',
				name: 'analysis12',
				children: null,
				component: './forms/byggnadskreditiv',
				authority: null
			}
		],
		authority: [ 'admin', 'user' ]
	}
];

const updateRouteAuthority = (path, routeData, sAuth) => {
	if (routeData && Array.isArray(routeData)) {
		routeData.forEach((route) => {
			if (route.path) {
				if (route.path === '/' || pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
					if (route.path === path && sAuth) {
						route.authority = sAuth;
					}
					if (route.routes) {
						updateRouteAuthority(path, route.routes, sAuth);
					}
				}
			}
		});
	}
};

const patchEachRoute = (serverRoute, routes) => {
	if (serverRoute && Array.isArray(serverRoute)) {
		serverRoute.forEach((eRoute) => {
			updateRouteAuthority(`${eRoute.path}`, routes, eRoute.authority);
			if (eRoute.children) {
				patchEachRoute(eRoute.children, routes);
			}
		});
	}
};

export function patchRoutes(routes) {
	if (extraRoutes) {
		patchEachRoute(extraRoutes, routes);
	}
}

export function render(oldRender) {
	oldRender();

	/*  fetch('/api/account/get_route',{method:'POST'})
    .then(res=>res.json())
    .then(res => {
      if(res.code === 0){
        extraRoutes = res.data;
      }
      oldRender();
  }) */
}
