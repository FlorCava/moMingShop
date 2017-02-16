import {
    REQUEST_LOGIN_USER,
    RECEIVE_LOGIN_USER,
    UPDATE_LOGIN_DRAFT,
    REQUEST_LOGOUT_USER
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

import jwtDecode from 'jwt-decode';

const defaultCommon = () => {
    return {
        loginName: '',
        loginPassword: '',
        token: null,
        userName: null,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: null
    }
};

const CommonReducer = (state = defaultCommon(), action) => {
    switch (action.type) {

        case REQUEST_LOGIN_USER:
            return update(state, {
                ['isAuthenticating']: {$set: true},
                ['statusText']: {$set: null}
            });
        case RECEIVE_LOGIN_USER:
            if (action.success) {
                return update(state, {
                    ['isAuthenticating']: {$set: false},
                    ['isAuthenticated']: {$set: true},
                    ['token']: {$set: action.token},
                    ['userName']: {$set: jwtDecode(action.token)._doc.name},
                    ['statusText']: {$set: '你已经成功登录系统。'}
                });
            } else {
                return update(state, {
                    ['isAuthenticating']: {$set: false},
                    ['isAuthenticated']: {$set: false},
                    ['token']: {$set: null},
                    ['userName']: {$set: null},
                    ['statusText']: {$set: `登录授权出错：${action.error}`}
                });
            }
        case REQUEST_LOGOUT_USER:
            return update(state, {
                ['isAuthenticated']: {$set: false},
                ['token']: {$set: null},
                ['userName']: {$set: null},
                ['statusText']: {$set: '你已经成功退出系统。'}
            });
        case UPDATE_LOGIN_DRAFT:
            return update(state, {
                [action.field]: {
                    $set: action.value
                }
            });

        default:
            return state;

    }
};

export default CommonReducer;