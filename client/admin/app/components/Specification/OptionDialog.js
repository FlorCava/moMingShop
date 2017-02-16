import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

// Stores & Actions
import SpecificationActionCreators from '../../actions/SpecificationActionCreators';

class OptionDialog extends Component {

    handleCloseOption() {
        this.props.closeSpecificationOptionDialog();
    };

    handleChangeOption(field, e) {
        this.props.updateSpecificationOptionDraft(field, e.target.value);
    }

    handleSubmitOption() {
        this.props.updateSpecificationOption(this.props.currentOptionIndex, this.props.currentOption);
        this.props.closeSpecificationOptionDialog();
    }

    render() {
        const optionActions = [
            <FlatButton
                label="保 存"
                primary={true}
                onTouchTap={this.handleSubmitOption.bind(this)}
            />,
            <FlatButton
                label="取 消"
                onTouchTap={this.handleCloseOption.bind(this)}
            />,
        ];

        return (
            <Dialog
                title="规格选项维护"
                actions={optionActions}
                modal={true}
                open={this.props.optionDialogOpen}
                autoScrollBodyContent={true}
            >
                <TextField
                    id="option_name"
                    key="option_name"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入选项名称"
                    floatingLabelText="选项名称"
                    value={this.props.currentOption.name}
                    onChange={this.handleChangeOption.bind(this, 'name')}
                />
                <Divider/>
                <TextField
                    id="option_description"
                    key="option_description"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入选项备注"
                    floatingLabelText="选项备注"
                    multiLine={true}
                    rows={2}
                    value={this.props.currentOption.description}
                    onChange={this.handleChangeOption.bind(this, 'description')}
                />
                <Divider/>
            </Dialog>
        );
    }
}

OptionDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        optionDialogOpen: state.Specification.optionDialogOpen,
        currentOptionIndex: state.Specification.currentOptionIndex,
        currentOption: state.Specification.currentOption,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closeSpecificationOptionDialog: () => dispatch(SpecificationActionCreators.closeSpecificationOptionDialog()),
        updateSpecificationOptionDraft: (field, value) => dispatch(SpecificationActionCreators.updateSpecificationOptionDraft(field, value)),
        updateSpecificationOption: (optionIndex, draftOption) => dispatch(SpecificationActionCreators.updateSpecificationOption(optionIndex, draftOption)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OptionDialog);
