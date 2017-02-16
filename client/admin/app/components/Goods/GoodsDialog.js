import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {CommonStyles} from '../CommonStyles';


// Stores & Actions
import GoodsActionCreators from '../../actions/GoodsActionCreators';

class GoodsDialog extends Component {

    handleClose() {
        this.props.goToGoodsList();
    };

    handleChange(field, e) {
        this.props.updateGoodsDraft(field, e.target.value);
    }

    handleSubmit() {
        if (this.props.goodsId !== undefined) {
            this.props.updateGoods(this.props.goodsId, this.props.currentGoods);
        } else {
            this.props.addGoods(this.props.currentGoods);
        }
    }

    componentWillMount() {
        this.props.fetchGoods(this.props.goodsId);
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
                title="货品维护"
                actions={actions}
                modal={true}
                open={this.props.goodsDialogOpen}
                autoScrollBodyContent={true}
            >
                {this.props.errors.summary && <p style={CommonStyles.errorMessage}>{this.props.errors.summary}</p>}

                <TextField
                    id="name"
                    key="name"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入货品名称"
                    floatingLabelText="货品名称"
                    value={this.props.currentGoods.name}
                    errorText={this.props.errors.name}
                    onChange={this.handleChange.bind(this, 'name')}
                />
                <Divider/>
                <TextField
                    id="description"
                    key="description"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入货品备注"
                    floatingLabelText="货品备注"
                    multiLine={true}
                    rows={2}
                    value={this.props.currentGoods.description}
                    errorText={this.props.errors.description}
                    onChange={this.handleChange.bind(this, 'description')}
                />
            </Dialog>
        );
    }
}

GoodsDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        errors: state.Goods.errors,
        goodsDialogOpen: state.Goods.goodsDialogOpen,
        currentGoods: state.Goods.currentGoods,
        goodsId: ownProps.params.goodsId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGoods: (goodsId) => dispatch(GoodsActionCreators.fetchGoods(goodsId)),
        updateGoodsDraft: (field, value) => dispatch(GoodsActionCreators.updateGoodsDraft(field, value)),
        addGoods: (goods) => dispatch(GoodsActionCreators.addGoods(goods)),
        updateGoods: (goodsId, draftGoods) => dispatch(GoodsActionCreators.updateGoods(goodsId, draftGoods)),
        deleteGoods: (goodsId) => dispatch(GoodsActionCreators.deleteGoods(goodsId)),
        goToGoodsList: () => dispatch(GoodsActionCreators.goToGoodsList()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GoodsDialog);
