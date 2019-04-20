var app = getApp();

Page({
    data: {
        page: 1,
        scrollTop: 0,
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        isme: 0
    },
    onLoad: function(t) {
        var a = this;
        if (a.setData({
            id: t.id,
            hopenid: t.openid,
            screenHeight: app.Data.getSystemInfo.screenHeight
        }), a.getlist(), app.Data.userInfo) a.setData({
            userInfo: app.Data.userInfo
        }); else {
            var e = wx.getStorageSync("userInfo");
            e ? (app.Data.userInfo = e, a.setData({
                userInfo: app.Data.userInfo
            })) : (a.setData({
                login: 1
            }), wx.hideTabBar({}));
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    updateUserInfo: function(t) {
        var a = this;
        app.getUserInfo(function(t) {
            t && (a.setData({
                userInfo: t,
                login: 0
            }), t.openid == a.data.hopenid && a.setData({
                isme: 1
            }), wx.showTabBar({}));
        }, t.detail);
    },
    getlist: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/rlist",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                page: e.data.page,
                cid: e.data.id
            },
            success: function(t) {
                if (!t) return !1;
                if (0 < t.data.length) if (1 == this.data.page) e.setData({
                    rlist: t.data
                }); else {
                    var a = e.data.rlist = e.data.rlist.concat(t.data);
                    e.setData({
                        rlist: a
                    });
                }
            }
        });
    },
    scrolltolower: function() {
        ++this.data.page, this.getlist();
    },
    keyinput: function(t) {
        console.log(t.detail.value), this.setData({
            content: t.detail.value
        });
    },
    delreview: function(t) {
        var e = this, a = t.currentTarget.dataset.id, n = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/delreview",
            method: "post",
            dataType: "json",
            data: {
                id: a
            },
            success: function(t) {
                if (t.data.result) {
                    var a = e.data.rlist;
                    a.splice(n, 1), e.setData({
                        rlist: a
                    });
                }
            }
        });
    },
    doreview: function() {
        var n = this;
        n.data.content ? app.util.request({
            url: "entry/wxapp/donesave",
            method: "post",
            dataType: "json",
            data: {
                id: n.data.id,
                avatar: n.data.userInfo.avatarUrl,
                nickname: n.data.userInfo.nickName,
                content: n.data.content
            },
            success: function(t) {
                if (t.data.result) {
                    var a = n.data.rlist, e = {
                        id: t.data,
                        nickname: n.data.userInfo.nickName,
                        avatar: n.data.userInfo.avatarUrl,
                        content: n.data.content,
                        addtime: "刚刚"
                    };
                    a ? a.unshift(e) : (a = [])[0] = e, n.setData({
                        content: "",
                        rlist: a
                    }), wx.showToast({
                        title: "评论成功",
                        duration: 2e3
                    });
                }
            }
        }) : wx.showToast({
            title: "请输入评论内容",
            duration: 2e3,
            icon: "none"
        });
    }
});