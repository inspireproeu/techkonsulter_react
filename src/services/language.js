import request from '@/utils/request';
import {getAccessToken } from '@/utils/authority';

export async function queryFetchLangs(params) {
  return request(`/salescrm/items/languages`, {
    method: 'GET',
    // params	
  });
}
export async function fakeLanguageEditForm(params, id, errorHandler) {
  return request(`/salescrm/items/languages/${id}`, {
    method: 'PATCH',
    errorHandler,
    data: params,
    headers: {
        'Authorization':`Bearer ${getAccessToken()}`,
      },
  });
}