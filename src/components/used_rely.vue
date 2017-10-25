<template>
  <section class="jump-box used_reply show">
    <header class="jump-box-header">
      <h3>常用回复</h3>
    </header>
    <section class="jump-box-viewers viewInner">
      <section class="jump-box-viewers-item viewItem" data-role="fr-tabs-1">
        <ul class="jump-box-list" id="ev-used-reply-box">
          <li class="jump-box-list-item" v-for="item in replyList" @click.stop="$store.state.usedReplyContent=item.replyContent">
            <span>{{item.replyContent}}</span>
          </li>
        </ul>
      </section>
    </section>
    <button class="jump-box-config-button icon-fast-reply-config used_reply_config_show"
            @click="$store.state.usedReplyConfig=true">
      <span>编辑常用回复</span>
    </button>
  </section>
</template>
<script>
  import ajax from "@/common/js/ajax";
  import store from "@/store/store";
  const XHRList = {
    usedList: "/call/customer/comm/reply/v1/getMapList/",
    update: "/call/customer/comm/reply/v1/save/"
  };
  export default{
    data(){
      return {
        replyList: []
      }
    },
    watch: {
      "$store.state.usedReplyConfig"(status){
        if (!status) {
          this.getReplyList();
        }
      }
    },
    mounted(){
      this.getReplyList();
    },
    methods: {
      getReplyList(){
        let that = this;
        store.commit("startLoading")
        ajax({
          url: XHRList.usedList,
          method: "POST",
          data: {
            customerId: this.$store.state.userId,
            isValid: "1",
            firstResult: "0",
            maxResult: "9999"
          },
          done(data){
            if (data.responseObject.responseData) {
              store.commit("stopLoading")
              let dataList = data.responseObject.responseData.dataList;
              if (dataList && dataList.length !== 0) {
                that.replyList = dataList.reverse();
              }
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  @import "../scss/base.scss";

  .jump-box {
    width: 800px;
    box-shadow: 0px 0px 40px 0px rgba(153, 167, 208, 0.35);
    border-radius: 4px 4px 4px 4px;
    position: absolute;
    bottom: 225px;
    left: 20px;
    background-color: #fff;
    z-index: 5;
    transform: scale(0);
    transform-origin: 60px 100%;
    transition: all 0.2s linear;
    &.show {
      transform: scale(1);
    }
    &:after {
      content: '';
      position: absolute;
      @include triangle(20px, #fff, down);
      margin-left: 60px;
    }
    &-header {
      text-align: center;
      width: 100%;
      background: #D9DFEC;
      padding: 20px 0;
      .jump-box-search {
        width: 372px;
        background-color: #fff;
        height: 32px;
        padding-left: 14px;
        border-radius: 4px;
      }
    }
  }

  .jump-box-tabs {
    @include clearfix();
    padding: 24px 55px;
    box-sizing: border-box;
    text-align: left;
    position: relative;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    .jump-box-tabs-controller {
      font-size: 14px;
      cursor: pointer;
      z-index: 2;
    }
    .jump-box-prev {
      position: absolute;
      line-height: 0;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 56px;
      height: 40px;
      background-color: #fff;
    }
    .jump-box-next {
      position: absolute;
      right: 0;
      line-height: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 56px;
      height: 40px;
      background-color: #fff;
    }
    .jump-box-tabs-item {
      padding: 0 22px;
      background-color: #f7f7f8;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      margin-right: 30px;
      box-sizing: border-box;
      color: #555;
      cursor: pointer;
      &.active {
        background: #7A8EC1;
        color: #fff;
      }
    }
  }

  .jump-box-viewers {
    padding-left: 55px;
    margin-top: 2px;
    min-height: 340px;
    overflow: hidden;
  }

  .jump-box-list {
    font-size: 16px;
    overflow: auto;
    max-height: 205px;
    margin-left: -14px;
    &-item {
      margin: 22px 0;
      cursor: pointer;
      //margin-left: -9px;
      color: #555;
      padding-right: 55px;
      &:hover {
        color: #222;
        &:before {
          background: #0FC2B4;
        }
      }
      & > span {
        vertical-align: middle;
        -ms-word-break: break-all;
        word-break: break-all;
      }
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        @include circle(6px, #eceff6);
        margin-right: 9px;
      }
    }
  }

  .jump-box-config-button {
    padding: 8px 15px;
    background: #F9F9F9;
    border-radius: 4px;
    color: #909090;
    position: absolute;
    cursor: pointer;
    right: 40px;
    bottom: 40px;
    & > span {
      margin-left: 9px;
    }
  }

  .used_reply {
    left: 12%;
  }

  .jump-box-header {
    & > h3 {
      font-size: 18px;
      color: #222222;
      font-weight: normal;
    }
  }

  .used-reply-config {
    .jump-box-member-input {
      width: 77%;
    }
    .jump-box-term {
      margin: 22px 0;
    }
  }

</style>
