import request from '@/utils/request';

import {getAccessToken } from '@/utils/authority';

export async function queryAssetList(params) {
  return request('/Certus', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}

export async function queryCertusColumns(params) {
  return request('/Certus/columnDefinitions', {
    params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${getAccessToken()}`,
    },
  });
}