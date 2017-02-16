module.exports.setHeaders = function() {
    return {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageInfoSync('token')
    }
}
