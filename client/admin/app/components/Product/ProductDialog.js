import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

// Components
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import {Editor} from '../Common/Editor';
import {convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import ImageUploader from '../Common/ImageUploader/ImageUploader';
import {CommonStyles} from '../CommonStyles';
import {styles} from './styles';

// Stores & Actions
import {STATIC_URL} from '../../config/config';
import ProductActionCreators from '../../actions/ProductActionCreators';
import BrandActionCreators from '../../actions/BrandActionCreators';
import CategoryActionCreators from '../../actions/CategoryActionCreators';

class ProductDialog extends Component {

    handleClose() {
        this.props.goToProductList();
    };

    handleChange(field, e) {
        this.props.updateProductDraft(field, e.target.value);
    }

    handleSelectChange(idField, nameField, e, index, payload) {
        let value = payload.substring(payload.indexOf('-') + 1);
        this.props.updateProductDraft(idField, value);
        this.props.updateProductDraft(nameField, e.target.textContent);
    }

    handleCheck(field, value, e) {
        this.props.updateProductDraft(field, value);
    }

    handleContentChange(field, content) {
        var contentRow = convertToRaw(content);
        let html = stateToHTML(content);
        this.props.updateProductDraft(field, html);
        this.props.updateProductDraft(field + '_draft', JSON.stringify(contentRow));
    }

    handleProductOptionsContentChange(productContentIndex, field, e) {
        this.props.updateProductOptionsContentDraft(productContentIndex, field, e.target.value);
    }

    handleSubmit() {
        if (this.props.productId !== undefined) {
            if (this.props.stepIndex === 0) {
                this.props.updateProductStepOne(this.props.productId, this.props.currentProduct, this.props.stepIndex);
            } else if (this.props.stepIndex === 1) {
                this.props.updateProductStepTwo(this.props.productId, this.props.currentProduct, this.props.stepIndex);
            } else if (this.props.stepIndex === 2) {
                this.props.updateProductStepThree(this.props.productId, this.props.currentProduct, this.props.stepIndex);
            }
        } else {
            this.props.addProductStepOne(this.props.currentProduct, this.props.stepIndex);
        }
    }

    handleProductImages(src, name, size, type) {
        this.props.addProductImages(this.props.productId, src, name);
    }

    handleProductBaseImage(src, name, size, type) {
        this.props.addProductBaseImage(this.props.productId, src, name);
    }

    handleContentImageFile(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    handleProductOptionsNewRequest(choseRequest, index) {
        if (index > -1) {
            this.props.addProductOptionsDraft(choseRequest);
        } else if (index === -1) {
            this.props.addProductOptionsDraftWithNew(choseRequest);
        }
        this.refs["autoCompleteProductOptions"].setState({searchText: ''});
    }

    handleTouchTapProductOptionsSpecOptPop(specId, event) {
        event.preventDefault();
        this.props.openProductOptionsSpecOptPop(specId, event.currentTarget)
    }

    handleProductOptionsOptNewRequest(choseRequest, index) {
        if (index > -1) {
            this.props.addProductOptionsOptDraft(this.props.currentProductSpecification.spec_id, choseRequest);
        } else if (index === -1) {
            this.props.addProductOptionsOptDraftWithNew(this.props.currentProductSpecification, choseRequest);
        }
        this.refs["autoCompleteProductOptions_opt"].setState({searchText: ''});
        this.props.closeProductOptionsSpecOptPop();
    }

    componentWillMount() {
        this.props.fetchCategoryList();
        this.props.fetchBrandList();
        this.props.fetchSpecificationListWithoutPage();
        this.props.fetchProduct(this.props.productId);
    }

    renderStepContent(stepIndex) {
        let brandItems = this.props.brands.map((brand) => {
            return (
                <MenuItem key={'brand-' + brand.brand_id} value={'brand-' + brand.brand_id} primaryText={brand.name}
                          label={brand.name}/>
            )
        });
        let categoryItems = this.props.categories.map((category) => {
            return (
                <MenuItem key={'category-' + category.category_id} value={'category-' + category.category_id}
                          primaryText={category.name} label={category.name}/>
            )
        });

        let baseImageGrid = null;
        if (this.props.currentProduct.baseImage !== '') {
            baseImageGrid = <div style={styles.gridRoot}>
                <GridList style={styles.gridList} cols={3}>
                    <Subheader>已上传图片：</Subheader>
                    <GridTile
                        key={this.props.currentProduct.baseImage}
                        title="主要商品图片"
                        actionIcon={
                            <IconButton
                                onTouchTap={this.props.removeProductBaseImage.bind(this,
                                    this.props.productId, this.props.currentProduct.baseImage)}>
                                <DeleteIcon color="white"/>
                            </IconButton>}
                    >
                        <img src={STATIC_URL + this.props.currentProduct.baseImage}/>
                    </GridTile>
                </GridList>
            </div>
        } else {
            baseImageGrid =
                <div >
                    <ImageUploader handleImageFile={this.handleProductBaseImage.bind(this)}/>
                </div>
        }
        switch (stepIndex) {
            case 0:
                return (
                    <div>
                        <SelectField
                            id="categoryId"
                            key="categoryId"
                            underlineStyle={{width: '0px'}}
                            value={this.props.currentProduct.categoryId === '' ? '' : 'category-' + this.props.currentProduct.categoryId}
                            errorText={this.props.errors.categoryId}
                            onChange={this.handleSelectChange.bind(this, 'categoryId', 'categoryName')}
                            floatingLabelText="所属分类"
                        >
                            {categoryItems}
                        </SelectField>
                        <Divider/>
                        <SelectField
                            id="brandId"
                            key="brandId"
                            underlineStyle={{width: '0px'}}
                            value={this.props.currentProduct.brandId === '' ? '' : 'brand-' + this.props.currentProduct.brandId}
                            errorText={this.props.errors.brandId}
                            onChange={this.handleSelectChange.bind(this, 'brandId', 'brandName')}
                            floatingLabelText="所属品牌"
                        >
                            {brandItems}
                        </SelectField>
                        <Divider/>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <TextField
                            id="product_name"
                            key="product_name"
                            underlineShow={false}
                            fullWidth={true}
                            hintText="输入产品名称"
                            floatingLabelText="产品名称"
                            value={this.props.currentProduct.product_name}
                            errorText={this.props.errors.product_name}
                            onChange={this.handleChange.bind(this, 'product_name')}
                        />
                        <Divider/>
                        <TextField
                            id="second_title"
                            key="second_title"
                            underlineShow={false}
                            fullWidth={true}
                            hintText="输入产品副名称"
                            floatingLabelText="产品副名称"
                            value={this.props.currentProduct.second_title}
                            errorText={this.props.errors.second_title}
                            onChange={this.handleChange.bind(this, 'second_title')}
                        />
                        <Divider/>
                        <div>商品规格</div>
                        <div style={styles.gridRoot}>
                            <GridList style={styles.gridList} cols={1} cellHeight="auto">
                                {this.props.currentProduct.options.spec_content.map((spec, specIndex) => (
                                    <GridTile
                                        key={specIndex}>
                                        <CancelIcon color="grey" style={{paddingRight: '20px'}}
                                                    onTouchTap={this.props.removeProductOptionsDraft.bind(this, spec.spec_id)}/>
                                        <span style={{paddingRight: '40px'}}>{spec.spec_name}</span>
                                        <FlatButton
                                            label={"添加<" + spec.spec_name + ">的选项"}
                                            secondary={true}
                                            onTouchTap={this.handleTouchTapProductOptionsSpecOptPop.bind(this, spec.spec_id)}
                                        />
                                        <div style={{display: 'flex', flexWrap: 'wrap',}}>
                                            {spec.spec_option.map((option, optionIndex) => (
                                                <Chip key={optionIndex} style={{margin: "4px"}}
                                                      onRequestDelete={this.props.removeProductOptionsOptDraft.bind(this, spec.spec_id, option.opt_id)}>
                                                    {option.opt_name}
                                                </Chip>
                                            ))}
                                        </div>
                                    </GridTile>
                                ))}
                            </GridList>
                        </div>
                        {this.props.currentProduct.options ?
                            <Table selectable={false}>
                                <TableHeader displaySelectAll={false}>
                                    <TableRow>
                                        <TableHeaderColumn>规格组合</TableHeaderColumn>
                                        <TableHeaderColumn>价格（元）</TableHeaderColumn>
                                        <TableHeaderColumn>库存</TableHeaderColumn>
                                        <TableHeaderColumn>商家编码</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false}>
                                    {this.props.currentProduct.options.product_content.map((productContent, productContentIndex) => {
                                        console.log(productContent);
                                        return (
                                            <TableRow key={productContentIndex}>
                                                <TableRowColumn>
                                                    {productContent.specs.map((spec) => {
                                                        return spec.opt_name + ' - ';
                                                    })}
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <TextField
                                                        id={"product_price" + productContentIndex}
                                                        key={"product_price" + productContentIndex}
                                                        value={productContent.product_price}
                                                        onChange={this.handleProductOptionsContentChange.bind(this, productContentIndex, 'product_price')}
                                                    />
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <TextField
                                                        id={"stock_qty" + productContentIndex}
                                                        key={"stock_qty" + productContentIndex}
                                                        value={productContent.stock_qty}
                                                        onChange={this.handleProductOptionsContentChange.bind(this, productContentIndex, 'stock_qty')}
                                                    />
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <TextField
                                                        disabled={true}
                                                        underlineShow={false}
                                                        id={"sku" + productContentIndex}
                                                        key={"sku" + productContentIndex}
                                                        value={productContent.sku}
                                                        onChange={this.handleProductOptionsContentChange.bind(this, productContentIndex, 'sku')}
                                                    />
                                                </TableRowColumn>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table> : ''
                        }
                        <AutoComplete
                            floatingLabelText="添加商品规格"
                            ref="autoCompleteProductOptions"
                            filter={AutoComplete.fuzzyFilter}
                            openOnFocus={true}
                            dataSource={this.props.specifications}
                            dataSourceConfig={{
                                text: 'name',
                                value: 'spec_id'
                            }}
                            onNewRequest={this.handleProductOptionsNewRequest.bind(this)}
                        />
                        <Popover
                            open={this.props.currentProductOptionsSpecOptPopOpen}
                            anchorEl={this.props.currentProductOptionsSpecOptPopAnchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.props.closeProductOptionsSpecOptPop.bind(this)}>
                            <AutoComplete
                                id="autoCompleteProductOptions_opt"
                                ref="autoCompleteProductOptions_opt"
                                filter={AutoComplete.fuzzyFilter}
                                openOnFocus={true}
                                dataSource={this.props.currentProductSpecification.options}
                                dataSourceConfig={{
                                    text: 'name',
                                    value: 'opt_id'
                                }}
                                onNewRequest={this.handleProductOptionsOptNewRequest.bind(this)}
                            />
                        </Popover>
                        <Divider/>
                        <TextField
                            id="price"
                            key="price"
                            underlineShow={false}
                            fullWidth={true}
                            hintText="输入产品价格"
                            floatingLabelText="产品价格"
                            value={this.props.currentProduct.price}
                            errorText={this.props.errors.price}
                            onChange={this.handleChange.bind(this, 'price')}
                        />
                        <Divider/>
                        <TextField
                            id="sku"
                            key="sku"
                            underlineShow={false}
                            fullWidth={true}
                            hintText="输入sku"
                            floatingLabelText="商品编码"
                            disabled={true}
                            value={this.props.currentProduct.sku}
                            onChange={this.handleChange.bind(this, 'sku')}
                        />
                        <Divider/><br/>
                        <Toggle
                            id="is_saleable"
                            key="is_saleable"
                            label="产品是否可卖"
                            style={{width: '250px'}}
                            toggled={this.props.currentProduct.is_saleable}
                            onToggle={this.handleCheck.bind(this, 'is_saleable', !this.props.currentProduct.is_saleable)}
                        />
                        <Divider/>
                        <div>主要产品图片</div>
                        {baseImageGrid}
                        <div>轮播产品图片</div>
                        <ImageUploader handleImageFile={this.handleProductImages.bind(this)}/>
                        <div style={styles.gridRoot}>
                            <GridList style={styles.gridList} cols={3}>
                                <Subheader>已上传图片列表：</Subheader>
                                {this.props.currentProduct.images.map((image, imageIndex) => (
                                    <GridTile
                                        key={image}
                                        title={imageIndex + 1}
                                        actionIcon={
                                            <IconButton
                                                onTouchTap={this.props.removeProductImages.bind(this, this.props.productId, image, imageIndex)}>
                                                <DeleteIcon color="white"/>
                                            </IconButton>}
                                    >
                                        <img src={STATIC_URL + image}/>
                                    </GridTile>
                                ))}
                            </GridList>
                        </div>
                        <Divider/>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div>产品介绍</div>
                        <Editor handleImageFile={this.handleContentImageFile.bind(this)}
                                onChange={this.handleContentChange.bind(this, 'description')}
                                rawContentState={this.props.currentProduct.description_draft}/>
                        <div>产品规格</div>
                        <Editor handleImageFile={this.handleContentImageFile.bind(this)}
                                onChange={this.handleContentChange.bind(this, 'product_specification')}
                                rawContentState={this.props.currentProduct.product_specification_draft}/>
                        <div>产品售后</div>
                        <Editor handleImageFile={this.handleContentImageFile.bind(this)}
                                onChange={this.handleContentChange.bind(this, 'sales_support')}
                                rawContentState={this.props.currentProduct.sales_support_draft}/>
                    </div>
                );
            default:
                return '没有需要更新的内容';
        }
    }

    render() {
        const actions = [
            // <FlatButton
            //     label="保 存"
            //     primary={true}
            //     onTouchTap={this.handleSubmit.bind(this)}
            // />,
            <FlatButton
                label="关 闭"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}
            />,
            // <FlatButton
            //     label="删 除"
            //     onTouchTap={this.handleDelete.bind(this)}
            // />,
        ];

        return (
            <Dialog
                title="商品维护"
                actions={actions}
                modal={true}
                contentStyle={CommonStyles.dialog}
                open={this.props.productDialogOpen}
                autoScrollBodyContent={true}
            >
                <div style={{width: '100%', margin: 'auto'}}>
                    <Stepper activeStep={this.props.stepIndex}>
                        <Step>
                            <StepLabel>选择商品品类、品牌</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>编辑基本信息</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>编辑商品详情</StepLabel>
                        </Step>
                    </Stepper>
                    <div style={styles.stepContent}>
                        <div>
                            {this.props.errors.summary &&
                            <p style={CommonStyles.errorMessage}>{this.props.errors.summary}</p>}

                            {this.renderStepContent(this.props.stepIndex)}
                            <div style={{marginTop: 12}}>
                                <FlatButton
                                    label="上一步"
                                    disabled={this.props.stepIndex === 0}
                                    onTouchTap={this.props.prevStep.bind(this, this.props.stepIndex)}
                                    style={{marginRight: 12}}
                                />
                                <RaisedButton
                                    label={this.props.stepIndex === 2 ? '完成' : '下一步'}
                                    primary={true}
                                    onTouchTap={this.handleSubmit.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

ProductDialog.contextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        errors: state.Product.errors,
        productDialogOpen: state.Product.productDialogOpen,
        currentProduct: state.Product.currentProduct,
        productId: state.Product.currentProductId !== '' ? state.Product.currentProductId : ownProps.params.productId,
        brands: state.Brand.brands,
        categories: state.Category.categories,
        specifications: state.Product.currentProductSpecifications,
        stepIndex: state.Product.stepIndex,
        currentProductOptionsSpecOptPopOpen: state.Product.currentProductOptionsSpecOptPopOpen,
        currentProductOptionsSpecOptPopAnchorEl: state.Product.currentProductOptionsSpecOptPopAnchorEl,
        currentProductSpecification: state.Product.currentProductSpecification,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBrandList: () => dispatch(BrandActionCreators.fetchBrandList()),
        fetchCategoryList: () => dispatch(CategoryActionCreators.fetchCategoryList()),
        fetchSpecificationListWithoutPage: () => dispatch(ProductActionCreators.fetchSpecificationListWithoutPage()),
        fetchProduct: (productId) => dispatch(ProductActionCreators.fetchProduct(productId)),
        updateProductDraft: (field, value) => dispatch(ProductActionCreators.updateProductDraft(field, value)),
        openProductOptionsSpecOptPop: (specId, anchorEl) => dispatch(ProductActionCreators.openProductOptionsSpecOptPop(specId, anchorEl)),
        closeProductOptionsSpecOptPop: () => dispatch(ProductActionCreators.closeProductOptionsSpecOptPop()),
        addProductOptionsDraft: (specification) => dispatch(ProductActionCreators.addProductOptionsDraft(specification)),
        addProductOptionsDraftWithNew: (newSpecName) => dispatch(ProductActionCreators.addProductOptionsDraftWithNew(newSpecName)),
        removeProductOptionsDraft: (specId) => dispatch(ProductActionCreators.removeProductOptionsDraft(specId)),
        addProductOptionsOptDraft: (specId, option) => dispatch(ProductActionCreators.addProductOptionsOptDraft(specId, option)),
        addProductOptionsOptDraftWithNew: (specification, newOptionName) => dispatch(ProductActionCreators.addProductOptionsOptDraftWithNew(specification, newOptionName)),
        removeProductOptionsOptDraft: (specId, optId) => dispatch(ProductActionCreators.removeProductOptionsOptDraft(specId, optId)),
        updateProductOptionsContentDraft: (productContentIndex, field, value) => dispatch(ProductActionCreators.updateProductOptionsContentDraft(productContentIndex, field, value)),
        addProductStepOne: (product, stepIndex) => dispatch(ProductActionCreators.addProductStepOne(product, stepIndex)),
        updateProductStepOne: (productId, draftProduct, stepIndex) => dispatch(ProductActionCreators.updateProductStepOne(productId, draftProduct, stepIndex)),
        updateProductStepTwo: (productId, draftProduct, stepIndex) => dispatch(ProductActionCreators.updateProductStepTwo(productId, draftProduct, stepIndex)),
        updateProductStepThree: (productId, draftProduct, stepIndex) => dispatch(ProductActionCreators.updateProductStepThree(productId, draftProduct, stepIndex)),
        // addProduct: (product, stepIndex) => dispatch(ProductActionCreators.addProduct(product, stepIndex)),
        // updateProduct: (productId, draftProduct, stepIndex) => dispatch(ProductActionCreators.updateProduct(productId, draftProduct, stepIndex)),
        // deleteProduct: (productId) => dispatch(ProductActionCreators.deleteProduct(productId)),
        addProductImages: (productId, image, imageName) =>
            dispatch(ProductActionCreators.addProductImages(productId, image, imageName)),
        removeProductImages: (productId, imageUrl, imageIndex) =>
            dispatch(ProductActionCreators.removeProductImages(productId, imageUrl, imageIndex)),
        addProductBaseImage: (productId, image, imageName) =>
            dispatch(ProductActionCreators.addProductBaseImage(productId, image, imageName)),
        removeProductBaseImage: (productId, imageUrl) =>
            dispatch(ProductActionCreators.removeProductBaseImage(productId, imageUrl)),
        goToProductList: () => dispatch(ProductActionCreators.goToProductList()),
        nextStep: (stepIndex) => dispatch(ProductActionCreators.nextStep(stepIndex)),
        prevStep: (stepIndex) => dispatch(ProductActionCreators.prevStep(stepIndex)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProductDialog);
