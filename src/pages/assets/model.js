import { message } from 'antd';
import { history } from 'umi';

import { 
  queryAssetList,
  queryAssetsColumns,
  fakeSubmitForm,
  deleteAssetById,
  deleteMultipleAssetById,
  updateMultipleAssetById,
  updateAssetById,
  statusCodes,
  getAssetById,
  allAssetIds,
  insertMultipleAsset
} from './service';

const Model = {
  namespace: 'assetForm',
  state: {
    assetsList : [],
    assetTotalCount: 0,
    columnDefinitions: [],
    assetCreateStatus: {},
    assetDeleteReponse: {},
    multipleAssetDeleteReponse: {},
    multipleAssetUpdateReponse: {},
    singleAssetUpdateReponse: {},
    statusCodes: [],
    assetExistOrNot: [],
    assetIdsList: [],
    multipleAssetsStatus: []
  },
  effects: {
    *storeAssets({ payload }, { call, put }) {
      yield put({
        type: 'cacheAssetList',
        payload: payload,
      });
    },
    *fetchAssets({ payload }, { call, put }) {
      const response = yield call(queryAssetList, payload);
      // console.log("response.data", response)
      yield put({
        type: 'reducerAssetList',
        payload: response,
      });
    },
    *fetchAssetsId({ payload }, { call, put }) {
      const response = yield call(allAssetIds, payload);
      // console.log("response.data", response)
      yield put({
        type: 'reducerAssetIdList',
        payload: response,
      });
    },
    
    *checkAssetExists({ payload }, { call, put }) {
      const response = yield call(getAssetById, payload);
      // console.log("response.data", response)
      yield put({
        type: 'reducerFilterAssetList',
        payload: response,
      });
    }, 
    *fetchAssetsColumns({ payload }, { call, put }) {
      const response = yield call(queryAssetsColumns, payload);
      yield put({
        type: 'reducerColumnList',
        payload: response,
      });
    },
    *submitAssetForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitForm, payload);
      yield put({
        type: 'reducerAssetInsert',
        payload: response,
      });
      // if (response.status === 'success') { 
      //   yield put({
      //     type: 'reducerAssetInsert',
      //     payload: response,
      //   });
      // } else {
      //   message.success('Something went wrong.');
      // }
    },
    *deleteAssetId({ payload, errorHandler}, { call, put }) {
      const response = yield call(deleteAssetById, payload, errorHandler);
      if(response)
      {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'deleteAsset',
          payload: response,
        });        
      }
    },
    *deleteMultipleAssetById({ payload, errorHandler}, { call, put }) {
      const response = yield call(deleteMultipleAssetById, payload, errorHandler);
      if(response)
      {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'deleteMultipleAsset',
          payload: response,
        });        
      }
    },
    *createMultipleAssetById({ payload, errorHandler}, { call, put }) {
      const response = yield call(insertMultipleAsset, payload, errorHandler);
      if(response)
      {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'createMultipleAsset_id',
          payload: response,
        });        
      }
    },
    
    *updateMultipleAssetById({ payload, errorHandler}, { call, put }) {
      const response = yield call(updateMultipleAssetById, payload, errorHandler);
      if(response)
      {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'updateMultipleAsset',
          payload: response,
        });        
      }
    },
    *updateSingleAssetById({ payload, errorHandler}, { call, put }) {
      const response = yield call(updateAssetById, payload, errorHandler);
      if(response)
      {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'updateSingleAsset',
          payload: response,
        });        
      }
    },
    *fetchStatusCodes({ payload }, { call, put }) {
      const response = yield call(statusCodes, payload);
      yield put({
        type: 'reducerStatusCodes',
        payload: response,
      });
    },
  },
  reducers: {
    cacheAssetList(state, action) {
      console.log("action.payload", action.payload)
      return { ...state, assetsList: action.payload.data};
    },
    reducerAssetList(state, action) {
      return { ...state, assetsList: action.payload.assets, assetTotalCount:  action.payload.totalCount?.count};
    },
    
    reducerFilterAssetList(state, action) {
      return { ...state, assetExistOrNot: action.payload.assets};
    },
    reducerAssetIdList(state, action) {
      return { ...state, assetIdsList: action.payload.assetsId};
    },
    reducerColumnList(state, action) {
      return { ...state, columnDefinitions: action.payload.data};
    },
    reducerAssetInsert(state, action) {
      return { ...state, assetCreateStatus: action.payload};
    },
    createMultipleAsset_id(state, action) {
      return { ...state, multipleAssetsStatus: action.payload};
    },
    deleteAsset(state, action) {
      return { ...state, assetDeleteReponse: action.payload};
    },
    deleteMultipleAsset(state, action) {
      return { ...state, multipleAssetDeleteReponse: action.payload};
    },
    updateMultipleAsset(state, action) {
      // console.log("action.payload", action.payload)
      return { ...state, multipleAssetUpdateReponse: action.payload};
    },
    updateSingleAsset(state, action) {
      // console.log("action.payload", action.payload)
      return { ...state, singleAssetUpdateReponse: action.payload};
    },
    reducerStatusCodes(state, action) {
      return { ...state, statusCodes: action.payload.status_codes};
    },
		resetFormData(state, { payload }) {
      return { ...state,
        assetsList: [], 
        validationerror: '', 
        assetCreateStatus: null,
        assetDeleteReponse: null,
        multipleAssetDeleteReponse: null,
        multipleAssetUpdateReponse: null,
        singleAssetUpdateReponse: null,
        assetExistOrNot: null
      };
    },

  },
};
export default Model;
