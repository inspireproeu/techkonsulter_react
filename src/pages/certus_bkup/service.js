import request from '@/utils/request';

import {getAccessToken } from '@/utils/authority';

export async function queryAssetList(params) {
  return request('/certus', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}

export async function queryCertusColumns(params) {
  return request('/certus/columnDefinitions', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}