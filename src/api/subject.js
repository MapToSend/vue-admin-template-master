import request from '@/utils/request'

export default {

  /**
   * 获取课程数据
   */
  querySubjectTree() {
    return request({
      url:"/eduservice/subject/list",
      method:"get",
    })
  },
  /**
   * 删除课程
   * @param title
   */
  deleteSubject(title) {
    return request({
      url:"/eduservice/subject/delete?title="+title,
      method:"get",
    })
  },

  /**
   * 添加课程
   * @param title
   */
  saveOneSubject(subject){
    return request({
      url:"/eduservice/subject/save",
      method:"get",
      params:subject
    })
  },


}
