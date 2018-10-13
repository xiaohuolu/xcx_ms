// pages/detail/evaluation/evaluation.js
const app=getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluation: [
      {
        "img": "../../assets/select/index_img_m2.png",
        "name": "客服小一",
        "time": "暂时没有与客服的沟通记录"
      },
      {
        "img": "../../assets/select/index_img_m10.png",
        "name": "客服小二",
        "time": "暂时没有与客服的沟通记录"
      
      },
      {
        "img": "../../assets/select/index_img_m3.png",
        "name": "客服小三",
        "time": "暂时没有与客服的沟通记录"
       
      },
      {
        "img": "../../assets/select/iphone.jpg",
        "name": "客服小四",
        "time": "暂时没有与客服的沟通记录"
      }
    ]
  },
  toMessageDetail(e){
    utils.showLoading("正在加载..")
     let name=e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/message/messageDetail/messageDetail?name=${name}`,
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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