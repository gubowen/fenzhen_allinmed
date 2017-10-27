<template>
  <figure class="messageList-item-content">
    <!--患者头像-->
    <figure class="messageList-item-img">
      <img :src="$store.state.currentItem.logoUrl" alt="">
    </figure>
    <!--图片-->
    <figcaption class="messageList-item-text">
      <img :src="message.file.url" alt="" style="width:300px" @click="showBigImgFunction(message.file.url)"/>
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
            this.$store.state.SBIObject.IMImage.forEach(function(item,index){
                ImageList.push( {"url":item.url});
            })
        }
        ImageList.push( {"url":this.message.file.url});
        this.$store.commit('setSBIObject',{'IMImage':ImageList});
        //console.log(this.message);
    },
    methods:{
      showBigImgFunction(message){
          let _this = this;

          this.$store.state.SBIObject.IMImage.forEach(function(item,index){
              if(message == item.url){
                  _this.$store.commit("setSBIIndex",index);
              }
          });
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
