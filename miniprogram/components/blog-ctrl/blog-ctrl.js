// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },
  externalClasses:['icon-fenxiang', 'icon-pinglun', 'iconfont'],

  /**
   * 组件的初始数据
   */
  data: {
    //登录组件是否显示
    loginShow: false,
    //底部弹出层是否显示
    modalShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
       // 推送模板消息
       wx.requestSubscribeMessage({
        tmplIds: ['VrZKkwbq6JPSee-A-zQwp_crdNfKQSJdphR0cM16gG8'],
        success: (res) => {
          console.log(res);
          wx.getSetting({
            withSubscriptions: true,
            success:(res) => {
              console.log(res);
              if(res.authSetting['scope.userInfo']){
                wx.getUserInfo({
                  success:(res) => {
                    userInfo = res.userInfo
                    // 显示评论弹出层
                    this.setData({
                      modalShow: true
                    })
                    
                  }
                })
              } else {
                this.setData({
                  loginShow: true
                })
              }
            }
          })
        }
      })
      
    },

    onLoginSuccess(event) {
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    onLoginFail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: ''
      })
    },
    onSend(event) {
      console.log(event);
      // 评论信息插入数据库
      // let formId = event.detail.formId
      let content = this.data.content
      // console.log(content,'123');
      if(content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: ''
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {

        // 推送模板消息
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            content,
            blogId: this.properties.blogId,
          }
        }).then(res => {
          console.log(res);
        })

        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: ''
        })
        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })

    },
    onInput(event) {
      // console.log(event);
      this.setData({
        content: event.detail.value
      })
    }
  }
})
