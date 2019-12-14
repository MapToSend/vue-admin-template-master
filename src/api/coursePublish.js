import request from '@/utils/request'

export default {

  /**
   *
   * @param redis_key
   */
  getChapterInfo_web(redis_key) {

    return request({
      url: "/eduservice/chapter/get",
      params: {
        redis_key:redis_key
      },
      method: "get"
    })
  },


  submitChapter(redis_key) {

    return request({
      url: "/eduservice/chapter/save",
      params: {
        redis_key:redis_key
      },
      method: "get"
    })
  },

}


