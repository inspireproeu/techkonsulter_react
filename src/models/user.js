import { message } from 'antd';

import { queryCurrent, query as queryUsers, fakeUpdateUser } from '@/services/user';
import { history } from 'umi';
import { setAuthority,getAccessToken } from '@/utils/authority';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {

      const response = yield call(queryCurrent, getAccessToken());
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *updateCurrent({ payload, id, errorHandler }, { call, put }) {
      const response = yield call(fakeUpdateUser, payload, id, errorHandler);
      if (response && response.data && response.data.id) {
        message.success("Customer updated successfully");
        history.push({
          pathname: '/customer'
        });
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },

    *updatePassword({ payload, id, errorHandler }, { call, put }) {
      const response = yield call(fakeUpdateUser, payload, id, errorHandler);
      if (response && response.data && response.data.id) {
        message.success("Password updated successfully");
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      if(action?.payload?.data?.userType) {
        setAuthority(action.payload.data.userType);
      }
      return { ...state, currentUser: action.payload.data || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser
        },
      };
    },
  },
};
export default UserModel;
