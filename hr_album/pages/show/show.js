var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var e = this, t = (decodeURIComponent(a.scene), decodeURIComponent(a.scene)), n = a.type;
        console.log(app.Data.getSystemInfo.screenHeight), "undefined" == t && (t = a.id), 
        null == n && (n = "show"), console.log(t);
        var o = app.util.url("entry/wxapp/show") + "m=hr_album&id=" + t + "&type=" + n + "&wechat_redirect";
        e.setData({
            id: t,
            album_url: o
        }), e.album_click(), "edit" == n ? wx.hideShareMenu() : e.share();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function() {
        var e = this;
        return {
            title: e.data.share.sharetitle,
            imageUrl: e.data.share.shareimg,
            path: "/hr_album/pages/show/show?id=" + e.data.id + "&type=show",
            success: function(a) {
                app.shareAction(e.data.id);
            }
        };
    },
    share: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/sharecon",
            method: "post",
            dataType: "json",
            data: {
                id: e.data.id
            },
            showLoading: !1,
            success: function(a) {
                app.Data.paydesc = a.data.paydesc, e.setData({
                    share: a.data
                });
            }
        });
    },
    album_click: function() {
        app.userclick(this.data.id);
    }
});