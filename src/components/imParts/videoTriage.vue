<template>
    <article class="messageList-item-content">
        <figcaption class="check-suggestion-message">
            <header class="check-suggestion-message-title">视诊</header>
            <section class="check-suggestion-content">
                <article class="check-suggestion-item">
                    <span>{{message.content.data.content}}</span>
                </article>
            </section>
        </figcaption>
        <figure class="messageList-item-img">
            <div class="messageList-item-nameTop">
                <p>{{ '【分诊医生】'+docName}}</p>
            </div>
            <div class="deleteMessage" @click.stop="deleteMsg">撤回</div>
            <img src="../../assets/img00/index/chatting_portrait_system@2x.png" alt="">
        </figure>
    </article>
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
    export default {
        data() {
            return {};
        },
        mounted() {
        },
        computed: {
            docName() {
                return this.message.custom && JSON.parse(this.message.custom).docName
                    ? JSON.parse(this.message.custom).docName
                    : this.$store.state.userName;
            }

        },
        methods: {
            deleteMsg(){
                this.$emit("deleteMsg");
                //this.$store.commit("setDeleteMsgInfo",this.message);
            }
        },
        props: {
            message: {
                type: Object
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
