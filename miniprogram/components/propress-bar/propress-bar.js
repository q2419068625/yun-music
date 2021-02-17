// components/propress-bar/propress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManger = wx.getBackgroundAudioManager()
let currentSec = -1 //当前的秒数
let duration = 0 //当前歌曲的总时长
let isMoving = false // 表示当前进度条是否拖拽, 解决：当进度条拖到时候updatetime事件冲突
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
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
      if(this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // console.log(event);
      if(event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth ) * 100,
        this.data.movableDis = event.detail.x
        isMoving = true
      }

    },
    onTouchEnd() {
      const currentTimeFmt = this._dataFormat(Math.floor(backgroundAudioManger.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      backgroundAudioManger.seek(duration * this.data.progress / 100)
      isMoving = false
    },
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
        isMoving = false
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManger.onStop(() => {
        console.log('onStop');
        
      })

      backgroundAudioManger.onPause(() => {
        console.log('onPause');
        this.triggerEvent('musicPause')
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
        if(!isMoving) {
          const currentTime = backgroundAudioManger.currentTime
          const duration = backgroundAudioManger.duration
          const sec = currentTime.toString().split('.')[0]
          if(sec != currentSec) {
            // console.log(currentTime);
            const currentTimeFmt = this._dataFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentSec = sec
            // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            })
          }
        }
        
      })

      backgroundAudioManger.onEnded(() => {
        console.log('onEnded');
        this.triggerEvent('musicEnd')
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
      duration = backgroundAudioManger.duration
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
