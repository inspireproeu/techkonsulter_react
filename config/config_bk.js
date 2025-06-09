// https://umijs.org/config/
import { defineConfig } from 'umi';
import proxy from './proxy';
const { REACT_APP_ENV, API_PREFIX, SUB_DIR } = process.env;

export default defineConfig({
	hash: true,
	antd: {},
	dva: {
		hmr: true
	},

	define: {
		//REACT_APP_ENV: REACT_APP_ENV || '',
		API_PREFIX: API_PREFIX || '',
		SUB_DIR: SUB_DIR || '/'
	},

	locale: {
		default: 'sv-SE',
		// default true, when it is true, will use `navigator.language` overwrite default
		antd: true,
		baseNavigator: true
	},
	dynamicImport: {
		loading: '@/components/PageLoading/index'
	},
	targets: {
		ie: 11
	},
	// umi routes: https://umijs.org/docs/routing

	routes: [
		{
			path: '/',
			component: '../layouts/BlankLayout',
			routes: [
				{
					path: '/stocklist',
					component: '../layouts/BlankLayout',
					routes: [
						{
							name: 'exportproducts',
							hideInMenu: true,
							icon: 'smile',
							path: '/stocklist',
							component: './exportproducts'
						},
						{
							component: '404',
						},
					]
				},
				{
					path: '/assetvalues',
					component: '../layouts/BlankLayout',
					routes: [
						{
							name: 'assetvalues',
							hideInMenu: true,
							icon: 'smile',
							path: '/assetvalues',
							component: './exportassetsvalue'
						},
						{
							component: '404',
						},
					]
				},
				{
					path: '/brokerbin',
					component: '../layouts/BlankLayout',
					routes: [
						{
							name: 'brokerbin',
							hideInMenu: true,
							icon: 'smile',
							path: '/brokerbin',
							component: './brokerbin'
						},
						{
							component: '404',
						},
					]
				},
				{
					path: '/customer-stocklist',
					component: '../layouts/BlankLayout',
					routes: [
						{
							name: 'CUSTOMER STOCK LIST',
							hideInMenu: true,
							icon: 'smile',
							path: '/customer-stocklist',
							component: './brokerbin'
						},
						{
							component: '404',
						},
					]
				},
				{
					path: '/user',
					component: '../layouts/BlankLayout',
					routes: [

						{
							path: '/user',
							redirect: '/user/login'
						},
						{
							name: 'login',
							hideInMenu: true,
							icon: 'smile',
							path: '/user/login',
							component: './user/login'
						},
						{
							name: 'Register',
							hideInMenu: true,
							icon: 'smile',
							path: '/user/register',
							component: './user/register'
						},
						{
							name: 'exportproducts',
							hideInMenu: true,
							icon: 'smile',
							path: '/exportproducts',
							component: './exportproducts'
						},
						{
							component: '404'
						}
					]
				},
				{
					path: '/',
					component: '../layouts/BasicLayout',
					Routes: ['src/pages/Authorized'],
					authority: ['admin', 'user'],
					routes: [
						{
							path: '/',
							redirect: '/assets',
						},
						// {
						// 	path: '/assets',
						// 	// icon: 'DatabaseOutlined',
						// 	name: 'ASSETS',
						// 	component: './assets/list',
						// 	// authority: [ 'admin' ],
						// },
						{
							path: '/assets',
							// icon: 'DatabaseOutlined',
							name: 'ASSETS',
							component: './assets/list/index',
							// authority: [ 'admin' ],
						},
						{
							path: '/archieve-assets',
							// icon: 'DatabaseOutlined',
							name: 'ARCHIEVE ASSETS',
							component: './assets/list/index',
							// authority: [ 'admin' ],
						},
						// {
						// 	path: '/assetstype',
						// 	// icon: 'form',
						// 	name: 'ASSET TYPES',
						// 	component: './assetstypes/list',
						// 	// authority: [ 'admin' ],
						// },
						{
							path: '/assetstype',
							// icon: 'form',
							name: 'ASSET TYPES',
							component: './asset_types/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/users',
							// icon: 'form',
							name: 'USERS',
							component: './users/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/partnumbers',
							// icon: 'form',
							name: 'PARTNUMBER',
							component: './partnumbers/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/pallets',
							// icon: 'form',
							name: 'PALLETS',
							component: './pallets/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/certus',
							// icon: 'form',
							name: 'CERTUS',
							component: './certus/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/maintance',
							// icon: 'form',
							name: 'MAINTENANCE',
							component: './maintance/list/pricing/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/deviation',
							// icon: 'form',
							name: 'DEVIATION',
							component: './deviation/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/complaint',
							// icon: 'form',
							name: 'COMPLAINT',
							component: './complain/list',
							// authority: [ 'admin' ],
						},
						// {
						// 	path: '/instructions',
						// 	// icon: 'form',
						// 	name: 'INSTRUCTIONS',
						// 	component: './instructions/list',
						// 	// authority: [ 'admin' ],
						// },
						// {
						// 	path: '/chart',
						// 	// icon: 'form',
						// 	name: 'CHART',
						// 	component: './chart/list',
						// 	// authority: [ 'admin' ],
						// },
						{
							path: '/assetvalues',
							// icon: 'form',
							name: 'ASSETVALUES',
							component: './exportassetsvalue',
							// authority: [ 'admin' ],
						},
						{
							path: '/estimateassetsvalue',
							// icon: 'form',
							name: 'ESTIMATEASSETVALUES',
							component: './assetvalue/list',
						},
						{
							path: '/clientusersList/:id',
							// icon: 'form',
							name: 'CLIENT USERS LIST',
							hideInMenu: true,
							component: './users/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/clientusersList',
							// icon: 'form',
							name: 'CLIENT USERS LIST',
							hideInMenu: true,
							component: './users/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/partnerusersList/:id',
							// icon: 'form',
							name: 'PARTNER USERS LIST',
							hideInMenu: true,
							component: './users/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/partnerusersList',
							// icon: 'form',
							name: 'PARTNER USERS LIST',
							hideInMenu: true,
							component: './users/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/projects',
							// icon: 'form',
							name: 'PROJECTS',
							component: './projects/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/projects/:id',
							// icon: 'form',
							name: 'PROJECTS',
							hideInMenu: true,
							component: './projects/list',
							// authority: [ 'admin' ],
						},
						// {
						// 	path: '/createproject',
						// 	// icon: 'form',
						// 	name: 'CREATE PROJECT',
						// 	hideInMenu: true,
						// 	component: './projects/components/AddNewProject',
						// 	// authority: [ 'admin' ],
						// },
						{
							path: '/createproject',
							// icon: 'form',
							name: 'CREATE PROJECT',
							hideInMenu: true,
							component: './projects/components/CreateForm',
							// authority: [ 'admin' ],
						},
						{
							path: '/projectassets/:id',
							// icon: 'form',
							name: 'PROJECT ASSETS',
							hideInMenu: true,
							component: './assets/list/index',
							// authority: [ 'admin' ],
						},
						{
							path: '/updateproject/:id',
							// icon: 'form',
							name: 'UPDATE PROJECT',
							hideInMenu: true,
							component: './projects/components/CreateForm',
							// component: './projects/components/AddNewProject',
							// authority: [ 'admin' ],
						},
						{
							path: '/financials',
							// icon: 'form',
							name: 'FINANCIALS',
							component: './projects/list',
							hideChildrenInMenu: false
						},
						{
							path: '/clients',
							// icon: 'form',
							name: 'CLIENTS',
							component: './clients/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/createclient',
							// icon: 'form',
							name: 'CREATE CLIENT',
							hideInMenu: true,
							component: './clients/components/AddNew',
							// authority: [ 'admin' ],
						},
						{
							path: '/updateclient/:id',
							// icon: 'form',
							name: 'UPDATE CLIENT',
							hideInMenu: true,
							component: './clients/components/AddNew',
							// authority: [ 'admin' ],
						},
						{
							path: '/createaddress/:id',
							// icon: 'form',
							hideInMenu: true,
							name: 'CREATE SUB ADDRESS',
							component: './clients/components/CreateSubAddress',
							// authority: [ 'admin' ],
						},
						{
							path: '/updateaddress/:id',
							// icon: 'form',
							hideInMenu: true,
							name: 'Update SUB ADDRESS',
							component: './clients/components/CreateSubAddress',
							// authority: [ 'admin' ],
						},
						{
							path: '/clientsubaddress/:id',
							// icon: 'form',
							hideInMenu: true,
							name: 'SUB ADDRESS',
							component: './clients/components/SubAddressList',
							// authority: [ 'admin' ],
						},
						{
							path: '/createpartner',
							hideInMenu: true,
							name: 'CREATE PARTNER',
							component: './partners/components/AddNew',
							// authority: [ 'admin' ],
						},

						{
							path: '/partners',
							// icon: 'form',
							name: 'PARTNERS',
							component: './partners/list',
						},
						{
							path: '/updatepartner/:id',
							// icon: 'form',
							name: 'UPDATE PARTNER',
							hideInMenu: true,
							component: './partners/components/AddNew',
							// authority: [ 'admin' ],
						},
						{
							path: '/palletsassets/:id',
							// icon: 'form',
							name: 'PROJECT ASSETS',
							hideInMenu: true,
							component: './assets/list/index',
							// authority: [ 'admin' ],
						},
						{
							path: '/financials/:id',
							hideInMenu: true,
							name: 'FINANCIALS',
							component: './projects/list',
							hideChildrenInMenu: false
						},
						{
							path: '/project-cost',
							// icon: 'form',
							name: 'FINANCE',
							component: './finance/list',
							hideChildrenInMenu: false
						},
						{
							path: '/project-cost/:id',
							// icon: 'form',
							name: 'FINANCE',
							hideInMenu: true,
							component: './finance/list',
							hideChildrenInMenu: false
						},
						{
							path: '/brokerbin',
							// icon: 'form',
							name: 'BROKERBIN',
							component: './brokerbin',
							// authority: [ 'admin' ],
						},
						{
							path: '/files',
							// icon: 'form',
							name: 'FILES',
							component: './file/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/nerdfix-history',
							// icon: 'form',
							name: 'NERDFIX',
							component: './nerdfix/list',
							// authority: [ 'admin' ],
						},
						{
							path: '/nerdfix-history/:id',
							hideInMenu: true,
							name: 'NERDFIX',
							component: './nerdfix/list',
							// authority: [ 'admin' ],
						},
						{
							//path: '/brokerbin',
							// icon: 'form',
							// authority: ['admin', 'user'],

							name: 'STOCKLIST',
							component: './brokerbin',
							children: [
								{
									path: '/broker-bin',
									// icon: 'form',
									name: 'BROKERBIN',
									// component: './brokerbin',

								},
								{
									path: '/computer',
									// icon: 'form',
									name: 'COMPUTER',
									// component: './brokerbin',

								},
								{
									path: '/mobile',
									// icon: 'form',
									name: 'MOBILE',
									// component: './brokerbin',

								},
								{
									path: '/general',
									// icon: 'form',
									name: 'GENERAL',
									// component: './brokerbin',

								},
								{
									path: '/customer-stocklist',
									// icon: 'form',
									name: 'CUSTOMER STOCK LIST',
									// component: './brokerbin',
								}
							]
						},

						{
							component: '404',
						},
					],
				}
			]
		}
	],

	// Theme for antd: https://ant.design/docs/react/customize-theme-cn
	// Theme variables: D:\reactweb\signar4\node_modules\antd\es\style\themes\default.less
	theme: {
		// ...darkTheme,
		//'primary-color': defaultSettings.primaryColor,
		//'screen-sm':'1024px',
		'primary-color': '#004750',
		'info-color': '#232323',
		'success-color': '#70E878',
		//@processing-color: @blue-6;
		'error-color': '#F80059',
		'highlight-color': '#277FFF',
		//@warning-color: @gold-6,
		//@normal-color: #d9d9d9,
		black: '#2A2B2D',
		'border-radius-base': '6px',

		'interface-1-color': '#F6F9FB',
		'interface-2-color': '#D1D6DA',
		'interface-3-color': '#95A0B2',
		'interface-4-color': '#277FFF',

		'illustration-1-color': '#777B84',
		'illustration-2-color': '#CED5E0',
		'illustration-3-color': '#EAEEF4',
		'illustration-4-color': '#FFFFFF',

		'shadow-base': '0px 4px 16px rgba(0, 0, 0, 0.15)',
		'input-placeholder-color': '#9199AA',
		'layout-body-background': '#F6F9FB',

		'font-size-base': '12px',
		'headline-font-size': '24px',
		'title-font-size': '24px',
		'lines-font-size': '18px',
		'inputinfo-font-size': '16px',
		'button-font-size': '18px',
		'stepsmenu-font-size': '14px',

		'layout-header-background': '#232323',
		'menu-dark-submenu-bg': '#00a0c6',
		'font-family': "'Mulish', serif",
		'btn-font-family': "'Mulish', serif",
		'alert-error-bg-color': '#ffc3b9'
	},
	// @ts-ignore
	title: false,
	ignoreMomentLocale: false,
	proxy: proxy[REACT_APP_ENV || 'dev'],
	//publicPath: '/',
	manifest: {
		basePath: SUB_DIR
	}
});
