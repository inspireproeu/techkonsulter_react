import { fakeRegister } from './service';
const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload, errorHandler}, { call, put }) {
      const response = yield call(fakeRegister, payload, errorHandler);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.data.id ? "ok":'' };
    },
  },
};
export default Model;
