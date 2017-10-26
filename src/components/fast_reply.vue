<template>
    <section class="jump-box fast-reply show">
        <header class="jump-box-header">
            <h3>快捷提问</h3>
        </header>
        <nav class="jump-box-tabs tabsInner" id="ev-show-tabs">
            <button class="jump-box-prev jump-box-tabs-controller">
                <i class="icon-leftArrow" @click="transformBtn('prev')"></i>
            </button>
            <article class="jump-tabs-wrapper" ref="tabItems">
                <figure class="jump-box-tabs-item tabsItem" :class="{'active': index == nowIndex}"
                        v-for="(items,index) in FastReplyList" @click="tabShow(items,index)">{{items.questionDesc}}


                </figure>
            </article>
            <button class="jump-box-next jump-box-tabs-controller">
                <i class="icon-rightArrow" @click="transformBtn('next')"></i>
            </button>
        </nav>
        <section class="jump-box-viewers viewInner" id="ev-show-inners">
            <section class="jump-box-viewers-item viewItem" :class="{'active': index == nowIndex}"
                     v-for="(items,index) in FastReplyList">
                <ul class="jump-box-list">
                    <li class="jump-box-list-item" v-for="item in items.children"><span
                            @click.stop="clickToSendReply(item)">{{item.questionDesc}}</span></li>
                </ul>
            </section>
        </section>
        <button class="jump-box-config-button icon-fast-reply-config" @click="showConfig()"><span>编辑快捷提问</span></button>

    </section>
</template>
<script>
    import axios from "axios";
    import store from "@/store/store";
    const XHRList = {
        getTerm: "/call/customer/quick/question/v1/getMapList/",
    }
    export  default{
        name: "fast-reply",
        data(){
            return {
                FastReplyList: {},
                showInnerList: {},
                nowIndex: 0,
                transformIndex: {
                    i: 0,
                    num: 0
                }
            }
        },
        components: {},
        watch: {
            "$store.state.fastReplyConfig"(status){
                if (!status) {
                    this.getFastReplyList();
                }
            }
        },
        methods: {
            init(){
                this.getFastReplyList();
            },
            showConfig(){
                this.$store.state.fastReplyConfig = true;
            },
            //tabs左右轮播按钮...
            transformBtn (dir) {
                const total = this.total;
                const size = this.size;
                if (dir === "prev") {
                    if (Math.abs(this.transformIndex.i) > 0) {
                        this.transformIndex.i++;
                        this.transformIndex.num += total / size;
                        $(".jump-tabs-wrapper").css("transform", "translateX(" + (this.transformIndex.num) + "px)")
                    }
                } else if (dir === "next") {
                    if (Math.abs(this.transformIndex.i) < size * 0.7) {
                        this.transformIndex.i--;
                        this.transformIndex.num -= total / size;
                        $(".jump-tabs-wrapper").css("transform", "translateX(" + (this.transformIndex.num) + "px)")
                    }
                }
            },
            //获取列表...
            getFastReplyList(){
                let _this = this;
                let dataValue = {
                    sessionCustomerId: _this.$store.state.userId,
                    isValid: "1",
                    firstResult: "0",
                    maxResult: "1000",
                    sortType: "2",
                    sortPartIdList: ""
                };
                axios({
                    method: "post",
                    url: XHRList.getTerm,
                    data: dataValue,
                    responseType: 'json',
                    transformRequest: [function (data) {
                        data = "paramJson=" + JSON.stringify(data);
                        return data;
                    }],
                    before: function () {
                        common.loading.show();
                    }
                }).then(function (res) {
                    if (res.data.responseObject.responseData) {
                        let datalist = res.data.responseObject.responseData.dataList;
                        _this.FastReplyList = datalist;
                    }
                    setTimeout(() => {
                        _this.getTotalSize();
                    }, 20)

                })
            },
            getTotalSize(){
                let total = 0, size = this.FastReplyList.length;
                document.querySelectorAll(".jump-tabs-wrapper .tabsItem").forEach((element, index) => {
                    total += element.offsetWidth
                });
                $(".jump-tabs-wrapper").width(total + 30 * size + 55);
                this.total = total;
                this.size = size;
            },
            tabShow(ele, index){
                this.nowIndex = index;
            },
            //点击将一条回复加入输入框...
            clickToSendReply: function (item) {
                store.commit("setFastReply", item.questionDesc)
                this.$emit("update:controllerInputStatus", parseInt(item.isUpload));
                this.$emit("update:fastRelyStatus", false);
            }
        },
        mounted(){
            this.init()
        },
        props: {
            controllerInputStatus: {
                type: Number
            }, fastRelyStatus: {
                type: Boolean
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../scss/base.scss";
    //快捷提问
    .jump-box {
        width: 800px;
        box-shadow: 0 0 40px 0 rgba(153, 167, 208, 0.35);
        border-radius: 4px 4px 4px 4px;
        position: absolute;
        bottom: 225px;
        left: 20px;
        background-color: #fff;
        z-index: 5;
        transform: scale(0);
        transform-origin: 60px 100%;
        transition: all 0.2s linear;
        &.show {
            transform: scale(1);
        }
        &:after {
            content: '';
            position: absolute;
            @include triangle(20px, #fff, down);
            margin-left: 60px;
        }
        &-header {
            text-align: center;
            width: 100%;
            background: #D9DFEC;
            padding: 20px 0;
            .jump-box-search {
                width: 372px;
                background-color: #fff;
                height: 32px;
                padding-left: 14px;
                border-radius: 4px;
            }
        }
    }

    .jump-box-tabs {
        @include clearfix();
        padding: 24px 55px;
        box-sizing: border-box;
        text-align: left;
        position: relative;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        .jump-box-tabs-controller {
            font-size: 14px;
            cursor: pointer;
            z-index: 2;
        }
        .jump-box-prev {
            position: absolute;
            line-height: 0;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 56px;
            height: 40px;
            background-color: #fff;
        }
        .jump-box-next {
            position: absolute;
            right: 0;
            line-height: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 56px;
            height: 40px;
            background-color: #fff;
        }
        .jump-box-tabs-item {
            padding: 0 22px;
            background-color: #f7f7f8;
            height: 32px;
            line-height: 32px;
            display: inline-block;
            border-radius: 4px;
            font-size: 14px;
            text-align: center;
            margin-right: 30px;
            box-sizing: border-box;
            color: #555;
            cursor: pointer;
            &.active {
                background: #7A8EC1;
                color: #fff;
            }
        }
    }

    .jump-box-viewers {
        padding-left: 55px;
        margin-top: 2px;
        min-height: 340px;
        overflow: hidden;
        &-item {
            display: none;
        }
        &-item.active {
            display: block;
        }
    }

    .jump-box-list {
        font-size: 16px;
        overflow: auto;
        max-height: 205px;
        margin-left: -14px;
        &-item {
            margin: 22px 0;
            cursor: pointer;
            //margin-left: -9px;
            color: #555;
            padding-right: 55px;
            &:hover {
                color: #222;
                &:before {
                    background: #0FC2B4;
                }
            }
            & > span {
                vertical-align: middle;
                -ms-word-break: break-all;
                word-break: break-all;
            }
            &:before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                @include circle(6px, #eceff6);
                margin-right: 9px;
            }
        }
    }

    .jump-box-config-button {
        padding: 8px 15px;
        background: #F9F9F9;
        border-radius: 4px;
        color: #909090;
        position: absolute;
        cursor: pointer;
        right: 40px;
        bottom: 40px;
        & > span {
            margin-left: 9px;
        }
    }
</style>
