<template>

  <article class="messageList-item-content" style="cursor: pointer;" @click.stop="updateShow">
    <!--初诊建议-->
    <figcaption class="check-suggestion-message">
      <header class="check-suggestion-message-title">初诊建议</header>
      <section class="preview-suggestion-content" data-id="1503473276490">
        <figure class="preview-suggestion-img">
          <img src="../../assets/img00/index/dialog_report.png" alt=""></figure>
        <figcaption class="preview-suggestion-content-text" v-for="suggestions in message.content.data" v-if="message.content.data.length">
          <header class="preview-suggestion-title"> {{suggestions.patientName + suggestions.createTime}}</header>
          <p class="preview-suggestion-result">
            初诊：{{suggestions.illnessName.length > 0 ? suggestions.illnessName : "暂不确定" }}
          </p>
          <p class="preview-suggestion-result" v-if="suggestions.docNames&&suggestions.docNames.length > 0" style="line-height: 1.7;">
            推荐医生:<br/>
            <span v-for="item in suggestions.docNames" style="display: block">
              <span>{{item.fullName}}</span>
              <span>【{{item.medicalTitle}}】</span><br/>
              <span>{{item.company}}</span>
            </span>
          </p>
        </figcaption>
        <figcaption class="preview-suggestion-content-text" v-if="!message.content.data.length">
          <header class="preview-suggestion-title"> {{message.content.data.patientName + message.content.data.createTime}}</header>
          <p class="preview-suggestion-result">
            初诊：{{message.content.data.illnessName.length > 0 ? message.content.data.illnessName : "暂不确定" }}
          </p>
          <p class="preview-suggestion-result" v-if="message.content.data.docNames&&message.content.data.docNames.length>0" style="line-height: 1.5;">
            推荐医生<br/>
            <span v-for="item in message.content.data.docNames" style="display: block">
              <span>{{item.fullName}}</span>
              <span>【{{item.medicalTitle}}】</span><br/>
              <span>{{item.company}}</span>
            </span>
          </p>
        </figcaption>
      </section>
    </figcaption>
    <figure class="messageList-item-img">
      <div class="messageList-item-nameTop">
        <p>{{ '【分诊医生】'+docName}}</p>
      </div>
      <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
      <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
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
import store from "@/store/store";
export default {
  data() {
    return {};
  },
  mounted() {},
  computed: {
    docName() {
      return JSON.parse(this.message.custom).docName
        ? JSON.parse(this.message.custom).docName
        : this.$store.state.userName;
    }
  },
  methods: {
    updateShow() {
      store.commit("setPreviewType", 2);
      store.commit(
        "setPreviewId",
        this.message.content.data.length
          ? this.message.content.data[0].diagnosisId
          : this.message.content.data.diagnosisId
      );
      store.commit("setPreviewShow", true);
    },
    deleteMsg(){
        this.$store.commit("setDeleteMsgInfo",this.message);
    }
  },
  props: {
    message: {
      type: Object
    },
    diagnosisShow: {
      type: Boolean
    },
    diagnosisId: {
      type: Number
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
