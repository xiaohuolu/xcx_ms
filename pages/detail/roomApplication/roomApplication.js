// pages/detail/roomApplication/roomApplication.js
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
    rooms: [],
    apiHost: "",
    date: '',
    tomorrow: '',
    // maskFlag: true,
    count: 1,
    haveRoom: 0,
    totalPrice: ""
  },
  bindViewTap: function() {
    utils.showLoading("正在加载..")
    var that = this;
    wx.navigateTo({
      url: '/pages/date/date'
    })
    wx.hideLoading()
  },
  // 下单
  sendOrder(e) {
    let that = this
    let user = wx.getStorageSync('userInfo')
    let rooms = this.data.rooms

    if (this.data.haveRoom == 0) {
      utils.showToast("所选时段暂时无房，请重新选择时段")
      return false
    }
    if (!utils.trim(e.detail.value.consignee)) {
      utils.showToast("入住人不能为空")
      return false
    } else {
      if (e.detail.value.consignee.length >30) {
        utils.showToast("入住人姓名不得超过30位")
        return false
      }
    }
    if (!utils.trim(e.detail.value.mobile)) {
      utils.showToast("手机号不能为空")
      return false
    } else {
      if (e.detail.value.mobile.length < 11) {
        utils.showToast("手机号最低11位")
        return false
      }
    }
    if (!utils.trim(e.detail.value.idcard)) {
      utils.showToast("身份证不能为空")
      return false
    } else {
      if (e.detail.value.idcard.length < 18) {
        utils.showToast("身份证号最低18位")
        return false
      }
    }
    utils.showLoading("正在提交订单..")
    console.log(user)
 
    wx.request({
      url: `${app.apiHost}/api/goods.order/add.json`,
      data: {
        goods_id: rooms.goods_id,
        goods_num: 1,
        goods_price: rooms.shop_price,
        start_time: that.data.checkInDate,
        over_time: that.data.checkOutDate,
        user_id: user.id,
        wx_openid: user.wx_openid,
        consignee: e.detail.value.consignee,
        mobile: e.detail.value.mobile,
        idcard: e.detail.value.idcard,
        user_note: e.detail.value.user_note
      },
      success: (order) => {

        if (order.data.success) {
          // 调微信支付，根据接口返回的订单号，流水号直接调取支付
          // 支付用户取消，或支付成功，都调到订单详情界面

          utils.showLoading("正在加载..")
          wx.request({
            url: `${this.data.apiHost}/api/wx/pay.json`,
            data: {
              order_sn: order.data.data.order_sn,
              user_id: order.data.data.user_id
            },
            success: (pay) => {
              if (pay.data.success) {

                wx.requestPayment({
                  timeStamp: pay.data.data.timeStamp.toString(),
                  nonceStr: pay.data.data.nonceStr,
                  package: pay.data.data.package,
                  signType: pay.data.data.signType,
                  paySign: pay.data.data.paySign,
                  success: (payed) => {
                  },
                  complete: (payed) => {
                    // wx.navigateTo({
                    //   url: `/pages/orderDetails/orderDetails?order_sn=${order.data.data.order_sn}`
                    // }) 
                  wx.redirectTo({
                    url: `/pages/orderDetails/orderDetails?order_sn=${order.data.data.order_sn}`
                  })
             
                  }
                })

              } else {
                utils.showModal('提示', `${pay.data.msg}`)
              }
            },
            complete: (pay) => {
              wx.hideLoading()
              utils.requestError(pay, 10)
            }
          })


        } else {
          utils.showModal('提示', `${order.data.msg}`)
        }

      },
      complete: (order) => {
        wx.hideLoading()
        utils.requestError(order, 9)
      }

    })

  },

  closeFlag() {
    let that = this;
    that.setData({
      maskFlag: true
    })
  },

  reduce() {
    if (this.data.count <= 1) {
      return false
    }
    this.setData({
      count: --this.data.count
    })
  },
  add() {
    this.setData({
      count: ++this.data.count
    })
  },
  // 查询房间有没有
  isHaveRoom(goods_id, start_time, over_time) {
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.order/calculate.json`,
      data: {
        goods_id: goods_id,
        goods_num: 1,
        start_time: start_time,
        over_time: over_time
      },
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          that.setData({
            haveRoom: 1,
            totalPrice: res.data.data.order_amount
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
        utils.requestError(res, 9)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      apiHost: app.apiHost,
      rooms: JSON.parse(options.room)
    })

    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: app.Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: app.Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });
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
    utils.showLoading("正在加载..")
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    if (getDate){
      let day = utils.calculateTime(getDate.checkInDate, getDate.checkOutDate)
      this.setData({
        checkInDate: getDate.checkInDate,
        checkOutDate: getDate.checkOutDate,
        day: day,
      })
    }
    // this.setData({
    //   totalPrice: this.data.rooms.shop_price * day
    // })

    this.isHaveRoom(this.data.rooms.goods_id, this.data.checkInDate, this.data.checkOutDate)
    wx.hideLoading()
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