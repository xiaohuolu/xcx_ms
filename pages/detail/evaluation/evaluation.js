// pages/detail/evaluation/evaluation.js
const app = getApp().globalData
const utils=app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    rows:5,
    hasMoreData: true,
    goods_id:"",
    evaluation:[]
  },
  // 获取评论
  getEvaluation(message) {
    utils.showLoading(message)
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.comment/listPage.json`,
      data: {
        goods_id: this.data.goods_id,
        page: that.data.page,
        rows: that.data.rows,
      },
      success: (res) => {
        let evaluationTem = that.data.evaluation
        if (res.data.success) {
          if(that.data.page==1){
            evaluationTem=[]
          }
          let evaluation = res.data.data.data
          if (evaluation.length<that.data.rows){
            that.setData({
              evaluation: evaluationTem.concat(evaluation),
              hasMoreData:false
            })
          }else{
            that.setData({
              evaluation: evaluationTem.concat(evaluation),
              hasMoreData: true,
              page:that.data.page+1
            })
          }
          // that.setData({
          //   evaluation: res.data.data.data
          // })
    
        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 16)
      }
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
  onLoad: function (options) {
    console.log(options)
    this.setData({
      goods_id: options.goods_id,
      // average: options.average
    })
    this.getEvaluation("正在加载数据..")
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
    this.data.page = 1
    this.getEvaluation("正在刷新数据..")
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getEvaluation("加载更多数据..")
    } else {
      utils.showToast("没有更多数据")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})