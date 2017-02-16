import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {CommonStyles} from '../CommonStyles';

// Stores & Actions
import BrandActionCreators from '../../actions/BrandActionCreators';

class BrandDialog extends Component {

    handleClose() {
        this.props.goToBrandList();
    };

    handleChange(field, e) {
        this.props.updateBrandDraft(field, e.target.value);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.brandId !== undefined) {
            this.props.updateBrand(this.props.brandId, this.props.currentBrand);
        } else {
            this.props.addBrand(this.props.currentBrand);
        }
    }

    componentDidMount() {
        this.props.fetchBrand(this.props.brandId);
    }

    render() {
        const actions = [
            <FlatButton
                label="保 存"
                primary={true}
                onTouchTap={this.handleSubmit.bind(this)}
            />,
            <FlatButton
                label="取 消"
                onTouchTap={this.handleClose.bind(this)}
            />,
        ];

        return (
            <Dialog
                title="商品品牌维护"
                actions={actions}
                modal={true}
                open={this.props.brandDialogOpen}
                autoScrollBodyContent={true}
            >
                {this.props.errors.summary && <p style={CommonStyles.errorMessage}>{this.props.errors.summary}</p>}

                <TextField
                    id="name"
                    key="name"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入品牌名称"
                    floatingLabelText="品牌名称"
                    value={this.props.currentBrand.name}
                    errorText={this.props.errors.name}
                    onChange={this.handleChange.bind(this, 'name')}
                />
                <Divider/>
                <TextField
                    id="description"
                    key="description"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入品牌备注"
                    floatingLabelText="品牌备注"
                    multiLine={true}
                    rows={2}
                    value={this.props.currentBrand.description}
                    onChange={this.handleChange.bind(this, 'description')}
                />
                <Divider/>
            </Dialog>
        );
    }
}

BrandDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        errors: state.Brand.errors,
        brandDialogOpen: state.Brand.brandDialogOpen,
        currentBrand: state.Brand.currentBrand,
        brandId: ownProps.params.brandId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBrand: (brandId) => dispatch(BrandActionCreators.fetchBrand(brandId)),
        updateBrandDraft: (field, value) => dispatch(BrandActionCreators.updateBrandDraft(field, value)),
        addBrand: (brand) => dispatch(BrandActionCreators.addBrand(brand)),
        updateBrand: (brandId, draftBrand) => dispatch(BrandActionCreators.updateBrand(brandId, draftBrand)),
        goToBrandList: () => dispatch(BrandActionCreators.goToBrandList()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BrandDialog);
