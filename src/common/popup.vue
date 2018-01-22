<template>
  <section class="middle-tip-modal popup">
    <figure class="middle-tip-box-text">
      <img v-show="obj.hasImg" src="/static/image/img00/login/save_loading.png">
      <p class="popup-text">{{obj.text}}</p>
    </figure>
  </section>
</template>
<script>
  export default{
    name: 'popup',
    data(){
      return {
        showFlag: true
      }
    },
    props: {
      obj: {
        type: Object
      }
    },
    mounted(){
      let _this = this;
//      _this.showFlag = true;
      setTimeout(function () {
//        _this.showFlag = false;
        _this.$emit('update:payPopupShow', false);
      }, 2000)
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../scss/modules/_popup";
  .fade-scale-enter-active,.fade-scale-leave-active {
    transition: all 0.5s linear;
  }
  .fade-scale-enter,.fade-scale-leave-to{
    opacity: 0;
    transform:scale(0) translate(-50%,-50%);
  }
</style>
