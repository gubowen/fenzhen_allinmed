<template>
    <figure class="messageList-item-content">
        <!--患者头像-->
        <figure class="messageList-item-img" v-if="message.from != '1_doctor00001'">
            <img :src="$store.state.currentItem.logoUrl" alt="">
        </figure>
        <figcaption class="messageList-item-text  messageList-item-multiple">
            <section class="multiple" v-if="multipleList.content">
                <header>
                    <i class="icon-img"></i><span>图片</span><span>{{'('+message.content.data.list.length+')'}}</span>
                </header>
                <section class="imgList" v-if="multipleList.content.data.list.length>0">
                    <ul>
                        <li v-for="(item,index) in multipleList.content.data.list" @click="showBigImgFunction(index)" v-show="index<3">
                            <img :src="removeBaseImageMsg(item.url)"/>
                        </li>
                    </ul>
                </section>
            </section>
        </figcaption>
        <figure v-if="message.from == '1_doctor00001'" class="messageList-item-img">
            <div class="messageList-item-nameTop">
                <p>{{ '【分诊医生】'+docName}}</p>
            </div>
            <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
            <img src="/static/image/img00/index/chatting_portrait_system@2x.png" alt="">
        </figure>
    </figure>
</template>
<script>
    import EXIF from "exif-js";
    import imageEXIF from "@/base/imageRotate";
    export default {
        data() {
            return {
                multipleList: {}
            }
        },
        props: {
            message: {
                type: Object
            },
            nim:{
                type:Object
            }
        },
        mounted() {

//            console.log("图集");
//            console.log(this.message);

            this.multipleList = this.message;
            if (this.multipleList.content.data.list.length > 3) {
               // this.multipleList.content.data.list.splice(3, this.multipleList.content.data.list.length - 1);
                this.multipleList = Object.assign({}, this.multipleList);
            }
            this.installSBIList();

        },
        methods: {
            installSBIList() {
                let _this = this;
                let SBIObject = {};
                SBIObject = this.$store.state.SBIObject;

                this.message.content.data.list.forEach(function (item,index) {
                           item.url = _this.removeBaseImageMsg(item.url);
                });

                SBIObject[_this.message.idClient] = this.message.content.data.list;

                this.$store.commit('setSBIObject', SBIObject);
            },
            showBigImgFunction(message) {
                let _this = this;
                this.$store.state.SBIObject[_this.message.idClient].forEach(function (item, index) {
                    if (message == index) {
                        _this.$store.commit("setSBIIndex", index);
                    }
                });
                this.$store.commit("setSBIFlag", true);
                this.$store.commit("setSBIType", _this.message.idClient);
            },
            removeBaseImageMsg(url){
                var _this = this;
                return _this.nim.viewImageStripMeta({
                    url: url,
                    strip: true
                });
            },
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../../scss/base.scss";

    .multiple {
        header {
            font-size: 14px;
            line-height: 14px;
            color: #222;
        }
        .imgList {
            & > ul {
                & > li {
                    /*border: 1px solid #D4EFF3;*/
                    width: 120px;
                    height: 117px;
                    margin-top: 10px;
                    display: inline-block;
                    vertical-align: middle;
                    cursor: pointer;
                    margin-right: 10px;

                    @include query(1440px){
                        width: 90px;
                        height: 90px;
                    }

                    & > img {
                        width: 100%;
                        height: 100%;
                        vertical-align: top;
                    }
                    &:last-child {
                        margin-right: 0;
                    }
                }

            }
        }
    }
</style>