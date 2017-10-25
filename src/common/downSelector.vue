/**
* @name:下拉选择
* @desc:
* @example:
* @depend:
* @date: 2017/10/18
* @author: gubowen
*/
<template>
  <section class="search-sortType-item">
    <ul class="search-selector">
      <input class="custom-selector-title firstListTitle" value="" :placeholder="dataListInfo.placeholderText" readonly @click="showData()" v-model="resultData" :disabled="dataListInfo.disabledFlag"/>
      <i :class="iconFlag ? 'icon-upArrow' : 'icon-downArrow'"></i>
      <section class="search-selector-second-box">
        <div class="custom-selector-second firstList" v-show="dataShow">
          <li class="custom-selector-item result-item" v-for="(item,index) in dataListInfo.dataList" @click="selectData(item,index)" :class="{'active':index == currentIndex}">
            <span v-show="item.tagName!=''" >{{item.tagName}}</span>
            <span v-show="item.illnessName!=''" >{{item.illnessName}}</span>
            <span v-show="item.progressName!=''" >{{item.progressName}}</span>
            <span v-show="item.operationName!=''" >{{item.operationName}}</span>
          </li>
        </div>
        <div class="custom-selector-second custom-selector-second-list secondList">
          <ul v-for="(item,index) in dataListInfo.dataList">
            <li class="custom-selector-item result-item" :class="{'active':index == oldIndex && IndexChildren==currentIndexChildren}" v-for="(itemChildren,IndexChildren) in item.children" v-if="index == currentIndex && secondActive" @click="childrenData(itemChildren,IndexChildren)">
              <span>{{itemChildren.operationName}}</span>
            </li>
          </ul>
        </div>
      </section>
    </ul>
  </section>
</template>
<script>
  export default{
    name: 'search-sorType-item',
    data(){
      return {
        dataShow: false,
        iconFlag: false,
        resultData: '',
        currentIndex: -1,
        oldIndex:-1,
        secondActive:true,
        currentIndexChildren:-1
      }
    },
    props: {
      dataListInfo: {
        type: Object
      }
    },
    methods: {
      init(){
      },
      showData(){
        this.dataShow = !this.dataShow;
        this.iconFlag = !this.iconFlag;
      },
      selectData(item, index){
        let _this = this;
        _this.currentIndex = index;
        _this.secondActive = true;
        if (item.tagName) {
          this.resultData = item.tagName;
          _this.$emit('update:dataBack', item);
          this.dataShow = !this.dataShow;
          this.iconFlag = !this.iconFlag;
        } else if (item.illnessName) {
          this.resultData = item.illnessName;
          _this.$emit('update:dataBack', item);
          this.dataShow = !this.dataShow;
          this.iconFlag = !this.iconFlag;
        } else if (item.progressName) {
          this.resultData = item.progressName;
          _this.$emit('update:dataBack', item.progressName);
          this.dataShow = !this.dataShow;
          this.iconFlag = !this.iconFlag;
        } else if (item.operationName) {
          if (item.children.length > 0) {
          } else {
            _this.resultData = item.operationName;
            _this.$emit('update:dataBack', item);
            this.dataShow = !this.dataShow;
            this.iconFlag = !this.iconFlag;
          }
        }
      },
      childrenData(item,index){
        this.oldIndex = this.currentIndex;
        this.secondActive=false;
        this.resultData = item.operationName;
        this.currentIndexChildren = index;
        this.dataShow = !this.dataShow;
        this.iconFlag = !this.iconFlag;
        this.$emit('update:dataBack',item);
      }
    }, mounted(){
      this.init()
    }
  }
</script>
<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
  .search-sortType {
    background-color: #fff;
    text-align: center;
    padding: 30px 0;
    display: inline-block;
    i {
      cursor: pointer;
    }

    &-item {
      font-size: 14px;
      color: #AAAAAA;
      letter-spacing: 0;
      line-height: 14px;
      border: 1px solid #F9F9F9;
      border-radius: 4px;
      background: #F9F9F9;
      margin-right: 17px;
      width: 130px;
      height: 30px;
    }

    &-item:last-child {
      margin-right: 0;
    }

    &-item.long-item {
      width: 202px;
    }

    .search-selector {
      display: inline-block;
      cursor: pointer;
      height: 100%;
      width: 100%;
      position: relative;
      border-radius: 4px;
      border: 1px solid #e1e2e7;
      text-align: left;

      & > h3 {
        font-weight: normal;
        font-size: 14px;
        color: #AAAAAA;
        display: inline-block;
        line-height: 14px;
        height: 100%;
        width: 100%;
        padding: 8px 10px;
        box-sizing: border-box;
        text-align: left;
      }
      & > input {
        font-weight: normal;
        font-size: 14px;
        color: #222222;
        display: inline-block;
        line-height: 14px;
        height: 100%;
        width: 90%;
        padding: 8px 10px;
        box-sizing: border-box;
        text-align: left;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        //   border-radius: 4px;
        //   border: 1px solid #E1E2E7;
      }

      & > input.disable {
        border: 1px solid #F9F9F9;
      }

      //& > input:focus{
      //  border: 1px solid #E1E2E7;
      //}

      & > .icon-downArrow {
        position: absolute;
        top: 10px;
        right: 0;
      }
      & > .icon-upArrow {
        position: absolute;
        top: 10px;
        right: 0;
      }

      .time-title {
        font-size: 14px;
        font-weight: normal;
        margin-top: 15px;
      }

      .search-selector-second-box {
        position: absolute;
        z-index: 5;
        text-align: left;
        font-size: 0;
        width: 700px;
        margin-left: 0;
        margin-top: 10px;

      }

      .custom-selector-second {
        display: inline-block;
        min-width: 130px;
        width: auto;
        font-size: 14px;
        color: #222222;
        letter-spacing: 0;
        line-height: 14px;
        vertical-align: top;
        text-align: left;
        box-sizing: border-box;
        padding: 0;
        max-height: 336px;
        overflow: auto;
        border-radius: 5px;
        box-shadow: 0 0 15px #666;
        background-color: #fff;

        &.custom-selector-second-list {
          right: -100%;
        }
        & > .search-icon-rightArrow {
          position: relative;
          &:before {
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            position: absolute;
            right: 9px;
            top: 13px;
            background: url("/image/img00/common/arrow_enter.png") no-repeat;
          }

        }

        .custom-selector-item {
          padding: 10px 18px;
          box-sizing: border-box;
          width: 100%;
          margin: 0;
          & > span {
            display: block;
          }

          &.active {
            background: #F6F9FA;
          }
          &.active > span {
            color: #2899e6;
          }
        }
      }

    }

    #sick-selector {
      .custom-selector-second {

        width: 202px;
      }
      .no-data {
        padding-top: 24px;
        padding-bottom: 24px;
        text-align: center;
        color: #bbb;

      }
    }
  }
</style>
