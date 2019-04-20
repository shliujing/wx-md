var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var a = t.openid;
        this.getdata(a);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    getdata: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/txlog",
            method: "post",
            dataType: "json",
            data: {
                openid: app.Data.userInfo.openid
            },
            success: function(t) {
                t.data && a.setData({
                    list: t.data
                });
            }
        });
    }
});