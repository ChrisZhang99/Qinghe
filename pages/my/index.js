var app = getApp()
Page( {
  data: {
    userInfo: {},
    leftMenus: [ {
      id:1,
      icon: '../../images/iconfont-dingdan.png',
      text: '我的订单',
      isunread: true,
      unreadNum: 2
    }],
    navRightItems: [],
    curMenuID: 1,
    curMenuIndex: 0
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })
  },

  onShow: function () {
    var that = this
    
    var url = app.globalData.hostUrl
    wx.request({
      url: url + 'PurchaseOrders/GetByOwner',
      method: 'POST',
      data: { creator: this.data.userInfo.baseInfo.nickName },
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          navRightItems: res.data.data
        });
      }
    })
  },

  switchRightTab: function (e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index);

    this.setData({
      curMenuID: id,
      curMenuIndex: index
    })

    var that = this
    if (this.data.curMenuID == 1)
    {
      var url = app.globalData.hostUrl
      wx.request({
        url: url + 'PurchaseOrders/GetByOwner',
        method: 'POST',
        data: { creator: this.data.userInfo.baseInfo.nickName },
        //data: { "purchaseItems": JSON.stringify(app.globalData.purchaseItems) },
        //data: {purchaseItems:purchaseItemList,creator:this.data.userInfo.baseInfo.nickName},
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {        
          that.setData({
            navRightItems: res.data.data
          });

        }
      })
    }
    
  }
})