//app.js
App({  
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //login
    //this.getUserInfo();
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
              
              that.getUserRoleInfo(that.globalData.userInfo.baseInfo.nickName)

              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  getUserRoleInfo: function (nickName) {
    var that = this;
    var url = that.globalData.hostUrl
    url += "Users/GetOne"
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
        
        //obj = JSON.parse(obj)
        console.log("-------------------------------------")
        console.log(res.data.data)
        if (res.data.data==null){
          wx.showModal({
            title: '提示',
            content: '请联系管理员注册登录账号',
            showCancel: false           
          })
          //wx.navigateBack() 
        }
        else{
          that.globalData.userInfo.role = res.data.data.Role.Name;
          that.globalData.userInfo.store = res.data.data.Store.Name
        }
      },
      fail: function(err){
        wx.showModal({
          title: '提示',
          content: '无法获取您的账号信息请联系管理员',
          showCancel: false
        })
        //wx.navigateBack() 
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
    userInfo:{baseInfo:null, openid:null, session_key:null, role:null, store:null},
    purchaseItems:[]
  }
})