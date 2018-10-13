// pages/detail/evaluation/evaluation.js
const app=getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiHost:"",
    evaluation: [],
    level:3,
    stars:[0,1,2,3,4]
  },
  toEvaluate(e){
    utils.showLoading("正在加载..")
    let order_sn = e.currentTarget.dataset.ordersn
    let goods_id = e.currentTarget.dataset.goodsid
 
    wx.navigateTo({
      url: `/pages/mine/toEvaluate/toEvaluate?order_sn=${order_sn}&goods_id=${goods_id}`,
    })
    wx.hideLoading()
  },
  toDetailEvaluate(e){
    utils.showLoading("正在加载..")
     let ids= e.currentTarget.dataset.index
    let goods_id=this.data.evaluation[ids].goods_id

    wx.navigateTo({
      url: `/pages/detail/evaluation/evaluation?goods_id=${goods_id}`
    })
    wx.hideLoading()
  },
  getMyEvaluate(wx_openid) {
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.comment/listOrderByWXOpenId.json`,
      data: {
        wx_openid: wx_openid
      },
      success: (res) => {
        if (res.data.success) {
          console.log(res)
          that.setData({
            evaluation: res.data.data
          })

        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }

      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 14)
      }

    })

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
     this.setData({
       apiHost:app.apiHost
     })
    let wx_openid = wx.getStorageSync('userInfo').wx_openid
    this.getMyEvaluate(wx_openid)
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})