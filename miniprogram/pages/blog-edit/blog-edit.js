 //输入文字最大的个数
const MAX_WORDS_NUM = 140  
const MAX_IMG_NUM = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,  //输入文字个数
    footerBottom: 0, // 距离底部的距离
    images: [],
    selectPhoto: true,  //添加图片的加号是否显示
  },
  onInput(event) {
    console.log(event);
    let wordsNum = event.detail.value.length
    if(wordsNum >= MAX_WORDS_NUM) {
        wordsNum = `最大字数为${MAX_WORDS_NUM}`   
    }
    this.setData({
      wordsNum
    })
  },
  onFocus(event) {
    // 模拟器获取键盘高度为0
    console.log(event);
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom:0
    })
  },
  //选择图片
  onChooseImage() {
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType:['compressed','original'],
      sourceType:['album','camera'],
      success:(res) => {
        console.log(res);
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        //
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      }
    })
  },
  // 删除图片
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if(this.data.images.length == MAX_IMG_NUM -1) {
      this.setData({
        selectPhoto: true
      })
    }
  },
  // 预览图片
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },
  // 发布功能
  send() {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})