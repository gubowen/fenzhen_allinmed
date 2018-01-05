<template>
    <figure class="messageList-item-content">
        <!--患者头像-->
        <figure class="messageList-item-img" v-if="message.from != '1_doctor00001'">
            <img :src="$store.state.currentItem.logoUrl" alt="" >
        </figure>
        <!--图片-->
        <figcaption class="messageList-item-text file" :class="{'make-photo-box':exifFlag}">
            <section  @click="showPDF(message.file.url)">
                <figure class="fileImg">
                    <img src="../../assets/img00/common/folder.jpg" alt=""/>
                </figure>
                <figure class="fileInfo">
                    <p class="fileName">{{JSON.parse(message.custom).name}}</p>
                    <p class="fileSize">{{getSize(message.file)}}</p>
                </figure>
            </section>
            <!--<video controls :src="message.file.url" style="width:300px"></video>-->

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
//            console.log(this.message);
        },
        computed:{
            docName(){
                return this.message.custom && JSON.parse(this.message.custom).docName
                    ? JSON.parse(this.message.custom).docName
                    : this.$store.state.userName;
            }
        },
        methods:{
            //打开PDF
            showPDF(item){
                window.open(item);
            },
            //计算图片大小
            getSize(item,index){
                if(item.size > this.maxSize*1024*1024){
                    item.sizeWarning = true;
                }
                let size = item.size;
                if (item.size < 1024 * 1024) {
                    return (size / 1024).toFixed(2) + 'KB';
                } else {
                    return (size / 1024 / 1024).toFixed(2) + 'MB';
                }
            },
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
<style lang="scss" rel="stylesheet/scss" >
    .make-photo-box{
        transform:rotate(90deg) translate(12%,12%);
    }
    .file{
        background-color: rgba(255, 255, 255, 0.8) !important;
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.16);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.16);
        padding: 6px 6px 6px 6px;
        margin-bottom: 4px !important;
        cursor: pointer;
        border-radius: 5px;
    .fileImg{
        display: table-cell;
        vertical-align: middle;
        width: 45px;
        height: 100%;
        text-align: center;
        img{
            width:45px;
            height:45px;
        }
    }
    .fileInfo{
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: table-cell;
        vertical-align: middle;
        max-width: 245px;
        line-height: 1.3;
        padding-left:5px;
    }
    .fileName{
    }
    .fileSize{
        margin-top:10px;
        text-align: right;
        color:#aaa;
    }
    }

</style>
