// pages/detail/facilities/facilities.js
const app=getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idsArr:[],
    apiHost:app.apiHost
  },

  getServices(ids){
   utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.services/listByIds.json`,
      data: { ids: ids},
      success: (res) => {
        if (res.data.success) {
          that.setData({
            idsArr: res.data.data
          })
        } else {
         utils.showModal("提示", `${res.data.msg}`)
        }
       
      }
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      let ids = options.ids
  
  
    this.getServices(ids)
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