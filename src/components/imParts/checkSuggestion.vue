<template>
  <article>
    <figure class="messageList-item-content" style="margin-bottom: 30px;float: none;">
      <!--文字-->
      <figcaption class="messageList-item-text">
        为了给您提供更专业的服务，建议您进行如下检查，并上传检查资料。
      </figcaption>
      <!--医生头像-->
      <figure class="messageList-item-img">
        <div class="messageList-item-nameTop">
          <p>{{ '【分诊医生】'+docName}}</p>
        </div>
        <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
        <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
      </figure>
    </figure>

    <figure class="messageList-item-content">
      <!--检查检验-->
      <figcaption class="check-suggestion-message">
        <header class="check-suggestion-message-title" style="height:auto;padding-right: 15px;font-size:14px">
          <span style="text-indent: 24px;display:inline-block;">检查/检验建议：</span>
          <span class="checkTestItems" v-for="checks  in message.content.data" v-if="message.content.data.length">{{checks.adviceName}}</span>
        </header>
        <!--<section class="check-suggestion-content">-->
          <!--<article class="check-suggestion-item" v-for="checks  in message.content.data" v-if="message.content.data.length">-->
            <!--<span>{{checks.adviceName}}</span>-->
          <!--</article>-->
          <!--<article class="check-suggestion-item" v-if="!message.content.data.length">-->
            <!--<span>{{message.content.data.adviceName}}</span>-->
          <!--</article>-->
        <!--</section>-->
      </figcaption>
      <figure class="messageList-item-img">
        <div class="messageList-item-nameTop">
          <p>{{ '【分诊医生】'+docName}}</p>
        </div>
        <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
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
export default {
  data() {
    return {};
  },
  mounted() {
    
  },
  computed: {
    docName() {
      return this.message.custom && JSON.parse(this.message.custom).docName
        ? JSON.parse(this.message.custom).docName
        : this.$store.state.userName;
    }
  },
  methods:{
    deleteMsg(){
        this.$store.commit("setDeleteMsgInfo",this.message);
    }
  },
  props: {
    message: {
      type: Object
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.checkTestItems {
  &:not(:last-child):after {
    content: " | ";
    display: inline-block;
  }
}
</style>
