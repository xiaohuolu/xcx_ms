//app.js
const utils = require("/utils/util.js")
App({

  onLaunch: function() {
    wx.clearStorageSync('userInfo')
    utils.showLoading("正在加载..")
    let that = this
        // 展示房间列表
    // wx.request({
    //   url: `${this.globalData.apiHost}/api/goods/listAll.json`,
    //   success: (res) => {
    //     if (res.data.success) {
    //       that.globalData.rooms = res.data.data

    //       if (that.roomsCallback) {
    //         that.roomsCallback(res.data.data);
    //       }
    //     } else {
    //       utils.showModal('提示', `${res.data.msg}`)
    //     }
    //   },
    //   complete: (res) => {
    //     wx.hideLoading()
    //     utils.requestError(res, 9)
    //   }
    // })

    // 获取全局信息
    wx.request({
      url: `${this.globalData.apiHost}//api/shop.config/info.json`,
      success:(res)=>{
          if(res.data.success){
            that.globalData.common=res.data.data
            if (that.commonCallback) {
              that.commonCallback(res.data.data);
            }
            wx.setNavigationBarTitle({
              title: that.globalData.common.name
            })
          } else {
            utils.showModal('提示', `${res.data.msg}`)
          }
      
      },  
      complete: (res) => {
        utils.requestError(res, 18)
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
        wx.getUserInfo({
          success: function (res) {
            // console.log(res.userInfo)
            that.globalData.utils.loginServer(that.globalData, res.userInfo)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    apiHost: "https://hotel.chengjiexiang.cn",
    active: 0,
    code: "",
    utils: require("/utils/util.js"),
    Moment: require("/utils/moment.js"),

  }

})