import request from '@/utils/request';

import { getAccessToken } from '@/utils/authority';

export async function queryAssetTypeList(params) {
  return request('/items/AssetType?limit=-1&sort=Asset_Name', {
    // params,
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}

export async function queryAssetTypeColumns(params) {
  return request('/items/AssetType/columnDefinitions', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}
export async function fakeSubmitForm(params) {
  if (!params.sampleco2)
    delete params.sampleco2
  if (!params.sample_weight)
    delete params.sample_weight

  return request('/items/AssetType', {
    method: 'POST',
    data: params,
    //requestType: 'form',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}
export async function updateForm(params) {
  if (!params.sampleco2)
    delete params.sampleco2
  if (!params.sample_weight)
    delete params.sample_weight
  return request(`/items/AssetType/${params.Asset_Id}`, {
    method: 'patch',
    data: params,
    //requestType: 'form',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}
export async function deleteAssetTypeById(params, errorHandler) {
  return request(`/items/AssetType`, {
    errorHandler,
    method: 'DELETE',
    data: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}
export async function deleteMultipleAssetTypeById(params, errorHandler) {
  return request(`/items/AssetType/multiple`, {
    errorHandler,
    method: 'DELETE',
    data: params.selectedAssetIds,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
}