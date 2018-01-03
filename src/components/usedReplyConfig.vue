<template>
    <section class="main-masker jump-box-config-box used-reply-config on" @click.stop="">
        <section class="jump-box-config">
            <i class="icon-close window-close" @click="$store.state.usedReplyConfig=false"></i>
            <header class="jump-box-config-title">
                <article>
                    <h2>编辑常用回复</h2>
                </article>
                <button class="jump-box-add-term icon-add-term" @click="fixFlagList['-1']=true">
                    <span>添加常用回复</span>
                </button>
            </header>
            <section class="jump-box-term-box" id="ev-used-reply-config-box">
                <section class="jump-box-term-add" v-if="fixFlagList['-1']">
                    <input type="text" class="add-input" placeholder="请输入常用回复" v-model.trim="fixContentList['-1']"
                           @input="contentLimit('-1')"/>
                    <figure class="term-add-button">
                        <button class="btn-primary term-add-save" @click.stop="createNewItem('-1')">保存</button>
                        <p class="term-add-cancel" @click.stop="fixFlagList['-1']=false">取消</p>
                    </figure>

                </section>
                <section class="jump-box-term" v-for="(item,index) in replyList" :key="index">
                    <article class="jump-box-term-title">
                        <h3 v-if="!fixFlagList[index]">{{item.replyContent}}</h3>
                        <figure class="jump-box-term-button" v-if="!fixFlagList[index]">
                            <p class="fix"
                               @click.stop="fixFlagList[index]=true;fixContentList[index]=item.replyContent">修改</p>
                            <p class="del" @click.stop="toggleDeleteModal(index)">删除

                                <section class="modal-confirm show" v-if="fixDeleteList[index]">
                                    <article class="modal-confirm-content">
                            <p>确定删除该回复吗？</p>
                    </article>
                    <figure class="modal-confirm-button">
                        <button class="btn-ensure modal-confirm-ensure" @click.stop="deleteCallback(item,index)">确定</button>
                        <button class="btn-primary modal-confirm-cancel" @click.stop="fixDeleteList[index]=false">取消</button>
                    </figure>
                </section>
                </p>
                </figure>
                <section class="jump-box-member-config" style="display: block;" v-if="fixFlagList[index]">
                    <input type="text" class="jump-box-member-input" placeholder="请输入常用回复"
                           v-model.trim="fixContentList[index]"
                           @input="contentLimit(index)"/>
                    <figure class="member-add-button">
                        <button class="btn-primary member-add-save" @click.stop="createNewItem(index)">保存</button>
                        <i class="icon-member-add-cancel" @click.stop="fixFlagList[index]=false"></i>
                    </figure>
                </section>
                </article>
            </section>
        </section>
    </section>
    </section>
</template>
<script>
    
    /**
     * @Desc：
     * @Usage:
     * @Notify：
     * @Depend：
     *
     * Created by Qiangkailiang on 17/10/20.
     */
    import ajax from "@/common/js/ajax";
    import api from "@/common/js/util";
    import store from "@/store/store";
    const XHRList = {
        usedList: "/call/customer/comm/reply/v1/getMapList/",
        update: "/call/customer/comm/reply/v1/save/"
    };
    export default{
        data(){
            return {
                replyList: [],
                fixFlagList: {
                    "-1": false
                },
                fixContentList: {
                    "-1": ""
                },
                fixDeleteList: {
                    "-1": false
                }

            }
        },
        mounted(){
            this.getReplyList();
        },
        methods: {
            toggleDeleteModal(index){
                for (let i in this.fixDeleteList){
                    this.fixDeleteList[i]=false;
                }
                this.fixDeleteList[index]=true
            },
            getReplyList(){
                let that = this;
                store.commit("startLoading")

                ajax({
                    url: XHRList.usedList,
                    method: "POST",
                    data: {
                        customerId: this.$store.state.userId,
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "9999"
                    },
                    done(data){
                        if (data.responseObject.responseData) {
                            store.commit("stopLoading");
                            let dataList = data.responseObject.responseData.dataList;
                            if (dataList && dataList.length !== 0) {
                                that.replyList = dataList.reverse();

                                dataList.forEach((element, index) => {
                                    that.$set(that.fixFlagList, index, false);
                                    that.$set(that.fixContentList, index, "");
                                    that.$set(that.fixDeleteList, index, false);
                                });
                            }
                        }
                    }
                })
            },
            contentLimit(index){
                if (api.getByteLen(this.fixContentList[index]) > 200) {
                    this.fixContentList[index] = api.getStrByteLen(this.fixContentList[index], 200);
                }
            },
            deleteCallback(item, index){
                let that = this;
                store.commit("startLoading");
                ajax({
                    url: XHRList.update,
                    method: 'POST',
                    data: {
                        id: item.id,
                        isValid: "0"
                    },
                    done(data){
                        if (data.responseObject.responseStatus) {
                            store.commit("stopLoading");
                            that.replyList.removeByValue(item);
                            that.fixDeleteList[index] = false;
                            delete that.fixContentList[that.replyList.length];
                            delete that.fixFlagList[that.replyList.length];
                        }
                    }
                })
            },
            createNewItem(index){
                let that = this;
                let content = this.fixContentList[index];
                let param = {};
                if (content.length === 0) {
                    that.fixFlagList[index] = false;
                    that.fixContentList[index] = "";
                    return;
                }

                if (index == -1) {
                    param = {
                        customerId: this.$store.state.userId,
                        replyContent: content,
                        isValid: "1",
                    }
                } else {
                    param = {
                        id: this.replyList[index].id,
                        replyContent: content,
                        isValid: "1",
                    }
                }
                store.commit("startLoading");
                ajax({
                    url: XHRList.update,
                    method: 'POST',
                    data: param,
                    done(data){
                        if (data.responseObject.responseStatus) {
                            store.commit("stopLoading")
                            let param = {
                                replyContent: content,
                                id: data.responseObject.responsePk,
                                customerId: that.$store.state.userId,
                            };
                            if (index == -1) {
                                that.replyList.unshift(param);
                            } else {
                                that.replyList[index] = param;
                            }
                            that.fixFlagList[index] = false;
                            that.fixContentList[index] = "";
                            that.$set(that.fixFlagList, that.replyList.length - 1, false);
                            that.$set(that.fixContentList, that.replyList.length - 1, "");
                            that.$set(that.fixDeleteList, that.replyList.length - 1, false);
                        }
                    }
                })
            }
        },
        props: {}
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../scss/base.scss";
    @import "../scss/modules/_fastReplyConfig.scss";
    @import "../scss/modules/_modalBox.scss";

    .used-reply-config .jump-box-member-input {
        width: 77%;
    }
</style>
