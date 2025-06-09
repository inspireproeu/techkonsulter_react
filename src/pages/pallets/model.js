import { message } from 'antd';
import { history } from 'umi';

import { 
  queryPalletList,
  queryPalletColumns,
  fakeSubmitForm,
  deletePalletById,
  statusCodes,
  fakeSubmitUpdate,
  inproduction
} from './service';

const Model = {
  namespace: 'palletsForm',
  state: {
    palletsList : [],
    palletsTotalCount: 0,
    columnDefinitions: [],
    palletsCreateStatus: {},
    palletsDeleteReponse: {},
    statusCodes: [],
    palletsUpdateStatus: {},
    palletsInProduction: []
  },
  effects: {
    *fetchPallets({ payload }, { call, put }) {
      const response = yield call(queryPalletList, payload);
      yield put({
        type: 'reducerPalletsList',
        payload: response.data,
      });
    },
    *fetchPalletsColumns({ payload }, { call, put }) {
      const response = yield call(queryPalletColumns, payload);
      yield put({
        type: 'reducerColumnList',
        payload: response.data,
      });
    },
    *fetchStatusCodes({ payload }, { call, put }) {
      const response = yield call(statusCodes, payload);
      yield put({
        type: 'reducerStatusCodes',
        payload: response.data,
      });
    },
    *fetchPalletsInproduction({ payload }, { call, put }) {
      const response = yield call(inproduction, payload);
      yield put({
        type: 'reducerPalletsInproduction',
        payload: response.data,
      });
    },
    *submitPalletsForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitForm, payload);
      yield put({
        type: 'reducerPalletsInsert',
        payload: response,
      });
    },
    *submitPalletsUpdateForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitUpdate, payload);
      yield put({
        type: 'reducerPalletsUpdate',
        payload: response,
      });
    },
    *deletePalletsId({ payload, errorHandler}, { call, put }) {
      const response = yield call(deletePalletById, payload, errorHandler);

      if(response)
      {
        // message.success("Customer deleted successfully");
        yield put({
          type: 'deletePallets',
          payload: response.data,
        });        
      }
    },
  },
  reducers: {
    reducerPalletsList(state, action) {
      return { ...state, palletsList: action.payload, palletsTotalCount:  action.payload.totalCount?.count};
    },
    reducerColumnList(state, action) {
      return { ...state, columnDefinitions: action.payload};
    },
    reducerStatusCodes(state, action) {
      return { ...state, statusCodes: action.payload.statusCodes};
    },
    reducerPalletsInproduction(state, action) {
      return { ...state, palletsInProduction: action.payload.pallets};
    },
    
    reducerPalletsUpdate(state, action) {
      return { ...state, palletsUpdateStatus: action.payload};
    },
    reducerPalletsInsert(state, action) {
      return { ...state, palletsCreateStatus: action.payload};
    },
    deletePallets(state, action) {
      return { ...state, palletsDeleteReponse: action.payload};
    },
		resetFormData(state, { payload }) {
      return { ...state, 
        validationerror: '', 
        palletsCreateStatus: null,
        palletsDeleteReponse: null,
        palletsUpdateStatus: null
      };
    },

  },
};
export default Model;
