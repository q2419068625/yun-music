// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
    console.log(event);
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      templateId: "VrZKkwbq6JPSee-A-zQwp_crdNfKQSJdphR0cM16gG8",
      page:`/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      data:{
        phrase1: {
          value: '评价完成',
        },
        thing2: {
          value: event.content
        }
      }
    })
  
  return result
}