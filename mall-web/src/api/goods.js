import request from "@/utils/request"

// 获取商品列表
export function goodsListApi(data){
    return request({
        url: '/medicine/client/goods/list',
        method: 'post',
        data
      })
}
// 获取商品详情
export function goodsDetail(productId){
  return request({
      url: '/medicine/client/goods/detail',
      method: 'post',
      data:{ productId }
  })
}
// 获取商品规格
export function goodsRule(productId){
   return request({
      url: '/medicine/client/goods/detail/category',
      method: 'post',
      data:{ productId }
  })
}