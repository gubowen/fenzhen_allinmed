<template>
  <article>
    <figure class="messageList-item-content" style="margin-bottom: 40px;">
      <!--文字-->
      <figcaption class="messageList-item-text" >
        非常抱歉，由于缺少重要的检查资料，暂时无法做出诊断。建议您尽快进行以下检查，并上传检查资料，唯医骨科将继续为您咨询。
      </figcaption>
      <!--医生头像-->
      <figure v-if="message.from == '1_doctor00001'" class="messageList-item-img">
        <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
      </figure>
    </figure>
    <figure class="messageList-item-content">
      <!--检查检验-->
      <figcaption class="check-suggestion-message">
        <header class="check-suggestion-message-title">检查/检验建议</header>
        <section class="check-suggestion-content">
          <article class="check-suggestion-item" v-for="checks  in message.content.data" v-if="message.content.data.length">
            <span>{{checks.adviceName}}</span>
          </article>
          <article class="check-suggestion-item" v-if="!message.content.data.length">
            <span>{{message.content.data.adviceName}}</span>
          </article>
        </section>
      </figcaption>
      <figure class="messageList-item-img">
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
    props: {
        message:{
            type:Object
        }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
