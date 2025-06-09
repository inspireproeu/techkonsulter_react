
export default {
  dev: {
    '/api/': {
      target: 'https://productionapi.techkonsult.se',
      target1: 'https://productionv2demo.inspirepro.eu',
      // target: 'http://0.0.0.0:8073',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },         
    // '/api/': {
    //   target: 'http://techapidev.inspirepro.co.in',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^': '',
    //   },
    // },   
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
