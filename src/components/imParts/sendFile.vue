<template>
    <section class="sendImg" v-if="showFlag">
        <input name="file" type="file" multiple="" @change="onFileChange($event)" id="sendImg"  :accept="getState()"/>



        <div class="btn-click" v-show="fileList.length === 0">
            <!--<img src="../../assets/img00/controller/fileUp.png"/>-->
            <img src="/static/image/img00/controller/fileUp.png"/>
            <span>选 择 文 件</span>
            <span>( JPEG、PNG、BMP、GIF 、JPG、PNG、MP4、PDF)</span>
        </div>
        <div class="imgList" v-show="fileList.length>0">
            <div class="imgInfo" v-for="(item,index) in fileList">
                <div class="name">{{item.name}}</div>
                <img :src="item.url" v-if="fileType(item.type) == 'image'"/>
                <img v-if="fileType(item.type) == 'video'" src="/static/image/img00/common/videoPlay.jpg"/>
                <img v-if="fileType(item.type) == 'file'" src="/static/image/img00/common/folder.jpg"/>
                <div :class="[item.sizeWarning ? 'on': 'no','size']"><span
                        class="num">{{getSize(item,index)}}</span><span></span></div>
                <div class="remove"><img @click="removeImg(index,item)" src="/static/image/img00/common/popup_close_activate.png"/></div>
            </div>
        </div>
        <div class="send-btn" v-show="fileList.length>0">
            <a href="javascript:;" @click="send">发送</a>
        </div>
        <div class="closeSend" @click="closeSend"></div>
    </section>
</template>
<script>
    import api from "@/common/js/util/util";
    import Vue from 'vue'

    export default {
        name: '',
        data() {
            return {
                showFlag: false,
                fileList: [],
                maxImgSize: 5,
                maxVideoSize: 100,
                maxFileSize: 100,
                maxPDFSize: 100,
                maxNumber: 9,
                videoNumber: 1,
                PDFNumber: 1

            }
        },
        watch: {
            "$store.state.sendFileShow"(data) {
                this.showFlag = data;
                if (!data) {
                    this.fileList = [];
                    this.$store.commit("setSendFileFlag", {
                        flag: false,
                        data: {}
                    });
                }
            }
        },
        methods: {
            init() {
                this.showFlag = this.$store.state.sendImgShow;
            },
            //上传
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;

                if (!files.length) {
                    return;
                }
                //一次最多上传数量
                if (this.fileList.length == this.maxNumber) {
                    document.getElementById("sendImg").value = '';
                    this.$store.commit("showPopup", {text: "一次最多上传" + this.maxNumber + '个文件！'});
                    return;
                } else {
                    if ((this.fileList.length + files.length) > this.maxNumber) {
                        document.getElementById("sendImg").value = '';
                        this.$store.commit("showPopup", {text: "一次最多上传" + this.maxNumber + '个文件！'});
                        return;
                    }
                }

                Array.from(files).forEach((element, index) => {
                    if ((/image\/\w+/.test(element.type)) || (/.pdf/.test(element.type)) || (/video\/\w+/.test(element.type))) {
                        if (/video\/\w+/.test(element.type) && !((/mp4/.test(element.type))||(/quicktime/.test(element.type)))) {
                            this.$store.commit("showPopup", {text: "请选择规定类型文件！"});
                        } else {
                            element.url = window.URL.createObjectURL(element);
                            element.sizeWarning = false;
                            this.fileList.push(element);
                        }
                    } else {
                        this.$store.commit("showPopup", {text: "请选择规定类型文件！"});
                        document.getElementById("sendImg").value = '';
                    }
                })
            },
            //发送文件
            send() {
                let _this = this;
                let videoNumber = 0;
                let PDFNumber = 0;
                for (let item of this.fileList) {
                    if (_this.fileType(item.type) == 'video') {
                        videoNumber++;
                    } else if (_this.fileType(item.type) == 'file') {
                        PDFNumber++;
                    }

                    if (item.sizeWarning) {
                        if (_this.fileType(item.type) == 'image') {
                            this.$store.commit("showPopup", {text: "请传入小于" + this.maxImgSize + "M的图片！"});
                        } else if (_this.fileType(item.type) == 'video') {
                            this.$store.commit("showPopup", {text: "请传入小于" + this.maxVideoSize + "M的视频！"});
                        } else if (_this.fileType(item.type) == 'file') {
                            this.$store.commit("showPopup", {text: "请传入小于" + this.maxPDFSize + "M的视频！"});
                        }
                        document.getElementById("sendImg").value = '';
                        return;
                    }
                }
                if (videoNumber > _this.videoNumber) {
                    this.$store.commit("showPopup", {text: "一次最多传入" + _this.videoNumber + "个视频！"});
                    return;
                } else if (PDFNumber > _this.PDFNumber) {
                    this.$store.commit("showPopup", {text: "一次最多传入" + _this.PDFNumber + "个PDF文件！"});
                    return;
                }
                let promises = [];
                let fileList = [];
                for (let item of this.fileList) {
                    promises.push(
                        new Promise((resolve, reject) => {
                            let reader = new FileReader();
                            reader.readAsDataURL(item);
                            reader.onload = function (e) {
                                console.log("加载完成！");
                                fileList.push({
                                    data: e.target.result,
                                    name: item.name,
                                    type: _this.fileType(item.type)
                                });
                                resolve(e);
                            };
                        })
                    )
                }
                Promise.all(promises).then(result => {
                    _this.$store.commit("setSendFileFlag", {
                        flag: true,
                        data: fileList
                    });

                    //上传完后续处理
                    _this.fileList = [];
                    _this.$store.commit("setSendFileShow", false);
                });
            },
            //关闭发送
            closeSend() {
                this.$store.commit("setSendFileShow", false);
                this.fileList = [];
                this.$store.commit("setSendFileFlag", {
                    flag: false,
                    data: {}
                });
            },
            //计算文件大小
            getSize(item, index) {
                if (item.size > this.maxSize * 1024 * 1024) {
                    item.sizeWarning = true;
                }
                let size = item.size;
                if (item.size < 1024 * 1024) {
                    return (size / 1024).toFixed(2) + 'KB';
                } else {
                    return (size / 1024 / 1024).toFixed(2) + 'MB';
                }
            },
            //删除文件
            removeImg(index, item) {
                document.getElementById("sendImg").value = '';
                this.fileList.removeByValue(item);
            },
            //判断文件类型
            fileType(type) {
                if ((/image\/\w+/.test(type))) {
                    return 'image';
                } else if (/.pdf/.test(type)) {
                    return 'file';
                } else if ((/video\/\w+/.test(type))) {
                    return 'video';
                }
                return 'file';
            },
            getState(){
               if (this.$store.state.isImage &&  this.$store.state.isVideo && this.$store.state.isFile){
                   return 'image/*,video/*,application/pdf'
               }else if(this.$store.state.isImage &&  this.$store.state.isVideo){
                   return 'image/*,video/*'
               }else if(this.$store.state.isVideo && this.$store.state.isFile){
                   return 'video/*,application/pdf'
               }else if (this.$store.state.isImage){
                   return 'image/*'
               }else if(this.$store.state.isVideo){
                   return 'video/*'
               }else if(this.$store.state.isFile){
                    return 'application/pdf'
               }else{
                   return 'application/vnd.ms-excel'
               }
            }
        },
        mounted() {
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
            img {
                display: block;
                margin: 0 auto;
                margin-bottom: 5px;
            }
            span {
                color: #fff;
                font-size: 20px;
                line-height: 20px;
                display: block;
                text-align: center;
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
                margin: 17px 5px;
                vertical-align: top;
                border: 1px solid #acacac;
                padding: 6px 6px 6px 6px;
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.16);
                font-size: 14px;
                & > img {
                    display: block;
                    width: 100px;
                    height: 100px;
                }
                .name {
                    width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .size {
                    padding-top: 5px;
                    font-size: 14px;
                    line-height: 14px;
                    &.on {
                        color: red;
                    }
                    .num {
                        font-weight: 600;
                    }
                }
                .remove {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 100%;
                    text-align: center;
                    line-height: 35px;
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    & > img {
                        width: 16px;
                        height: 16px;
                        padding: 12px;
                    }
                }
            }
        }
        .send-btn {
            width: 95px;
            height: 35px;
            background-color: #7a8ec1;
            border-radius: 5px;
            cursor: pointer;
            vertical-align: middle;
            position: absolute;
            right: 30px;
            bottom: 21px;
            z-index: 3;
            a {
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 35px;
                color: #fff;
                display: block;
            }
        }
        .closeSend {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-top: 40px solid #fff;
            border-left: 40px solid transparent;
            z-index: 3;
            &:after {
                content: '';
                display: block;
                width: 15px;
                height: 15px;
                position: absolute;
                /*background: url("../../assets/img00/common/popup_close_activate.png") no-repeat;*/
                background: url("/static/image/img00/common/popup_close_activate.png") no-repeat;
                top: -36px;
                right: 4px;
                cursor: pointer;
            }
        }
    }
</style>