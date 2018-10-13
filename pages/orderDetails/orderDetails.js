// pages/orderDetails/orderDetails.js
const app = getApp().globalData
const utils = app.utils
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rooms: [],
    apiHost: app.apiHost,
    order_status: "",
    payBtn: false,
    cancelBtn: false,
    pay_status: 0,
    order_status_text: "",
    cancel: 0,
    payment: 0
  },

  onlineDeposit() {
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/template/articles/articles?content=${app.common.onlineDeposit}&title=线上押金`,
    })
    wx.hideLoading()
  },
  unsubscribePolicy() {
    utils.showLoading("正在加载..")
    wx.navigateTo({
      url: `/template/articles/articles?content=${app.common.unsubscribePolicy}&title=退订政策`,
    })
    wx.hideLoading()
  },
  customService() {
    wx.makePhoneCall({
      phoneNumber: app.common.phonecall
    })
  },

  // 获取房间参数
  getRoomsDetail(order_sn) {
    let that = this
    utils.showLoading("正在加载..")
    wx.request({
      url: `${app.apiHost}/api/goods.order/detail.json`,
      data: {
        order_sn: order_sn
      },
      success: (res) => {
        //订单状态是待确认0，并且支付状态是未支付0,显示立即支付
        // 订单状态待确认0,显示取消订单
        // 订单状态已确认1，并且支付状态为已支付，显示申请退款，跳刀静态页面，显示客服联系方式，客服和店家线下联系退款
        if (res.data.success) {
          let that = this
          let order_status = ""
          let overdue = 1800
          let consuming = res.data.data.now_time - res.data.data.add_time
          let surplus = overdue - consuming
          that.setData({
            order_status_text: res.data.data.order_status_text
          })
          if (res.data.data.order_status == 0 && res.data.data.pay_status == 1) {
            order_status = "支付成功，请等待管理员确认订单"
            that.setData({
              payBtn: true,
              pay_status: 1
            })
          } else if (res.data.data.order_status == 0 && res.data.data.pay_status == 0) {
            if (consuming < overdue) {
              var interval = setInterval(function() {
                surplus--;
                if (surplus == 0 || that.data.cancel == 1 || that.data.payment == 1) {
                  clearInterval(interval);
                  that.setData({
                    order_status: "订单已过期",
                    payBtn: true,
                    cancelBtn: true,
                    order_status_text: "已过期"
                  })
                  return;
                }
                var h = 0;
                var i = Math.floor(surplus / 60);
                var s = surplus % 60;
                if (i >= 60) {
                  h = Math.floor(i / 60);
                  i = i % 60;
                }
                if (h == 0) {
                  if (i == 0) {
                    that.setData({
                      order_status: `请在${s}秒内完成支付`
                    })
                  } else {
                    that.setData({
                      order_status: `请在${i}分${s}秒内完成支付`
                    })
                  }
                } else {
                  that.setData({
                    order_status: `请在${h}小时${i}分${s}秒内完成支付`
                  })
                }
              }, 1000);
              //  order_status = "显示倒计时"
            } else {
              order_status = "该订单已过期，请重新订房"
              that.setData({
                payBtn: true,
                cancelBtn: true,
                order_status_text: "已过期"
              })
            }
          } else if (res.data.data.order_status == 1) {
            that.setData({
              payBtn: true
            })
            if (res.data.data.shipping_status == 0) {
              order_status = "请于当天及时办理入住"

            } else if (res.data.data.shipping_status == 1) {
              order_status = "祝您住房愉快"
            }
          } else if (res.data.data.order_status == 2) {
            order_status = "该订单已过期，请重新订房"
            that.setData({
              payBtn: true,
              cancelBtn: true
            })
          } else if (res.data.data.order_status == 3) {
            order_status = "您已取消订单"
            that.setData({
              payBtn: true,
              cancelBtn: true
            })
          } else if (res.data.data.order_status == 4) {
            order_status = "欢迎下次入住"
            that.setData({
              payBtn: true,
              cancelBtn: true
            })
          }
          that.setData({
            order_status: order_status,
            rooms: res.data.data,
          })
        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }

      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 12)
      }

    })

  },
  // 支付
  payment() {
    let that = this
    utils.showLoading("正在加载..")
    wx.request({
      url: `${this.data.apiHost}/api/wx/pay.json`,
      data: {
        order_sn: this.data.rooms.order_sn,
        user_id: this.data.rooms.user_id
      },
      success: (res) => {
        if (res.data.success) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp.toString(),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: (res) => {
              console.log(res)
              that.setData({
                payment: 1
              })
              setTimeout(() => {
                that.onLoad(that.options)
              }, 2000)

            },
            complete: (res) => {
              wx.hideLoading()
              console.log(res.errMsg)
            }
          })

        } else {
          utils.showModal('提示', `${res.data.msg}`)
        }
      },
      complete: (res) => {
        wx.hideLoading()
        utils.requestError(res, 10)
      }
    })
  },
  // 取消
  cancel() {
    let room = JSON.stringify(this.data.rooms)
    let that = this
    // utils.showLoading("正在加载..")
    if (this.data.rooms.pay_status == 0) {
      wx.showModal({
        title: '提示',
        content: '确定要取消订单吗',
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: `${app.apiHost}/api/goods.order/cancel.json`,
              data: {
                order_sn: this.data.rooms.order_sn,
                user_id: this.data.rooms.user_id
              },
              success: (res) => {
                if (res.data.success) {
                  that.setData({
                    cancel: 1
                  })
                  utils.showModal('提示', `${res.data.msg}`)
                  setTimeout(() => {
                    that.onLoad(that.options)
                  }, 2000)

                } else {
                  utils.showModal('提示', `${res.data.msg}`)
                }
              },
              complete: (res) => {
                wx.hideLoading()
                utils.requestError(res, 18)
              }
            })
          }

        }
      })

    } else {
      // 跳到退款页面
      wx.navigateTo({
        url: `/pages/orderDetails/cancel/cancel?room=${room}`
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_sn: options.order_sn
    })
    this.getRoomsDetail(this.data.order_sn)
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