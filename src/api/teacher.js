import request from '@/utils/request'

export default {

  /**
   * 条件分页查询老师api
   * @param page
   * @param limit
   * @param objCondition
   */
  queryTeacherPageList(page, limit, objCondition) {
    return request({
      url: '/eduservice/teacher/queryCondition/' + page + "/" + limit,
      method: 'post',
      data: objCondition  // json格式传值
      // params  键值对格式参数
    })
  },
  /**
   * 逻辑删除老师api
   *
   * @param id
   */
  deleteTeacherById(id) {
    return request({
      url: '/eduservice/teacher/delete/' + id,
      method: 'post',

    })
  },

  /**
   * 添加老师
   * @param teacher
   */
  save(teacher) {

    return request({
      url: "/eduservice/teacher/save",
      method: "post",
      data: teacher
    })
  },

  /**
   * 根据id查询讲师
   * @param id
   */
  queryTeacherById(id) {

    return request({
      url: '/eduservice/teacher/query/' + id,
      method: "get"
    })
  },

  /**
   *更新讲师信息
   */
  updateTeacher(teacher) {

    return request({
      url: '/eduservice/teacher/update',
      method: "post",
      data:teacher
    })
  }

}
