var app = getApp()
Page({
    data: {
        userInfo: {},
        navLeftItems: [],
        navRightItems: [],
        curCategoryID: 1,
		    curCategoryIndex: 0,
        curCategoryName: null,
        curProductID: 1,
        curProductIndex: 0,
        curProductName: null,
        productNumber: 0
    },

    getProductsForCurrentCategory: function () {
      var that = this
      wx.request({
        url: 'https://www.snowcrane123.com/products/getbycategoryid/' + this.data.curCategoryID,
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            navRightItems: res.data.data
          });
        }
      })
    },

    setProductItems: function(res){
      var that = this
      var productNumber = null;
      var productItems = new Array();
      for (var i = 0; i < res.data.data.length; i++) {
        for (var j = 0; j < app.globalData.purchaseItems.length; j++) {
          if (app.globalData.purchaseItems[j].categoryID == res.data.data[i].CategoryID
            && app.globalData.purchaseItems[j].productID == res.data.data[i].ID) {
            productNumber = app.globalData.purchaseItems[j].productNumber;
            break;
          }
          else {
            productNumber = null;
          }
        }
        var purchaseItem = {
          ID: res.data.data[i].ID, Name: res.data.data[i].Name,
          Price: res.data.data[i].Price, Unit: res.data.data[i].Unit,
          CategoryID: res.data.data[i].CategoryID, Category: res.data.data[i].Category,
          ProductNumber: productNumber
        };
        productItems.push(purchaseItem);
      }
      that.setData({
        navRightItems: productItems
      });
    },

    onLoad: function() {

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
      wx.request({
        url: 'https://www.snowcrane123.com/categories/all',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            curCategoryID: res.data.data[0].ID,
            curCategoryName: res.data.data[0].Name,
            navLeftItems: res.data.data
          })

          wx.request({
            url: 'https://www.snowcrane123.com/products/getbycategoryid/' + res.data.data[0].ID,
            method: 'GET',
            data: {},
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setProductItems(res);              
            }
          })
        }
      });

    },

    //事件处理函数
    numberIput: function (e) {
      this.setData({
        productNumber: e.detail.value
      });
      
      var isExistingItem = false;
      for (var i = 0; i < app.globalData.purchaseItems.length; i++)
      {
        if (app.globalData.purchaseItems[i].categoryID == this.data.curCategoryID
        && app.globalData.purchaseItems[i].productID == this.data.curProductID)
        {
          app.globalData.purchaseItems[i].productNumber = e.detail.value;
          if (app.globalData.purchaseItems[i].productNumber==null
            || app.globalData.purchaseItems[i].productNumber==""
            || app.globalData.purchaseItems[i].productNumber==0)
            {
              app.globalData.purchaseItems.splice(i, 1);
            }
          isExistingItem = true;
          break;
        }
      }

      if (!isExistingItem && e.detail.value > 0)
      {
        var purchaseItem = { categoryID: this.data.curCategoryID, productID: this.data.curProductID,
                            categoryName: this.data.curCategoryName, productName: this.data.curProductName,
                            productNumber: e.detail.value, productUnit: this.data.navRightItems[this.data.curProductIndex].Unit};
        app.globalData.purchaseItems.push(purchaseItem);
      }

    },

    switchRightTab: function(e) {
        let id = e.target.dataset.id,
          name = e.target.dataset.name,
			  index = parseInt(e.target.dataset.index);

        this.setData({
          curCategoryID: id,
          curCategoryName: name,
          curCategoryIndex: index
        })

        var that = this
        wx.request({
          //url: 'http://huanqiuxiaozhen.com/wemall/goodstype/typebrandList',
          url: 'https://www.snowcrane123.com/products/getbycategoryid/' + id,
          method: 'GET',
          data: {},
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            that.setProductItems(res);            
          }
        })		    
    },

  switchRightItem: function (e) {
    let id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
    index = parseInt(e.currentTarget.dataset.index);
    console.log(e);
    console.log(index);
    this.setData({
      curProductID: id,
      curProductName: name,
      curProductIndex: index
    })
  }

})