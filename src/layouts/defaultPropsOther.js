export default {
    route: {
      path: '/financials',
  
      routes: [
        {
          path: '/financials',
          name: 'FINANCIALS',
          component: './projects/list',
        },
        {
          path: '/project-cost',
          name: 'FINANCE',
          component: './finance/list',
        },
        {
          component: '404',
        },
      ],
    }
  };