<template>
    <section class="sendImg" v-show="showFlag">
        <input name="file" type="file" multiple="" @change="onFileChange($event)"/>
        <div class="btn-click" v-show="fileList.length === 0">
            <span>File to upload</span>
            <img src="../../assets/img00/controller/home_question_default.png"/>
            <p>(Only One File)</p>
        </div>
        <div class="imgList" v-show="fileList.length>0">
            <div class="imgInfo" v-for="(item,index) in fileList">
                <div class="name">{{item.name}}</div>
                <img src="../../assets/img00/common/videoPlay.jpg"/>
                <div :class="[item.sizeWarning ? 'on': 'no','size']"><span class="num">{{getSize(item,index)}}</span><span></span></div>
                <div class="remove" ><img @click="removeImg(index,item)" src="../../assets/img00/common/popup_close_activate.png"/></div>
            </div>
        </div>
        <div class="send-btn" v-show="fileList.length>0">
            <a href="javascript:;" @click="send">发送</a>
        </div>
        <div class="closeSend" @click="closeSend"></div>
    </section>
</template>
<script>
    import api from "@/common/js/util";
    import Vue from 'vue'
    export default{
        name: '',
        data(){
            return {
                fileType:'',
                showFlag: false,
                fileList: [],
                maxSize:5,
                maxNumber:1  //一次发送数量
            }
        },
        watch: {
            "$store.state.sendFileShow"(data){
                this.showFlag = data;
            }
        },
        methods: {
            init(){
                this.showFlag = this.$store.state.sendFileShow;
            },
            //上传
            onFileChange(e){
                let files = e.target.files || e.dataTransfer.files;

                if (!files.length) {
                    return;
                }else if(files.length >1){
                    alert("请单发视频！");
                    return;
                }

                //一次最多上传数量
                if(this.fileList.length ==this.maxNumber){
                     alert("请单发视频！");
                        return;
                }else{
                    if((this.fileList.length +files.length) >this.maxNumber){
                        alert("请单发视频！");
                        return;
                    }
                }
                files = Object.assign({}, files);
                for(let i in files){
                    if(/video\/\w+/.test(files[i].type)){
                        files[i].url =  window.URL.createObjectURL(files[i]);
                        files[i].sizeWarning = false;
                        this.fileList.push(files[i]);

                    }else{
                            alert("请上传视频文件！");
                            return
                    }
                }
            },
            //发送
            send(){
                let _this = this;
                for(let item of this.fileList){
                    if(item.sizeWarning){
                        alert("请传入小于" + this.maxSize + 'M的图片！');
                        return;
                    }
                }

                for(let item of this.fileList){
                    let reader = new FileReader();
                    reader.readAsDataURL(item);
                    reader.onload=function(e){
                        console.log("加载完成！");
                        _this.$store.commit("setSendFileFlag",{
                            flag:true,
                            data: this.result
                        });
                    };
                }
                //上传完后续处理
                _this.fileList = [];
                _this.$store.commit("setSendFileShow",false);
                _this.$store.commit("setSendFileFlag", {
                    flag: false,
                    data: {}
                });
            },
            //关闭发送
            closeSend(){
                this.$store.commit("setSendFileShow",false);
                this.fileList = [];
                this.$store.commit("setSendFileFlag", {
                    flag: false,
                    data: {}
                });
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
            //删除图片
            removeImg(index,item){
//                console.log(index);
//                console.log(this.fileList);
               this.fileList.removeByValue(item);
            },
        },
        mounted(){
            this.init();
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    .sendImg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        input[type='file'] {
            width: 100%;
            height: 100%;
            background: transparent;
            opacity: 0;
            z-index: 2;
            position: relative;
        }
        .btn-click {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 1;
            span {
                color: #fff;
                font-size: 24px;
                line-height: 24px;
            }
            p{
                margin-top:20px;
                color: #cc5116;
                font-size: 24px;
                line-height: 24px;
            }
        }
        .imgList {
            position: absolute;
            top: 0;
            left: 0;
            width: auto;
            height: 100%;
            padding-top: 25px;
            box-sizing: border-box;
            z-index: 3;
            .imgInfo {
                background: rgba(255, 255, 255, 0.8);
                position: relative;
                display: inline-block;
                margin: 17px;
                vertical-align: top;
                border: 1px solid #acacac;
                padding: 6px 6px 6px 6px;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.16);
                font-size: 14px;
                &>img {
                    display: block;
                    width: 100px;
                    height: 100px;
                }
                .name{
                    width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .size {
                    padding-top: 5px;
                    font-size: 14px;
                    line-height: 14px;
                    &.on{
                        color: red;
                    }
                    .num {
                        font-weight: 600;
                    }
                }
                .remove{
                    width:40px;
                    height:40px;
                    background: rgba(255,255,255,0.8);
                    border-radius: 100%;
                    text-align: center;
                    line-height: 35px;
                    position:absolute;
                    right: -10px;
                    top: -10px;
                    &>img{
                        width:16px;
                        height:16px;
                        padding: 12px;
                    }
                }
            }
        }
        .send-btn{
            width: 95px;
            height: 35px;
            background-color: #7a8ec1;
            border-radius: 5px;
            cursor: pointer;
            vertical-align: middle;
            position: absolute;
            right:30px;
            bottom:21px;
            z-index:3;
            a{
                width: 100%;
                height:100%;
                text-align: center;
                line-height: 35px;
                color: #fff;
                display: block;
            }
        }
        .closeSend{
            position: absolute;
            top:0;
            right:0;
            width: 0;
            height: 0;
            border-top: 40px solid #fff;
            border-left: 40px solid transparent;
            z-index: 3;
            &:after{
                content: '';
                display: block;
                width: 15px;
                height: 15px;
                position: absolute;
                background: url("../../assets/img00/common/popup_close_activate.png") no-repeat ;
                top: -36px;
                right: 4px;
                cursor: pointer;
            }
        }
    }
</style>