var app = getApp();

Page({
    data: {
        cusmter: 0,
        gopay: 0
    },
    onLoad: function(a) {
        var t = this;
        if (app.Data.userInfo) t.setData({
            paydesc: app.Data.paydesc,
            userInfo: app.Data.userInfo
        }); else {
            var e = wx.getStorageSync("userInfo");
            e.openid ? (app.Data.userInfo = e, t.setData({
                paydesc: app.Data.paydesc,
                userInfo: app.Data.userInfo
            })) : (t.setData({
                login: 1
            }), wx.hideTabBar({}));
        }
        wx.setNavigationBarTitle({
            title: "给个打赏吧！"
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#D55A48"
        }), t.moneyNum(), t.setData({
            pid: a.pid,
            tid: a.openid,
            nickname: a.nickname,
            avatar: a.avatar
        });
    },
    onReady: function() {},
    onShow: function() {},
    updateUserInfo: function(a) {
        var t = this;
        app.getUserInfo(function(a) {
            a && (t.setData({
                userInfo: a,
                login: 0
            }), wx.showTabBar({}));
        }, a.detail);
    },
    bindKeyInput: function(a) {
        var t = parseFloat(a.detail.value), e = 0;
        0 != t && t <= 1e3 && (e = 1), this.setData({
            money: t,
            gopay: e
        });
    },
    dopay: function(a) {
        var t = a.currentTarget.dataset.num, e = this;
        this.data.money || this.setData({
            money: t
        }), app.util.request({
            url: "entry/wxapp/pay",
            data: {
                openid: app.Data.userInfo.openid,
                cost: e.data.money,
                tid: e.data.tid,
                pid: e.data.pid,
                nickname: e.data.nickname,
                avatar: e.data.avatar,
                tnickname: app.Data.userInfo.nickName
            },
            success: function(t) {
                t.data && wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: "MD5",
                    paySign: t.data.paySign,
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "none",
                            duration: 3e3,
                            success: function() {
                                e.tosave(t.data.out_trade_no);
                            }
                        });
                    },
                    fail: function(a) {
                        wx.showToast({
                            title: "支付失败",
                            icon: "none",
                            duration: 2e3,
                            success: function() {
                                e.setData({
                                    money: 0,
                                    gopay: 0,
                                    cusmter: 0
                                });
                            }
                        });
                    }
                });
            },
            fail: function(a) {
                wx.showModal({
                    title: "系统提示",
                    content: "支付出错",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm;
                    }
                });
            }
        });
    },
    cusmter: function(a) {
        this.setData({
            cusmter: 1
        });
    },
    closealert: function() {
        this.setData({
            cusmter: 0,
            money: 0
        });
    },
    tosave: function(a) {
        var t = app.Data.userInfo.openid;
        app.util.request({
            url: "entry/wxapp/payresult",
            method: "post",
            dataType: "json",
            data: {
                openid: t,
                trade_no: a
            },
            success: function(a) {
                wx.showToast({
                    title: "打赏成功",
                    icon: "none",
                    duration: 3e3,
                    success: function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    moneyNum: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/moneynum",
            method: "post",
            dataType: "json",
            success: function(a) {
                t.setData({
                    moneys: a.data
                });
            }
        });
    }
});