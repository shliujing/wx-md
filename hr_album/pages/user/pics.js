var app = getApp();

Page({
    data: {
        loading: !1,
        text: "正在加载",
        pics: []
    },
    onLoad: function(t) {
        wx.hideShareMenu(), this.setData({
            pid: t.pid
        }), wx.setNavigationBarTitle({
            title: "编辑图片"
        }), this.piclist();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    piclist: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/photodata",
            method: "post",
            dataType: "json",
            data: {
                openid: app.Data.userInfo.openid,
                uniacid: app.siteInfo.uniacid,
                pid: a.data.pid
            },
            success: function(t) {
                a.setData({
                    photoData: t.data.pdata,
                    imgurl: t.data.imgurl,
                    pdata: t.data.tnum
                });
            }
        });
    },
    leftmove: function(t) {
        var a = this, o = t.currentTarget.dataset.idx;
        if (0 != o) {
            var e = a.data.photoData.pic, i = e[o], n = a.data.photoData.text, l = n[o];
            e[o] = a.data.photoData.pic[o - 1], e[o - 1] = i, n[o] = a.data.photoData.text[o - 1], 
            n[o - 1] = l, a.setData({
                "photoData.text": n,
                "photoData.pic": e
            });
        }
    },
    rightmove: function(t) {
        var a = this, o = t.currentTarget.dataset.idx;
        if (o != a.data.pdata - 1) {
            var e = a.data.photoData.pic, i = e[o], n = a.data.photoData.text, l = n[o];
            e[o] = a.data.photoData.pic[o + 1], e[o + 1] = i, n[o] = a.data.photoData.text[o + 1], 
            n[o + 1] = l, a.setData({
                "photoData.text": n,
                "photoData.pic": e
            });
        }
    },
    delpic: function(t) {
        var a = this, o = t.currentTarget.dataset.idx, e = a.data.photoData.pic, i = a.data.photoData.text;
        e.splice(o, 1), i.splice(o, 1), a.setData({
            "photoData.pic": e,
            "photoData.text": i
        });
    },
    closeWin: function() {
        app.redirectTo("show/show", "id=" + this.data.pid + "&type=edit");
    },
    savepic: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/savetext",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                openid: app.Data.userInfo.openid,
                uniacid: app.siteInfo.uniacid,
                pid: a.data.pid,
                title: a.data.photoData.title,
                pic: a.data.photoData.pic,
                text: a.data.photoData.text
            },
            success: function(t) {
                app.redirectTo("show/show", "id=" + a.data.pid + "&type=edit");
            }
        });
    },
    addpic: function() {
        var o = this;
        this.data.pics;
        wx.chooseImage({
            count: 9,
            sizeType: [ "original" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths;
                o.setData({
                    pics: a
                }), o.setData({
                    loading: !0,
                    text: "正在压缩图片"
                }), o.uploadimg({
                    path: o.data.pics
                });
            }
        });
    },
    uploadimg: function(o) {
        var e = this, i = o.i ? o.i : 0, n = o.success ? o.success : 0, l = o.fail ? o.fail : 0, p = o.path[i];
        wx.getImageInfo({
            src: p,
            success: function(t) {
                if (800 < t.width || 1e3 < t.height) {
                    var a = wx.createCanvasContext("myCanvas");
                    1 < t.width / t.height ? (a.drawImage(p, 0, 0, 650, 500), a.draw(!1, function(t) {
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 650,
                            height: 500,
                            destWidth: 650,
                            destHeight: 500,
                            canvasId: "myCanvas",
                            fileType: "jpg",
                            success: function(t) {
                                console.log(t.tempFilePath + "横图"), wx.uploadFile({
                                    url: app.util.url("entry/wxapp/upimg", {
                                        m: "hr_album"
                                    }),
                                    filePath: t.tempFilePath,
                                    name: "file",
                                    formData: null,
                                    success: function(t) {
                                        n++, console.log(t.data), console.log(i);
                                        var a = e.data.photoData.pic;
                                        a[a.length] = t.data, e.setData({
                                            "photoData.pic": a
                                        });
                                    },
                                    fail: function(t) {
                                        l++, console.log("fail:" + i + "fail:" + l);
                                    },
                                    complete: function() {
                                        console.log(i), i++, e.setData({
                                            text: "上传中 " + i + " / " + o.path.length
                                        }), i == o.path.length ? (console.log("执行完毕"), console.log("成功：" + n + " 失败：" + l), 
                                        e.setData({
                                            loading: !1
                                        })) : (console.log(i), o.i = i, o.success = n, o.fail = l, e.uploadimg(o));
                                    }
                                });
                            },
                            fail: function(t) {}
                        });
                    })) : (a.drawImage(p, 0, 0, 640, 900), a.draw(!1, function(t) {
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 640,
                            height: 900,
                            destWidth: 640,
                            destHeight: 900,
                            canvasId: "myCanvas",
                            success: function(t) {
                                console.log(t.tempFilePath + "竖图"), wx.uploadFile({
                                    url: app.util.url("entry/wxapp/upimg", {
                                        m: "hr_album"
                                    }),
                                    filePath: t.tempFilePath,
                                    name: "file",
                                    formData: null,
                                    success: function(t) {
                                        n++, console.log(t.data), console.log(i);
                                        var a = e.data.photoData.pic;
                                        a[a.length] = t.data, e.setData({
                                            "photoData.pic": a
                                        });
                                    },
                                    fail: function(t) {
                                        l++, console.log("fail:" + i + "fail:" + l);
                                    },
                                    complete: function() {
                                        console.log(i), i++, e.setData({
                                            text: "上传中 " + i + " / " + o.path.length
                                        }), i == o.path.length ? (console.log("执行完毕"), console.log("成功：" + n + " 失败：" + l), 
                                        e.setData({
                                            loading: !1
                                        })) : (console.log(i), o.i = i, o.success = n, o.fail = l, e.uploadimg(o));
                                    }
                                });
                            },
                            fail: function(t) {}
                        });
                    }));
                } else wx.uploadFile({
                    url: app.util.url("entry/wxapp/upimg", {
                        m: "hr_album"
                    }),
                    filePath: p,
                    name: "file",
                    formData: null,
                    success: function(t) {
                        n++, console.log(t.data), console.log(i);
                        var a = e.data.photoData.pic;
                        a[a.length] = t.data, e.setData({
                            "photoData.pic": a
                        });
                    },
                    fail: function(t) {
                        l++, console.log("fail:" + i + "fail:" + l);
                    },
                    complete: function() {
                        console.log(i), i++, e.setData({
                            text: "上传中 " + i + " / " + o.path.length
                        }), i == o.path.length ? (console.log("执行完毕"), console.log("成功：" + n + " 失败：" + l), 
                        e.setData({
                            loading: !1
                        })) : (console.log(i), o.i = i, o.success = n, o.fail = l, e.uploadimg(o));
                    }
                });
            }
        });
    }
});