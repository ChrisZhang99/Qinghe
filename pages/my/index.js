var app = getApp()
Page( {
  data: {
    ordersInText: "",
    showModal: false,
    storeIndex: 0,
    stores: [],
    vendorIndex: 0,
    vendors: [],
    vendorIDs: [],
    summaryOrderItems: [],
    summaryStoreOrderItems: [],
    summaryVendorOrderItems: [],
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
        text: '门店订单'
      },
      {
        id: 3,
        icon: '../../images/iconfont-tuihuo.png',
        text: '供货商订单'
      }],
    navRightItems: [],
    curMenuID: 1,
    curMenuIndex: 0,
    startDate: '2016-11-08',
    startTime: '12:00',
    stopDate: '2016-11-08',
    stopTime: '12:00'
  },

  bindStorePickerChange: function (e) {
    this.setData({
      storeIndex: e.detail.value
    })
    this.getSummaryOrdersByStore();
  },

  bindVendorPickerChange: function (e) {
    this.setData({
      vendorIndex: e.detail.value
    })
    this.getSummaryOrdersByVendor();
  },

  getSummaryOrdersByStore: function () {
    var that = this

    var url = app.globalData.hostUrl
    var startTime = this.data.startDate + " " + this.data.startTime;
    var stopTime = this.data.stopDate + " " + this.data.stopTime;
    var storeName = that.data.stores[that.data.storeIndex];
    wx.request({
      url: url + 'PurchaseOrders/GetSummaryByStoreAndDate',
      method: 'POST',
      data: { storeName: storeName, startTime: startTime, stopTime: stopTime },
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          summaryStoreOrderItems: res.data.data
        });
        console.log(that.data.summaryStoreOrderItems)
      }
      , fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

  getSummaryOrdersByVendor: function () {
    var that = this

    var url = app.globalData.hostUrl
    var startTime = this.data.startDate + " " + this.data.startTime;
    var stopTime = this.data.stopDate + " " + this.data.stopTime;
    var vendorID = that.data.vendorIDs[that.data.vendorIndex];
    wx.request({
      url: url + 'PurchaseOrders/GetSummaryByVendorAndDate',
      method: 'POST',
      data: { vendorID: vendorID, startTime: startTime, stopTime: stopTime },
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          summaryVendorOrderItems: res.data.data
        });
        console.log("that.data.summaryVendorOrderItems")
        console.log(that.data.summaryVendorOrderItems)
      }
      , fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

  generateTextByStore: function (e) {
    console.log("eeeeeee");
    console.log(e);
    let index = e.currentTarget.dataset.id;
    var ordersText = "开始时间：" + this.data.startDate + " " + this.data.startTime + "\r\n" + "停止时间：" + this.data.stopDate + " " + this.data.stopTime + "\r\n"
      + "门店：" + this.data.summaryStoreOrderItems[index].StoreName + "\r\n";
    for (var i = 0; i < this.data.summaryStoreOrderItems[index].CategoryOrders.length; i++) {
      ordersText += "种类：" + this.data.summaryStoreOrderItems[index].CategoryOrders[i].CategoryName + "\r\n";
      for (var j = 0; j < this.data.summaryStoreOrderItems[index].CategoryOrders[i].OrderDetails.length; j++) {
        ordersText += this.data.summaryStoreOrderItems[index].CategoryOrders[i].OrderDetails[j].ProductName + "\t" + 
          this.data.summaryStoreOrderItems[index].CategoryOrders[i].OrderDetails[j].ProductCount + "\t" + 
          this.data.summaryStoreOrderItems[index].CategoryOrders[i].OrderDetails[j].ProductUnit + "\t" +
          "单价：" + this.data.summaryStoreOrderItems[index].CategoryOrders[i].OrderDetails[j].ProductPrice + "\t" +
          "合计：" + this.data.summaryStoreOrderItems[index].CategoryOrders[i].OrderDetails[j].ProductAmount + "\r\n";
      }     
      ordersText += this.data.summaryStoreOrderItems[index].CategoryOrders[i].CategoryName + "合计：" + 
      this.data.summaryStoreOrderItems[index].CategoryOrders[i].CategoryAmount + "\r\n";
    }
    ordersText += "当前门店总计计：" + this.data.summaryStoreOrderItems[index].StoreAmount + "\r\n";

    this.setData({
      showModal: true,
      ordersInText: ordersText
    })
  },

  generateTextByVendor: function (e) {
    console.log("vvvvvvvv");
    console.log(e);
    
    let index = e.currentTarget.dataset.id;
    console.log(this.data.summaryVendorOrderItems[index]);
    var ordersText = "开始时间：" + this.data.startDate + " " + this.data.startTime + "\r\n" + "停止时间：" + this.data.stopDate + " " + this.data.stopTime + "\r\n"
      + "供货商：" + this.data.summaryVendorOrderItems[index].VendorName + "\r\n";
    for (var i = 0; i < this.data.summaryVendorOrderItems[index].CategoryOrders.length; i++) {
      ordersText += "种类：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].CategoryName + "\r\n";
      for (var j = 0; j < this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders.length; j++) {
        ordersText += "门店：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].StoreName + "\r\n";
        for (var m = 0; m < this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails.length; m++) {
          console.log(this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m]);
          ordersText += this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductName + "\t" + 
            this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductCount + "\t" +
            this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductUnit + "\t" +
            //"单价：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductPrice + "\t" +
            //"合计：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductAmount + 
            "\r\n";
        }
        
      }
    }

    this.setData({
      showModal: true,
      ordersInText: ordersText
    })
  },

  generateAllStoreOrderText: function (e) {
    var allAmount=0;
    var ordersText = "开始时间：" + this.data.startDate + " " + this.data.startTime + "\r\n" + "停止时间：" + this.data.stopDate + " " + this.data.stopTime + "\r\n";
    for (var m = 0; m < this.data.summaryStoreOrderItems.length; m++) {
      ordersText += "门店：" + this.data.summaryStoreOrderItems[m].StoreName + "\r\n";
      for (var i = 0; i < this.data.summaryStoreOrderItems[m].CategoryOrders.length; i++) {
        ordersText += "种类：" + this.data.summaryStoreOrderItems[m].CategoryOrders[i].CategoryName + "\r\n";
        for (var j = 0; j < this.data.summaryStoreOrderItems[m].CategoryOrders[i].OrderDetails.length; j++) {
          ordersText += this.data.summaryStoreOrderItems[m].CategoryOrders[i].OrderDetails[j].ProductName + "\t" + 
            this.data.summaryStoreOrderItems[m].CategoryOrders[i].OrderDetails[j].ProductCount + "\t" +
            this.data.summaryStoreOrderItems[m].CategoryOrders[i].OrderDetails[j].ProductUnit + "\t" +
            "单价：" + this.data.summaryStoreOrderItems[m].CategoryOrders[i].OrderDetails[j].ProductPrice + "\t" +
            "合计：" + this.data.summaryStoreOrderItems[m].CategoryOrders[i].OrderDetails[j].ProductAmount + "\r\n";
        }
        ordersText += this.data.summaryStoreOrderItems[index].CategoryOrders[i].CategoryName + "合计：" +
          this.data.summaryStoreOrderItems[index].CategoryOrders[i].CategoryAmount + "\r\n";
      }
      
      ordersText += "当前门店总计：" + this.data.summaryStoreOrderItems[m].StoreAmount + "\r\n";
      allAmount += this.data.summaryStoreOrderItems[m].StoreAmount;
    }
    ordersText += "所有门店总计：" + allAmount + "\r\n";

    this.setData({
      showModal: true,
      ordersInText: ordersText
    })
  },

  generateAllVendorOrderText: function (e) {
    var ordersText = "开始时间：" + this.data.startDate + " " + this.data.startTime + "\r\n" + "停止时间：" + this.data.stopDate + " " + this.data.stopTime + "\r\n";
    for (var m = 0; m < this.data.summaryVendorOrderItems.length; m++) {
      ordersText += "供货商：" + this.data.summaryVendorOrderItems[m].VendorName + "\r\n";
      for (var i = 0; i < this.data.summaryVendorOrderItems[m].CategoryOrders.length; i++) {
        ordersText += "种类：" + this.data.summaryStoreOrderItems[m].CategoryOrders[i].CategoryName + "\r\n";
        for (var j = 0; j < this.data.summaryStoreOrderItems[m].CategoryOrders[i].StoreOrders.length; j++) {
          ordersText += "门店：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].StoreName + "\r\n";
          for (var n = 0; n < this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails.length; n++) {
            ordersText += this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[n].ProductName + "\t" +
              this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[n].ProductCount + "\t" +
              this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[n].ProductUnit + "\t" +
              //"单价：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductPrice + "\t" +
              //"合计：" + this.data.summaryVendorOrderItems[index].CategoryOrders[i].StoreOrders[j].OrderDetails[m].ProductAmount + 
              "\r\n";
          }
        }
      }
    }

    this.setData({
      showModal: true,
      ordersInText: ordersText
    })
  },

  copyText: function (e) {
    let that = this
    wx.setClipboardData({
      data: that.data.ordersInText,
      success() {
        console.log('copy success')
      }
    })
    wx.getClipboardData({
      success(res) {
        console.log(res.data)
      }
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '订单',
      path: '/page/my/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
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

    wx.request({
      url: 'https://www.snowcrane123.com/stores/all',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var arrStores=new Array();
        arrStores[0]="所有"
        for (var i = 0; i < res.data.data.length; i++) {
          arrStores.push(res.data.data[i].Name);          
        }
        console.log(arrStores)
        that.setData({
          stores: arrStores
        })
      }
    });

    wx.request({
      url: 'https://www.snowcrane123.com/categories/AllCategoryVendors',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var arrVendors = new Array();
        var arrVendorIDs = new Array();
        arrVendors[0] = "所有"
        arrVendorIDs[0]=-1
        for (var i = 0; i < res.data.data.length; i++) {
          arrVendors.push(res.data.data[i].VendorName);
          arrVendorIDs.push(res.data.data[i].VendorID);
        }
        console.log(arrVendors)
        that.setData({
          vendors: arrVendors,
          vendorIDs: arrVendorIDs
        })
      }
    });
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

    var myDate = new Date();
    this.setData({
      startDate: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate()-1),
      startTime: '16:00',
      stopDate: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate(),
      stopTime: myDate.getHours() + ':' + myDate.getMinutes()
    })
    if (this.data.curMenuID==2){
      this.getSummaryOrdersByStore();
    }
    if (this.data.curMenuID == 3) {
      this.getSummaryOrdersByVendor();
    }
   
    //this.getSummaryOrders();
  }, 

  getSummaryOrders: function() {
    var that = this

    var url = app.globalData.hostUrl
    var startTime = this.data.startDate + " " + this.data.startTime;
    var stopTime = this.data.stopDate + " " + this.data.stopTime;

    wx.request({
      url: url + 'PurchaseOrders/GetSummaryByTime',
      method: 'POST',
      data: { startTime: startTime, stopTime: stopTime },
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          summaryOrderItems: res.data.data
        });
        console.log(res)
      }
      , fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
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
    else if (this.data.curMenuID == 2) {
      this.getSummaryOrdersByStore();
    }
    else if (this.data.curMenuID == 3) {
      this.getSummaryOrdersByVendor();
    }
  },

  //  点击时间组件确定事件  
  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
    //this.getSummaryOrders();
    if (this.data.curMenuID == 2) {
      this.getSummaryOrdersByStore();
    }
    if (this.data.curMenuID == 3) {
      this.getSummaryOrdersByVendor();
    }
  },
  //  点击日期组件确定事件  
  bindStartDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
    //this.getSummaryOrders();
    if (this.data.curMenuID == 2) {
      this.getSummaryOrdersByStore();
    }
    if (this.data.curMenuID == 3) {
      this.getSummaryOrdersByVendor();
    }
  },
  //  点击时间组件确定事件  
  bindStopTimeChange: function (e) {
    this.setData({
      stopTime: e.detail.value
    })
    //this.getSummaryOrders();
    if (this.data.curMenuID == 2) {
      this.getSummaryOrdersByStore();
    }
    if (this.data.curMenuID == 3) {
      this.getSummaryOrdersByVendor();
    }
  },
  //  点击日期组件确定事件  
  bindStopDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      stopDate: e.detail.value
    })
    //this.getSummaryOrders();
    if (this.data.curMenuID == 2) {
      this.getSummaryOrdersByStore();
    }
    if (this.data.curMenuID == 3) {
      this.getSummaryOrdersByVendor();
    }
  },

  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})