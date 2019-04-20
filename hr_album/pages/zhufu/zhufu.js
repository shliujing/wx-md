var app = getApp(), WxParse = require("../../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(t) {
        this.setData({
            id: t.id
        }), this.acon();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onReachBottom: function() {},
    acon: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/acget",
            method: "post",
            dataType: "json",
            data: {
                id: e.data.id
            },
            success: function(t) {
                var a = t.data;
                console.log(a), e.setData({
                    article: a
                }), wx.setNavigationBarTitle({
                    title: a.title,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {}
                }), WxParse.wxParse("article", "html", a.contnet, e, 0);
            }
        });
    }
});