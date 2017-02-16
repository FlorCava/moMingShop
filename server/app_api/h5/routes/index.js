const express = require('express')
const router = express.Router()
const passport = require('passport')

const ctrlUsers = require('../controllers/users')
const ctrlCategories = require('../controllers/categories')
const ctrlProducts = require('../controllers/products')
const ctrlOrders = require('../controllers/orders')

/**
 * 用户 routing
 */
// 获取用户相关信息
router.post('/users/user_info',
  ctrlUsers.userInfo
)
// 微信小程序用户登陆／注册
router.post('/users/weixin/auth',
  ctrlUsers.authWithWeiXinApp
)

/**
 * 产品分类 routing
 */
// 获取产品分类列表
router.get('/categories',
  // passport.authenticate('jwt', {session: false}),
  ctrlCategories.categoryList
)

/**
 * 产品 routing
 */
// 获取产品列表
router.get('/products',
  ctrlProducts.productList
)
// 根据品牌获取产品列表
router.get('/products/brand/:brandId',
  ctrlProducts.productListByBrand
)
// 根据产品分类获取产品列表
router.get('/products/category/:categoryId',
  ctrlProducts.productListByCategory
)
// 获取指定的产品信息
router.get('/products/:productId',
  ctrlProducts.productReadOne
)

/**
 * 订单 routing
 */
// 获取订单列表
router.get('/orders',
  ctrlOrders.orderList
)
// 创建订单
router.post('/orders',
  ctrlOrders.orderCreateOne
)

module.exports = router;