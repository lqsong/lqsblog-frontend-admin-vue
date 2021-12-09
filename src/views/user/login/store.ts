import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { setToken } from '@/utils/localToken';
import { accountLogin, validateCodeImg } from './service';
import { LoginParamsType } from "./data.d";

export interface StateType {
    imgCodeDataLoading: boolean;
    imgCodeData: string;
    imgCodeToken: string;
    loginStatus?: 'ok' | 'error';
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        changeImgCodeDataLoading: Mutation<StateType>;
        changeImgCodeData: Mutation<StateType>;
        changeImgCodeToken: Mutation<StateType>;
        changeLoginStatus: Mutation<StateType>;
    };
    actions: {
        getImgCode: Action<StateType, StateType>;
        login: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    imgCodeDataLoading: false,
    imgCodeData: '',
    imgCodeToken: '',
    loginStatus: undefined,
}

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'userlogin',
    state: {
        ...initState
    },
    mutations: {
        changeImgCodeDataLoading(state, payload) {
            state.imgCodeDataLoading = payload;
        },
        changeImgCodeData(state, payload) {
            state.imgCodeData = payload;
        },
        changeImgCodeToken(state, payload) {
            state.imgCodeToken = payload;
        },
        changeLoginStatus(state, payload) {
            state.loginStatus = payload;
        },
    },
    actions: {
        async getImgCode ({ commit }) {
            commit('changeImgCodeDataLoading',true);

            try {
                const response: ResponseData = await validateCodeImg();
                const { data } = response;
                const { base64, tokenCode } = data;
                commit('changeImgCodeData', base64);
                commit('changeImgCodeToken', tokenCode);
                commit('changeImgCodeDataLoading',false);
                
            } catch (error) {
                console.log('getImgCode', error)
                commit('changeImgCodeDataLoading',false);
            }
            
        },
        async login({ commit }, payload: LoginParamsType) {
            let status: undefined | string = undefined;
            try {
                const response: ResponseData = await accountLogin(payload);
                const { data } = response;
                setToken(data.token || '');
                status = 'ok';
            } catch (error) {
                const err = error as any;
                if (err.message && err.message === 'CustomError') {
                    status = 'error';
                }
            }

            commit('changeLoginStatus',status);

            if (status === 'ok') {
                return true;
            } else if (status === 'error') {
                return false;
            }
            return undefined;
        }
    }
}

export default StoreModel;