//app.js
App({  
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //login
    this.getUserInfo();
  },
  getUserInfo:function(cb){
    console.log("start to get user info")
    console.log(this.globalData.userInfo)
    var that = this
    if(this.globalData.userInfo.baseInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      console.log("get open id")
      wx.login({
        success: function (res) {
          //var appInstance = getApp()
          /*
          var url = that.globalData.hostUrl
          url += "WXUserInfo/GetOpenID"
          console.log("res_openid")
          wx.request({
            url: url,
            data: {
              loginCode: res.code
            },
            method: 'POST',
            dataType: "json",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res_openid) {
              var obj = res_openid.data.data
              that.globalData.userInfo.openid = res_openid.data.data.openid;
              that.globalData.userInfo.session_key = res_openid.data.data.session_key
              //obj = JSON.parse(obj)
              console.log(res_openid.data.data)
              
            },
            complete: function (res_openid) {
              console.log("结果：" + JSON.stringify(res_openid))
            }
          })  
          */
          wx.getUserInfo({

            success: function (res_user) {
              console.log("res_user.userInfo")
              that.globalData.userInfo.baseInfo = res_user.userInfo
              //typeof cb == "function" && cb(that.globalData.userInfo)
              //that.getUserRollInfo(that.globalData.userInfo.baseInfo.nickName)
            }
          })
        }
      })
    }
  },

  getUserRollInfo: function (nickName) {
    var that = this;
    var url = that.globalData.hostUrl
    url += "WXUserInfo/GetOpenID"
    wx.request({
      url: url,
      data: {
        nickName: nickName
      },
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var obj = res_openid.data.data
        that.globalData.userInfo.roll = res.data.data.Roll;
        that.globalData.userInfo.store = res.data.data.Store
        //obj = JSON.parse(obj)
        console.log(res.data.data)
        if (that.globalData.userInfo.roll==null){
          wx.showModal({
            title: '提示',
            content: '请联系管理员注册登录账号',
            showCancel: false           
          })
          wx.navigateBack({
            delta: 1
          }) 
        }
      },
      fail: function(err){
        wx.showModal({
          title: '提示',
          content: '无法获取您的账号信息',
          showCancel: false
        })
        wx.navigateBack({
          delta: 1
        }) 
      }
    })
  },

  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData:{
    hostUrl: 'https://www.snowcrane123.com/',
    userInfo:{baseInfo:null, openid:null, session_key:null, roll:null, store:null},
    purchaseItems:[]
  }
})