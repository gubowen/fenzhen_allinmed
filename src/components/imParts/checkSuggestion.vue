<template>
  <article>
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
