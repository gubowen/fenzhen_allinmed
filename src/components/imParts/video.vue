<template>
    <figure class="messageList-item-content">
        <!--患者头像-->
        <figure class="messageList-item-img" v-if="message.from != '1_doctor00001'">
            <img :src="$store.state.currentItem.logoUrl" alt="" >
        </figure>
        <!--图片-->
        <figcaption class="messageList-item-text" :class="{'make-photo-box':exifFlag}">

            <video controls :src="message.file.url" style="width:300px"></video>
            <!--<img :src="message.file.url" alt="" style="width:300px" @click="showBigImgFunction(message.file.url)" ref="imageElement"/>-->
        </figcaption>
        <figure v-if="message.from == '1_doctor00001'" class="messageList-item-img">
            <div class="messageList-item-nameTop">
                <p>{{ '【分诊医生】'+docName}}</p>
            </div>
            <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
            <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
        </figure>
    </figure>
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
    import EXIF from "exif-js";
    import imageEXIF from "@/base/imageRotate";
    export default{
        data(){
            return {
                exifFlag:false
            }
        },
        mounted(){
            console.log(this.message);
        },
        computed:{
            docName(){
                return this.message.custom && JSON.parse(this.message.custom).docName
                    ? JSON.parse(this.message.custom).docName
                    : this.$store.state.userName;
            }
        },
        methods:{
            //撤回消息
            deleteMsg(){
                this.$emit("deleteMsg");
            }
        },
        props: {
            message:{
                type:Object
            },
            nim:{
                type:Object
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    .make-photo-box{
        transform:rotate(90deg) translate(12%,12%);
    }
</style>
