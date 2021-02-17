// components/lyric/lyric.js
let lyricHeight = 0  //当前歌词的高度
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric:String
  },
  observers: {
    lyric(lrc) {
      console.log(lrc);
      if(lrc == "暂无歌词") {
        this.setData({  
          lrcList: [
            {
              lrc,
              time: 0
            }
          ],
          nowLyricIndex: -1
        })
      }else {
        this._parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],
    nowLyricIndex:0 ,//当前选中歌词索引
    scrollTop: 0, // 滚动条滚动高度
  },
  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (res) => {
          // 求出 1rpx 的大小
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime) {
      // console.log(currentTime);
      let lrcList = this.data.lrcList
      if(lrcList.length == 0) {
        return
      }
      if(currentTime > lrcList[lrcList.length -1 ].time ) {
        if(this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }
      for(let i = 0, len = lrcList.length; i < len; i++) {
        if(currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight  
          })
          break
        }
      }
    },
    _parseLyric(slyric) {
      let line = slyric.split('\n')
      let _lrclist = []
      line.forEach(ele => {
        let time = ele.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time != null) {
          let lrc = ele.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          //把时间转换成秒
          let timeSeconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          console.log('timeSeconds',timeSeconds);
          _lrclist.push({
            lrc,
            time: timeSeconds
          })
        } 
      })
      this.setData({
        lrcList: _lrclist
      })
    }
  }
})
