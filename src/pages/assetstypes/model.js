import { message } from 'antd';
import { history } from 'umi';

import {
  queryAssetTypeList,
  queryAssetTypeColumns,
  fakeSubmitForm,
  deleteAssetTypeById,
  updateForm,
  deleteMultipleAssetTypeById
} from './service';

const Model = {
  namespace: 'assetsTypesForm',
  state: {
    assetsTypeList: [],
    assetTypeTotalCount: 0,
    columnDefinitions: [],
    assetsTypesCreateStatus: {},
    assetsTypesDeleteReponse: {},
    assetsTypesMultipleDeleteReponse: {},
    assetsTypesUpdateReponse: {},
    multipleAssetTypeDeleteReponse: {}
  },
  effects: {
    *fetchAssetsType({ payload }, { call, put }) {
      const response = yield call(queryAssetTypeList, payload);
      yield put({
        type: 'reducerAssetsTypesList',
        payload: response.data,
      });
    },
    *fetchAssetTypeColumns({ payload }, { call, put }) {
      const response = yield call(queryAssetTypeColumns, payload);
      yield put({
        type: 'reducerColumnList',
        payload: response.data,
      });
    },
    *submitAssetTypeForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitForm, payload);
      yield put({
        type: 'reducerAssetTypeInsert',
        payload: response,
      });
    },
    *updateAssetType({ payload }, { call, put }) {
      const response = yield call(updateForm, payload);
      yield put({
        type: 'reducerAssetTypeUpdate',
        payload: response,
      });
    },
    *deleteAssetsTypesId({ payload, errorHandler }, { call, put }) {
      const response = yield call(deleteAssetTypeById, payload, errorHandler);
      // message.success("Customer deleted successfully");
      console.log("rewsponseeee", response)
      yield put({
        type: 'deleteAssetsTypes',
        payload: 'delete',
      });
    },
    *deleteMultipleAssetById({ payload, errorHandler }, { call, put }) {
      const response = yield call(deleteMultipleAssetTypeById, payload, errorHandler);
      if (response) {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'deleteMultipleAsset',
          payload: response,
        });
      }
    },
  },
  reducers: {
    reducerAssetsTypesList(state, action) {
      return { ...state, assetsTypeList: action.payload, assetTypeTotalCount: action.payload.totalCount?.count };
    },
    reducerColumnList(state, action) {
      return { ...state, columnDefinitions: action.payload };
    },
    reducerAssetTypeInsert(state, action) {
      return { ...state, assetsTypesCreateStatus: action.payload };
    },
    deleteAssetsTypes(state, action) {
      return { ...state, assetsTypesDeleteReponse: action.payload };
    },
    deleteMultipleAsset(state, action) {
      return { ...state, multipleAssetTypeDeleteReponse: action.payload };
    },
    reducerAssetTypeUpdate(state, action) {
      return { ...state, assetsTypesUpdateReponse: action.payload };
    },
    resetFormData(state, { payload }) {
      return {
        ...state,
        validationerror: '',
        assetsTypesCreateStatus: null,
        assetsTypesDeleteReponse: null,
        assetsTypesMultipleDeleteReponse: null,
        assetsTypesUpdateReponse: null,
        multipleAssetTypeDeleteReponse: null
      };
    },

  },
};
export default Model;
