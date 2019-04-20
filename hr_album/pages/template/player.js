var app = getApp(), playaudio = wx.createInnerAudioContext();

function play_music(a) {
    var i = a, p = i.data.share.bgmusic;
    playaudio.src = p, playaudio.autoplay = !0, playaudio.play(), playaudio.onPlay(function() {
        console.log("开始播放");
    }), i.setData({
        palyeranima: "-webkit-animation:zhuan 2s linear infinite"
    });
}

function playmusiced(a) {
    var i = a;
    playaudio.paused ? (playaudio.play(), i.setData({
        palyeranima: "-webkit-animation:zhuan 2s linear infinite"
    })) : (playaudio.pause(), i.setData({
        palyeranima: ""
    }));
}

function palystate(a) {
    var i = a;
    playaudio.paused && (playaudio.play(), i.setData({
        palyeranima: "-webkit-animation:zhuan 2s linear infinite"
    }));
}

function playstop(a) {
    var i = a;
    playaudio.pause(), i.setData({
        palyeranima: ""
    });
}

module.exports = {
    play_music: play_music,
    playmusiced: playmusiced,
    playstop: playstop,
    palystate: palystate
};