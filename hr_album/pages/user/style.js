var app = getApp();

Page({
    data: {
        pid: 0,
        cid: 0,
        skinData: null
    },
    onLoad: function(t) {
        var a = wx.getSystemInfoSync();
        this.setData({
            windowHeight: a.windowHeight,
            pid: t.pid
        }), wx.setNavigationBarTitle({
            title: "选择模板"
        }), this.skinList();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    skinList: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/skin",
            method: "post",
            dataType: "json",
            data: {
                uniacid: app.siteInfo.uniacid
            },
            success: function(t) {
                a.setData({
                    cate: t.data.cate,
                    skinData: t.data.skindata,
                    surl: t.data.skinurl
                });
            }
        });
    },
    switchNav: function(t) {
        var a = this;
        this.data.cid == t.currentTarget.dataset.cid && 0 != t.currentTarget.dataset.cid || (this.data.cid = t.currentTarget.dataset.cid, 
        this.setData({
            cid: this.data.cid
        }), app.util.request({
            url: "entry/wxapp/skin",
            method: "post",
            dataType: "json",
            data: {
                uniacid: app.siteInfo.uniacid,
                cid: a.data.cid
            },
            success: function(t) {
                a.setData({
                    skinData: t.data.skindata
                });
            }
        }));
    },
    updateSkin: function(t) {
        var a = t.currentTarget.dataset.skiname;
        app.util.request({
            url: "entry/wxapp/updateskin",
            method: "post",
            dataType: "json",
            data: {
                uniacid: app.siteInfo.uniacid,
                pid: this.data.pid,
                skiname: a
            },
            success: function(t) {
                app.redirectTo("show/show", "&id=" + t.data.id + "&type=edit");
            }
        });
    },
    closeWin: function() {
        app.redirectTo("show/show", "&id=" + this.data.pid + "&type=edit");
    }
});