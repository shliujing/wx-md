var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var t = a.openid;
        this.getdata(t);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    getdata: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/paylog",
            method: "post",
            dataType: "json",
            data: {
                openid: app.Data.userInfo.openid
            },
            success: function(a) {
                a.data && t.setData({
                    list: a.data
                });
            }
        });
    }
});