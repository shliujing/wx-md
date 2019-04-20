var app = getApp();

Page({
    data: {
        navname: "index",
        page: 1,
        skinid: 0,
        scrollTop: 0,
        hotlist: [],
        indicatorDots: !0,
        indicatorDot: !1,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3
    },
    onLoad: function(a) {
        this.getads(), this.setData({
            screenHeight: app.Data.getSystemInfo.screenHeight
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        app.getConfig(function(a) {
            if (e.setData({
                review: app.Data.config.review,
                imgurl: app.Data.config.imgurl,
                kfbg: app.Data.config.kfbg,
                llads: app.Data.config.llads,
                iskf: app.Data.config.iskf,
                list_style: app.Data.config.list_style,
                showmode: app.Data.config.showmode,
                todo: app.Data.config.todo
            }), 1 == app.Data.config.review) wx.hideTabBar(), e.getrlist(); else if (2 == app.Data.config.review) e.aclist(), 
            wx.hideTabBar(); else if (1 == app.Data.config.showmode) if (app.Data.userInfo) e.setData({
                userInfo: app.Data.userInfo
            }), e.getmob(); else {
                var t = wx.getStorageSync("userInfo");
                t.openid ? (app.Data.userInfo = t, e.setData({
                    userInfo: app.Data.userInfo
                }), e.getmob()) : (e.setData({
                    login: 1
                }), wx.hideTabBar({}));
            } else e.getpics();
            wx.setNavigationBarTitle({
                title: app.Data.config.spacename
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function() {
        return {
            imageUrl: this.data.userInfo.imgurl + this.data.userInfo.sharepic,
            path: "/hr_album/pages/index/index"
        };
    },
    aclist: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/aclist",
            method: "post",
            dataType: "json",
            success: function(a) {
                t.setData({
                    aclist: a.data
                });
            }
        });
    },
    tap_item: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/hr_album/pages/zhufu/zhufu?id=" + t
        });
    },
    getads: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/adslist",
            method: "post",
            dataType: "json",
            showLoading: !1,
            success: function(a) {
                t.setData({
                    ads: a.data
                });
            }
        });
    },
    getpics: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/picslist",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                page: e.data.page
            },
            success: function(a) {
                if (!a) return !1;
                if (0 < a.data.length) if (1 == this.data.page) e.setData({
                    hotlist: a.data
                }); else {
                    var t = e.data.hotlist = e.data.hotlist.concat(a.data);
                    e.setData({
                        hotlist: t
                    });
                }
            }
        });
    },
    getmob: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/moblist",
            method: "post",
            dataType: "json",
            showLoading: !1,
            success: function(a) {
                if (!a) return !1;
                0 < a.data.length && t.setData({
                    moblist: a.data
                });
            }
        });
    },
    getrlist: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/getrlist",
            method: "post",
            dataType: "json",
            showLoading: !1,
            success: function(a) {
                0 < a.data.length && t.setData({
                    relist: a.data
                });
            }
        });
    },
    scrolltolower: function() {
        ++this.data.page, this.getpics();
    },
    showAlbum: function(a) {
        var t = a.currentTarget.dataset.id;
        console.log(t), app.redirect("show/show", "id=" + t + "&type=show");
    },
    formSubmit: function(a) {
        console.log(a.detail.formId), app.upForm(a.detail.formId);
    },
    hdGoto: function(a) {
        var t = a.currentTarget.dataset.id, e = this.data.ads[t];
        wx.navigateTo({
            url: "/hr_album/pages/web/index?url=" + escape(e.path)
        });
    },
    imgview: function(a) {
        var t = a.currentTarget.dataset.img;
        wx.previewImage({
            current: t,
            urls: [ t ]
        });
    },
    gotoNav: function(a) {
        var t = a.currentTarget.dataset.nav;
        "add" == t ? wx.reLaunch({
            url: "/hr_album/pages/user/add"
        }) : "user" == t && wx.reLaunch({
            url: "/hr_album/pages/user/user"
        });
    },
    updateUserInfo: function(a) {
        var t = this;
        app.getUserInfo(function(a) {
            a && (t.setData({
                login: 0
            }), t.getmob(), wx.showTabBar({}));
        }, a.detail);
    },
    chooseimg: function(a) {
        var e = this, t = a.currentTarget.dataset.skinid;
        console.log(t), e.setData({
            skinid: t
        }), wx.chooseImage({
            count: 9,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths;
                e.setData({
                    pics: t
                }), e.setData({
                    loading: !0,
                    text: "正在处理图片"
                }), e.uploadimg({
                    path: e.data.pics
                });
            }
        });
    },
    uploadimg: function(e) {
        var o = this, s = e.i ? e.i : 0, i = e.success ? e.success : 0, n = e.fail ? e.fail : 0, l = e.path[s];
        wx.getImageInfo({
            src: l,
            success: function(a) {
                if (800 < a.width || 1e3 < a.height) {
                    var t = wx.createCanvasContext("myCanvas");
                    1 < a.width / a.height ? (t.drawImage(l, 0, 0, 650, 500), t.draw(!1, function(a) {
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
                                        i++, console.log(a.data), console.log(s), o.data.pics[s] = a.data;
                                    },
                                    fail: function(a) {
                                        n++, console.log("fail:" + s + "fail:" + n);
                                    },
                                    complete: function() {
                                        console.log(s), s++, o.setData({
                                            text: "上传中 " + s + " / " + e.path.length
                                        }), s == e.path.length ? (console.log("执行完毕"), console.log("成功：" + i + " 失败：" + n), 
                                        o.savephoto(), o.setData({
                                            loading: !1
                                        })) : (console.log(s), e.i = s, e.success = i, e.fail = n, o.uploadimg(e));
                                    }
                                });
                            },
                            fail: function(a) {}
                        });
                    })) : (t.drawImage(l, 0, 0, 640, 900), t.draw(!1, function(a) {
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
                                        i++, console.log(a.data), console.log(s), o.data.pics[s] = a.data;
                                    },
                                    fail: function(a) {
                                        n++, console.log("fail:" + s + "fail:" + n);
                                    },
                                    complete: function() {
                                        console.log(s), s++, o.setData({
                                            text: "上传中 " + s + " / " + e.path.length
                                        }), s == e.path.length ? (console.log("执行完毕"), console.log("成功：" + i + " 失败：" + n), 
                                        o.savephoto(), o.setData({
                                            loading: !1
                                        })) : (console.log(s), e.i = s, e.success = i, e.fail = n, o.uploadimg(e));
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
                        i++, console.log(a.data), console.log(s), o.data.pics[s] = a.data;
                    },
                    fail: function(a) {
                        n++, console.log("fail:" + s + "fail:" + n);
                    },
                    complete: function() {
                        console.log(s), s++, o.setData({
                            text: "上传中 " + s + " / " + e.path.length
                        }), s == e.path.length ? (console.log("执行完毕"), console.log("成功：" + i + " 失败：" + n), 
                        o.savephoto(), o.setData({
                            loading: !1
                        })) : (console.log(s), e.i = s, e.success = i, e.fail = n, o.uploadimg(e));
                    }
                });
            }
        });
    },
    savephoto: function() {
        app.util.request({
            url: "entry/wxapp/saveindata",
            method: "post",
            dataType: "json",
            data: {
                pics: this.data.pics,
                openid: app.Data.userInfo.openid,
                avatar: app.Data.userInfo.avatarUrl,
                nickname: app.Data.userInfo.nickName,
                skinid: this.data.skinid
            },
            success: function(a) {
                app.redirect("show/show", "id=" + a.data.id + "&type=edit");
            }
        });
    }
});