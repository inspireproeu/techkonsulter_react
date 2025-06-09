import { stringify } from 'querystring';
import { history } from 'umi';
import { message } from 'antd';

import { fakeAccountLogin } from '@/services/login';
import { setAuthority, getAccessToken, setAccessToken, removeAuthority, removeAccessToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { queryCurrent } from '@/services/user';

const Model = {
	namespace: 'login',
	state: {
		status: undefined,
		loginStatus: {}
	},
	effects: {
		*login({ payload, errorHandler }, { call, put }) {
			try {
				yield put({
					type: 'logoutResponse',
					payload: ''
				});
				const response = yield call(fakeAccountLogin, payload, errorHandler);

				if (response.data && response.data.access_token) {

					yield put({
						type: 'changeLoginStatus',
						payload: response.data
					});
					const userresponse = yield call(queryCurrent, response.data.access_token);
					// Login successfully
					// console.log("userresponse", userresponse)
					// return
					let userType = userresponse.data.userType
					// setAuthority(userType);
					let urlPath = ''
					if (userType !== 'ADMIN' && userType !== 'FINANCIAL') {
						urlPath = '/projects'
					} else if (userType === 'FINANCIAL') {
						urlPath = '/financials'
					} else {
						urlPath = '/'
					}
					history.replace(urlPath);
				} else {
					yield put({
						type: 'loginResponse',
						payload: response
					});
				}
			} catch (e) {
				//alert("error");
				//message.error('Failed');
			}
		},

		logout() {
			removeAuthority();
			removeAccessToken();
			history.replace({
				pathname: '/user/login'
			});
		}
	},
	reducers: {
		changeLoginStatus(state, { payload }) {
			// setAuthority(payload.currentAuthority);
			// setAuthority('admin');
			setAccessToken(payload.access_token);
			return { ...state, status: "ok", type: payload };
		},
		loginResponse(state, { payload }) {
			return { ...state, loginStatus: payload };
		},
		logoutResponse(state, { payload }) {
			return { ...state, logoutMessage: payload };
		}
	}
};
export default Model;
