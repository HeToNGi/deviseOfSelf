import request from "@/utils/request"

export function orderSure(data) {
  return request({
    url: '/medicine/client/order/create',
    method: 'post',
    data
  })
}

export function orderPay(orderCode) {
  return request({
    url: '/medicine/client/order/pay',
    method: 'post',
    data: orderCode
  })
}

export function findOrderList(data) {
  return request({
    url: '/users/client/users/order/list',
    method: 'post',
    data: data
  })
}

