import {
    GO_TO_SPECIFICATION_EDIT,
    REQUEST_SPECIFICATION_LIST,
    RECEIVE_SPECIFICATION_LIST,
    REQUEST_SPECIFICATION,
    RECEIVE_SPECIFICATION,
    UPDATE_SPECIFICATION_DRAFT,
    REQUEST_CREATE_SPECIFICATION,
    RECEIVE_CREATE_SPECIFICATION,
    REQUEST_UPDATE_SPECIFICATION,
    RECEIVE_UPDATE_SPECIFICATION,
    REQUEST_DELETE_SPECIFICATION,
    RECEIVE_DELETE_SPECIFICATION,
    OPEN_SPECIFICATION_OPTION_DIALOG,
    CLOSE_SPECIFICATION_OPTION_DIALOG,
    UPDATE_SPECIFICATION_OPTION_DRAFT,
    UPDATE_SPECIFICATION_OPTION,
    REMOVE_SPECIFICATION_OPTION,
} from '../utils/constants';

import AppApi from '../api/AppApi';

import {push, goBack} from 'react-router-redux';

let SpecificationActionCreators = {
    goToSpecificationList(){
        return (dispatch) => {
            dispatch(this.fetchSpecificationList());
            dispatch(goBack());
        }
    },
    goToSpecificationEdit(url){
        return (dispatch) => {
            dispatch({type: GO_TO_SPECIFICATION_EDIT});
            dispatch(push(url));
        }
    },
    fetchSpecificationList(page){
        if (!page) {
            page = 1;
        }
        return (dispatch) => {
            dispatch({type: REQUEST_SPECIFICATION_LIST});
            AppApi.fetchSpecificationList(page).then(
                (specifications) => dispatch({type: RECEIVE_SPECIFICATION_LIST, success: true, specifications}),
                (error) => dispatch({type: RECEIVE_SPECIFICATION_LIST, success: false, error})
            );
        };
    },
    fetchSpecification(specificationId){
        return (dispatch) => {
            dispatch({type: REQUEST_SPECIFICATION, specificationId: specificationId});
            if (specificationId) {
                AppApi.fetchSpecification(specificationId).then(
                    (currentSpecification) => dispatch({type: RECEIVE_SPECIFICATION, success: true, currentSpecification}),
                    (error) => dispatch({type: RECEIVE_SPECIFICATION, success: false, error})
                );
            } else {
                dispatch({type: RECEIVE_SPECIFICATION, success: true, currentSpecification: null});
            }
        };
    },
    addSpecification(specification){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_SPECIFICATION, specification});
            AppApi.addSpecification(specification).then(
                (receiveNewSpecification) => {
                    dispatch({type: RECEIVE_CREATE_SPECIFICATION, success: true, currentSpecification: receiveNewSpecification});
                    dispatch(this.goToSpecificationList());
                },
                (error) => dispatch({type: RECEIVE_CREATE_SPECIFICATION, success: false, specification, error})
            );
        };
    },
    updateSpecification(specificationId, specificationDraft){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_SPECIFICATION, specification: specificationDraft});
            AppApi.updateSpecification(specificationId, specificationDraft).then(
                () => {
                    dispatch({type: RECEIVE_UPDATE_SPECIFICATION, success: true});
                    dispatch(this.goToSpecificationList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_SPECIFICATION, success: false, specificationDraft, error})
            );
        };
    },
    deleteSpecification(specificationId){
        return (dispatch) => {
            dispatch({type: REQUEST_DELETE_SPECIFICATION, specificationId: specificationId});
            AppApi.deleteSpecification(specificationId).then(
                (message) => {
                    dispatch({type: RECEIVE_DELETE_SPECIFICATION, success: true, message: message});
                    dispatch(this.fetchSpecificationList());
                },
                (error) => dispatch({type: RECEIVE_DELETE_SPECIFICATION, success: false, error})
            );
        };
    },
    updateSpecificationDraft(field, value) {
        return {type: UPDATE_SPECIFICATION_DRAFT, field, value};
    },
    openSpecificationOptionDialog(optionIndex) {
        return {type: OPEN_SPECIFICATION_OPTION_DIALOG, optionIndex: optionIndex};
    },
    closeSpecificationOptionDialog() {
        return {type: CLOSE_SPECIFICATION_OPTION_DIALOG};
    },
    updateSpecificationOptionDraft(field, value) {
        return {type: UPDATE_SPECIFICATION_OPTION_DRAFT, field, value};
    },
    updateSpecificationOption(optionIndex, optionDraft){
        return (dispatch) => {
            dispatch({type: UPDATE_SPECIFICATION_OPTION, optionIndex: optionIndex, option: optionDraft});
        };
    },
    removeSpecificationOption(optionIndex){
        return (dispatch) => {
            dispatch({type: REMOVE_SPECIFICATION_OPTION, optionIndex: optionIndex});
        };
    },
};

export default SpecificationActionCreators;