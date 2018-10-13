// pages/mine/myOrders/myOrders.js
const app = getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    apiHost:""
  },
  toOrderDetails(e) {
    utils.showLoading("正在加载..")
  
    wx.navigateTo({
      url: `/pages/orderDetails/orderDetails?order_sn=${e.currentTarget.dataset.ordersn}`,
    })
    wx.hideLoading()
  },
  // 我的订单列表
  getMyorders(wx_openid) {
    utils.showLoading("正在加载..")
    let that=this
    wx.request({
      url: `${app.apiHost}/api/goods.order/listByWXOpenId.json`,
      data: {
        wx_openid: wx_openid
      },
      success: (res) => {
        if (res.data.success) {
           that.setData({
             orders:res.data.data
           })
      
        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }

      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 13)
      }

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      apiHost:app.apiHost
    })
    let wx_openid = wx.getStorageSync('userInfo').wx_openid
    this.getMyorders(wx_openid)
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