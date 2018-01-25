<template>
    <div class="page-container" v-if="totalCount>pageNum">
        <div class="pagination pager">
            <ul class="pages">
                <li class="pgNext" :class="{'pgEmpty':pageValue == 1}" @click="pageChanges({num:0,value:1})">首页
                </li>
                <li class="pgNext" :class="{'pgEmpty':pageValue == 1}"
                    @click="pageChanges({num:pageArr.indexOf(pageValue)-1,value:pageArr[pageArr.indexOf(pageValue)-1]})">
                    上一页
                </li>
                <li class="page-number" :class="{'pgCurrent':pageValue == item}" v-for="(item,index) in pageArr"
                    @click="pageChanges({num:index,value:item})">{{item}}
                </li>
                <li class="pgNext" :class="{'pgEmpty':pageValue == Math.ceil(totalCount/pageNum)}"
                    @click="pageChanges({num:pageArr.indexOf(pageValue)+1,value:pageArr[pageArr.indexOf(pageValue)+1]})">
                    下一页
                </li>
                <li class="pgNext" :class="{'pgEmpty':pageValue == Math.ceil(totalCount/pageNum)}"
                    @click="pageChanges({num:Math.ceil(totalCount/pageNum)-1,value:Math.ceil(totalCount/pageNum)})">
                    末页
                </li>
            </ul>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    /**
     * @Desc：仿jQuery分页
     * @Usage:
     * @Notify：
     * @Depend：
     * Created by wangjingrong on 2018/1/19.
     */
    export default {
        data() {
            return {
                pageValue: 1,
                pageStart: 0,
                pageArr: []
            }
        },
        mounted(){
            this.pages(0,1);
        },
        methods: {
            pageChanges(obj){
                if(obj.value == "•••") return false;
                this.pageStart = (obj.value-1) * this.pageNum;
                this.pageValue = obj.value;
                this.pages(obj.num,obj.value);
                this.$emit("pageChangesCallBack",this.pageStart);
            },
            pages(clickNum, clickValue) {
                console.log(this.totalCount,this.pageNum);
                let pagesLength = Math.ceil(this.totalCount / this.pageNum);
                let ellipsis = "•••", ellipsisNum;
                if (pagesLength > 10) {
                    //点击首页、末页
                    if (clickValue == 1 || clickValue == pagesLength) {
                        this.pageArr = [1, 2, 3, 4, 5, "•••", pagesLength - 2, pagesLength - 1, pagesLength];
                        return false;
                    }
                    //确定"•••"的位置
                    this.pageArr.forEach(function (value, key) {
                        if (ellipsis == value) {
                            ellipsisNum = key;
                        }
                    });
                    //改变数值
                    if (ellipsisNum) {
                        let rightNum = Number(this.pageArr[ellipsisNum - 1]) + 1,
                            leftNum = Number(this.pageArr[ellipsisNum + 1]) - 1;
                        if (clickNum == ellipsisNum - 1) {
                            this.pageArr.splice(ellipsisNum, 0, rightNum);
                            this.pageArr.splice(0, 1);
                        } else if (clickNum == 0 && Number(this.pageArr[0]) != 1) {
                            this.pageArr.unshift(Number(this.pageArr[0]) - 1);
                            this.pageArr.splice(ellipsisNum, 1);
                        } else if (clickNum == ellipsisNum + 1) {
                            this.pageArr.splice(ellipsisNum + 1, 0, leftNum);
                            this.pageArr.splice(this.pageArr.length - 1, 1);
                        } else if (clickNum == this.pageArr.length - 1 && Number(this.pageArr[this.pageArr.length - 1] != pagesLength)) {
                            this.pageArr.push(Number(this.pageArr[this.pageArr.length - 1]) + 1);
                            this.pageArr.splice(ellipsisNum, 1);
                        }


                        if (this.pageArr[ellipsisNum + 1] - this.pageArr[clickNum] == 1 || this.pageArr[clickNum] - this.pageArr[ellipsisNum - 1] == 1) {
                            this.pageArr.splice(ellipsisNum, 1);
                        }
                    } else {
                        if (clickNum == 0) {
                            this.pageArr.splice(4, 1, ellipsis);
                            this.pageArr.unshift(Number(this.pageArr[0]) - 1);
                        } else if (clickNum == 7) {
                            this.pageArr.splice(5, 1, ellipsis);
                            this.pageArr.push(Number(this.pageArr[this.pageArr.length - 1]) + 1);
                        }
                    }
                } else {
                    this.pageArr = [];
                    for (let i = 1; i <= Math.ceil(pagesLength); i++) {
                        this.pageArr.push(i);
                    }
                }
            },
        },
        props: {
            totalCount: {
                type: Number,
                required: true
            },
            pageNum: {
                type: Number,
                required: true
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../scss/library/_common-modules";

    .page-container {
        padding-bottom: 30px;
        .pagination {
            height: 36px;
            margin-top: 45px;
            padding: 0;
            .pages {
                text-align: center;
            }
            .pgEmpty {
                color: #eee;
                cursor: default;
            }
            .pgNext {
                width: 50px;
            }
            li {
                display: inline-block;
                width: 36px;
                height: 36px;
                line-height: 36px;
                margin-right: 8px;
                text-align: center;
                color: grey;
                background-color: #fff;
                font-size: 14px;
                overflow: hidden;
                padding: 0;
                cursor: pointer;
            }
            .pgCurrent {
                height: 36px;
                width: 36px;
                background: #3d84c6;
                color: #fff;
            }
        }
    }
</style>
