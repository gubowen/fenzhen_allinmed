<template>
  <aside class="medical-record-remark" :class="{on:showRecord}">
    <header class="medical-record-remark-header">
      <section class="remark-add">
        <p class="remark-build" :class="{'remark-new':showAdd}" v-show="showRecord" @click.stop="remarkValue='';showAdd=!showAdd;addType='add';showConfim=false;"><i></i><span>{{showAdd?"返回":"添加"}}</span></p>
        <h3 class="remark-name" v-show="!showRecord" @click.stop="showRecord=true"><i></i><span>展开添加分诊记录</span></h3>
        <p class="remark-toggle" v-show="showRecord" @click.stop="showRecord=false"><i></i><span>收起分诊记录</span></p>
      </section>
    </header>

    <section class="medical-record-remark-content">
      <section class="date" :class="{'active':!showAdd}">
        <article class="remark-content-item" v-for="(item,index) in remarkList">
          <p class="text" @click="remarkValue = item.remarkContent;remarkId=item.id;showAdd=!showAdd;addType='update';showConfim=false;">{{item.remarkContent}}</p>
          <p class="time">{{getTime(item)}}</p>
          <i class="delete" @click="showConfim=!showConfim;showConfimIndex=index"></i>
          <confirm :comfirmContent="confimContent" v-if="showConfim&&showConfimIndex==index" @ensureCallback="deleteRemrak(item)" @cancelCallback="showConfim=!showConfim"></confirm>
        </article>
      </section>
      <section class="edit" :class="{'active':showAdd}">
        <textarea placeholder="请填写" maxlength="200" class="J-textArea-remark"  v-model="remarkValue"></textarea>
        <button class="saveButton" @click="addRemrak">保存</button>
      </section>
    </section>
  </aside>
</template>
<script type="text/ecmascript-6">
  import ajax from "../common/js/ajax";
  import confirm from "../common/smallConfirm"
  const XHRList = {
    update: "/call/customer/patient/case/remark/v1/create/",
    list: "/call/customer/patient/case/remark/v1/getMapList/",
    deleteList: "/call/customer/patient/case/remark/v1/update/"
  };
  export default{
    data(){
        return {
          showRecord:false,
          showAdd:false,
          showConfim:false,
          showConfimIndex:"",
          addType:"add",
          remarkValue:"",
          remarkId:"",
          remarkList:[]
        }
    },
    mounted(){
        this.getRemarkList();
    },
    watch:{
       '$store.state.currentItem'(){
           this.getRemarkList();
       }
    },
    methods:{
      getRemarkList(){
        let that = this;
        ajax({
          url: XHRList.list,
          method: 'POST',
          data: {
            caseId: that.$store.state.caseId,
            isValid: "1",
            firstResult: "0",
            maxResult: "9999"
          },
          done(data){
            if (data.responseObject.responseData) {
              if(data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length>0){
                that.remarkList = data.responseObject.responseData.dataList.reverse();
              }else{
                that.remarkList=[]
              }
            }
          }
        })
      },
      getTime(opt){
        if(opt.time){
          return opt.time
        }else{
          let d = opt.createTime.replace(/-/g, "/"),
          f = d.substring(2, 10),
            y = f.substring(0, 2),
            m = f.substring(3, 5).indexOf("0") === 0 ? f.substring(4, 5) : f.substring(3, 5),
            dd = f.substring(6, 8),
            s = d.substring(10).substring(0, 6),
            time = y + "/" + m + "/" + dd + s;
          return time;
        }
      },
      addRemrak(){
        let that = this;
        if(this.addType == "add"){
          ajax({
            url: XHRList.update,
            method: 'POST',
            data: {
              patientId: that.$store.state.patientId,
              caseId: that.$store.state.caseId,
              operatorId: that.$store.state.userId,
              operatorType: "1",
              remarkContent: that.remarkValue
            },
            done(data){
              if (data.responseObject.responseStatus) {
                let D = new Date(),
                  y = D.getFullYear(),
                  m = D.getMonth(),
                  d = D.getDate(),
                  h = D.getHours(),
                  mm = D.getMinutes(),
                  time = (y + "").substring(2) + "/" + m + "/" + d + " " + h + ":" + mm;
                that.showAdd = !that.showAdd;
                that.remarkList.unshift({
                  remarkContent: that.remarkValue,
                  time: time,
                  id: data.responseObject.responsePk
                })
              }
            }
          })
        }else if(this.addType == "update"){
          ajax({
            url: XHRList.deleteList,
            method: 'POST',
            data: {
              id: that.remarkId,
              remarkContent: that.remarkValue
            },
            done(data){
              if (data.responseObject.responseStatus) {
                that.getRemarkList();
                that.showAdd = !that.showAdd;
              }
            }
          })
        }
      },
      deleteRemrak(opt){
        let that = this;
        ajax({
          url: XHRList.deleteList,
          method: 'POST',
          data: {
            id: opt.id,
            isValid: "0"
          },
          done(data){
            if (data.responseObject.responseStatus) {
              that.showConfim=!that.showConfim;
              that.remarkList.forEach(function (element,index) {
                if(opt.id==element.id){
                  that.remarkList.splice(index,1);
                  return false;
                }
              })
            }
          }
        })
      }
    },
    components:{
      confirm
    },
    computed:{
      confimContent(){
        return "确定删除该条备注吗?"
      }
    },
    props:{

    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../scss/base";
  .medical-record-remark {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 340px;
    z-index: 3;
    transform: translateY(88%);
    background-color: #fff;
    overflow: hidden;
    transition:all 0.2s ease-in-out;
    &-header {
      background-color: #eceff6;
      text-align: center;
      height: 40px;
      line-height: 40px;
      @include clearfix();
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 14px;

      section {
        & > h3 {
          font-weight: normal;
          font-size: 14px;
          display: inline-block;
          color: #6B748C;
          letter-spacing: 0;
          line-height: 40px;
          cursor: pointer;
          i {
            background: url("../assets/img00/employee/home_note_default.png") no-repeat;
            width: 18px;
            height: 18px;
            display: inline-block;
            top: 0;
            margin-right: 4px;
            cursor: pointer;
            vertical-align: baseline;
          }
        }

        & > .remark-time {
          font-size: 14px;
          color: #909090;
          letter-spacing: 0;
          line-height: 12px;
        }

        .remark-build {
          float: left;
          font-size: 14px;
          color: #6B748C;
          letter-spacing: 0;
          line-height: 40px;
          cursor: pointer;
          i {
            background: url("../assets/img00/employee/home_note_add.png") no-repeat;
            width: 12px;
            height: 12px;
            display: inline-block;
            top: 0;
            margin-right: 4px;
            cursor: pointer;
            vertical-align: baseline;
          }
        }

        .remark-new {
          i {
            background: url("../assets/img00/employee/home_note_return.png") no-repeat;
          }
        }
        .remark-back {
          float: left;
          font-size: 14px;
          color: #6B748C;
          letter-spacing: 0;
          line-height: 40px;
          cursor: pointer;
          display: none;
          &.on {
            display: block;
          }
          i {
            background: url("../assets/img00/employee/home_note_return.png") no-repeat;
            width: 12px;
            height: 12px;
            display: inline-block;
            top: 0;
            margin-right: 4px;
            cursor: pointer;
            vertical-align: baseline;
          }
        }

        .remark-toggle {
          //float: right;
          font-size: 14px;
          color: #6B748C;
          letter-spacing: 0;
          line-height: 40px;
          cursor: pointer;
          i {
            background: url("../assets/img00/employee/arrow_pack_down.png") no-repeat;
            width: 12px;
            height: 12px;
            display: inline-block;
            top: 0;
            margin-right: 4px;
            cursor: pointer;
            vertical-align: middle;
          }
        }
      }
      .active {
        display: block;
      }
    }
    &-content {
      //padding: 0 15px;
      height: 88%;
      overflow: auto;
      .date {
        display: none
      }
      .edit {
        height: 100%;
        width: 100%;
        display: none;
        .text {
          padding: 20px;
          box-sizing: border-box;
          height: 300px;
          line-height:1.2;
          outline: medium;
        }
        textarea{
          padding: 20px;
          box-sizing: border-box;
          height: 280px;
          width:100%;
          line-height:1.2;
          outline: medium;
        }


        .saveButton {
          font-size: 13px;
          color: #7A8EC1;
          letter-spacing: 0;
          line-height: 30px;
          border: 1px solid #7A8EC1;
          border-radius: 4px;
          width: 70px;
          height: 30px;
          position: absolute;
          bottom: 20px;
          right: 20px;
          cursor: pointer;
        }
      }
      .active {
        display: block;
      }
      .modal-confirm{
        top: 80%;
        right: 14px;
        left:auto;
      }
    }
    .medical-record-remark-content{display: none;}
    &.on {
      transform: translateY(0);
      .medical-record-remark-content{display: block;}
    }
  }
  .remark-content-item {
    padding: 20px 15px;
    box-sizing: border-box;
    height: 75px;
    position: relative;
    // border-bottom: 1px solid #e7e7e7;
    background: #FAFBFD;
    box-shadow: 0 0 8px 0 rgba(179, 205, 199, 0.45);
    transition: all 0.2s linear;
    & > .text {
      font-size: 14px;
      color: #222222;
      letter-spacing: 0;
      line-height: 14px;
      width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    & > .time {
      font-size: 14px;
      color: #909090;
      margin-top: 10px;
      letter-spacing: 0;
      line-height: 12px;
    }
    &:hover {
      .delete {
        background: url("../assets/img00/index/home_note_delete.png") no-repeat;
        width: 18px;
        height: 18px;
        display: inline-block;
        position: absolute;
        right: 20px;
        top: 28px;
        cursor: pointer;
      }
    }
  }
</style>
