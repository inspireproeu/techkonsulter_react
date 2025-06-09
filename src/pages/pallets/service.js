import request from '@/utils/request';

import {getAccessToken } from '@/utils/authority';

export async function queryPalletList(params) {
  return request('/items/Pallets', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}
export async function queryPalletColumns(params) {
  return request('/items/Pallets/columnDefinitions', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}
export async function statusCodes(params) {
  return request('/items/Pallets/statusCodes', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}
export async function inproduction(params) {
  return request('/items/Pallets/inproduction', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/items/Pallets', {
    method: 'POST',
    data: params,
    //requestType: 'form',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}
export async function deletePalletById(params, errorHandler) {
  return request(`/items/Pallets`, {
    errorHandler,
    method: 'DELETE',
    data: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },  
  });
}
export async function fakeSubmitUpdate(params) {
  return request('/items/Pallets', {
    method: 'PUT',
    data: params,
    //requestType: 'form',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}