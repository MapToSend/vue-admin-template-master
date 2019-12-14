import request from '@/utils/request'

export default {
  /**
   *
   * @param type
   * @param begin
   * @param end
   */
  query_web(type, begin, end) {
    return request({
      url: '/staservice/daily/queryDaily',
      method: 'post',
      params:{
        type:type,
        begin:begin,
        end:end,
      },
    })
  },


}

