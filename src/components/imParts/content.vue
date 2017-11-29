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
        <div class="messageList-item-nameTop">
          <p>{{ '【分诊医生】'+docName}}</p>
        </div>
        <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
        <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
      </figure>
      <!--<figure v-if="message.from == '1_doctor00001'" class="messageList-item-name">-->
        <!--<p> 分诊医生</p>-->
        <!--<p>{{$store.state.userName}}</p>-->
      <!--</figure>-->
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
    computed:{
      docName(){
          return this.message.custom && JSON.parse(this.message.custom).docName
              ? JSON.parse(this.message.custom).docName
              : this.$store.state.userName;
      }
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
        },
      deleteMsg(){
          this.$store.commit("setDeleteMsgInfo",this.message);
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
  .messageList-item-name{
    line-height: 35px;
    display: inline-block;
    font-size: 14px;
    height:30px;
    margin-left:5px;
    text-align: left;
    background: #00D6C6;
    border-radius: 4px;
    color: #fff;
    padding:2px 5px;
    p{
    line-height: 15px;
    height:15px;
      color:#eee;
      &:last-child{
        color:#fff;
      }
    }
  }


</style>
