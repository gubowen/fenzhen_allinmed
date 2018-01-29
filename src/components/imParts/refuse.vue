<template>
    <section class="main-masker on">
        <section class="refuse-box">
            <i class="icon-close window-close" @click="close"></i>
            <header class="refuse-box-title">
                <article>
                    <h2>请选择拒绝理由</h2>
                    <p>发送后将结束与患者沟通</p>
                </article>
            </header>
            <section class="refuse-box-inner">
                <section class="refuse-box-inner-list">
                    <ul>
                        <li class="refuse-box-inner-list-item" :class="{'active': index == nowIndex}" v-for="(item,index) in refuseList" @click="selectReason">
                            <h3 @click.stop="selectReason(item,index)" v-if="!fixFlag[index]">{{item.refuseContent}}</h3>
                        </li>
                    </ul>
                </section>
                <figure class="refuse-box-update">
                    <input type="text" class="add-input" placeholder="请输入拒绝理由" v-model="refuseReason"  maxlength="50"/>
                    <i class="icon-Cancel" @click="remove" v-show="refuseReason"></i>
                </figure>
            </section>
            <section class="refuse-box-footer">

                <button type="button" :class="[{'active':refuseReason},'btn-primary-small']" @click="send">发送</button>
                <button type="button" class="btn-border-small " @click="close">取消</button>
            </section>
        </section>
    </section>
</template>
<script>
    import api from "../../common/js/util/util";
    const XHRList = {
        refuseReasonList: "/call/comm/data/refuse/v1/getList/",

    };
    export default{
        name: 'refuse',
        data(){
            return {
                refuseList: [],
                nowIndex: -1,
                fixFlag: {
                    '-1': false
                },
                refuseReason:''
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                var _this = this;
                let dataValue={
                    refuseType:1,
                    siteId:18,
                    isValid:1
                };
                api.ajax({
                    url:XHRList.refuseReasonList,
                    method: "POST",
                    data: dataValue,
                    done(res) {
                        if(res.responseObject){
                            let refuseList = [];
                            res.responseObject.forEach(function(item,index){
                                refuseList.push(Object.create({
                                    flag:true,
                                    refuseContent:item.refuseContent
                                }))

                            });
                            _this.$store.commit('setRefuseList',refuseList);
                        }
                        _this.refuseList = _this.$store.state.refuseList;
                    },
                    fail(err) {
                        console.log("请求失败：" + err);
                        _this.refuseList = _this.$store.state.refuseList;
                    }
                });

            },
            //选择原因
            selectReason(item, index){
                this.nowIndex = index;
                this.refuseReason = item.refuseContent;
            },
            close(){
                this.$store.commit("setRefuseFlag", false);
            },
            updateEvent(index){
                this.$set(this.fixFlag, index, true);
            },
            save(item,index){
                if(item.text.length>0){
                    this.$store.commit("refuseList",this.refuseList);
                    this.$set(this.fixFlag, index, false);
                }
            },
            send(){
                if(this.refuseReason){
                    this.$store.commit("setRefuseReason", {
                        flag: true,
                        data:  '分诊医生'+this.$store.state.userName+'拒绝分诊，拒绝理由:'+this.refuseReason
                    });
                    this.$store.commit("setRefuseFlag", false);
                }
            },
            remove(){
                this.refuseReason='';
                this.nowIndex = -1;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../scss/base";

    .main-masker {
        .refuse-box {
            position: absolute;
            top: 50%;
            transform: translateY(-200%);
            left: 50%;
            width: 800px;
            margin-left: -400px;
            background-color: #fff;
            transition: all 0.3s ease-in-out;
            .window-close {
                position: absolute;
                right: -34px;
                cursor: pointer;
            }
            &-title {
                padding: 20px 40px;
                background: #D9DFEC;
                text-align: center;
                color: #222;
                font-size: 18px;
                position: relative;
                & > article {
                    h2 {
                        font-size: 18px;
                        color: #222;
                    }
                    p {
                        color: #6b748c;
                        font-size: 13px;
                        margin-top: 8px;
                    }
                }
            }
            &-inner {
                overflow: auto;
                height: 280px;
                &.hidden {
                    display: none;
                }
                &-list {
                    padding: 0 40px;
                    font-size: 16px;
                    overflow: auto;
                    &-item {
                        margin: 22px 0;
                        cursor: pointer;
                        //margin-left: -9px;
                        color: #555;
                        line-height: 1.5;
                        &:hover {
                            color: #222;
                            &:before {
                                background: #0FC2B4;
                            }
                        }
                        & > h3 {
                            display: inline-block;
                            vertical-align: middle;
                            -ms-word-break: break-all;
                            word-break: break-all;
                            font-weight: normal;
                        }
                        .refuse-button {
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0;
                            position: relative;
                            float: right;
                            p {
                                font-size: 14px;
                                margin-left: 20px;
                                display: inline-block;
                                vertical-align: middle;
                                cursor: pointer;
                                color: #7A8EC1;
                                font-weight: normal;
                            }
                        }

                        &:before {
                            content: '';
                            display: inline-block;
                            vertical-align: middle;
                            @include circle(6px, #eceff6);
                            margin-right: 9px;
                        }
                        &.active {
                            :not(p) {
                                color: #7a8ec1;
                                font-weight: 600;
                            }
                            &:before {
                                background: #0FC2B4;

                            }
                        }
                    }

                }
                .refuse-box-update {
                    display: inline-block;
                    padding: 0 40px;
                    width:100%;
                    box-sizing: border-box;
                    position: relative;
                    & > input {
                        width: 100%;
                        padding: 8px 24px 8px 14px;
                        background: #F9F9F9;
                        border: 1px solid #E1E2E7;
                        font-size: 14px;
                        box-sizing: border-box;
                    }
                    .refuse-add-button{
                        display: inline-block;
                        .refuse-save{
                            width: 70px;
                            height: 30px;
                            margin: 0 10px;
                            background: #ccc;
                            &.on{
                                background:   #7a8ec1;
                            }
                        }
                        .refuse-cancel{

                        }
                    }
                    .icon-Cancel{
                        position: absolute;
                        right: 52px;
                        margin-top: -22px;
                        display: block;
                        font-size: 0;
                        cursor: pointer;
                        &:before {
                            content: '';
                            display: block;
                            font-size: 0;
                            width: 8px;
                            height: 8px;
                            background-size: contain;
                            background: url("/static/image/img00/common/popup_close_activate.png") no-repeat center;
                        }
                    }
                }
            }
            &-footer {
                padding-top:15px;
                text-align: center;
                margin-bottom: 15px;
                .btn-primary-small {
                    margin-right: 25px;
                    vertical-align: top;
                    background: #ECEFF6;
                    color: #CCC;
                    &.active{
                        background-color: #7a8ec1;
                        color: #fff;
                    }
                }
            }
        }
        &.on {
            .refuse-box {
                transform: translateY(-50%);
            }
        }
    }

</style>