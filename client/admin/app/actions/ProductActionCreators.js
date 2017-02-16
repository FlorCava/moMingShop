import {
    GO_TO_PRODUCT_EDIT,
    REQUEST_PRODUCT_LIST,
    RECEIVE_PRODUCT_LIST,
    REQUEST_PRODUCT,
    RECEIVE_PRODUCT,
    UPDATE_PRODUCT_DRAFT,
    REQUEST_CREATE_PRODUCT_STEP_ONE,
    RECEIVE_CREATE_PRODUCT_STEP_ONE,
    REQUEST_UPDATE_PRODUCT_STEP_ONE,
    RECEIVE_UPDATE_PRODUCT_STEP_ONE,
    REQUEST_UPDATE_PRODUCT_STEP_TWO,
    RECEIVE_UPDATE_PRODUCT_STEP_TWO,
    REQUEST_UPDATE_PRODUCT_STEP_THREE,
    RECEIVE_UPDATE_PRODUCT_STEP_THREE,
    REQUEST_CREATE_PRODUCT,
    RECEIVE_CREATE_PRODUCT,
    REQUEST_UPDATE_PRODUCT,
    RECEIVE_UPDATE_PRODUCT,
    REQUEST_DELETE_PRODUCT,
    RECEIVE_DELETE_PRODUCT,
    REQUEST_PRODUCT_OPTIONS_SPECIFICATION_LIST,
    RECEIVE_PRODUCT_OPTIONS_SPECIFICATION_LIST,
    OPEN_PRODUCT_OPTIONS_SPEC_OPT_POP,
    CLOSE_PRODUCT_OPTIONS_SPEC_OPT_POP,
    ADD_PRODUCT_OPTIONS_DRAFT,
    ADD_PRODUCT_OPTIONS_DRAFT_WITH_NEW,
    REMOVE_PRODUCT_OPTIONS_DRAFT,
    ADD_PRODUCT_OPTIONS_OPT_DRAFT,
    ADD_PRODUCT_OPTIONS_OPT_DRAFT_WITH_NEW,
    REMOVE_PRODUCT_OPTIONS_OPT_DRAFT,
    UPDATE_PRODUCT_OPTIONS_DRAFT,
    CREATE_PRODUCT_OPTIONS_CONTENT_DRAFT,
    UPDATE_PRODUCT_OPTIONS_CONTENT_DRAFT,
    REQUEST_CREATE_PRODUCT_IMAGES,
    RECEIVE_CREATE_PRODUCT_IMAGES,
    REQUEST_REMOVE_PRODUCT_IMAGES,
    RECEIVE_REMOVE_PRODUCT_IMAGES,
    REQUEST_REMOVE_PRODUCT_BASE_IMAGE,
    RECEIVE_REMOVE_PRODUCT_BASE_IMAGE,
    REQUEST_PRODUCT_IMAGES_DELETE_ONE,
    RECEIVE_PRODUCT_IMAGES_DELETE_ONE,
    REQUEST_PRODUCT_BASE_IMAGE_ADD,
    RECEIVE_PRODUCT_BASE_IMAGE_ADD,
    REQUEST_PRODUCT_BASE_IMAGE_DELETE,
    RECEIVE_PRODUCT_BASE_IMAGE_DELETE,
    REQUEST_STEP_NEXT,
    REQUEST_STEP_PREV,
} from '../utils/constants';
import AppApi from '../api/AppApi';
import {push, goBack} from 'react-router-redux';
import {getCurrentProductSpecification} from '../reducers/ProductReducer';

let ProductActionCreators = {
    goToProductList(){
        return (dispatch) => {
            dispatch(this.fetchProductList());
            dispatch(goBack());
        }
    },
    goToProductEdit(productId){
        return (dispatch) => {
            dispatch({type: GO_TO_PRODUCT_EDIT});
            dispatch(push(productId ? `products/edit/${productId}` : 'products/new'));
        }
    },
    fetchProductList(page){
        if (!page) {
            page = 1;
        }
        return (dispatch) => {
            dispatch({type: REQUEST_PRODUCT_LIST});
            AppApi.fetchProductList(page).then(
                (products) => dispatch({type: RECEIVE_PRODUCT_LIST, success: true, products}),
                (error) => dispatch({type: RECEIVE_PRODUCT_LIST, success: false, error})
            );
        };
    },
    fetchProduct(productId){
        return (dispatch) => {
            dispatch({type: REQUEST_PRODUCT, productId: productId});
            if (productId) {
                AppApi.fetchProduct(productId).then(
                    (currentProduct) => dispatch({type: RECEIVE_PRODUCT, success: true, currentProduct}),
                    (error) => dispatch({type: RECEIVE_PRODUCT, success: false, error})
                );
            } else {
                dispatch({type: RECEIVE_PRODUCT, success: true, currentProduct: null});
            }
        };
    },
    addProductStepOne(product, stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_PRODUCT_STEP_ONE, product});
            AppApi.addProductStepOne(product).then(
                (receiveNewProduct) => {
                    dispatch({
                        type: RECEIVE_CREATE_PRODUCT_STEP_ONE,
                        success: true,
                        currentProduct: receiveNewProduct,
                        stepIndex: stepIndex
                    });
                },
                (error) => dispatch({type: RECEIVE_CREATE_PRODUCT_STEP_ONE, success: false, product, error})
            );
        };
    },
    updateProductStepOne(productId, productDraft, stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_PRODUCT_STEP_ONE, product: productDraft});
            AppApi.updateProductStepOne(productId, productDraft).then(
                (receiveUpdateProduct) => {
                    dispatch({
                        type: RECEIVE_UPDATE_PRODUCT_STEP_ONE,
                        success: true,
                        currentProduct: receiveUpdateProduct,
                        stepIndex: stepIndex
                    });
                },
                (error) => dispatch({type: RECEIVE_UPDATE_PRODUCT_STEP_ONE, success: false, productDraft, error})
            );
        };
    },
    updateProductStepTwo(productId, productDraft, stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_PRODUCT_STEP_TWO, product: productDraft});
            AppApi.updateProductStepTwo(productId, productDraft).then(
                (receiveUpdateProduct) => {
                    dispatch({
                        type: RECEIVE_UPDATE_PRODUCT_STEP_TWO,
                        success: true,
                        currentProduct: receiveUpdateProduct,
                        stepIndex: stepIndex
                    });
                },
                (error) => dispatch({type: RECEIVE_UPDATE_PRODUCT_STEP_TWO, success: false, productDraft, error})
            );
        };
    },
    updateProductStepThree(productId, productDraft, stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_PRODUCT_STEP_THREE, product: productDraft});
            AppApi.updateProductStepThree(productId, productDraft).then(
                (receiveUpdateProduct) => {
                    dispatch({
                        type: RECEIVE_UPDATE_PRODUCT_STEP_THREE,
                        success: true,
                        currentProduct: receiveUpdateProduct,
                        stepIndex: stepIndex
                    });
                    dispatch(this.goToProductList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_PRODUCT_STEP_THREE, success: false, productDraft, error})
            );
        };
    },
    addProduct(product, stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_PRODUCT, product});
            AppApi.addProduct(product).then(
                (receiveNewProduct) => {
                    dispatch({
                        type: RECEIVE_CREATE_PRODUCT,
                        success: true,
                        currentProduct: receiveNewProduct,
                        stepIndex: stepIndex
                    });
                    // dispatch(this.fetchProductList());
                    // dispatch(push('products'));
                },
                (error) => dispatch({type: RECEIVE_CREATE_PRODUCT, success: false, product, error})
            );
        };
    },
    updateProduct(productId, productDraft, stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_UPDATE_PRODUCT, product: productDraft});
            AppApi.updateProduct(productId, productDraft).then(
                (receiveUpdateProduct) => {
                    dispatch({
                        type: RECEIVE_UPDATE_PRODUCT,
                        success: true,
                        currentProduct: receiveUpdateProduct,
                        stepIndex: stepIndex
                    });
                    // dispatch(this.fetchProductList());
                    // dispatch(push('products'));
                },
                (error) => dispatch({type: RECEIVE_UPDATE_PRODUCT, success: false, productDraft, error})
            );
        };
    },
    deleteProduct(productId){
        return (dispatch) => {
            dispatch({type: REQUEST_DELETE_PRODUCT, productId: productId});
            AppApi.deleteProduct(productId).then(
                (message) => {
                    dispatch({type: RECEIVE_DELETE_PRODUCT, success: true, message: message});
                    dispatch(this.fetchProductList());
                },
                (error) => dispatch({type: RECEIVE_UPDATE_PRODUCT, success: false, error})
            );
        };
    },
    updateProductDraft(field, value) {
        return {type: UPDATE_PRODUCT_DRAFT, field, value};
    },
    fetchSpecificationListWithoutPage(){
        return (dispatch) => {
            dispatch({type: REQUEST_PRODUCT_OPTIONS_SPECIFICATION_LIST});
            AppApi.fetchSpecificationListWithoutPage().then(
                (specifications) => dispatch({
                    type: RECEIVE_PRODUCT_OPTIONS_SPECIFICATION_LIST,
                    success: true,
                    specifications
                }),
                (error) => dispatch({type: RECEIVE_PRODUCT_OPTIONS_SPECIFICATION_LIST, success: false, error})
            );
        };
    },
    openProductOptionsSpecOptPop(specId, anchorEl){
        return (dispatch) => {
            dispatch({type: OPEN_PRODUCT_OPTIONS_SPEC_OPT_POP, specId, anchorEl});
        };
    },
    closeProductOptionsSpecOptPop(){
        return (dispatch) => {
            dispatch({type: CLOSE_PRODUCT_OPTIONS_SPEC_OPT_POP});
        };
    },
    addProductOptionsDraft(specification){
        return {type: ADD_PRODUCT_OPTIONS_DRAFT, specification: specification}
    },
    addProductOptionsDraftWithNew(newSpecName){
        let specification = {
            _id: '',
            spec_id: '',
            name: newSpecName,
            goodsId: '',
            sort_order: 0,
            description: '',
            options: []
        };
        return (dispatch) => {
            AppApi.addSpecification(specification).then(
                (receiveNewSpecification) => {
                    dispatch({
                        type: ADD_PRODUCT_OPTIONS_DRAFT_WITH_NEW,
                        success: true,
                        specification: receiveNewSpecification
                    });
                },
                (error) => dispatch({type: ADD_PRODUCT_OPTIONS_DRAFT_WITH_NEW, success: false, error})
            );
        };
    },
    removeProductOptionsDraft(specId){
        return (dispatch) => {
            dispatch({type: REMOVE_PRODUCT_OPTIONS_DRAFT, specId});
            dispatch({type: CREATE_PRODUCT_OPTIONS_CONTENT_DRAFT});
        };
    },
    addProductOptionsOptDraft(specId, option){
        return (dispatch) => {
            dispatch({type: ADD_PRODUCT_OPTIONS_OPT_DRAFT, specId, option});
            dispatch({type: CREATE_PRODUCT_OPTIONS_CONTENT_DRAFT});
        }
    },
    addProductOptionsOptDraftWithNew(specification, newOptionName){
        return (dispatch) => {
            let newOption = {
                name: newOptionName,
                opt_id: -1,
                description: ''
            };
            specification.options.push(newOption);
            AppApi.updateSpecification(specification._id, specification).then(
                (receiveUpdateSpecification) => {
                    dispatch({
                        type: ADD_PRODUCT_OPTIONS_OPT_DRAFT_WITH_NEW,
                        success: true,
                        specification: receiveUpdateSpecification,
                        newOptionName: newOptionName
                    });
                    dispatch({type: CREATE_PRODUCT_OPTIONS_CONTENT_DRAFT});
                },
                (error) => dispatch({type: ADD_PRODUCT_OPTIONS_OPT_DRAFT_WITH_NEW, success: false, error})
            );
        }
    },
    removeProductOptionsOptDraft(specId, optId){
        return (dispatch) => {
            dispatch({type: REMOVE_PRODUCT_OPTIONS_OPT_DRAFT, specId, optId});
            dispatch({type: CREATE_PRODUCT_OPTIONS_CONTENT_DRAFT});
        };
    },
    updateProductOptionsContentDraft(productContentIndex, field, value) {
        return {type: UPDATE_PRODUCT_OPTIONS_CONTENT_DRAFT, productContentIndex, field, value};
    },
    addProductBaseImage(productId, image, imageName){
        return (dispatch) => {
            dispatch({type: REQUEST_PRODUCT_BASE_IMAGE_ADD, image});
            AppApi.addProductFile(image, imageName).then(
                (receiveNewImage) => {
                    dispatch({type: RECEIVE_PRODUCT_BASE_IMAGE_ADD, success: true, image: receiveNewImage});
                    if (productId) {
                        AppApi.productBaseImageAdd(productId, receiveNewImage.url);
                    }
                },
                (error) => dispatch({type: RECEIVE_PRODUCT_BASE_IMAGE_ADD, success: false, error})
            );
        };
    },
    removeProductBaseImage(productId, imageUrl){
        // let imageRelativeUrl = imageUrl.substring(STATIC_URL.length);
        if (productId) {
            return (dispatch) => {
                dispatch({type: REQUEST_PRODUCT_BASE_IMAGE_DELETE, imageUrl});
                AppApi.productBaseImageDelete(productId, imageUrl).then(
                    (message) => {
                        dispatch({type: RECEIVE_PRODUCT_BASE_IMAGE_DELETE, success: true, imageUrl});
                    },
                    (error) => dispatch({
                        type: RECEIVE_PRODUCT_BASE_IMAGE_DELETE,
                        success: false,
                        imageUrl,
                        error
                    })
                );
            };
        } else {
            return (dispatch) => {
                dispatch({type: REQUEST_REMOVE_PRODUCT_BASE_IMAGE, imageUrl});
                AppApi.deleteProductFile(imageUrl).then(
                    (message) => {
                        dispatch({type: RECEIVE_REMOVE_PRODUCT_BASE_IMAGE, success: true, imageUrl});
                    },
                    (error) => dispatch({
                        type: RECEIVE_REMOVE_PRODUCT_BASE_IMAGE,
                        success: false,
                        imageUrl,
                        error
                    })
                );
            };
        }
    },
    addProductImages(productId, image, imageName){
        return (dispatch) => {
            dispatch({type: REQUEST_CREATE_PRODUCT_IMAGES, image});
            AppApi.addProductFile(image, imageName).then(
                (receiveNewImage) => {
                    dispatch({type: RECEIVE_CREATE_PRODUCT_IMAGES, success: true, image: receiveNewImage});
                    if (productId) {
                        AppApi.productImagesAddOne(productId, receiveNewImage.url);
                    }
                },
                (error) => dispatch({type: RECEIVE_CREATE_PRODUCT_IMAGES, success: false, error})
            );
        };
    },
    removeProductImages(productId, imageUrl, imageIndex){
        // let imageRelativeUrl = imageUrl.substring(STATIC_URL.length);
        if (productId) {
            return (dispatch) => {
                dispatch({type: REQUEST_PRODUCT_IMAGES_DELETE_ONE, imageUrl});
                AppApi.productImagesDeleteOne(productId, imageUrl).then(
                    (message) => {
                        dispatch({type: RECEIVE_PRODUCT_IMAGES_DELETE_ONE, success: true, imageUrl, imageIndex});
                    },
                    (error) => dispatch({
                        type: RECEIVE_PRODUCT_IMAGES_DELETE_ONE,
                        success: false,
                        imageUrl,
                        imageIndex,
                        error
                    })
                );
            };
        } else {
            return (dispatch) => {
                dispatch({type: REQUEST_REMOVE_PRODUCT_IMAGES, imageUrl});
                AppApi.deleteProductFile(imageUrl).then(
                    (message) => {
                        dispatch({type: RECEIVE_REMOVE_PRODUCT_IMAGES, success: true, imageUrl, imageIndex});
                    },
                    (error) => dispatch({
                        type: RECEIVE_REMOVE_PRODUCT_IMAGES,
                        success: false,
                        imageUrl,
                        imageIndex,
                        error
                    })
                );
            };
        }
    },
    nextStep(stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_STEP_NEXT, stepIndex});
        }
    },
    prevStep(stepIndex){
        return (dispatch) => {
            dispatch({type: REQUEST_STEP_PREV, stepIndex});
        }
    },
};

export default ProductActionCreators;