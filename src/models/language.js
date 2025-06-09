import { queryFetchLangs, fakeLanguageEditForm } from '@/services/language';
import { getLocale } from 'umi';

const Model = {
	namespace: 'language',
	state: {
		swedish_language: {},
		localeLanguage: {},
		languageList: [],
		languageUpdateStatus: undefined
	},
	effects: {
		*fetchLanguage(_, { call, put }) {
			const response = yield call(queryFetchLangs);
			if(response.data && response.data?.length > 0) {
				let swedishLang = {};
				let englishLang = {};
				response.data.forEach(item => {
					swedishLang[item.keyword] = item.swedish;
					englishLang[item.keyword] = item.english;
				  });
				yield put({
				  type: 'saveLanguage',
				  payload: {
					swedishLang: swedishLang,
					englishLang: englishLang,
					languageList: response
				  },
				});
			}
			
		},
		*updateLanguage({ payload, errorHandler }, { call, put }) {
			let id = payload.id;
			delete payload['id'];
			const response = yield call(
			  fakeLanguageEditForm, 
				payload,
				id,
				errorHandler
			  );
			if (!response || response?.data?.id ) {
			  yield put({
				type: 'updateLanguageReducer',
				payload: response
			  });
			  // message.success('Status updated successfully.');
			  // history.push({
			  //   pathname: '/brand'
			  // });
			} else {
			  message.success('Something went wrong.');
			}
		  },
	},
	reducers: {
		saveLanguage(state, { payload }) {
			return { ...state,
				languageList: payload.languageList,
				localeLanguage: (getLocale() === 'en-US' ? payload.englishLang : payload.swedishLang) 
			};
		},
		updateLanguageReducer(state, { payload }) {
			return { ...state, languageUpdateStatus: payload?.data?.id ? "ok":'ok' };

		},
		resetLanguage(state, { }) {
			return { ...state, languageUpdateStatus: undefined };
		}
	}
};
export default Model;
