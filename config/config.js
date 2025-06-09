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
						{
							path: '/assets',
							// icon: 'DatabaseOutlined',
							name: 'ASSETS',
							component: './assets/list/index',

						},
						{
							path: '/projects',
							// icon: 'form',
							name: 'PROJECTS',
							component: './projects/list',

						},
						{
							path: '/projects/:id',
							// icon: 'form',
							name: 'PROJECTS',
							hideInMenu: true,
							component: './projects/list',

						},
						{
							path: '/createproject',
							// icon: 'form',
							name: 'CREATE PROJECT',
							hideInMenu: true,
							component: './projects/components/CreateForm',

						},
						{
							path: '/projectassets/:id',
							// icon: 'form',
							name: 'PROJECT ASSETS',
							hideInMenu: true,
							component: './assets/list/index',

						},
						{
							path: '/updateproject/:id',
							// icon: 'form',
							name: 'UPDATE PROJECT',
							hideInMenu: true,
							component: './projects/components/CreateForm',
							// component: './projects/components/AddNewProject',

						},
						{
							path: '/financials',
							// icon: 'form',
							name: 'FINANCIALS',
							component: './projects/list',
							hideChildrenInMenu: false
						},

						{
							path: '/partnumbers',
							// icon: 'form',
							name: 'PARTNUMBER',
							component: './partnumbers/list',

						},
						{
							path: '/clients',
							hideInMenu: true,
							name: 'CLIENTS',
							component: './clients/list',

						},
						{
							path: '/clientusersList/:id',
							// icon: 'form',
							name: 'CLIENT USERS LIST',
							hideInMenu: true,
							component: './users/list',

						},
						{
							path: '/clientusersList',
							// icon: 'form',
							name: 'CLIENT USERS LIST',
							hideInMenu: true,
							component: './users/list',

						},
						{
							path: '/partnerusersList/:id',
							// icon: 'form',
							name: 'PARTNER USERS LIST',
							hideInMenu: true,
							component: './users/list',

						},
						{
							path: '/partnerusersList',
							// icon: 'form',
							name: 'PARTNER USERS LIST',
							hideInMenu: true,
							component: './users/list',

						},


						{
							path: '/createclient',
							// icon: 'form',
							name: 'CREATE CLIENT',
							hideInMenu: true,
							component: './clients/components/AddNew',

						},
						{
							path: '/updateclient/:id',
							// icon: 'form',
							name: 'UPDATE CLIENT',
							hideInMenu: true,
							component: './clients/components/AddNew',

						},
						{
							path: '/createaddress/:id',
							// icon: 'form',
							hideInMenu: true,
							name: 'CREATE SUB ADDRESS',
							component: './clients/components/CreateSubAddress',

						},
						{
							path: '/updateaddress/:id',
							// icon: 'form',
							hideInMenu: true,
							name: 'Update SUB ADDRESS',
							component: './clients/components/CreateSubAddress',

						},
						{
							path: '/clientsubaddress/:id',
							// icon: 'form',
							hideInMenu: true,
							name: 'SUB ADDRESS',
							component: './clients/components/SubAddressList',

						},
						{
							path: '/createpartner',
							hideInMenu: true,
							name: 'CREATE PARTNER',
							component: './partners/components/AddNew',

						},

						{
							path: '/partners',
							hideInMenu: true,
							name: 'PARTNERS',
							component: './partners/list',
						},
						{
							path: '/updatepartner/:id',
							// icon: 'form',
							name: 'UPDATE PARTNER',
							hideInMenu: true,
							component: './partners/components/AddNew',

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
							hideInMenu: true,
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
							path: '/assetvalues',
							hideInMenu: true,
							name: 'ASSETVALUES',
							component: './exportassetsvalue',

						},
						{
							path: '/techvaluator',
							hideInMenu: true,
							name: 'TECHVALUATOR',
							component: './assetvalue/list',
						},
						{
							path: '/broker-bin',
							name: 'BROKERBIN',
							component: './brokerbin',
							hideInMenu: true,
						},
						{
							path: '/computer-se',
							hideInMenu: true,
							name: 'COMPUTER SE',
							component: './brokerbin',

						},
						{
							path: '/mobile-se',
							hideInMenu: true,
							name: 'MOBILE SE',
							component: './brokerbin',

						},
						{
							path: '/general-se',
							hideInMenu: true,
							name: 'GENERAL SE',
							component: './brokerbin',

						},
						{
							path: '/customer-stocklist',
							hideInMenu: true,
							name: 'CUSTOMER STOCK LIST',
							component: './brokerbin',
						},
						{
							path: '/computer-nl',
							hideInMenu: true,
							name: 'COMPUTER NL',
							component: './brokerbin',

						},
						{
							path: '/mobile-nl',
							hideInMenu: true,
							name: 'MOBILE NL',
							component: './brokerbin',

						},
						{
							path: '/general-nl',
							hideInMenu: true,
							name: 'GENERAL NL',
							component: './brokerbin',

						},
						{
							path: '/maintance',
							name: 'MAINTENANCE',
							component: './maintance/list/pricing/list',
							hideInMenu: true,
						},
						{
							path: '/pallets',
							name: 'PALLETS',
							component: './pallets/list',
							hideInMenu: true,
						},
						{
							path: '/deviation',
							hideInMenu: true,
							name: 'DEVIATION',
							component: './deviation/list',
						},
						{
							path: '/complaint',
							hideInMenu: true,
							name: 'COMPLAINT',
							component: './complain/list',
						},
						{
							path: '/archieve-assets',
							hideInMenu: true,
							name: 'ARCHIEVE ASSETS',
							component: './assets/list/index',

						},
						{
							path: '/assetstype',
							hideInMenu: true,
							name: 'ASSET TYPES',
							component: './asset_types/list',

						},
						{
							path: '/users',
							hideInMenu: true,
							name: 'USERS',
							component: './users/list',

						},

						{
							path: '/certus',
							hideInMenu: true,
							name: 'CERTUS',
							component: './certus/list',

						},
						{
							path: '/palletsassets/:id',
							hideInMenu: true,
							name: 'PROJECT ASSETS',
							hideInMenu: true,
							component: './assets/list/index',

						},

						{
							path: '/files',
							hideInMenu: true,
							name: 'FILES',
							component: './file/list',

						},
						{
							path: '/nerdfix-history',
							hideInMenu: true,
							name: 'NERDFIX',
							component: './nerdfix/list',

						},
						{
							path: '/nerdfix-history/:id',
							hideInMenu: true,
							name: 'NERDFIX',
							component: './nerdfix/list',

						},
						{
							path: '/asset-history/:id',
							hideInMenu: true,
							name: 'ASSET HISTORY',
							component: './asset_history/list',
						},
						{
							component: '404',
						},

						{
							name: 'PROJECT GROUP',
							icon: 'Right',
							children: [
								{
									path: '/projects',
									// icon: 'form',
									name: 'PROJECTS',
									// component: './projects/list',

								},
								{
									path: '/financials',
									// icon: 'form',
									name: 'FINANCIALS',
									hideChildrenInMenu: false
								},
								{
									path: '/clients',
									name: 'CLIENTS',
								},
								{
									path: '/partners',
									name: 'PARTNERS',
								},
								{
									path: '/project-cost',
									name: 'PROJECT COSTS',
								},
								{
									path: '/assetvalues',
									name: 'ASSETVALUES',
								},
								{
									path: '/techvaluator',
									name: 'TECHVALUATOR',
								},
							]
						},

						{
							name: 'SALES',
							icon: 'Right',
							children: [
								{
									name: 'STOCKLIST',
									children: [
										{
											path: '/broker-bin',
											name: 'BROKERBIN',
										},
										{
											path: '/computer-se',
											name: 'COMPUTER SE',
										},
										{
											path: '/mobile-se',
											name: 'MOBILE SE',
										},
										{
											path: '/general-se',
											name: 'GENERAL SE',
										},
										{
											path: '/customer-stocklist',
											name: 'CUSTOMER STOCK LIST',
										},
										{
											path: '/computer-nl',
											name: 'COMPUTER NL',
										},
										{
											path: '/mobile-nl',
											name: 'MOBILE NL',
										},
										{
											path: '/general-nl',
											name: 'GENERAL NL'
										}
									]
								},
								{
									path: '/broker-bin',
									name: 'BROKERBIN',
								},
								{
									path: '/maintance',
									name: 'PRICING',
								},
							]
						},


						{
							name: 'SETTINGS',
							icon: 'Right',
							children: [
								{
									path: '/pallets',
									name: 'PALLETS',
								},
								{
									path: '/partnumbers',
									name: 'PARTNUMBER',
								},
								{
									path: '/complaint',
									name: 'COMPLAINT',
								},
								{
									path: '/deviation',
									name: 'DEVIATION',
								},
								{
									path: '/users',
									name: 'USERS',
								},
								{
									path: '/files',
									name: 'FILES',
								},
								{
									path: '/archieve-assets',
									name: 'ARCHIEVE ASSETS'
								},
								{
									path: '/assetstype',
									name: 'ASSET TYPES',
								},
								{
									path: '/certus',
									name: 'CERTUS',

								},
								{
									path: '/nerdfix-history',
									name: 'NERDFIX',

								},
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
