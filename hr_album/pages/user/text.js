var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        wx.hideShareMenu(), this.setData({
            pid: t.pid
        }), wx.setNavigationBarTitle({
            title: "编辑文字"
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
    topmove: function(t) {
        var a = this, o = t.currentTarget.dataset.idx;
        if (0 != o) {
            var i = a.data.photoData.pic, e = a.data.photoData.text, p = i[o], d = e[o];
            i[o] = a.data.photoData.pic[o - 1], i[o - 1] = p, e[o] = a.data.photoData.text[o - 1], 
            e[o - 1] = d, a.setData({
                "photoData.text": e,
                "photoData.pic": i
            });
        }
    },
    botmove: function(t) {
        var a = this, o = t.currentTarget.dataset.idx;
        if (o != a.data.pdata - 1) {
            var i = a.data.photoData.pic, e = a.data.photoData.text, p = i[o], d = e[o];
            i[o] = a.data.photoData.pic[o + 1], i[o + 1] = p, e[o] = a.data.photoData.text[o + 1], 
            e[o + 1] = d, a.setData({
                "photoData.text": e,
                "photoData.pic": i
            });
        }
    },
    uptext: function(t) {
        var a = t.currentTarget.dataset.idx, o = t.detail.value, i = this.data.photoData.text;
        i[a] = o, this.setData({
            "photoData.text": i
        });
    },
    delpic: function(t) {
        var a = this, o = t.currentTarget.dataset.idx, i = a.data.photoData.pic, e = a.data.photoData.text;
        i.splice(o, 1), e.splice(o, 1), a.setData({
            "photoData.pic": i,
            "photoData.text": e
        });
    },
    uptitle: function(t) {
        var a = t.detail.value;
        this.setData({
            "photoData.title": a
        });
    },
    savetext: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/savetext",
            method: "post",
            dataType: "json",
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
    closeWin: function() {
        app.redirectTo("show/show", "id=" + this.data.pid + "&type=edit");
    }
});