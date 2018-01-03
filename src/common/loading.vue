<template>
  <section class="middle-tip-box ev-loading">
    <section class="middle-tip-modal">
      <figure class="middle-tip-box-text">
        <img src="/static/img/img00/common/save_complete.png" alt="loading...">
      </figure>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/7/18.
   */
  export default{
    props: {
      show:{
          type:Boolean
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../scss/library/_common-modules";
  .middle-tip-box {
    position: absolute;
    width: 100%;
    height: 100%;
    /*top: 50%;*/
    /*left: 50%;*/
    top: 0;
    left: 0;

  /*transform: translate(-50%, -50%);*/
  z-index: 6;
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
    -webkit-transform: rotate(0);
    transform: rotate(0); }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg); } }

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0); }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg); } }

</style>
