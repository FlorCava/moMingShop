import { push } from 'react-router-redux';
import {
    REQUEST_LOGIN_USER,
    RECEIVE_LOGIN_USER,
    REQUEST_LOGOUT_USER,
    UPDATE_LOGIN_DRAFT
} from '../utils/constants';

import AppApi from '../api/AppApi';

let CommonActionCreators = {
    logout() {
        localStorage.removeItem('token');
        return {
            type: REQUEST_LOGOUT_USER
        }
    },
    logoutAndRedirect() {
        return (dispatch, state) => {
            dispatch(this.logout());
            dispatch(push('/login'));
        }
    },
    auth(name, password, redirect="/"){
        return (dispatch) => {
            dispatch({type: REQUEST_LOGIN_USER});
            AppApi.auth(name, password).then(
                (result) => {
                    dispatch(this.loginUserSuccess(result.token));
                    dispatch(push(redirect));
                },
                (error) => {
                    localStorage.removeItem('token');
                    dispatch({type: RECEIVE_LOGIN_USER, success: false, error})
                }
            );
        };
    },
    loginUserSuccess(token){
        localStorage.setItem('token', token);
        return {type: RECEIVE_LOGIN_USER, success: true, token: token};
    },
    updateLoginDraft(field, value) {
        return {type: UPDATE_LOGIN_DRAFT, field, value};
    }
};

export default CommonActionCreators;