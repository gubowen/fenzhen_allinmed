<template>
  <section class="modal-confirm show">
    <article class="modal-confirm-content">
      <p>{{comfirmContent}}</p>
    </article>
    <figure class="modal-confirm-button">
      <button class="btn-ensure modal-confirm-ensure" @click="ensure">确定</button>
      <button class="btn-primary modal-confirm-cancel" @click="cancel">取消</button>
    </figure>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Qiangkailiang on 17/10/22.
   */
  export default{
    data(){
      return {}
    },
    mounted(){

    },
    methods:{
       ensure(){
           this.$emit("ensureCallback");
       },
      cancel(){
           this.$emit("cancelCallback");
      }
    },
    props: {
        comfirmContent:{
            type:String
        }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "./scss/base.scss";
  .modal-confirm {
    position: absolute;
    width: 250px;
    top: 50%;
    left: 50%;
    background: #FFFFFF;
    box-shadow: 0px 0px 20px 0px rgba(153, 167, 208, 0.35);
    border-radius: 4px;
    padding: 40px 20px;
    padding-bottom: 20px;
    min-height: 155px;
    box-sizing: border-box;
    z-index: 5;
    opacity: 0;
    transition: all 0.2s linear;
    &.show {
      opacity: 1;
    }
    &.upShow {
      bottom: 60px;
      top: auto;
    }
    &.upShow:after {
      top:auto;
      bottom: -10px;
      @include triangle(10px, #fff, down);
    }

    &:after {
      content: '';
      display: block;
      @include triangle(10px, #fff, up);
      position: absolute;
      top: -10px;
      right: 10px;

    }
    &-content {
      p {
        font-size: 13px;
        color: #808080;
        line-height: 1.5;

      }
    }
    .modal-confirm-button {
      text-align: center;
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      text-align: center;
      & > button {
        margin: 0 10px;
        width: 58px;
        height: 24px;
        font-size: 12px;
        border-radius: 3px;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
      }
      .modal-confirm-ensure {
        border: 1px solid #7A8EC1;
        color: #7a8ec1;

      }
      .modal-confirm-cancel {

      }
    }
  }

  .middle-tip-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    .middle-tip-box-text {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -25px;
      margin-top: -25px;
      overflow: hidden;
      animation: rotate 1s linear forwards infinite;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }

  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg)
    }
  }

  .middle-tip-modal {
    &.popup-tips {
      opacity: 0.9;
      background: #000000;
      border-radius: 8px;
      @include square(120px);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;

      }
      .middle-tip-box-text {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        font-size: 16px;
        color: #FFFFFF;
        & > img {
          width: 50px;
          height: 50px;
          vertical-align: top;
          margin-bottom: 14px;
        }
      }
    }
  }

  .big-confirm {
    text-align: center;
    opacity: 0;
    transition: all 0.2s linear;
    &.show {
      opacity: 1;
    }
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
    .big-confirm-inner {
      display: inline-block;
      vertical-align: middle;
      background-color: #fff;
      border-radius: 4px;
      width: 550px;
      height: 300px;
    }
    .big-confirm-title {
      background: #D9DFEC;
      border-radius: 4px 4px 0 0;
      width: 100%;
      height: 40px;
      position: relative;
      & > h4 {
        font-weight: normal;
        font-size: 14px;
        color: #222222;
        height: 100%;
        line-height: 40px;
      }
      .window-close {
        position: absolute;
        right: 0;
        top: 0;
        margin-right: -34px;
        cursor: pointer;
      }
    }
    .big-confirm-content {
      margin-top: 90px;
      text-align: center;
      & > p {
        font-size: 18px;
        color: #222222;
      }
    }
    .big-confirm-btn {
      text-align: center;
      margin-top: 72px;
      font-size: 0;
      & > button {
        display: inline-block;
        vertical-align: middle;
        width: 70px;
        height: 30px;
        line-height: 30px;
        margin: 0 10px;
        cursor: pointer;
        &.disabled{
          background-color: #CCCCCC;
        }
      }
    }
    .big-confirm-input {
      width: 100%;
      resize: none;
      height: 175px;
      padding: 20px;
      border: 1px solid #F6FAFA;
      box-sizing: border-box;
      font-size: 15px;
      color: #222222;
      @include placeholder() {
        font-size: 14px;
        color: #AAAAAA;
      }
      & + .big-confirm-btn {
        margin-top: 23px;
      }
    }
  }
</style>
