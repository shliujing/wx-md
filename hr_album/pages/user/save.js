var app = getApp();

Page({
    data: {
        check: 0,
        shared: 0
    },
    onLoad: function(t) {
        this.setData({
            id: t.pid,
            thumb: t.thumb,
            sharetitle: t.title,
            llads: app.Data.config.llads
        }), wx.setNavigationBarTitle({
            title: "保存相册"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onShareAppMessage: function() {
        var t = this;
        return app.shareAction(t.data.id), {
            title: t.data.sharetitle,
            path: "/hr_album/pages/show/show?id=" + t.data.id + "&type=show",
            imageUrl: this.data.thumb
        };
    },
    comeback: function() {
        app.redirectTo("show/show", "id=" + this.data.id + "&type=edit");
    },
    switch1Change: function(t) {
        var a = t.detail.value, e = this;
        app.util.request({
            url: "entry/wxapp/shareset",
            method: "post",
            dataType: "json",
            data: {
                openid: app.Data.userInfo.openid,
                id: e.data.id,
                isshow: a ? 0 : 1
            },
            success: function(t) {
                t.data.success ? (e.setData({
                    check: t.data.isshow
                }), wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    mask: !0,
                    duration: 2e3
                })) : wx.showToast({
                    title: "发表失败",
                    icon: "success",
                    duration: 2e3
                });
            }
        });
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
            url: a.data.thumb
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
        var a = this, t = a.data.thumb, e = a.data.getqrcode, s = a.data.hbg, i = wx.createCanvasContext("myCanvas");
        i.setFillStyle("white"), i.fillRect(0, 0, 400, 600), i.drawImage(t, 0, 50, 400, 600), 
        i.drawImage(s, 0, 0, 400, 600), i.setTextAlign("left"), i.setFontSize(18), i.setFillStyle("#111111"), 
        i.fillText(a.data.sharetitle, 10, 30), i.drawImage(e, 280, 450, 100, 100), i.clip(), 
        i.draw(!1, function(t) {
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