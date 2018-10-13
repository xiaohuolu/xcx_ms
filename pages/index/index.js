//index.js
//获取应用实例
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear()
var DATE_MONTH = new Date().getMonth() + 1
var DATE_DAY = new Date().getDate()
const app = getApp().globalData
const utils = app.utils
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkInDate: app.Moment(new Date()).format('YYYY-MM-DD'),
    checkOutDate: app.Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    day: 1,
    imgUrls: [],
    duration: 1000,
    autoplay: true,
    indicatorDots: true,
    interval: 5000,
    common:{},
    userInfo: {},
    //  房间列表
    rooms: [],
    apiHost: null,
    active: 0
  },
  bindViewTap: function() {
    utils.showLoading("正在加载..")
    var that = this;

    wx.navigateTo({
      url: '/pages/date/date'
    })
    wx.hideLoading()
  },
  toDetail(e) {
    
    utils.showLoading("正在加载..")
    // let index = e.currentTarget.dataset.index
    let room = JSON.stringify( e.currentTarget.dataset.room)

    wx.navigateTo({
      url: `/pages/detail/detail?room=${room}`
    })
    wx.hideLoading()
  },
  toMap() {
    wx.openLocation({
      latitude: parseFloat(this.data.common.latitude),
      longitude: parseFloat(this.data.common.longitude),
      scale: 10,
      name: this.data.common.address,
      address: this.data.common.addressSearch
    })

    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success() {
    //           // 用户已经同意小程序获取地理位置，后续调用 wx.getLocation 接口不会弹窗询问


    //         },
    //         fail() {
    // wx.openLocation({
    //   latitude: app.common.latitude,
    //   longitude: app.common.longitude,
    //   scale: 10,
    //   name: app.common.address,
    //   address: app.common.addressSearch
    // })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  tabNav(e) {
    // console.log(e.currentTarget.dataset.num)
    if (e.currentTarget.dataset.num == this.data.active) {
      return
    }
    utils.showLoading("正在加载..")
    this.setData({
      active: e.currentTarget.dataset.num
    })
    if (this.data.active == 0) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else if (this.data.active == 2) {
      wx.reLaunch({
        url: '/pages/mine/mine',
      })
    }
    wx.hideLoading()
  },
  // toContact(e) {
  //   utils.showLoading("正在加载..")
  // },
  // 轮播
  getAdvertisement() {
    let that = this
    wx.request({
      url: `${app.apiHost}/api/advertisement.json`,
      data: {
        type: "dc16686d2f2cb14532246349e6a837385a83a5dd"
      },
      success: (res) => {
        if (res.data.success) {
          that.setData({
            imgUrls: res.data.data
          })
        } else {
          that.setData({
            haveRoom: 0
          })
          utils.showModal('提示', `${res.data.msg}`)
        }
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 17)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     
    utils.showLoading("正在加载..")
    this.setData({
        apiHost: app.apiHost
      })
    // if (app.rooms) {
    //   this.setData({
    //     apiHost: app.apiHost,
    //     rooms: app.rooms
    //   })
    // } else {
    //   getApp().roomsCallback = res => {
    //     this.setData({
    //       apiHost: app.apiHost,
    //       rooms: res
    //     })
    //   }
    // }
    if (app.common) {
      this.setData({
        common: app.common
      })
    } else {
      getApp().commonCallback = res => {
        this.setData({
          common: res
        })
      }
    }
   
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: app.Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: app.Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });
 

    utils.getRoomList(this, this.data.checkInDate, this.data.checkOutDate)

    this.getAdvertisement()
    wx.hideLoading()
  },
  previewImage(e) {
    let imgArr = []
    this.data.imgUrls.forEach((item, index) => {
      let imgItem = item.link + item.image
      imgArr.push(imgItem)
    })

    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: imgArr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");

    if (getDate) {
      let day = utils.calculateTime(getDate.checkInDate, getDate.checkOutDate)
      this.setData({
        checkInDate: getDate.checkInDate,
        checkOutDate: getDate.checkOutDate,
        day: day
      })
      utils.getRoomList(this, this.data.checkInDate, this.data.checkOutDate)
    }
   
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})