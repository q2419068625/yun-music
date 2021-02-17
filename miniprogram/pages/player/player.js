// pages/player/player.js
let musiclist = []
//正在播放歌曲的index
let nowPlayingIndex = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManger = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, //false 表示不播放， true表示正在播放
    isLyricShow: false,  //表示当前歌曲是否显示
    lyric:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicid)


  },

  _loadMusicDetail(musicId) {
    backgroundAudioManger.stop()
    let music = musiclist[nowPlayingIndex]
    console.log(music);
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying:false
    })
    wx.showLoading({
      title: '歌曲加载中',
    })

    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'musicUrl'
      }
    }).then(res => {
      console.log(JSON.parse(res.result));
      let result = JSON.parse(res.result)
      backgroundAudioManger.src = result.data[0].url
      backgroundAudioManger.title = music.name
      backgroundAudioManger.coverImgUrl = music.al.picUrl
      backgroundAudioManger.singer = music.ar[0].name
      backgroundAudioManger.epname = music.al.name

      this.setData({
        isPlaying: true
      })
      wx.hideLoading()

      // 加载歌词
      wx.cloud.callFunction({
        name:'music',
        data: {
          musicId,
          $url:'lyric'
        }
      }).then(res => {
        console.log(res);
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if(lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })

  },
  togglePlaying() {
    //正在播放
    if(this.data.isPlaying) {
      backgroundAudioManger.pause()
    }else {
      backgroundAudioManger.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  //上一首
  onPrev() {
    nowPlayingIndex--
    if(nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  //下一首
  onNext() {
    nowPlayingIndex++
    if(nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  //控制歌词显示
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  // 歌词联动
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  }
})