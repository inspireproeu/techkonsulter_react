/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';
import { removeAuthority, removeAccessToken } from '@/utils/authority';

const codeMessage = {
	200: 'The server successfully returned the requested data.',
	201: 'New or modified data is successful.',
	202: 'A request has entered the background queue (asynchronous task).',
	204: 'The data was deleted successfully.',
	400: 'There was an error in the request sent, and the server did not create or modify data.',
	401: 'The user does not have permission',
	403: 'The user is authorized, but access is forbidden.',
	404: 'The request sent was for a record that did not exist.',
	406: 'The requested format is not available.',
	410: 'The requested resource is permanently deleted and will no longer be available.',
	422: 'A validation error occurred.',
	500: 'An error occurred in the server, please check the server.',
	502: 'Gateway error.',
	503: 'The service is unavailable.',
	504: 'The gateway timed out.'
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
	const { response } = error;

	if (response && response.status) {
		const errorText = "";//codeMessage[response.status] || response.statusText;
		const { status, url } = response;

		if (status === 401 || status === 403) {
			history.push({
				pathname: '/user/login'
			});
		} else {
			notification.error({
				message: `Request error ${status}: ${url}`,
				description: errorText
			});
		}
	}
	//  else if (!response) {
	// 	history.push({
	// 		pathname: '/user/login'
	// 	});
	// 	removeAuthority();
	// 	removeAccessToken();

	// 	notification.error({
	// 		description: 'Your network cannot connect to the server',
	// 		message: 'Network issue'
	// 	});
	// }

	return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
	errorHandler,
	prefix: API_PREFIX,
	headers: {
		Accept: 'application/json',
		//'Content-Type': 'application/x-www-form-urlencoded'
		'Content-Type': 'application/json'
	}
});
// const request = extend({
// 	errorHandler,
// 	prefix: API_PREFIX,
// 	headers: {
// 		Accept: 'application/json',
// 		'Content-Type': 'application/x-www-form-urlencoded'
// 	}
// });
export default request;
