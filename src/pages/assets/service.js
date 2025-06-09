import request from '@/utils/request';

import {getAccessToken } from '@/utils/authority';

export async function queryAssetList(params) {
  return request('/items/Assets', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}
export async function queryAssetsColumns(params) {
  return request('/items/Asset_Column_Definitions', {
    params,
    headers: {
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}
export async function fakeSubmitForm(params) {
  return request('/items/Assets', {
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
export async function deleteAssetById(params, errorHandler) {
  return request(`/items/Assets`, {
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
export async function deleteMultipleAssetById(params, errorHandler) {
  return request(`/Assets/multiple`, {
    errorHandler,
    method: 'DELETE',
    data: params.selectedAssetIds,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },  
  });
}
export async function updateMultipleAssetById(params, errorHandler) {
  return request(`/Assets/multiple`, {
    errorHandler,
    method: 'PUT',
    data: params.selectedData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },  
  });
}

export async function insertMultipleAsset(params, errorHandler) {
  return request(`/Assets/multiple`, {
    errorHandler,
    method: 'POST',
    data: params.selectedData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },  
  });
}

export async function updateAssetById(params, errorHandler) {
  return request(`/items/Assets`, {
    errorHandler,
    method: 'PUT',
    data: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },  
  });
}
export async function statusCodes(params) {
  return request('items/Status_Codes', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}

export async function getAssetById(params) {
  return request('/Assets/checkValueExist', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}

export async function allAssetIds() {
  return request('/Assets/allAssetIds', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}

