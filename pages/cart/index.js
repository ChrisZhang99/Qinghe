var app = getApp()
Page( {
  data: {
    userInfo: {},
    cartImg: '../../images/cart-null.png',
    tipWords: '购物车空空如也',
    cartItems: [],
    purchaseButtonDisabled: false,
    access_token: null,
    showLoading: false   
  },

  showLoading: function () {
    this.setData({
      showLoading: true
    })
  },
  cancelLoading: function () {
    this.setData({
      showLoading: false
    })
  },
  
  onLoad: function () {

    var that = this

    that.setData({
      userInfo: app.globalData.userInfo
    })
    console.log("+++++++++++")
    console.log(that.data.userInfo)
  },

  onShow: function () {
    var that = this
    
    that.setData({
      cartItems: app.globalData.purchaseItems,
      purchaseButtonDisabled: (app.globalData.purchaseItems.length == 0)
    }); 

    /*
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxfae3ca3c5e8a9bd9&secret=563116f55cb65e769a5b23b26b8270a2',
      method: 'get',
      data: { },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          access_token: res.data.access_token
        });
      }
    })
    */
  },

  placeOrder: function (e) {

    var that = this
    that.showLoading();
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
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        app.globalData.purchaseItems.splice(0, app.globalData.purchaseItems.length);
        that.setData({
          purchaseButtonDisabled: true
        });
        that.cancelLoading();
        var purchaseLines="";

        for (var i = 0; i < res.data.data.PurchaseItems.length; i++) {

          var line = res.data.data.PurchaseItems[i].productName + "     " + res.data.data.PurchaseItems[i].productNumber + "     " +
          res.data.data.PurchaseItems[i].productUnit + "\r\n";
          purchaseLines = purchaseLines + line;
        }  

        let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.access_token;
        let _jsonData = {
          access_token: that.data.access_token,
          touser: app.globalData.userInfo.openid,
          template_id: 'TSraOn07HldeK1mDTjK0vMFOu3ZpIqb8gsqZZs_O8qY',
          form_id: e.detail.formId,
          page: "pages/my/index",
          data: {
            "keyword1": { "value": res.data.data.PurchaseOrder.CreatedTime, "color": "#173177" },
            "keyword2": { "value": purchaseLines, "color": "#173177" },
          }
        }

        wx.request({
          url: url,
          data: _jsonData,
          method: "POST",
          success: function (res) {
            console.log(res)
          },
          fail: function (err) {
            console.log('request fail ', err);
          },
          complete: function (res) {
            console.log("request completed!");
          }

        })
      },
      fail: function (err) {
        that.setData({
          purchaseButtonDisabled: false
        });
        that.cancelLoading();
        console.log('request fail ', err);
      }
    })

    
  }
})
