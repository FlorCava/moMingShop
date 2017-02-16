import {
    GO_TO_SPECIFICATION_EDIT,
    RECEIVE_SPECIFICATION_LIST,
    RECEIVE_SPECIFICATION,
    UPDATE_SPECIFICATION_DRAFT,
    RECEIVE_CREATE_SPECIFICATION,
    RECEIVE_UPDATE_SPECIFICATION,
    OPEN_SPECIFICATION_OPTION_DIALOG,
    CLOSE_SPECIFICATION_OPTION_DIALOG,
    UPDATE_SPECIFICATION_OPTION_DRAFT,
    UPDATE_SPECIFICATION_OPTION,
    REMOVE_SPECIFICATION_OPTION,
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

const defaultSpecification = () => {
    return {
        errors: '',
        specificationsPage: 0,
        specificationsPages: 0,
        specificationDialogOpen: true,
        specifications: [],
        currentSpecification: {
            _id: '',
            spec_id: '',
            name: '',
            goodsId: '',
            sort_order: 0,
            description: '',
            options: []
        },
        optionDialogOpen: false,
        currentOptionIndex: -1,
        currentOption: {
            _id: '',
            name: '',
            description: ''
        },
    }
};

const SpecificationReducer = (state = defaultSpecification(), action) => {
    switch (action.type) {
        case GO_TO_SPECIFICATION_EDIT:
            return update(state, {
                errors: {$set: ''},
                currentSpecification: {
                    $set: {
                        _id: '',
                        spec_id: '',
                        name: '',
                        goodsId: '',
                        sort_order: 0,
                        description: '',
                        options: []
                    }
                }
            });
        case RECEIVE_SPECIFICATION_LIST:
            return update(state, {
                specifications: {$set: action.specifications.specifications},
                specificationsPage: {$set: action.specifications.page},
                specificationsPages: {$set: action.specifications.pages}
            });
        case RECEIVE_SPECIFICATION:
            if (action.currentSpecification) {
                return update(state, {
                    currentSpecification: {$set: action.currentSpecification}
                });
            }
            return state;
        case UPDATE_SPECIFICATION_DRAFT:
            return update(state, {
                currentSpecification: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case RECEIVE_CREATE_SPECIFICATION:
            if (action.success) {
                return update(state, {
                    currentSpecification: {$set: action.currentSpecification}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_SPECIFICATION:
            if (!action.success) {
                return update(state, {
                    errors: {$set: action.error.errors}
                });
            }
            return state;
        case OPEN_SPECIFICATION_OPTION_DIALOG:
            if (action.optionIndex >= 0) {
                return update(state, {
                    optionDialogOpen: {$set: true},
                    currentOptionIndex: {$set: action.optionIndex},
                    currentOption: {
                        $set: state.currentSpecification.options[action.optionIndex]
                    }
                });
            } else {
                return update(state, {
                    optionDialogOpen: {$set: true},
                    currentOptionIndex: {$set: -1},
                    currentOption: {
                        $set: {
                            _id: '',
                            name: '',
                            description: ''
                        }
                    }
                });
            }
            return state;
        case CLOSE_SPECIFICATION_OPTION_DIALOG:
            return update(state, {
                optionDialogOpen: {$set: false}
            });
        case UPDATE_SPECIFICATION_OPTION_DRAFT:
            return update(state, {
                currentOption: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case UPDATE_SPECIFICATION_OPTION:
            if (action.optionIndex >= 0) {
                return update(state, {
                    currentSpecification: {
                        options: {
                            [action.optionIndex]: {
                                $set: action.option
                            }
                        }
                    }
                });
            } else {
                return update(state, {
                    currentSpecification: {
                        options: {
                            $push: [{
                                name: action.option.name,
                                description: action.option.description
                            }]
                        }
                    }
                });
            }
        case REMOVE_SPECIFICATION_OPTION:
            return update(state, {
                currentSpecification: {
                    options: {
                        $splice: [[action.optionIndex, 1]]
                    }
                }
            });

        default:
            return state;

    }
};

export default SpecificationReducer;

