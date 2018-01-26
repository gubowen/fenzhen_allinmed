<template>
    <div id="app" @click="$store.state.usedReplyShow=false;$store.state.fastReplyShow=false">
        <!--<img src="./assets/logo.png">-->
        <!--<keep-alive>-->
        <!--<router-view></router-view>-->
        <!--</keep-alive>-->
        <router-view></router-view>
        <Loading v-show="$store.state.loadingShow"></Loading>
        <transition name="fade">
            <Popup v-if="$store.state.popupShow" :obj="$store.state.popupContent"></Popup>
        </transition>
    </div>
</template>

<script>
    import userList from "@/userlist_rebuild";
    import router from "@/router";
    import Loading from "@/common/loading";
    import Popup from '@/common/popup';
    export default {
        name: 'app',
        //router,
        components: {
            userList,
            Loading,
            Popup
            // <user-list> 将只在父模板可用
        },
        mounted(){

        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/css">
    @import "./scss/base.scss";
    @import './scss/swiper/swiper.scss';
    #app {
        width: 100%;
        height: 100%;
    }

    html, body {
        height: 100%;
        overflow: hidden;
    }

    /*vue组件自定义动画开始*/
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
    {
        opacity: 0;
    }
</style>
