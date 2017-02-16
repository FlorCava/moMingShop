import {
    GO_TO_PROPERTY_EDIT,
    REQUEST_PROPERTY_LIST,
    RECEIVE_PROPERTY_LIST,
    REQUEST_PROPERTY,
    RECEIVE_PROPERTY,
    UPDATE_PROPERTY_DRAFT,
    REQUEST_CREATE_PROPERTY,
    RECEIVE_CREATE_PROPERTY,
    REQUEST_UPDATE_PROPERTY,
    RECEIVE_UPDATE_PROPERTY,
    REQUEST_DELETE_PROPERTY,
    RECEIVE_DELETE_PROPERTY,
    OPEN_PROPERTY_DIALOG,
    CLOSE_PROPERTY_DIALOG,
    OPEN_PROPERTY_OPTION_DIALOG,
    CLOSE_PROPERTY_OPTION_DIALOG,
    UPDATE_PROPERTY_OPTION_DRAFT,
    UPDATE_PROPERTY_OPTION,
    REMOVE_PROPERTY_OPTION,
} from '../utils/constants';

import AppApi from '../api/AppApi';

import {push, goBack} from 'react-router-redux';

let PropertyActionCreators = {
    goToPropertyList(){
        return (dispatch) => {
            dispatch(this.fetchPropertyList());
            dispatch(goBack());
        }
    },
    goToPropertyEdit(url){
        return (dispatch) => {
            dispatch({type: GO_TO_PROPERTY_EDIT});
            dispatch(push(url));
        }
    },
    fetchPropertyList(page){
        if (!page) {
            page = 1;
        }
        return (dispatch) => {
            dispatch({type: REQUEST_PROPERTY_LIST});
            AppApi.fetchPropertyList(page).then(
                (properties) => dispatch({type: RECEIVE_PROPERTY_LIST, success: true, properties}),
                (error) => dispatch({type: RECEIVE_PROPERTY_LIST, success: false, error})
            );
        };
    },
    fetchProperty(propertyId){
        return (dispatch) => {
            dispatch({type: REQUEST_PROPERTY, propertyId: propertyId});
            if (propertyId) {
                AppApi.fetchProperty(propertyId).then(
                    (currentProperty) => dispatch({type: RECEIVE_PROPERTY, success: true, currentProperty}),
                    (error) => dispatch({type: RECEIVE_PROPERTY, success: false, error})
                );
            } else {
                dispatch({type: RECEIVE_PROPERTY, success: true, currentProperty: null});
            }
        };
    },
    addProperty(property){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_PROPERTY, property});
            AppApi.addProperty(property).then(
                (receiveNewProperty) => {
                    dispatch({type: RECEIVE_CREATE_PROPERTY, success: true, currentProperty: receiveNewProperty});
                    dispatch(this.goToPropertyList());
                },
                (error) => dispatch({type: RECEIVE_CREATE_PROPERTY, success: false, property, error})
            );
        };
    },
    updateProperty(propertyId, propertyDraft){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_PROPERTY, property: propertyDraft});
            AppApi.updateProperty(propertyId, propertyDraft).then(
                () => {
                    dispatch({type: RECEIVE_UPDATE_PROPERTY, success: true});
                    dispatch(this.goToPropertyList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_PROPERTY, success: false, propertyDraft, error})
            );
        };
    },
    deleteProperty(propertyId){
        return (dispatch) => {
            dispatch({type: REQUEST_DELETE_PROPERTY, propertyId: propertyId});
            AppApi.deleteProperty(propertyId).then(
                (message) => {
                    dispatch({type: RECEIVE_DELETE_PROPERTY, success: true, message: message});
                    dispatch(this.fetchPropertyList());
                },
                (error) => dispatch({type: RECEIVE_DELETE_PROPERTY, success: false, error})
            );
        };
    },
    updatePropertyDraft(field, value) {
        return {type: UPDATE_PROPERTY_DRAFT, field, value};
    },
    openPropertyDialog() {
        return {type: OPEN_PROPERTY_DIALOG};
    },
    closePropertyDialog() {
        return {type: CLOSE_PROPERTY_DIALOG};
    },
    openPropertyOptionDialog(optionIndex) {
        return {type: OPEN_PROPERTY_OPTION_DIALOG, optionIndex: optionIndex};
    },
    closePropertyOptionDialog() {
        return {type: CLOSE_PROPERTY_OPTION_DIALOG};
    },
    updatePropertyOptionDraft(field, value) {
        return {type: UPDATE_PROPERTY_OPTION_DRAFT, field, value};
    },
    updatePropertyOption(optionIndex, optionDraft){
        return (dispatch) => {
            dispatch({type: UPDATE_PROPERTY_OPTION, optionIndex: optionIndex, option: optionDraft});
        };
    },
    removePropertyOption(optionIndex){
        return (dispatch) => {
            dispatch({type: REMOVE_PROPERTY_OPTION, optionIndex: optionIndex});
        };
    },
};

export default PropertyActionCreators;