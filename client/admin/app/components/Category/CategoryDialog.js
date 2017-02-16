import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Components
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {CommonStyles} from '../CommonStyles';

// Stores & Actions
import CategoryActionCreators from '../../actions/CategoryActionCreators';

class CategoryDialog extends Component {

    handleClose(){
        this.props.goToCategoryList();
    };

    handleChange(field, e) {
        this.props.updateCategoryDraft(field, e.target.value);
    }

    handleSelectChange(field, e, index, payload) {
        this.props.updateCategoryDraft(field, payload);
    }

    handleSubmit(e){
        e.preventDefault();
        if (this.props.categoryId !== undefined) {
            this.props.updateCategory(this.props.categoryId, this.props.currentCategory);
        } else {
            this.props.addCategory(this.props.currentCategory);
        }
    }

    componentWillMount() {
        this.props.fetchCategoryParentList();
        this.props.fetchCategory(this.props.categoryId);
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
                <MenuItem key={category._id} value={category._id} primaryText={category.name}/>
            )
        });

        return (
            <Dialog
                title="商品分类维护"
                actions={actions}
                modal={true}
                open={this.props.categoryDialogOpen}
                autoScrollBodyContent={true}
            >
                {this.props.errors.summary && <p style={CommonStyles.errorMessage}>{this.props.errors.summary}</p>}

                <TextField
                    id="name"
                    key="name"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入分类名称"
                    floatingLabelText="分类名称"
                    value={this.props.currentCategory.name}
                    errorText={this.props.errors.name}
                    onChange={this.handleChange.bind(this, 'name')}
                />
                <Divider/>
                <TextField
                    id="sort_order"
                    key="sort_order"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入分类排序权重"
                    floatingLabelText="分类排序权重"
                    value={this.props.currentCategory.sort_order}
                    errorText={this.props.errors.sort_order}
                    onChange={this.handleChange.bind(this, 'sort_order')}
                />
                <Divider/>
                <SelectField
                    id="parentId"
                    key="parentId"
                    underlineStyle={{width: '0px'}}
                    value={this.props.currentCategory.parentId}
                    errorText={this.props.errors.parentId}
                    onChange={this.handleSelectChange.bind(this, 'parentId')}
                    floatingLabelText="上级分类"
                >
                    {parentCategoryItems}
                </SelectField>
                <Divider/>
                <TextField
                    id="description"
                    key="description"
                    underlineShow={false}
                    fullWidth={true}
                    hintText="输入分类备注"
                    floatingLabelText="分类备注"
                    multiLine={true}
                    rows={2}
                    value={this.props.currentCategory.description}
                    errorText={this.props.errors.description}
                    onChange={this.handleChange.bind(this, 'description')}
                />
                <Divider/>
            </Dialog>
        );
    }
}

CategoryDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        errors: state.Category.errors,
        categoryDialogOpen: state.Category.categoryDialogOpen,
        currentCategory: state.Category.currentCategory,
        categoryId: ownProps.params.categoryId,
        parent_categories: state.Category.parent_categories
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCategoryParentList: () => dispatch(CategoryActionCreators.fetchCategoryParentList()),
        fetchCategory: (categoryId) => dispatch(CategoryActionCreators.fetchCategory(categoryId)),
        updateCategoryDraft: (field, value) => dispatch(CategoryActionCreators.updateCategoryDraft(field, value)),
        addCategory: (category) => dispatch(CategoryActionCreators.addCategory(category)),
        updateCategory: (categoryId, draftCategory) => dispatch(CategoryActionCreators.updateCategory(categoryId, draftCategory)),
        goToCategoryList: () => dispatch(CategoryActionCreators.goToCategoryList())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog);
