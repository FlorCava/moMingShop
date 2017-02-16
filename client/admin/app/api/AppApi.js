import 'isomorphic-fetch';
import 'babel-polyfill';

const API_URL = 'http://localhost:3000/api/admin';
const API_HEADERS = {
    'Content-Type': 'application/json'
};

let AppApi = {
    auth(name, password){
        return fetch(`${API_URL}/auth`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify({
                name: name,
                password: password
            })
        })
            .then((response) => response.json())
            .catch(function (ex) {
                console.log(ex);
            });
    },

    // 商品品牌相关API
    fetchBrandList(page) {
        return fetch(`${API_URL}/brands/page/${page}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchBrand(brandId) {
        return fetch(`${API_URL}/brands/${brandId}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    addBrand(brand) {
        return fetch(`${API_URL}/brands`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(brand)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateBrand(brandId, draftBrand){
        return fetch(`${API_URL}/brands/${brandId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftBrand)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    deleteBrand(brandId){
        return fetch(`${API_URL}/brands/${brandId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    },

    // 商品分类相关API
    fetchCategoryList(page) {
        return fetch(`${API_URL}/categories/page/${page}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchCategoryParentList() {
        return fetch(`${API_URL}/parent_categories`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchCategory(categoryId) {
        return fetch(`${API_URL}/categories/${categoryId}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    addCategory(category) {
        return fetch(`${API_URL}/categories`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(category)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateCategory(categoryId, draftCategory){
        return fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftCategory)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    deleteCategory(categoryId){
        return fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    },

    // 商品属性相关API
    fetchPropertyList(page) {
        return fetch(`${API_URL}/properties/page/${page}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchProperty(propertyId) {
        return fetch(`${API_URL}/properties/${propertyId}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    addProperty(property) {
        return fetch(`${API_URL}/properties`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(property)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateProperty(propertyId, draftProperty){
        return fetch(`${API_URL}/properties/${propertyId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftProperty)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    deleteProperty(propertyId){
        return fetch(`${API_URL}/properties/${propertyId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    },

    // 货品相关API
    fetchGoodsList(page) {
        return fetch(`${API_URL}/goods/page/${page}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchGoods(goodsId) {
        return fetch(`${API_URL}/goods/${goodsId}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    addGoods(goods) {
        return fetch(`${API_URL}/goods`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(goods)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateGoods(goodsId, draftGoods){
        return fetch(`${API_URL}/goods/${goodsId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftGoods)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    deleteGoods(goodsId){
        return fetch(`${API_URL}/goods/${goodsId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    },

    // 商品规格相关API
    fetchSpecificationList(page) {
        return fetch(`${API_URL}/specifications/page/${page}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchSpecificationListWithoutPage() {
        return fetch(`${API_URL}/specifications`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchSpecification(specificationId) {
        return fetch(`${API_URL}/specifications/${specificationId}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    addSpecification(specification) {
        return fetch(`${API_URL}/specifications`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(specification)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateSpecification(specificationId, draftSpecification){
        return fetch(`${API_URL}/specifications/${specificationId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftSpecification)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    deleteSpecification(specificationId){
        return fetch(`${API_URL}/specifications/${specificationId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    },

    // 产品相关API
    fetchProductList(page) {
        return fetch(`${API_URL}/products/page/${page}`, {headers: API_HEADERS})
            .then((response) => response.json())
    },
    fetchProduct(productId) {
        return fetch(`${API_URL}/products/${productId}`, {
            headers: API_HEADERS
        })
            .then((response) => {
                return response.json()
            })
    },
    addProductStepOne(product) {
        return fetch(`${API_URL}/products/step/one`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(product)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateProductStepOne(productId, draftProduct){
        return fetch(`${API_URL}/products/step/one/${productId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftProduct)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateProductStepTwo(productId, draftProduct){
        return fetch(`${API_URL}/products/step/two/${productId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftProduct)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateProductStepThree(productId, draftProduct){
        return fetch(`${API_URL}/products/step/three/${productId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftProduct)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    addProduct(product) {
        return fetch(`${API_URL}/products`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(product)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    updateProduct(productId, draftProduct){
        return fetch(`${API_URL}/products/${productId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(draftProduct)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(error => Promise.reject(error));
                }
            })
    },
    deleteProduct(productId){
        return fetch(`${API_URL}/products/${productId}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    },
    productBaseImageAdd(productId, imageUrl) {
        return fetch(`${API_URL}/products/${productId}/image/${imageUrl}`, {
            method: 'post',
            headers: API_HEADERS
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
    },
    productBaseImageDelete(productId, imageUrl) {
        return fetch(`${API_URL}/products/${productId}/image/${imageUrl}`, {
            method: 'delete',
            headers: API_HEADERS
        })
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
    },
    productImagesAddOne(productId, imageUrl) {
        return fetch(`${API_URL}/products/${productId}/images/${imageUrl}`, {
            method: 'post',
            headers: API_HEADERS
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
    },
    productImagesDeleteOne(productId, imageUrl) {
        return fetch(`${API_URL}/products/${productId}/images/${imageUrl}`, {
            method: 'delete',
            headers: API_HEADERS
        })
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
    },
    addProductFile(file, fileName){
        var formData = new FormData();
        formData.append('image', file);
        formData.append('fileName', fileName);
        return fetch(`${API_URL}/file/product`, {
            method: 'post',
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: formData

        })
            .then((response) => response.json())
    },
    deleteProductFile(fileUrl){
        return fetch(`${API_URL}/file/${fileUrl}`, {
            method: 'delete',
            headers: API_HEADERS
        })
    }
};

export default AppApi;
