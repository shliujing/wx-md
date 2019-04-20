var app = getApp();

Page({
    data: {
        shared: 0
    },
    onLoad: function(a) {
        var e = this;
        app.getConfig(function(t) {
            e.setData({
                id: a.id,
                shareimg: a.shareimg,
                sharetitle: a.sharetitle,
                llads: app.Data.config.llads
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this;
        return app.shareAction(t.data.id), {
            title: t.data.sharetitle,
            imageUrl: t.data.shareimg,
            path: "/hr_album/pages/show/show?id=" + t.data.id + "&type=show",
            success: function(t) {
                console.log("ok");
            }
        };
    },
    haibao: function() {
        wx.showLoading({
            mask: !0,
            title: "正在生成海报"
        }), this.getqrcode();
    },
    getqrcode: function() {
        var a = this;
        wx.downloadFile({
            url: app.util.url("entry/wxapp/qrcode", {
                m: "hr_album",
                id: a.data.id
            }),
            success: function(t) {
                200 === t.statusCode && a.setData({
                    getqrcode: t.tempFilePath
                }), a.getcardbg();
            }
        });
    },
    getcardbg: function() {
        var a = this, t = app.util.url("entry/wxapp/saveimg", {
            m: "hr_album",
            url: a.data.shareimg
        });
        wx.downloadFile({
            url: t,
            success: function(t) {
                a.setData({
                    thumb: t.tempFilePath
                }), console.log("ok"), a.gotobg();
            }
        });
    },
    gotobg: function() {
        var a = this, t = app.util.url("entry/wxapp/hbgimg", {
            m: "hr_album"
        });
        wx.downloadFile({
            url: t,
            success: function(t) {
                a.setData({
                    hbg: t.tempFilePath
                }), console.log("ok"), a.gotoshare();
            }
        });
    },
    gotoshare: function() {
        var a = this, t = a.data.thumb, e = a.data.getqrcode, i = a.data.hbg, o = wx.createCanvasContext("myCanvas");
        o.setFillStyle("white"), o.fillRect(0, 0, 400, 600), o.drawImage(t, 0, 50, 400, 600), 
        o.drawImage(i, 0, 0, 400, 600), o.setTextAlign("left"), o.setFontSize(18), o.setFillStyle("#111111"), 
        o.fillText(a.data.sharetitle, 10, 30), o.drawImage(e, 280, 450, 100, 100), o.clip(), 
        o.draw(!1, function(t) {
            a.saveimg();
        });
    },
    saveimg: function() {
        var a = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 400,
            height: 600,
            destWidth: 400,
            destHeight: 600,
            canvasId: "myCanvas",
            success: function(t) {
                a.setData({
                    shareImgSrc: t.tempFilePath,
                    shared: 1
                }), a.savelocal();
            },
            fail: function(t) {}
        });
    },
    savelocal: function() {
        wx.hideLoading(), wx.saveImageToPhotosAlbum({
            filePath: this.data.shareImgSrc,
            success: function(t) {}
        });
    },
    closered: function() {
        this.setData({
            shared: 0
        });
    }
});