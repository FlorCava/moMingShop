import {UserAuthWrapper} from 'redux-auth-wrapper';
import {push} from 'react-router-redux';

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export function parseJSON(response) {
    return response.json();
}

export const requireAuthentication = UserAuthWrapper({
    authSelector: state => state.Common,
    predicate: Common => Common.isAuthenticated,
    redirectAction: push,
    wrapperDisplayName: 'UserIsJWTAuthenticated'
});

export function isEmptyObject(e) {
    var t;
    for (t in e) {
        return !1;
    }
    return !0
}