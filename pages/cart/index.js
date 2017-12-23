var app = getApp()
Page( {
  data: {
    userInfo: {},
    cartImg: '../../images/cart-null.png',
    tipWords: '购物车空空如也',
    cartItems: []
  },

  onLoad: function () {

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  onShow: function () {
    var that = this
    
    that.setData({
      cartItems: app.globalData.purchaseItems
    });
    console.log(that.data.cartItems);  
  },

  placeOrder: function (e) {
    var that = this
    console.log(app.globalData.purchaseItems);  
    var purchaseItemList = {};

    for (var i = 0; i < app.globalData.purchaseItems.length; i++) {
      purchaseItemList["purchaseItems[" + i + "].categoryID"] = app.globalData.purchaseItems[i].categoryID;
      purchaseItemList["purchaseItems[" + i + "].categoryName"] = app.globalData.purchaseItems[i].categoryName;
      purchaseItemList["purchaseItems[" + i + "].productID"] = app.globalData.purchaseItems[i].productID;
      purchaseItemList["purchaseItems[" + i + "].productName"] = app.globalData.purchaseItems[i].productName;
      purchaseItemList["purchaseItems[" + i + "].productNumber"] = app.globalData.purchaseItems[i].productNumber;
      purchaseItemList["purchaseItems[" + i + "].productUnit"] = app.globalData.purchaseItems[i].productUnit;
    }  
    purchaseItemList["creator"] = this.data.userInfo.baseInfo.nickName
    
    wx.request({
      url: 'https://www.snowcrane123.com/PurchaseOrders/Add/',
      method: 'POST',
      data: purchaseItemList,
      //data: { "purchaseItems": JSON.stringify(app.globalData.purchaseItems) },
      //data: {purchaseItems:purchaseItemList,creator:this.data.userInfo.baseInfo.nickName},
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        console.log("res.data");    
        console.log(res.data);
      }
    })
  }
})
