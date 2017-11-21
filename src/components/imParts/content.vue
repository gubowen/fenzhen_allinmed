<template>
  <article>
    <figure class="messageList-item-content">
      <!--患者头像-->
      <figure v-if="message.from != '1_doctor00001'" class="messageList-item-img">
        <img :src="$store.state.currentItem.logoUrl" alt="">
      </figure>
      <!--文字-->
      <figcaption class="messageList-item-text" v-if="message.type == 'text'&&(message.text!=='患者已上传检查资料'&&message.text!=='患者已上传视诊资料')">
        <p class="resendTips" @click="resendMsg" v-if="message.status==='fail'">!</p>
        <!--<p class="resendTips" @click="resendMsg" >!</p>-->
        {{message.text}}
      </figcaption>
      <figcaption class="messageList-item-text" v-if="message.type == 'text'&&message.text==='患者已上传检查资料'">
        {{message.text + "，点击至"}}
        <a href="#" class="link" @click="goToCheck">“专科检查”</a>
        查看

      </figcaption>
      <figcaption class="messageList-item-text" v-if="message.type == 'text'&&message.text==='患者已上传视诊资料'">
        {{message.text + "，点击至"}}
        <a href="#" class="link" @click="goToCheck">“专科检查”</a>
        查看。若视频上传中，请稍后再次点击查看。
      </figcaption>
      <!--医生头像-->
      <figure v-if="message.from == '1_doctor00001'" class="messageList-item-img">
        <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
      </figure>
    </figure>
  </article>


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

    },
    methods: {
      goToCheck(){
        this.$router.push({
          path: "/home/majorCheck/",
          params: {
              num: JSON.stringify(this.$store.state.currentItem)
          }
        })
      },
      resendMsg(){
         this.$store.commit("setResendMsgInfo",this.message);
        }
    },
    props: {
      message: {
        type: Object
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
.resendTips{
    width:15px;
    height:15px;
    background: red;
    color:#fff;
    border-radius: 50%;
    display: inline-block;
    margin-right:10px;
    text-align: center;
    line-height: 15px;
    cursor: pointer;
}
</style>
