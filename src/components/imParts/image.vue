<template>
  <figure class="messageList-item-content">
    <!--患者头像-->
    <figure class="messageList-item-img">
      <img :src="$store.state.currentItem.logoUrl" alt="">
    </figure>
    <!--图片-->
    <figcaption class="messageList-item-text">
      <img :src="message.file.url" alt="" style="width:300px" @click="showBigImgFunction()"/>
    </figcaption>
  </figure>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Qiangkailiang on 17/10/23.
   */
  export default{
    data(){
      return {}
    },
    mounted(){
        let ImageList = [];
        if(this.$store.state.SBIObject != ''&& this.$store.state.SBIObject.IMImage){
          ImageList.push( {"url":this.$store.state.SBIObject.IMImage});
        }
        ImageList.push( {"url":this.message.file.url});
        this.$store.commit('setSBIObject',{'IMImage':ImageList});
        //console.log(this.message);
    },
    methods:{
      showBigImgFunction(){
          this.$store.commit("setSBIFlag",true);
          this.$store.commit("setSBIType",'IMImage');
      }
    },
    props: {
      message:{
            type:Object
        }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
