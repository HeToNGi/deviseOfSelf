import request from "@/utils/request"

// 添加购物车
export function addCart(data) {
    return request({
        url: '/medicine/client/cart/addCart',
        method: 'post',
        data: {
            sku: data.selectedSkuComb.id,
            quantity: data.selectedNum
        }
    })
}

export function addCartNum(sku, quantity) {
    return request({
        url: '/medicine/client/cart/cartNum',
        method: 'post',
        data: {
            sku: sku,
            quantity: quantity
        }
    })
}


export function deleteCart(sku) {
    return request({
        url: '/medicine/client/cart/deleteCart',
        method: 'post',
        data: {
            sku: sku
        }
    })
}


// 查询购物车
export function findCart() {
    return request({
        url: '/medicine/client/cart/list',
        method: 'post',
    })
}
