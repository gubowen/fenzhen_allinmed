<template>
  <figure class="messageList-item-content">
    <!--患者头像-->
    <figure class="messageList-item-img">
      <img :src="$store.state.currentItem.logoUrl" alt="" >
    </figure>
    <!--图片-->
    <figcaption class="messageList-item-text" :class="{'make-photo-box':exifFlag}">
      <img :src="message.file.url" alt="" style="width:300px" @click="showBigImgFunction(message.file.url)" ref="imageElement"/>
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
   import EXIF from "exif-js";
   import imageEXIF from "@/base/imageRotate";
  export default{
    data(){
      return {
          exifFlag:false
      }
    },
    mounted(){
        this.removeBaseImageMsg(this.message.file.url);
        this.installSBIList();
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
      },
        removeBaseImageMsg(url){
            this.message.file.url=this.nim.viewImageStripMeta({
                url: url,
                strip: true
            });
        },
        installSBIList(){
            let ImageList = [];
            if(this.$store.state.SBIObject != ''&& this.$store.state.SBIObject.IMImage){
                this.$store.state.SBIObject.IMImage.forEach(function(item,index){
                    ImageList.push( {"url":item.url});
                })
            }
            ImageList.push( {"url":this.message.file.url});
            this.$store.commit('setSBIObject',{'IMImage':ImageList});
        }
    },
    props: {
      message:{
            type:Object
        },
        nim:{
          type:Object
        }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
.make-photo-box{
  transform:rotate(90deg) translate(12%,12%);
}
</style>
