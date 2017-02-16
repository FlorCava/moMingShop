import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import OptionDialog from './OptionDialog';
import {CommonStyles} from '../CommonStyles';

// Stores & Actions
import SpecificationActionCreators from '../../actions/SpecificationActionCreators';
import GoodsActionCreators from '../../actions/GoodsActionCreators';

class SpecificationDialog extends Component {

    handleClose() {
        this.props.goToSpecificationList();
    };

    handleChange(field, e) {
        this.props.updateSpecificationDraft(field, e.target.value);
    }

    handleSelectChange(field, e, index, payload) {
        this.props.updateSpecificationDraft(field, payload);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.specificationId !== undefined) {
            this.props.updateSpecification(this.props.specificationId, this.props.currentSpecification);
        } else {
            this.props.addSpecification(this.props.currentSpecification);
        }
    }

    componentWillMount() {
        this.props.fetchGoodsList();
        this.props.fetchSpecification(this.props.specificationId);
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
        let goodsItems = this.props.goods.map((good) => {
            return (
                <MenuItem key={good._id} value={good._id} primaryText={good.name}/>
            )
        });
        let options = this.props.currentSpecification.options.map((option, optionIndex) => {
            return (
                <TableRow key={optionIndex}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.openSpecificationOptionDialog.bind(this, optionIndex)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.props.specificationOptionDeleteTap.bind(this, optionIndex)}/>
                    </TableRowColumn>
                    <TableRowColumn>{option.name}</TableRowColumn>
                    <TableRowColumn>{option.description}</TableRowColumn>
                </TableRow>
            )
        });

        return (
            <Dialog
                title="商品规格维护"
                actions={actions}
                modal={true}
                contentStyle={CommonStyles.dialog}
                open={this.props.specificationDialogOpen}
                autoScrollBodyContent={true}
            >
                {this.props.errors.summary && <p style={CommonStyles.errorMessage}>{this.props.errors.summary}</p>}

                <TextField
                    id="name"
                    key="name"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入规格名称"
                    floatingLabelText="规格名称"
                    value={this.props.currentSpecification.name}
                    errorText={this.props.errors.name}
                    onChange={this.handleChange.bind(this, 'name')}
                />
                <Divider/>
                <TextField
                    id="sort_order"
                    key="sort_order"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入规格排序权重"
                    floatingLabelText="规格排序权重"
                    value={this.props.currentSpecification.sort_order}
                    errorText={this.props.errors.sort_order}
                    onChange={this.handleChange.bind(this, 'sort_order')}
                />
                <Divider/>
                <SelectField
                    id="goodsId"
                    key="goodsId"
                    underlineStyle={{width: '0px'}}
                    value={this.props.currentSpecification.goodsId}
                    errorText={this.props.errors.goodsId}
                    onChange={this.handleSelectChange.bind(this, 'goodsId')}
                    floatingLabelText="所属货品"
                >
                    {goodsItems}
                </SelectField>
                <Divider/>
                <TextField
                    id="description"
                    key="description"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入规格备注"
                    floatingLabelText="规格备注"
                    multiLine={true}
                    rows={2}
                    value={this.props.currentSpecification.description}
                    errorText={this.props.errors.description}
                    onChange={this.handleChange.bind(this, 'description')}
                />
                <Divider/>
                <FlatButton
                    label="添加规格选项"
                    secondary={true}
                    onTouchTap={this.props.openSpecificationOptionDialog.bind(this, -1)}
                />
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>操作</TableHeaderColumn>
                            <TableHeaderColumn>规格名称</TableHeaderColumn>
                            <TableHeaderColumn>描述</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {options}
                    </TableBody>
                </Table>
                <OptionDialog/>
            </Dialog>
        );
    }
}

SpecificationDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        errors: state.Specification.errors,
        specificationDialogOpen: state.Specification.specificationDialogOpen,
        currentSpecification: state.Specification.currentSpecification,
        specificationId: ownProps.params.specificationId,
        goods: state.Goods.goods
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGoodsList: () => dispatch(GoodsActionCreators.fetchGoodsList()),
        fetchSpecification: (specificationId) => dispatch(SpecificationActionCreators.fetchSpecification(specificationId)),
        updateSpecificationDraft: (field, value) => dispatch(SpecificationActionCreators.updateSpecificationDraft(field, value)),
        addSpecification: (specification) => dispatch(SpecificationActionCreators.addSpecification(specification)),
        updateSpecification: (specificationId, draftSpecification) => dispatch(SpecificationActionCreators.updateSpecification(specificationId, draftSpecification)),
        goToSpecificationList: () => dispatch(SpecificationActionCreators.goToSpecificationList()),
        openSpecificationOptionDialog: (optionIndex) => dispatch(SpecificationActionCreators.openSpecificationOptionDialog(optionIndex)),
        specificationOptionDeleteTap: (optionIndex) => dispatch(SpecificationActionCreators.removeSpecificationOption(optionIndex)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SpecificationDialog);
