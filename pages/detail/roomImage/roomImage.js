// pages/detail/roomImage/roomImage.js
const app = getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 标签index
    current: 0,
    // 全部标签
    labels: [],
    // 点击标签
    label:"卧室",
    goods_id: "",
    apiHost: "",
    // 预览图片数组
    previewImageArr: [],
    // 所有图片
    imgUrls: []
   
  },
  // 某标签图片
  // chooseItem(e) {
  //   wx.showLoading({
  //     title: '正在加载..',
  //     mask:true
  //   })
  //   // console.log(e)
  //   let that = this
  //   that.setData({
  //     current: e.currentTarget.dataset.num,
  //     label: e.currentTarget.dataset.name
  //   })

  //   wx.request({
  //     url: `${this.data.apiHost}/api/goods.image/listByLabel.json` ,
  //     data: { goods_id: this.data.goods_id, label: e.currentTarget.dataset.id},
  //     success:(res)=>{
  //       wx.hideLoading()
  //       that.setData({
  //         imgUrls: res.data.data
  //       })
  //     }
  //   })
  // },
  // 预览图片
  previewImage(e) {
    utils.showLoading("正在加载..")
    let src = e.currentTarget.dataset.src
    let previewImageArr = []
    this.data.imgUrls.forEach((item, index) => {
      previewImageArr.push(this.data.apiHost + item.image_url)
    })
    this.setData({
      previewImageArr: previewImageArr
    })
    wx.previewImage({
      current: src,
      urls: this.data.previewImageArr
    })
    wx.hideLoading()
  },
  // 全部图片
  getImagesAll() {
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${this.data.apiHost}/api/goods.image/listALL.json`,
      data: {
        goods_id: this.data.goods_id
      },
      success: (res) => {
        if (res.data.success) {
          that.setData({
            imgUrls: res.data.data
          })
        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }
     
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 5)
      }
    })
  },
 

  //  获取标签
  getLabel() {
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${this.data.apiHost}/api/goods.image/listLabel.json`,
      success: (res) => {
        if (res.data.success) {
          that.setData({
            labels: res.data.data
          })
        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 3)
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goods_id: options.goods_id,
      apiHost: app.apiHost
    })

    this.getImagesAll()
    this.getLabel()
  },

  /**
   *  生命周期函数--监听页面初次渲染完成
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