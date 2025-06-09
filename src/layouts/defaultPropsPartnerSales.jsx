export default {
  route: {
    path: '/',

    routes: [
      {
        path: '/assets',
        // icon: 'DatabaseOutlined',
        name: 'ASSETS',
        component: './assets/list',
      },
      {
        path: '/projects',
        // icon: 'form',
        name: 'PROJECTS',
        component: './projects/list',
      },
      {
        path: '/createproject',
        // icon: 'form',
        name: 'CREATE PROJECT',
        hideInMenu: true,
        component: './projects/components/AddNewProject',
      },
      {
        path: '/projectassets/:id',
        // icon: 'form',
        name: 'PROJECT ASSETS',
        hideInMenu: true,
        component: './assets/list',
      },
      {
        path: '/techvaluator',
        // icon: 'form',
        name: 'TECHVALUATOR',
        component: './assetvalue/list'
      },
      {
        component: '404',
      },
    ],
  }
};