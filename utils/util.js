const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trim(str) {
  if (str != "") {
    str = str.replace(/^\s+|\s+$/g, "");
  }
  return str;
}
// 计算时间差
function calculateTime(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
  var dateSpan,
    tempDate,
    iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
};
function getRoomList(that,live,leave){
  wx.request({
    url: `${that.data.apiHost}/api/goods/listAll.json`,
    data:{
      in: live,
      out: leave
    },
    success: (res) => {
      if (res.data.success) {
          
        that.setData({
          rooms: res.data.data
        })
        // if (app.roomsCallback) {
        //   app.roomsCallback(res.data.data);
        // }
      } else {
        showModal('提示', `${res.data.msg}`)
      }
    },
    complete: (res) => {
      wx.hideLoading()
      requestError(res, 9)
    }
  })
}
function loginServer(app, userInfo) {
  let user = wx.getStorageSync("userInfo")
  if (user) {
    if (user.wx_openid) {
      console.log("您已登录过")
      return false
    }
  } else {
    console.log("没登录")
  }
  showLoading("正在加载..")
  let that = this
  wx.request({
    url: `${app.apiHost}/api/wx/user_login.json`,
    data: {
      code: app.code,
      avatarUrl: userInfo.avatarUrl,
      country: userInfo.country,
      province: userInfo.province,
      city: userInfo.city,
      gender: userInfo.gender,
      language: userInfo.language,
      nickName: userInfo.nickName
    },
    success: (res) => {
      if (res.data.success) {
        app.userInfo = res.data.data
        wx.setStorageSync('userInfo', res.data.data)
      } else {
        showModal('提示', `${res.data.msg}`)
      }
    },
    complete: (res) => {
      wx.hideLoading()
      requestError(res, 11)
    }
  })
}

function requestError(res, apiNo) {
  console.log(res)
  if (res.statusCode == 403) {
    showModal("提示", "服务器正在维护，请稍后再试")
  } else if (res.statusCode == 404) {
    showModal("提示", "服务器正在维护，请稍后再试")
  } else if (res.statusCode == 500) {
    showModal("提示", "服务器正在维护，请稍后再试")
  }
  // 请求错误报告接口，向错误报告接口传入statusCode和接口编号，由服务器向管理员发送短信，告诉程序报错
}

function showModal(title, content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false
  })
}

function showLoading(title) {
  wx.showLoading({
    title: title,
    mask: true
  })
}

function showToast(title) {
  wx.showToast({
    icon: "none",
    title: title,
    duration: 2000
  })
}
module.exports = {
  formatTime: formatTime,
  trim: trim,
  loginServer: loginServer,
  requestError: requestError,
  showModal: showModal,
  showLoading: showLoading,
  showToast: showToast,
  calculateTime: calculateTime,
  getRoomList: getRoomList
}