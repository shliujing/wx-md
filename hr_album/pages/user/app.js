var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        null == app.Data.config ? this.getData() : this.setData({
            config: app.Data.config
        }), this.appInfo();
    },
    onReady: function() {},
    onShow: function() {},
    onShareAppMessage: function() {},
    appInfo: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/appinfo",
            method: "post",
            dataType: "json",
            showLoading: !1,
            success: function(a) {
                a.data && t.setData({
                    list: a.data
                });
            }
        });
    },
    getData: function() {
        var t = this;
        app.getConfig(function(a) {
            t.setData({
                config: a
            });
        });
    },
    gotoApp: function(a) {
        var t = a.currentTarget.dataset.index, n = this.data.list[t];
        wx.navigateToMiniProgram({
            appId: n.appid,
            path: n.path,
            extraData: {
                foo: "bar"
            },
            envVersion: "release",
            success: function(a) {}
        });
    }
});