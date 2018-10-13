const app = getApp().globalData
const utils=app.utils
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    duration: 1000,
    current:1,
    imgTotal:0,
    apiHost: null,
    room:null,
    services:[],
    maskFlag: true,
    evaluation:null,
    unsubscribePolicy: ""
  },
  showCur(e){
   this.setData({
     current: e.detail.current+1
   })
  },
  toDescription(){
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/template/articles/articles?content=${this.data.room.goods_content}&title=房源描述`,
    })
    wx.hideLoading()
  },
  toEvaluation(){
    utils.showLoading("正在加载..")
   wx.navigateTo({
     url: `/pages/detail/evaluation/evaluation?goods_id=${this.data.room.goods_id}&average=${this.data.average}`,
   })
   wx.hideLoading()
  },
  toPremium(){
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/template/articles/articles?content=${this.data.common.premium}&title=额外费用`,
    })
    wx.hideLoading()
  },
  toOnlineDeposit(){
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/template/articles/articles?content=${this.data.common.onlineDeposit}&title=线上押金`,
    })
    wx.hideLoading()
  },
  toFacilities(){
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/pages/detail/facilities/facilities?ids=${this.data.room.services}`,
    })
    wx.hideLoading()
  },
  // 自定义弹框
  toRoomApplication(){
    let that=this
    utils.showLoading("正在加载..")
    // 判断没有登录的情况下
      let user=wx.getStorageSync("userInfo")
    if (user && user.wx_openid){ 
      let room = JSON.stringify(this.data.room)
      wx.navigateTo({
        url: `/pages/detail/roomApplication/roomApplication?room=${room}`,
      })
    }else{
      that.setData({
        maskFlag: false
      })
    }
    wx.hideLoading()
  },
// 获取授权按钮信息
  bindGetUserInfo(e){
   console.log(e)
    let that = this;
    if (e.detail.userInfo) {
      utils.loginServer(app, e.detail.userInfo)
      let room = JSON.stringify(this.data.room)
      wx.navigateTo({
        url: `/pages/detail/roomApplication/roomApplication?room=${room}`,
      })
    }else{
     utils.showModal('用户未授权', "如需正常使用小程序功能，请按确定并且点击授权按钮，允许小程序获取信息")
    }
    wx.hideLoading()
  },
  // 关闭弹框
  closeFlag() {
    this.setData({
      maskFlag: true
    })
  },
  toRoomImage(e){
   utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/pages/detail/roomImage/roomImage?goods_id=${this.data.room.goods_id}`,
    })
    wx.hideLoading()
  },
  // 获取配套设施
  getServices(){
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.services/listByIds.json`,
      data: { ids: this.data.room.services },
      success: (res) => {
        if (res.data.success) {
          that.setData({
            servicesLength: res.data.data.length
          })
          if (res.data.data.length < 7) {
            that.setData({
              services: res.data.data
            })
          } else {
            let services = that.data.services
            res.data.data.forEach((item, index) => {
              if (index < 7) {
                that.data.services = services.push(item)
              }
              that.setData({
                services: services
              })
            })
          }
        } else {
         utils.showModal('提示', `${res.data.msg}`)
        }
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 6)
      }
    })
  },
  // 获取房间图片
  getRoomImage(){
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.image/listALL.json`,
      data: { goods_id: this.data.room.goods_id},
      success:(res)=>{
        if (res.data.success) {
          that.setData({
            imgUrls: res.data.data,
            imgTotal: res.data.data.length
          })
        }else{
         utils.showModal('提示', `${res.data.msg}`)
        }
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 5)
      }
    })
  },
  // 获取评论
  getEvaluation() {
    utils.showLoading("正在加载..")
    let that = this
    wx.request({
      url: `${app.apiHost}/api/goods.comment/listPage.json`,
      data: { 
        goods_id: this.data.room.goods_id,
        page:1,
        rows:9999
       },
      success: (res) => {
        if (res.data.success) {
          let arr=[]
         res.data.data.data.forEach((item,index)=>{
           arr.push(item.level)
         })
          let average = Math.round(arr.reduce((acc, val) => acc + val, 0) / arr.length) 
          
          that.setData({
            average: average
          })
           
          if (res.data.data.data.length!==0){
            that.setData({
              evaluation: res.data.data.data[0],
              evaluation_total:res.data.data.total
            })
          }
   
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
 
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
 

    let room=JSON.parse(options.room)
    let that=this
    this.setData({
      apiHost: app.apiHost,
      room: room,
      common:app.common
    })
 
    console.log(this.data.room)
    

     this.getServices()
    this.getRoomImage()
    this.getEvaluation()
   
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