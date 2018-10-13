// pages/mine/toEvaluate/toEvaluate.js
const app = getApp().globalData
const utils = app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    stars: [0, 1, 2, 3, 4],
    choose_ids: 5,
    comment: ""
  },
  chooseStart(e) {
    let ids = e.currentTarget.dataset.ids
    let arr = this.data.stars.filter(item => {
      return item <= ids
    })
    this.setData({
      choose_ids: arr.length
    })

  },
  bindFormSubmit(e) {
    let that = this
    let userInfo = wx.getStorageSync("userInfo")
    let wx_openid = userInfo.wx_openid
    let comment = e.detail.value.textarea

    utils.showLoading("正在加载..")
    if (utils.trim(comment).length >= 3) {
    } else {
      utils.showToast("最少写3个字就可以发表啦")
      return
    }

    wx.request({
      url: `${app.apiHost}/api/goods.comment/add.json`,
      data: {
        order_sn: that.data.order_sn,
        goods_id: that.data.goods_id,
        user_id: userInfo.id,
        wx_openid: wx_openid,
        level: that.data.choose_ids,
        comment: comment,
        images: ""
      },
      success: (res) => {
        if (res.data.success) {
          console.log(res)
          utils.showToast(`${res.data.msg}`)
          setTimeout(()=>{
            // wx.redirectTo({
            //   url: `/pages/mine/myEvaluate/myEvaluate`
            // }) 
            wx.navigateBack({
              url: `/pages/mine/myEvaluate/myEvaluate`
            }) 
            var pages = getCurrentPages();
            var prePage = pages[pages.length - 2];
            prePage.onLoad();

          },2000)
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
  chooseImg() {
    let that = this
    wx.chooseImage({
      success: function(res) {
        res.tempFilePaths.forEach((item, index) => {
          that.data.images.push(item)
        })
        that.setData({
          images: that.data.images
        })
      },
    })
  },
  previewImage(e) {
    let current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.images
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let goods_id = options.goods_id
    let order_sn = options.order_sn
    this.setData({
      goods_id: goods_id,
      order_sn: order_sn
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