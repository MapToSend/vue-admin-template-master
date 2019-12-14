import request from '@/utils/request'

export default {

  deleteAliyunVideo(videoId){
    return request({
      url: "/videoService/vod//delete/"+videoId,
      method: "get"
    })

  },





  addviDeo(redis_key, video, chapterId) {

    return request({
      url: "/eduservice/video/add?redis_key=" + redis_key + "&chapterId=" + chapterId,
      data: video,
      method: "post"
    })
  },

  deleteVideo_web(redis_key, videoId) {
    return request({
      url: "/eduservice/video/delete",
      params: {
        redis_key: redis_key,
        videoId: videoId
      },
      method: "get"
    })
  },

  updateVideo_web(redis_key, video,chapterId) {
    return request({
      url: "/eduservice/video/update?redis_key=" + redis_key+ "&chapterId=" + chapterId,
      data: video,
      method: "post"
    })
  }
}


