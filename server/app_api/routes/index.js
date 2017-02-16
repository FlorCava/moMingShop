const express = require('express')
const router = express.Router()
const passport = require('passport')
const path = require('path')
const fse = require('fs-extra')
const utils = require('../../utils/utils')
const multer = require('multer')
const moment = require('moment')

const ctrlBrands = require('../controllers/brands')
const ctrlCategories = require('../controllers/categories')
const ctrlProperties = require('../controllers/properties')
const ctrlGoods = require('../controllers/goods')
const ctrlSpecifications = require('../controllers/specifications')
const ctrlProducts = require('../controllers/products')
const ctrlHome = require('../controllers/home')
const ctrlUsers = require('../controllers/users')
const ctrlFiles = require('../controllers/files')

/**
 * 用户 routing
 */
// 注册
router.post('/signup',
  ctrlUsers.SignUp
)
// 登陆
router.post('/auth',
  ctrlUsers.Authenticate
)
// 获取用户信息
router.get('/memberinfo',
  passport.authenticate('jwt', {session: false}),
  ctrlUsers.MemberInfo
)
//
// // router.get('/auth/wechat', passport.authenticate('wechat', options));
// router.get('/auth/wechat', passport.authenticate('wechat'));
// router.get('/auth/wechat/callback', passport.authenticate('wechat', {
//     failureRedirect: '/auth/fail',
//     successReturnToOrRedirect: '/'
// }));

/**
 * 商品品牌后台管理 routing
 */
// 分页获取品牌列表
router.get('/brands/page/:page',
  // passport.authenticate('jwt', {session: false}),
  ctrlBrands.brandList
)
// 创建品牌
router.post('/brands',
  ctrlBrands.brandCreate
)
// 获取指定品牌
router.get('/brands/:brandId',
  ctrlBrands.brandReadOne
)
// 更新指定品牌
router.put('/brands/:brandId',
  ctrlBrands.brandUpdateOne
)
// 删除指定品牌
router.delete('/brands/:brandId',
  ctrlBrands.brandDeleteOne
)

/**
 * 商品分类后台管理 routing
 */
// 分页获取分类列表
router.get('/categories/page/:page',
  ctrlCategories.categoryList
)
// 获取顶级产品分类
router.get('/parent_categories',
  ctrlCategories.categoryParentList
)
// 创建分裂
router.post('/categories',
  ctrlCategories.categoryCreate
)
// 获取指定分类
router.get('/categories/:categoryId',
  ctrlCategories.categoryReadOne
)
// 更新指定分类
router.put('/categories/:categoryId',
  ctrlCategories.categoryUpdateOne
)
// 删除指定分类
router.delete('/categories/:categoryId',
  ctrlCategories.categoryDeleteOne
)

/**
 * 商品属性后台管理 routing
 */
// 分页获取属性列表
router.get('/properties/page/:page',
  ctrlProperties.propertyList
)
// 创建属性
router.post('/properties',
  ctrlProperties.propertyCreate
)
// 获取指定属性
router.get('/properties/:propertyId',
  ctrlProperties.propertyReadOne
)
// 更新指定属性
router.put('/properties/:propertyId',
  ctrlProperties.propertyUpdateOne
)
// 删除指定属性
router.delete('/properties/:propertyId',
  ctrlProperties.propertyDeleteOne
)

/**
 * 货品后台管理 routing
 */
// 分页获取货品列表
router.get('/goods/page/:page',
  ctrlGoods.goodsList
)
// 创建货品
router.post('/goods',
  ctrlGoods.goodsCreate
)
// 获取指定货品
router.get('/goods/:goodsId',
  ctrlGoods.goodsReadOne
)
// 更新指定货品
router.put('/goods/:goodsId',
  ctrlGoods.goodsUpdateOne
)
// 删除指定货品
router.delete('/goods/:goodsId',
  ctrlGoods.goodsDeleteOne
)

/**
 * 商品规格后台管理 routing
 */
// 分页获取规格列表
router.get('/specifications/page/:page',
  ctrlSpecifications.specificationList
)
// 获取规格列表（所有）
router.get('/specifications',
  ctrlSpecifications.specificationListWithoutPage
)
// 创建规格
router.post('/specifications',
  ctrlSpecifications.specificationCreate
)
// 获取指定规格
router.get('/specifications/:specificationId',
  ctrlSpecifications.specificationReadOne
)
// 更新指定规格
router.put('/specifications/:specificationId',
  ctrlSpecifications.specificationUpdateOne
)
// 删除指定规格
router.delete('/specifications/:specificationId',
  ctrlSpecifications.specificationDeleteOne
)

/**
 * 产品后台管理 routing
 */
// 分页获取产品列表
router.get('/products/page/:page',
  // passport.authenticate('jwt', {session: false}),
  ctrlProducts.productList
)
// 创建产品
router.post('/products/step/one',
  ctrlProducts.productCreateStepOne
)
// 更新指定产品部分信息（step one）
router.put('/products/step/one/:productId',
  ctrlProducts.productUpdateStepOne
)
// 更新指定产品部分信息（step two）
router.put('/products/step/two/:productId',
  ctrlProducts.productUpdateStepTwo
)
// 更新指定产品部分信息（step three）
router.put('/products/step/three/:productId',
  ctrlProducts.productUpdateStepThree
)
// router.post('/products', ctrlProducts.productCreate)
// 获取指定产品
router.get('/products/:productId',
  ctrlProducts.productReadOne
)
// router.put('/products/:productId', ctrlProducts.productUpdateOne)
// 删除指定产品
router.delete('/products/:productId',
  ctrlProducts.productDeleteOne
)
// 添加指定产品图片
router.post('/products/:productId/images/*?',
  ctrlProducts.productImagesAddOne
)
// 删除指定产品图片
router.delete('/products/:productId/images/*?',
  ctrlProducts.productImagesDeleteOne
)
// 添加指定产品缩略图
router.post('/products/:productId/image/*?',
  ctrlProducts.productBaseImageAdd
)
// 删除指定产品缩略图
router.delete('/products/:productId/image/*?',
  ctrlProducts.productBaseImageDelete
)

router.get('/home_slides', ctrlHome.homeSlideList);

/**
 * 产品文件服务 routing
 */
const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    let year = moment().get('year')
    let month = moment().get('month') + 1
    let day = moment().get('date')
    let filePath = path.resolve(__dirname, `../../public/image/product/${year}/${month}/${day}`)

    fse.ensureDir(filePath, function () {
      cb(null, filePath)
    })
  },
  filename: function (req, file, cb) {
    let name = utils.randomWord(false, 12)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      name = name + '.jpg'
    } else if (file.mimetype === 'image/png') {
      name = name + '.png'
    }
    cb(null, name)
  }
})
const uploadProduct = multer({storage: storageProduct})
router.post('/file/product',
  uploadProduct.single('image'),
  ctrlFiles.fileCreate
)
router.delete('/file/*?',
  ctrlFiles.fileDeleteOne
)

module.exports = router