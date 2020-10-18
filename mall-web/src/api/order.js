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
        data:{
            orderCode:orderCode
        }
    })
}

export function findOrderList(data) {
    return request({
        url: '/order/findOrderList',
        method: 'post',
        data:data
    })
}

