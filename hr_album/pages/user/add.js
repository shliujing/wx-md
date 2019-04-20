var app = getApp();

Page({
    data: {
        loading: !1,
        navname: "add"
    },
    onLoad: function(a) {
        var e = this;
        if (wx.getSystemInfo({
            success: function(a) {
                e.setData({
                    config: app.Data.config
                }), wx.setNavigationBarTitle({
                    title: app.Data.config.spacename
                });
            }
        }), app.Data.userInfo) e.setData({
            userInfo: app.Data.userInfo
        }); else {
            var t = wx.getStorageSync("userInfo");
            t.openid ? (app.Data.userInfo = t, e.setData({
                userInfo: app.Data.userInfo
            })) : (e.setData({
                login: 1
            }), wx.hideTabBar({}));
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    updateUserInfo: function(a) {
        var e = this;
        app.getUserInfo(function(a) {
            a && (e.setData({
                login: 0
            }), wx.showTabBar({}));
        }, a.detail);
    },
    chooseimg: function() {
        var t = this;
        wx.chooseImage({
            count: 9,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var e = a.tempFilePaths;
                t.setData({
                    pics: e
                }), t.setData({
                    loading: !0,
                    text: "正在压缩图片"
                }), t.uploadimg({
                    path: t.data.pics
                });
            }
        });
    },
    uploadimg: function(t) {
        var o = this, n = t.i ? t.i : 0, s = t.success ? t.success : 0, i = t.fail ? t.fail : 0, l = t.path[n];
        wx.getImageInfo({
            src: l,
            success: function(a) {
                if (800 < a.width || 1e3 < a.height) {
                    var e = wx.createCanvasContext("myCanvas");
                    1 < a.width / a.height ? (e.drawImage(l, 0, 0, 650, 500), e.draw(!1, function(a) {
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 650,
                            height: 500,
                            destWidth: 650,
                            destHeight: 500,
                            canvasId: "myCanvas",
                            fileType: "jpg",
                            success: function(a) {
                                console.log(a.tempFilePath + "横图"), wx.uploadFile({
                                    url: app.util.url("entry/wxapp/upimg", {
                                        m: "hr_album"
                                    }),
                                    filePath: a.tempFilePath,
                                    name: "file",
                                    formData: null,
                                    success: function(a) {
                                        s++, console.log(a.data), console.log(n), o.data.pics[n] = a.data;
                                    },
                                    fail: function(a) {
                                        i++, console.log("fail:" + n + "fail:" + i);
                                    },
                                    complete: function() {
                                        console.log(n), n++, o.setData({
                                            text: "上传中 " + n + " / " + t.path.length
                                        }), n == t.path.length ? (console.log("执行完毕"), console.log("成功：" + s + " 失败：" + i), 
                                        o.savephoto(), o.setData({
                                            loading: !1
                                        })) : (console.log(n), t.i = n, t.success = s, t.fail = i, o.uploadimg(t));
                                    }
                                });
                            },
                            fail: function(a) {}
                        });
                    })) : (e.drawImage(l, 0, 0, 640, 900), e.draw(!1, function(a) {
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 640,
                            height: 900,
                            destWidth: 640,
                            destHeight: 900,
                            canvasId: "myCanvas",
                            success: function(a) {
                                console.log(a.tempFilePath + "竖图"), wx.uploadFile({
                                    url: app.util.url("entry/wxapp/upimg", {
                                        m: "hr_album"
                                    }),
                                    filePath: a.tempFilePath,
                                    name: "file",
                                    formData: null,
                                    success: function(a) {
                                        s++, console.log(a.data), console.log(n), o.data.pics[n] = a.data;
                                    },
                                    fail: function(a) {
                                        i++, console.log("fail:" + n + "fail:" + i);
                                    },
                                    complete: function() {
                                        console.log(n), n++, o.setData({
                                            text: "上传中 " + n + " / " + t.path.length
                                        }), n == t.path.length ? (console.log("执行完毕"), console.log("成功：" + s + " 失败：" + i), 
                                        o.savephoto(), o.setData({
                                            loading: !1
                                        })) : (console.log(n), t.i = n, t.success = s, t.fail = i, o.uploadimg(t));
                                    }
                                });
                            },
                            fail: function(a) {}
                        });
                    }));
                } else wx.uploadFile({
                    url: app.util.url("entry/wxapp/upimg", {
                        m: "hr_album"
                    }),
                    filePath: l,
                    name: "file",
                    formData: null,
                    success: function(a) {
                        s++, console.log(a.data), console.log(n), o.data.pics[n] = a.data;
                    },
                    fail: function(a) {
                        i++, console.log("fail:" + n + "fail:" + i);
                    },
                    complete: function() {
                        console.log(n), n++, o.setData({
                            text: "上传中 " + n + " / " + t.path.length
                        }), n == t.path.length ? (console.log("执行完毕"), console.log("成功：" + s + " 失败：" + i), 
                        o.savephoto(), o.setData({
                            loading: !1
                        })) : (console.log(n), t.i = n, t.success = s, t.fail = i, o.uploadimg(t));
                    }
                });
            }
        });
    },
    savephoto: function() {
        app.util.request({
            url: "entry/wxapp/savedata",
            method: "post",
            dataType: "json",
            data: {
                pics: this.data.pics,
                openid: app.Data.userInfo.openid,
                avatar: app.Data.userInfo.avatarUrl,
                nickname: app.Data.userInfo.nickName,
                uniacid: app.siteInfo.uniacid
            },
            success: function(a) {
                app.redirect("show/show", "id=" + a.data.id + "&type=edit");
            }
        });
    },
    gotoNav: function(a) {
        var e = a.currentTarget.dataset.nav;
        "user" == e ? wx.reLaunch({
            url: "/hr_album/pages/user/user"
        }) : "index" == e && wx.reLaunch({
            url: "/hr_album/pages/index/index"
        });
    },
    upform: function(a) {
        console.log(a.detail.formId), app.upForm(a.detail.formId);
    }
});