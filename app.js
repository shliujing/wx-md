var _App;

function _defineProperty(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = n, t;
}

App((_defineProperty(_App = {
    onLaunch: function() {},
    util: require("we7/util.js"),
    md5: require("we7/md5.js"),
    Data: {
        userInfo: null,
        config: null,
        getSystemInfo: null,
        paydesc: null,
        ver: 16
    },
    onShow: function() {
        var e = this;
        wx.getSystemInfo({
            success: function(t) {
                e.Data.getSystemInfo = t;
            }
        });
    },
    updeluser: function() {
        this.util.request({
            url: "entry/wxapp/updeluser",
            method: "post",
            dataType: "json",
            data: {
                openid: this.Data.userInfo.openid,
                status: 1
            },
            showLoading: !1,
            success: function(t) {}
        });
    },
    getUserInfo: function(a, o) {
        var s = this;
        wx.getStorageSync("deluser") && wx.navigateBack({
            delta: 10
        }), s.Data.userInfo ? (s.Data.userInfo.status && (wx.setStorageSync("deluser", "1"), 
        wx.navigateBack({
            delta: 10
        })), "function" == typeof a && a(s.Data.userInfo)) : wx.login({
            success: function(t) {
                var e = t.code, n = o.userInfo;
                n.code = e, s.util.request({
                    url: "entry/wxapp/member",
                    method: "post",
                    dataType: "json",
                    data: n,
                    showLoading: !1,
                    success: function(t) {
                        0 < t.data.status && (wx.setStorageSync("deluser", "1"), wx.navigateBack({
                            delta: 10
                        })), s.Data.userInfo = t.data, wx.setStorageSync("userInfo", t.data), "function" == typeof a && a(s.Data.userInfo);
                    }
                });
            },
            fail: function() {
                wx.showModal({
                    title: "获取信息失败",
                    content: "请允许授权以便为您提供给服务",
                    success: function(t) {
                        t.confirm && util.getUserInfo();
                    }
                });
            }
        });
    },
    upForm: function(t) {
        console.log(t), this.util.request({
            url: "entry/wxapp/upform",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                openid: this.Data.userInfo.openid,
                formid: t
            },
            success: function(t) {}
        });
    },
    getConfig: function(e) {
        var n = this;
        this.util.request({
            url: "entry/wxapp/setdata",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                ver: n.Data.ver
            },
            success: function(t) {
                n.Data.config = t.data, "function" == typeof e && e(n.Data.config);
            }
        });
    },
    shareAction: function(t) {
        this.util.request({
            url: "entry/wxapp/shareclick",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                uniacid: this.siteInfo.uniacid,
                id: t
            },
            success: function(t) {}
        });
    },
    redirect: function(t, e) {
        wx.navigateTo({
            url: "/hr_album/pages/" + t + "?" + e
        });
    },
    redirectTo: function(t, e) {
        wx.redirectTo({
            url: "/hr_album/pages/" + t + "?" + e
        });
    }
}, "shareAction", function(t) {
    this.util.request({
        url: "entry/wxapp/shareclick",
        method: "post",
        dataType: "json",
        showLoading: !1,
        data: {
            uniacid: this.siteInfo.uniacid,
            id: t
        },
        success: function(t) {}
    });
}), _defineProperty(_App, "userclick", function(t) {
    this.util.request({
        url: "entry/wxapp/userclick",
        method: "post",
        dataType: "json",
        showLoading: !1,
        data: {
            uniacid: this.siteInfo.uniacid,
            id: t
        },
        success: function(t) {}
    });
}), _defineProperty(_App, "siteInfo", require("siteinfo.js")), _App));