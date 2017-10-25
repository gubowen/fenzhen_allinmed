<template>
  <section class="middle-tip-modal popup " :class="{'show':showFlag}">
    <figure class="middle-tip-box-text">
      <img v-show="obj.hasImg" src="/static/img/img00/login/save_loading.png">
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
      _this.showFlag = true;
      setTimeout(function () {
        _this.showFlag = false;
        _this.$emit('update:payPopupShow', false);
      }, 2000)
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../scss/modules/_popup";
</style>
