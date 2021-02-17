// components/lyric/lyric.js
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
      this._parseLyric(lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrclist:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(slyric) {
      let line = slyric.split('\n')
      let _lrclist = []
      line.forEach(ele => {
        let time = ele.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time != null) {
          let lrc = ele.split(time)[1]
          let timeReg = time[0].match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
          //把时间转换成秒
          let timeSeconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrclist.push({
            lrc,
            time: timeSeconds
          })
        } 
      })
      this.setData({
        lrclist: _lrclist
      })
    }
  }
})
