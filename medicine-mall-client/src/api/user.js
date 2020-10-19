import request from "@/utils/request"

export function personCenter(data) {
  return request({
    url: '/users/client/user/center',
    method: 'post',
    data
  })
}
