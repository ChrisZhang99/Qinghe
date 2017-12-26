var app = getApp()
Page( {
  data: {
    userInfo: {},
    cartImg: '../../images/cart-null.png',
    tipWords: '购物车空空如也',
    cartItems: [],
    purchaseButtonDisabled: false,
    access_token: null   
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
      cartItems: app.globalData.purchaseItems,
      purchaseButtonDisabled: (app.globalData.purchaseItems.length == 0)
    });
    console.log(that.data.cartItems);  

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb7d4a9bfe0803710&secret=d4f58b79a053947ef64b993d256e80fc',
      method: 'get',
      data: { },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("heheheehehehehe");
        console.log(res);
        that.setData({
          access_token: res.data.access_token
        });
      }
    })
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
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        console.log("res.data");    
        console.log(res.data);
        app.globalData.purchaseItems.splice(0, app.globalData.purchaseItems.length);
        that.setData({
          purchaseButtonDisabled: true
        });

        var purchaseLines="";

        for (var i = 0; i < res.data.data.PurchaseItems.length; i++) {

          var line = res.data.data.PurchaseItems[i].productName + "     " + res.data.data.PurchaseItems[i].productNumber + "     " +
          res.data.data.PurchaseItems[i].productUnit + "\r\n";
          purchaseLines = purchaseLines + line;
        }  
        console.log(purchaseLines);
        console.log("that.data.access_token");
        console.log(that.data.access_token);
        console.log("e.detail.formId");
        console.log(e.detail.formId);
        let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.access_token;
        let _jsonData = {
          access_token: that.data.access_token,
          touser: app.globalData.userInfo.openid,
          template_id: 'gQiFCEFO-hR1Avof0joZQL7wdlxAJOFCmqToMJSZSWM',
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
      }
    })

    
  }
})
