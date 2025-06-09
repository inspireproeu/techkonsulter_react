import request from '@/utils/request';
export async function fakeRegister2(params) {
  return request('/register', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params, errorHandler) {
  return request('/salescrm/custom/signup', {
    errorHandler,
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}



