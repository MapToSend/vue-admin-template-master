import request from '@/utils/request'

export default {

  addChaper(redis_key, title,sort) {

    return request({
      url: "/eduservice/chapter/add",
      params: {
        title:title,
        sort:sort,
        redis_key:redis_key
      },
      method: "post"
    })
  },

  getSubjectId(redis_key) {

    return request({
      url: "/eduservice/chapter/getSubject",
      params: {
        redis_key:redis_key
      },
      method: "get"
    })
  },
  /**
   * 获取课程章节
   * @param redis_key
   */
  getChapter(redis_key) {

    return request({
      url: "/eduservice/chapter/getChapter",
      params: {
        redis_key:redis_key
      },
      method: "get"
    })
  },

  /**
   * 删除章节
   * @param redis_key
   * @param chapterId
   */
  deleteChapter_web(redis_key,chapterId) {

    return request({
      url: "/eduservice/chapter/delete",
      params: {
        redis_key:redis_key,
        chapterId:chapterId
      },
      method: "post"
    })


  },

  updateChapter_web(redis_key,title,sort,id){
    return request({
      url: "/eduservice/chapter/update",
      params: {
        title:title,
        sort:sort,
        redis_key:redis_key,
        id:id
      },
      method: "post"
    })


  }
}


