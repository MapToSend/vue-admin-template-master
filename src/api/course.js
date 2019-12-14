import request from '@/utils/request'

export default {
  /**
   * 条件分页查询老师api
   * @param page
   * @param limit
   * @param objCondition
   */
  queryCoursePageList(page, limit, queryconditon) {
    return request({
      url: '/eduservice/course/queryCondition/' + page + "/" + limit,
      method: 'post',
      params:{
        queryconditon:queryconditon
      },
    })
  },

  /**
   * 删除课程
   */
  deleteCourse(courseId) {
    return request({
      url: '/eduservice/course/delete/'+courseId,
      method: 'get',
    })

  },


  /**
   * 更新课程基本信息
   */
  updateCourse(courseInfo, id) {
    return request({
      url: '/eduservice/course/update?id='+id,
      method: 'post',
      data:courseInfo

    })

  },

  /**
   * 获取老师下拉框数据
   */
  queryTeacherName() {

    return request({
      url: '/eduservice/course/queryTeacher',
      method: 'get',

    })
  },
  /**
   * 获取老师下拉框数据
   */
  querySubject_1() {

    return request({
      url: '/eduservice/course/querySubject',
      method: 'get',

    })
  },


  /**
   * 课程数据提交
   */

  saveCourse(courseInfo) {

    return request({
      url: '/eduservice/course/saveCourse',
      data: courseInfo,
      method: "post"
    })

  },

  /**
   * 获取信息回显
   */

  getCourse(redis_key) {

    return request({
      url: '/eduservice/course/getCourse?redis_key=' + redis_key,
      method: "post"
    })

  }
}

