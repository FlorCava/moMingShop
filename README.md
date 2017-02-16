# moMingShop
微信小程序版商城Demo

### 文档结构：
- server：node.js + express实现rest api；
- client.weixin_app：商城微信小程序客户端，没有使用第三方框架，只对官方api做少量封装，保持结构的精简；
- client.weixin_h5：保留结构，用于后续产品H5版本（比如公众号使用）的客户端；
- client.admin：react + redux + material ui实现的商城管理后台；

### 产品功能:
微信小程序版商城Demo。
#### v0.0.1：
- Admin后台可创建品牌、商品分类、商品属性、商品；
- 微信小程序端可浏览商品；
