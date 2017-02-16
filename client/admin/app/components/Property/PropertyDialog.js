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
import PropertyActionCreators from '../../actions/PropertyActionCreators';
import CategoryActionCreators from '../../actions/CategoryActionCreators';

class PropertyDialog extends Component {
    handleClose() {
        this.props.goToPropertyList();
    };

    handleChange(field, e) {
        this.props.updatePropertyDraft(field, e.target.value);
    }

    handleSelectChange(field, e, index, payload) {
        this.props.updatePropertyDraft(field, payload);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.propertyId !== undefined) {
            this.props.updateProperty(this.props.propertyId, this.props.currentProperty);
        } else {
            this.props.addProperty(this.props.currentProperty);
        }
    }

    componentWillMount() {
        this.props.fetchCategoryParentList();
        this.props.fetchProperty(this.props.propertyId);
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
        let parentCategoryItems = this.props.parent_categories.map((category) => {
            return (
                <MenuItem key={category.category_id} value={category.category_id} primaryText={category.name}/>
            )
        });
        let options = this.props.currentProperty.options.map((option, optionIndex) => {
            return (
                <TableRow key={optionIndex}>
                    <TableRowColumn>
                        <FlatButton
                            label="编辑"
                            onTouchTap={this.props.openPropertyOptionDialog.bind(this, optionIndex)}/>
                        <FlatButton
                            label="删除"
                            onTouchTap={this.props.propertyOptionDeleteTap.bind(this, optionIndex)}/>
                    </TableRowColumn>
                    <TableRowColumn>{option.name}</TableRowColumn>
                    <TableRowColumn>{option.description}</TableRowColumn>
                </TableRow>
            )
        });

        return (
            <Dialog
                title="商品属性维护"
                actions={actions}
                modal={true}
                contentStyle={CommonStyles.dialog}
                open={this.props.propertyDialogOpen}
                autoScrollBodyContent={true}
            >
                {this.props.errors.summary && <p style={CommonStyles.errorMessage}>{this.props.errors.summary}</p>}

                <TextField
                    id="name"
                    key="name"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入属性名称"
                    floatingLabelText="属性名称"
                    value={this.props.currentProperty.name}
                    errorText={this.props.errors.name}
                    onChange={this.handleChange.bind(this, 'name')}
                />
                <Divider/>
                <TextField
                    id="sort_order"
                    key="sort_order"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入属性排序权重"
                    floatingLabelText="属性排序权重"
                    value={this.props.currentProperty.sort_order}
                    errorText={this.props.errors.sort_order}
                    onChange={this.handleChange.bind(this, 'sort_order')}
                />
                <Divider/>
                <SelectField
                    id="categoryId"
                    key="categoryId"
                    underlineStyle={{width: '0px'}}
                    value={this.props.currentProperty.categoryId}
                    errorText={this.props.errors.categoryId}
                    onChange={this.handleSelectChange.bind(this, 'categoryId')}
                    floatingLabelText="所属分类"
                >
                    {parentCategoryItems}
                </SelectField>
                <Divider/>
                <TextField
                    id="description"
                    key="description"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入属性备注"
                    floatingLabelText="属性备注"
                    multiLine={true}
                    rows={2}
                    value={this.props.currentProperty.description}
                    errorText={this.props.errors.description}
                    onChange={this.handleChange.bind(this, 'description')}
                />
                <Divider/>
                <FlatButton
                    label="添加属性选项"
                    secondary={true}
                    onTouchTap={this.props.openPropertyOptionDialog.bind(this, -1)}
                />
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>操作</TableHeaderColumn>
                            <TableHeaderColumn>属性名称</TableHeaderColumn>
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

PropertyDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        errors: state.Property.errors,
        propertyDialogOpen: state.Property.propertyDialogOpen,
        currentProperty: state.Property.currentProperty,
        propertyId: ownProps.params.propertyId,
        parent_categories: state.Category.parent_categories
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closePropertyDialog: () => dispatch(PropertyActionCreators.closePropertyDialog()),
        fetchCategoryParentList: () => dispatch(CategoryActionCreators.fetchCategoryParentList()),
        fetchProperty: (propertyId) => dispatch(PropertyActionCreators.fetchProperty(propertyId)),
        updatePropertyDraft: (field, value) => dispatch(PropertyActionCreators.updatePropertyDraft(field, value)),
        addProperty: (property) => dispatch(PropertyActionCreators.addProperty(property)),
        updateProperty: (propertyId, draftProperty) => dispatch(PropertyActionCreators.updateProperty(propertyId, draftProperty)),
        goToPropertyList: () => dispatch(PropertyActionCreators.goToPropertyList()),
        openPropertyOptionDialog: (optionIndex) => dispatch(PropertyActionCreators.openPropertyOptionDialog(optionIndex)),
        propertyOptionDeleteTap: (optionIndex) => dispatch(PropertyActionCreators.removePropertyOption(optionIndex)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertyDialog);
