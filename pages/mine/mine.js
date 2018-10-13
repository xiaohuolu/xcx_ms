const app = getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization: true,
    active:2
  },
  toMyOrders() {
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: '/pages/mine/myOrders/myOrders',
    })
    wx.hideLoading()
  },
  toMyEvaluate(){
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: '/pages/mine/myEvaluate/myEvaluate',
    })
    wx.hideLoading()
  },
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    let that = this;
    if (e.detail.userInfo) {
      that.setData({
        authorization: false
      })
      utils.loginServer(app,e.detail.userInfo)
    } else {
      utils.showModal('用户未授权', "如需正常使用小程序功能，请按确定并且点击授权按钮，允许小程序获取信息")
    }

  },
  tabNav(e) {
  
    if (e.currentTarget.dataset.num == this.data.active) {
      return
    }
    utils.showLoading("正在加载..")
    // console.log(e.currentTarget.dataset.num)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let taht=this
    // console.log(app.userInfo)
    // let userInfo = app.userInfo
    // if (userInfo){
    //   this.setData({
    //     authorization: false
    //   })

    // }
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          taht.setData({
            authorization: false
          })
          wx.getUserInfo({
            success: function(res) {
              // console.log(res.userInfo)
              utils.loginServer(app,res.userInfo)
            }
          })
        }
      },
      complete:(res)=>{
        console.log(res)
      }
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