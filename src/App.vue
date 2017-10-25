<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<keep-alive>-->
      <!--<router-view></router-view>-->
    <!--</keep-alive>-->
    <router-view></router-view>
    <Loading v-if="$store.state.loadingShow"></Loading>
  </div>
</template>

<script>
  import userList from "./userlist_rebuild";
  import router from "./router";
  import Loading from "@/common/loading";

  export default {
    name: 'app',
    //router,
    components: {
      userList,
      Loading
      // <user-list> 将只在父模板可用
    },
    mounted(){

    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/css">
  @import "./scss/base.scss";
  #app {
    width: 100%;
    height: 100%;
  }
  html,body{
    height:100%;
  }
</style>
