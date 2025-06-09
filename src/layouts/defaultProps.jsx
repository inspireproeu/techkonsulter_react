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
        path: '/clientusersList',
        name: 'CLIENT USERS LIST',
        component: './users/list'
      },
      {
        path: '/techvaluator',
        // icon: 'form',
        name: 'TECHVALUATOR',
        component: './assetvalue/list'
      },
      {
        path: '/createproject',
        // icon: 'form',
        name: 'CREATE PROJECT',
        hideInMenu: true,
        component: './projects/components/AddNewProject',
        authority: ['ADMIN', 'CLIENT'],
      },
      {
        path: '/projectassets/:id',
        // icon: 'form',
        name: 'PROJECT ASSETS',
        hideInMenu: true,
        component: './assets/list',
        authority: ['ADMIN', 'CLIENT'],
      },
      {
        component: '404',
      },

    ],
  },
  // location: {
  //   pathname: '/',
  // },
};