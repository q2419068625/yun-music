// components/propress-bar/propress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManger = wx.getBackgroundAudioManager()
//当前的秒数
let currentSec = -1
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime:"00:00",
      totalTime:"00:00"
    },
    movableDis:0,
    progress: 0
  },
  lifetimes:{
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        // console.log(rect);
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth,movableViewWidth);
      })
    },
    _bindBGMEvent() {
      backgroundAudioManger.onPlay(() => {
        console.log('onPlay');
      })

      backgroundAudioManger.onStop(() => {
        console.log('onStop');
      })

      backgroundAudioManger.onPause(() => {
        console.log('onPause');
      })

      backgroundAudioManger.onWaiting(() => {
        console.log('onWaiting');
      })

      backgroundAudioManger.onCanplay(() => {
        console.log('onCanplay');
        if(typeof backgroundAudioManger.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backgroundAudioManger.onTimeUpdate(() => {
        console.log('onTimeUpdate');
        const currentTime = backgroundAudioManger.currentTime
        const duration = backgroundAudioManger.duration
        const sec = currentTime.toString().split('.')[0]
        if(sec != currentSec) {
          console.log(currentTime);
          const currentTimeFmt = this._dataFormat(currentTime)
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
          })
          currentSec = sec
        }
        
      })

      backgroundAudioManger.onEnded(() => {
        console.log('onEnded');
      })

      backgroundAudioManger.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },
    _setTime() {
      const duration = backgroundAudioManger.duration
      console.log(duration);
      const durationFmt = this._dataFormat(duration)
      console.log(durationFmt);
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    _dataFormat(sec) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    //补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})
