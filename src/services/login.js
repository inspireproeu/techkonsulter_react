import request from '@/utils/request';
export async function fakeAccountLogin(params, errorHandler) {
  // console.log("params ******", params)

  return request('/auth/login', {
    errorHandler,
    method: 'POST',
    data: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

}

export async function getFakeCaptcha(mobile) {
  return request(`/login/captcha?mobile=${mobile}`);
}
