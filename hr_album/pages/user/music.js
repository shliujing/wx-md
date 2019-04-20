var app = getApp(), selmusic = wx.createInnerAudioContext();

Page({
    data: {
        cid: 0,
        pid: 0,
        mid: 0,
        skin: "",
        smudata: {},
        seachmusic: 0
    },
    onLoad: function(t) {
        wx.hideShareMenu(), this.setData({
            pid: t.pid
        }), wx.setNavigationBarTitle({
            title: "选择音乐"
        }), this.mulist();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        selmusic.stop(function() {});
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    mulist: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/music",
            method: "post",
            dataType: "json",
            data: {
                uniacid: app.siteInfo.uniacid
            },
            success: function(t) {
                a.setData({
                    cate: t.data.cate,
                    music: t.data.music
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
            url: "entry/wxapp/music",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                uniacid: app.siteInfo.uniacid,
                cid: a.data.cid
            },
            success: function(t) {
                a.setData({
                    music: t.data.music
                });
            }
        }));
    },
    changeMusic: function(t) {
        if (this.data.mid != t.currentTarget.dataset.mid) {
            this.data.mid = t.currentTarget.dataset.mid, this.setData({
                mid: this.data.mid
            });
            var a = t.currentTarget.dataset.music;
            selmusic.autoplay = !0, selmusic.src = a, console.log(this.data.mid);
        }
    },
    saveMusic: function(t) {
        var a = this, i = t.currentTarget.dataset.music;
        app.util.request({
            url: "entry/wxapp/savemusic",
            method: "post",
            dataType: "json",
            data: {
                uniacid: app.siteInfo.uniacid,
                id: a.data.pid,
                music: i
            },
            success: function(t) {
                app.redirectTo("show/show", "id=" + a.data.pid + "&type=edit");
            }
        });
    },
    onseach: function() {
        this.setData({
            seachmusic: 1
        });
    },
    exitSeach: function() {
        this.setData({
            seachmusic: 0
        });
    },
    bindKeyInput: function(t) {
        var a = this, i = t.detail.value;
        app.util.request({
            url: "entry/wxapp/seachmusic",
            method: "post",
            dataType: "json",
            showLoading: !1,
            data: {
                title: i
            },
            success: function(t) {
                a.setData({
                    smudata: t.data
                });
            }
        });
    },
    closeWin: function() {
        app.redirectTo("show/show", "id=" + this.data.pid + "&type=edit");
    }
});