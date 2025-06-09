import request from '@/utils/request';
import { getAccessToken } from '@/utils/authority';

export async function query() {
  return request('/users');
}
export async function queryCurrent(token) {
  // console.log("getAccessToken()",getAccessToken())
  // console.log("token",token)
  return request('/users/me?fields=role_name,first_name,last_name,role.description,email,id,role.id,phone_number,userType,partner.id,client.id,access,role.name,isDefault,warehouse,client.toShowEstimateValues,partner.toShowEstimateValues,partner.country,client.country', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token ? token : getAccessToken()}`,
    },
  });

  // return request('/currentUser');
}

export async function fakeUpdateUser(params, id, errorHandler) {

  return request(`/salescrm/users/${id}`, {
    errorHandler,
    method: 'PATCH',
    data: params,
    // requestType: 'form',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}

export async function queryNotices() {
  return request('/notices');
}
export async function queryFetchLangs(params) {
  return request(`/salescrm/items/languages`, {
    method: 'GET',
    // params	
  });
}