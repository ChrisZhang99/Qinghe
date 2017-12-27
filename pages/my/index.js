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
    },
      {
        id: 2,
        icon: '../../images/purchase-orders.png',
        text: '订单查询'
      }],
    navRightItems: [],
    curMenuID: 1,
    curMenuIndex: 0,
    startDate: '2016-11-08',
    startTime: '12:00',
    stopDate: '2016-11-08',
    stopTime: '12:00'
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
    
  },

  //  点击时间组件确定事件  
  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindStartDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  //  点击时间组件确定事件  
  bindStopTimeChange: function (e) {
    this.setData({
      stopTime: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindStopDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      stopDate: e.detail.value
    })
  }
})