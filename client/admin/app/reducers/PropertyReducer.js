import {
    GO_TO_PROPERTY_EDIT,
    RECEIVE_PROPERTY_LIST,
    RECEIVE_PROPERTY,
    UPDATE_PROPERTY_DRAFT,
    RECEIVE_CREATE_PROPERTY,
    RECEIVE_UPDATE_PROPERTY,
    OPEN_PROPERTY_DIALOG,
    CLOSE_PROPERTY_DIALOG,
    OPEN_PROPERTY_OPTION_DIALOG,
    CLOSE_PROPERTY_OPTION_DIALOG,
    UPDATE_PROPERTY_OPTION_DRAFT,
    UPDATE_PROPERTY_OPTION,
    REMOVE_PROPERTY_OPTION,
} from '../utils/constants';
import update from 'react-addons-update';
import 'babel-polyfill';

const defaultProperty = () => {
    return {
        errors: '',
        propertiesPage: 0,
        propertiesPages: 0,
        propertyDialogOpen: true,
        properties: [],
        currentProperty: {
            _id: '',
            prop_id: '',
            name: '',
            categoryId: '',
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

const PropertyReducer = (state = defaultProperty(), action) => {
    switch (action.type) {
        case GO_TO_PROPERTY_EDIT:
            return update(state, {
                errors: {$set: ''},
                currentProperty: {
                    $set: {
                        _id: '',
                        prop_id: '',
                        name: '',
                        categoryId: '',
                        sort_order: 0,
                        description: '',
                        options: []
                    }
                }
            });
        case RECEIVE_PROPERTY_LIST:
            return update(state, {
                properties: {$set: action.properties.properties},
                propertiesPage: {$set: action.properties.page},
                propertiesPages: {$set: action.properties.pages}
            });
        case RECEIVE_PROPERTY:
            if (action.currentProperty) {
                return update(state, {
                    currentProperty: {$set: action.currentProperty}
                });
            }
            return state;
        case UPDATE_PROPERTY_DRAFT:
            return update(state, {
                currentProperty: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case RECEIVE_CREATE_PROPERTY:
            if (action.success) {
                return update(state, {
                    currentProperty: {$set: action.currentProperty}
                });
            } else {
                return update(state, {
                    errors: {$set: action.error.errors}
                })
            }
        case RECEIVE_UPDATE_PROPERTY:
            if (!action.success) {
                return update(state, {
                    errors: {$set: action.error.errors}
                });
            }
            return state;
        case OPEN_PROPERTY_DIALOG:
            return update(state, {
                propertyDialogOpen: {$set: true}
            });
            return state;
        case CLOSE_PROPERTY_DIALOG:
            return update(state, {
                propertyDialogOpen: {$set: false}
            });
        case OPEN_PROPERTY_OPTION_DIALOG:
            if (action.optionIndex >= 0) {
                return update(state, {
                    optionDialogOpen: {$set: true},
                    currentOptionIndex: {$set: action.optionIndex},
                    currentOption: {
                        $set: state.currentProperty.options[action.optionIndex]
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
        case CLOSE_PROPERTY_OPTION_DIALOG:
            return update(state, {
                optionDialogOpen: {$set: false}
            });
        case UPDATE_PROPERTY_OPTION_DRAFT:
            return update(state, {
                currentOption: {
                    [action.field]: {
                        $set: action.value
                    }
                }
            });
        case UPDATE_PROPERTY_OPTION:
            if (action.optionIndex >= 0) {
                return update(state, {
                    currentProperty: {
                        options: {
                            [action.optionIndex]: {
                                $set: action.option
                            }
                        }
                    }
                });
            } else {
                return update(state, {
                    currentProperty: {
                        options: {
                            $push: [{
                                name: action.option.name,
                                description: action.option.description
                            }]
                        }
                    }
                });
            }
        case REMOVE_PROPERTY_OPTION:
            return update(state, {
                currentProperty: {
                    options: {
                        $splice: [[action.optionIndex, 1]]
                    }
                }
            });

        default:
            return state;

    }
};

export default PropertyReducer;

