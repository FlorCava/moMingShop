import {
    RECEIVE_PRODUCT_LIST,
    GO_TO_PRODUCT_EDIT,
    RECEIVE_PRODUCT,
    UPDATE_PRODUCT_DRAFT,
    RECEIVE_CREATE_PRODUCT_STEP_ONE,
    RECEIVE_UPDATE_PRODUCT_STEP_ONE,
    RECEIVE_UPDATE_PRODUCT_STEP_TWO,
    RECEIVE_UPDATE_PRODUCT_STEP_THREE,
    RECEIVE_CREATE_PRODUCT,
    RECEIVE_UPDATE_PRODUCT,
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
    RECEIVE_CREATE_PRODUCT_IMAGES,
    REQUEST_REMOVE_PRODUCT_IMAGES,
    RECEIVE_REMOVE_PRODUCT_IMAGES,
    REQUEST_PRODUCT_IMAGES_DELETE_ONE,
    RECEIVE_PRODUCT_IMAGES_DELETE_ONE,
    REQUEST_REMOVE_PRODUCT_BASE_IMAGE,
    RECEIVE_REMOVE_PRODUCT_BASE_IMAGE,
    RECEIVE_PRODUCT_BASE_IMAGE_ADD,
    REQUEST_PRODUCT_BASE_IMAGE_DELETE,
    RECEIVE_PRODUCT_BASE_IMAGE_DELETE,
    REQUEST_STEP_NEXT,
    REQUEST_STEP_PREV,
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

let specIndex;
let optIndex;

const defaultProduct = () => {
    return {
        errors: '',
        productsPage: 0,
        productsPages: 0,
        productDialogOpen: true,
        products: [],
        currentProduct: {
            _id: '',
            product_id: '',
            product_name: '',
            second_title: '',
            product_specification: '',
            sales_support: '',
            description: '',
            description_draft: '',
            baseImage: '',
            thumbnail: '',
            brandId: '',
            brandName: '',
            goodsId: '',
            goodsName: '',
            categoryId: '',
            categoryName: '',
            images: [],
            is_saleable: true,
            price: 0.00,
            sku: '',
            status: '',
        },
        currentProductId: '',
        stepIndex: 0,
        currentProductSpecifications: [],
        currentProductOptionsSpecOptPopOpen: false,
        currentProductOptionsSpecOptPopAnchorEl: null,
        currentProductSpecification: {options: []},
    }
};

function generateGroup(spec_content, temp_product_content) {
    for (var i in spec_content) {
        var s = spec_content[i];
        var newTempGroup = [];
        for (var j in temp_product_content) {
            for (var k in s) {
                var tempOne = [];
                for (var x in temp_product_content[j]) {
                    tempOne.push(temp_product_content[j][x]);
                }
                tempOne.push(s[k]);
                newTempGroup.push(tempOne);
            }
        }
        if (newTempGroup.length > 0) {
            temp_product_content = newTempGroup;
        }
    }
    return temp_product_content;
}

function createProductOptionsContent(state) {
    let product_content_draft = [];
    if (state.currentProduct.options) {
        let spec_content = [];
        state.currentProduct.options.spec_content.forEach(function (spec) {
            let spec_content_option = [];
            spec.spec_option.forEach(function (option) {
                spec_content_option.push({
                    spec_id: spec.spec_id,
                    spec_name: spec.spec_name,
                    opt_id: option.opt_id,
                    opt_name: option.opt_name,
                })
            });
            spec_content.push(spec_content_option);
        });

        let product_content = [], temp_product_content = [];
        if (spec_content.length > 0) {
            let firstSpecContentOptions = spec_content[0];
            firstSpecContentOptions.forEach(function (option) {
                temp_product_content.push([option]);
            });
            spec_content.splice(0, 1);
            product_content = generateGroup(spec_content, temp_product_content);
        }

        product_content.forEach(function (content) {
            product_content_draft.push({
                specs: content,
                image: '',
                product_id: 0,
                product_price: 0,
                sku: '',
                status: '',
                stock_qty: 0
            })
        })
    }
    return product_content_draft;
}

const ProductReducer = (state = defaultProduct(), action) => {
    switch (action.type) {
        case RECEIVE_PRODUCT_LIST:
            return update(state, {
                products: {$set: action.products.products},
                productsPage: {$set: action.products.page},
                productsPages: {$set: action.products.pages}
            });
        case GO_TO_PRODUCT_EDIT:
            return update(state, {
                errors: {$set: ''},
                stepIndex: {$set: 0},
                currentProductId: {$set: ''},
                currentProduct: {
                    $set: {
                        _id: '',
                        product_id: '',
                        product_name: '',
                        second_title: '',
                        product_specification: '',
                        sales_support: '',
                        description: '',
                        description_draft: '',
                        baseImage: '',
                        thumbnail: '',
                        brandId: '',
                        brandName: '',
                        goodsId: '',
                        goodsName: '',
                        categoryId: '',
                        categoryName: '',
                        images: [],
                        is_saleable: true,
                        price: 0.00,
                        sku: '',
                        status: '',
                    }
                }
            });
        case RECEIVE_PRODUCT:
            if (action.currentProduct) {
                return update(state, {
                    currentProduct: {$set: action.currentProduct},
                    currentProductId: {$set: action.currentProduct._id}
                });
            }
            return state;
        case UPDATE_PRODUCT_DRAFT:
            return update(state, {
                currentProduct: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case RECEIVE_PRODUCT_OPTIONS_SPECIFICATION_LIST:
            return update(state, {
                currentProductSpecifications: {$set: action.specifications}
            });
        case OPEN_PRODUCT_OPTIONS_SPEC_OPT_POP:
            let specification = getCurrentProductSpecification(state, action.specId);
            return update(state, {
                currentProductOptionsSpecOptPopOpen: {$set: true},
                currentProductOptionsSpecOptPopAnchorEl: {$set: action.anchorEl},
                currentProductSpecification: {$set: specification}
            });
        case CLOSE_PRODUCT_OPTIONS_SPEC_OPT_POP:
            return update(state, {
                currentProductOptionsSpecOptPopOpen: {$set: false},
                currentProductSpecification: {options: []}
            });
        case ADD_PRODUCT_OPTIONS_DRAFT:
            return update(state, {
                currentProduct: {
                    options: {
                        spec_content: {
                            $push: [{
                                spec_id: action.specification.spec_id,
                                spec_name: action.specification.name,
                                sort_order: state.currentProduct.options.spec_content.length,
                                spec_option: []
                            }]
                        }
                    }
                }
            });
        case ADD_PRODUCT_OPTIONS_DRAFT_WITH_NEW:
            if (action.success) {
                return update(state, {
                    currentProduct: {
                        options: {
                            spec_content: {
                                $push: [{
                                    spec_id: action.specification.spec_id,
                                    spec_name: action.specification.name,
                                    sort_order: state.currentProduct.options.spec_content.length,
                                    spec_option: []
                                }]
                            }
                        }
                    },
                    currentProductSpecifications: {
                        $push: [action.specification]
                    }
                });
            }
            return state;
        case REMOVE_PRODUCT_OPTIONS_DRAFT:
            specIndex = getCurrentProductOptionsSpecContentIndex(state, action.specId);
            return update(state, {
                currentProduct: {
                    options: {
                        spec_content: {
                            $splice: [[specIndex, 1]]
                        }
                    }
                }
            });
        case ADD_PRODUCT_OPTIONS_OPT_DRAFT:
            let optionSpecContentIndex = getCurrentProductOptionsSpecContentIndex(state, action.specId);
            let spec_option = {
                opt_id: action.option.opt_id,
                opt_name: action.option.name
            };
            return update(state, {
                currentProduct: {
                    options: {
                        spec_content: {
                            [optionSpecContentIndex]: {
                                spec_option: {
                                    $push: [spec_option]
                                }
                            }
                        }
                    }
                }
            });
        case ADD_PRODUCT_OPTIONS_OPT_DRAFT_WITH_NEW:
            if (action.success) {
                let specIndex = getCurrentProductSpecificationIndex(state, action.specification.spec_id);
                let optionSpecContentIndex = getCurrentProductOptionsSpecContentIndex(state, action.specification.spec_id);
                let newOption = action.specification.options.find((option) => option.name == action.newOptionName);
                let spec_option = {
                    opt_id: newOption.opt_id,
                    opt_name: newOption.name
                };
                return update(state, {
                    currentProduct: {
                        options: {
                            spec_content: {
                                [optionSpecContentIndex]: {
                                    spec_option: {
                                        $push: [spec_option]
                                    }
                                }
                            }
                        }
                    },
                    currentProductSpecifications: {
                        [specIndex]: {$set: action.specification}
                    },
                    currentProductSpecification: {$set: action.specification}
                });
            }
            return state;
        case REMOVE_PRODUCT_OPTIONS_OPT_DRAFT:
            specIndex = getCurrentProductOptionsSpecContentIndex(state, action.specId);
            optIndex = getCurrentProductOptionsSpecContentOptionIndex(state, action.specId, action.optId);
            return update(state, {
                currentProduct: {
                    options: {
                        spec_content: {
                            [specIndex]: {
                                spec_option: {
                                    $splice: [[optIndex, 1]]
                                }
                            }
                        }
                    }
                }
            });
        case CREATE_PRODUCT_OPTIONS_CONTENT_DRAFT:
            let product_content_draft = createProductOptionsContent(state);
            return update(state, {
                currentProduct: {
                    options: {
                        product_content: {$set: product_content_draft}
                    }
                }
            });
        case UPDATE_PRODUCT_OPTIONS_CONTENT_DRAFT:
            return update(state, {
                currentProduct: {
                    options: {
                        product_content: {
                            [action.productContentIndex]: {
                                [action.field]: {
                                    $set: action.value
                                }
                            }
                        }
                    }
                }
            });
        case RECEIVE_CREATE_PRODUCT_STEP_ONE:
            if (action.success) {
                let nextStepIndex = action.stepIndex;
                if (nextStepIndex < 2) {
                    nextStepIndex = nextStepIndex + 1;
                }
                return update(state, {
                    errors: {$set: ''},
                    currentProduct: {$set: action.currentProduct},
                    currentProductId: {$set: action.currentProduct._id},
                    stepIndex: {$set: nextStepIndex}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_PRODUCT_STEP_ONE:
            if (action.success) {
                let nextStepIndex = action.stepIndex;
                if (nextStepIndex < 2) {
                    nextStepIndex = nextStepIndex + 1;
                }
                return update(state, {
                    errors: {$set: ''},
                    currentProduct: {$set: action.currentProduct},
                    stepIndex: {$set: nextStepIndex}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_PRODUCT_STEP_TWO:
            if (action.success) {
                let nextStepIndex = action.stepIndex;
                if (nextStepIndex < 2) {
                    nextStepIndex = nextStepIndex + 1;
                }
                return update(state, {
                    errors: {$set: ''},
                    currentProduct: {$set: action.currentProduct},
                    stepIndex: {$set: nextStepIndex}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_PRODUCT_STEP_THREE:
            if (action.success) {
                let nextStepIndex = action.stepIndex;
                if (nextStepIndex < 2) {
                    nextStepIndex = nextStepIndex + 1;
                }
                return update(state, {
                    errors: {$set: ''},
                    currentProduct: {$set: action.currentProduct},
                    stepIndex: {$set: nextStepIndex}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_CREATE_PRODUCT:
            if (action.success) {
                let nextStepIndex = action.stepIndex;
                if (nextStepIndex < 2) {
                    nextStepIndex = nextStepIndex + 1;
                }
                return update(state, {
                    currentProduct: {$set: action.currentProduct},
                    currentProductId: {$set: action.currentProduct._id},
                    stepIndex: {$set: nextStepIndex}
                });
            }
            return state;
        case RECEIVE_UPDATE_PRODUCT:
            if (action.success) {
                let nextStepIndex = action.stepIndex;
                if (nextStepIndex < 2) {
                    nextStepIndex = nextStepIndex + 1;
                }
                return update(state, {
                    currentProduct: {$set: action.currentProduct},
                    stepIndex: {$set: nextStepIndex}
                });
            }
            return state;
        case RECEIVE_CREATE_PRODUCT_IMAGES:
            if (action.success) {
                return update(state, {
                    currentProduct: {
                        images: {
                            $push: [action.image.url]
                        }
                    }
                })
            }
            return state;
        case RECEIVE_PRODUCT_BASE_IMAGE_ADD:
            if (action.success) {
                return update(state, {
                    currentProduct: {
                        baseImage: {
                            $set: action.image.url
                        }
                    }
                })
            }
            return state;

        case REQUEST_REMOVE_PRODUCT_IMAGES:
            return update(state, {
                currentProduct: {
                    images: {
                        $splice: [[action.imageIndex, 1]]
                    }
                }
            });
        case RECEIVE_REMOVE_PRODUCT_IMAGES:
            if (!action.success) {
                return update(state, {
                    currentProduct: {
                        images: {
                            $splice: [[action.imageIndex, 0, action.imageUrl]]
                        }
                    }
                });
            }
            return state;

        case REQUEST_REMOVE_PRODUCT_BASE_IMAGE:
            return update(state, {
                currentProduct: {
                    baseImage: {
                        $set: ''
                    }
                }
            });
        case RECEIVE_REMOVE_PRODUCT_BASE_IMAGE:
            if (!action.success) {
                return update(state, {
                    currentProduct: {
                        baseImage: {
                            $set: action.imageUrl
                        }
                    }
                });
            }
            return state;

        case REQUEST_PRODUCT_IMAGES_DELETE_ONE:
            return update(state, {
                currentProduct: {
                    images: {
                        $splice: [[action.imageIndex, 1]]
                    }
                }
            });
        case RECEIVE_PRODUCT_IMAGES_DELETE_ONE:
            if (!action.success) {
                return update(state, {
                    currentProduct: {
                        images: {
                            $splice: [[action.imageIndex, 0, action.imageUrl]]
                        }
                    }
                });
            }
            return state;

        case REQUEST_PRODUCT_BASE_IMAGE_DELETE:
            return update(state, {
                currentProduct: {
                    baseImage: {
                        $set: ''
                    }
                }
            });
        case RECEIVE_PRODUCT_BASE_IMAGE_DELETE:
            if (!action.success) {
                return update(state, {
                    currentProduct: {
                        baseImage: {
                            $set: action.imageUrl
                        }
                    }
                });
            }
            return state;

        case REQUEST_STEP_NEXT:
            return update(state, {
                stepIndex: {$set: action.stepIndex + 1}
            });
        case REQUEST_STEP_PREV:
            return update(state, {
                stepIndex: {$set: action.stepIndex - 1}
            });

        default:
            return state;

    }
};

export default ProductReducer;
export const getCurrentProductSpecification = (state, id) => state.currentProductSpecifications.find((specification) => specification.spec_id == id);
export const getCurrentProductSpecificationIndex = (state, id) => state.currentProductSpecifications.findIndex((specification) => specification.spec_id == id);
export const getCurrentProductOptionsSpecContentIndex = (state, id) => state.currentProduct.options.spec_content.findIndex((spec) => spec.spec_id == id);
export const getCurrentProductOptionsSpecContentOptionIndex = (state, spec_id, opt_id) => state.currentProduct.options.spec_content.find((spec) => spec.spec_id == spec_id)
    .spec_option.findIndex((opt) => opt.opt_id == opt_id);

