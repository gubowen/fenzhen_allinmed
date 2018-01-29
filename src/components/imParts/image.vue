<template>
    <figure class="messageList-item-content">
        <!--患者头像-->
        <figure class="messageList-item-img" v-if="message.from != '1_doctor00001'">
            <img :src="$store.state.currentItem.logoUrl" alt="">
        </figure>
        <!--图片-->
        <figcaption class="messageList-item-text" :class="{'make-photo-box':exifFlag}">
            <img :src="message.file.url" alt="" style="width:300px" @click.self="showBigImgFunction(message.file.url)" ref="imageElement"/>
        </figcaption>
        <figure v-if="message.from == '1_doctor00001'" class="messageList-item-img">
            <div class="messageList-item-nameTop">
                <p>{{ '【分诊医生】'+docName}}</p>
            </div>
            <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
            <img src="/static/image/img00/index/chatting_portrait_system@2x.png" alt="">
            <!--<img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">-->
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
                exifFlag: false
            }
        },
        mounted(){
            this.removeBaseImageMsg(this.message.file.url);
            this.installSBIList();
            this.initImageFn();
        },
        computed: {
            docName(){
                return this.message.custom && JSON.parse(this.message.custom).docName
                    ? JSON.parse(this.message.custom).docName
                    : this.$store.state.userName;
            }
        },
        methods: {
            showBigImgFunction(message){
                let _this = this;
                this.$store.state.SBIObject.IMImage.forEach(function (item, index) {

                    if (message == item.url) {
                        console.log(index);
                        console.log(message);
                        _this.$store.commit("setSBIIndex", index);
                    }
                });
                this.$store.commit("setSBIFlag", true);
                this.$store.commit("setSBIType", 'IMImage');
            },
            removeBaseImageMsg(url){
                this.message.file.url = this.nim.viewImageStripMeta({
                    url: url,
                    strip: true
                });
            },
            installSBIList(){
                let _this = this;
                let ImageList = [];
                let SBIObject = [];

                SBIObject = this.$store.state.SBIObject;
                if (this.$store.state.SBIObject  &&  this.$store.state.SBIObject.IMImage) {
//                    console.log("11");
                    let flag = false;
                    SBIObject.IMImage.forEach(function (item, index) {
                        ImageList.push({"url": item.url});
                    });

                    if (_this.message.file.url.indexOf('&stripmeta=1&stripmeta=1') == -1) {
                        ImageList.push({"url": this.message.file.url});
                        SBIObject.IMImage = ImageList;
                    } else {

                    }

                } else {
//                    console.log("22");
                    SBIObject.IMImage = [];
                    SBIObject.IMImage = [{"url": this.message.file.url}];
                }
                this.$store.commit('setSBIObject', SBIObject);


//                if(this.$store.state.SBIObject != ''&& this.$store.state.SBIObject.IMImage){
//                    this.$store.state.SBIObject.IMImage.forEach(function(item,index){
//                        ImageList.push( {"url":item.url});
//                    })
//                }
//                ImageList.push( {"url":this.message.file.url});
//                this.$store.commit('setSBIObject',{'IMImage':ImageList});


            },
            initImageFn(){
                const that = this;

                this.$refs.imageElement.onload = function () {
                    that.$emit("loadCallback");
                };

            },
            deleteMsg(){
                this.$emit("deleteMsg");
            }
        },
        props: {
            message: {
                type: Object
            },
            nim: {
                type: Object
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    .make-photo-box {
        transform: rotate(90deg) translate(12%, 12%);
    }
</style>
