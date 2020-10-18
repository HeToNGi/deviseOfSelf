<template>
  <div class="navLink-class">
    <div :class='(buttonList.type == "2" ? "cap-image-ad__image-nav" : "cap-image-ad__slide cap-image-ad__text-nav nav-link")'
         :style='"overflow-x:hidden; background-color:"+buttonList.backgroundcolor'>
        <div  v-for="(item,index)  in buttonList" :key="index"
             class="image-wrapper" :style="'width:'+ width+'%; margin-right: 0px;'">
            <router-link  to="/goods/detail" class="cap-image-ad__link cap-image-ad__link--image-nav"
               >
                <div class="cap-image-ad__image">
                    <img :src="item.url" style="width: 100%; "/>
                </div>
            </router-link>
        </div>
    </div>
  </div>
</template>

<script>

    export default {
        props: {
            data: Object
        },
        data() {
            return {
                buttonList: [],
                height: 0,
                width:20
            }
        },
        created: function () {
             
        }
    }
</script>

<style>
    .nav-link{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .navLink-class{
      background: #FFFFFF;
    }
</style>
