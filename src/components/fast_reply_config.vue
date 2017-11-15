<template>
  <section class="main-masker jump-box-config-box fast-reply-config on">
    <section class="jump-box-config">
      <i class="icon-close window-close" @click="$store.state.fastReplyConfig = false"></i>
      <header class="jump-box-config-title">
        <article>
          <h2>编辑快速提问</h2>
        </article>
        <button class="jump-box-add-term icon-add-term" @click="termShowFlag[-1]=true"><span>添加分组</span></button>
      </header>
      <section class="jump-box-term-box" id="ev-fast-reply-box">
        <section class="jump-box-term-add" v-if="termShowFlag[-1]">
          <input type="text" class="add-input" placeholder="请输入疾病部位名称" v-model="addInputContent"
                 @input="contentLimit('term','-1')"/>
          <figure class="term-add-button">
            <button class="btn-primary" @click.stop="configCallback('addTerm')">保存</button>
            <p class="term-add-cancel" @click.stop="termShowFlag[-1]=false">取消</p>
          </figure>
        </section>

        <section class="jump-box-term" v-for="(item,index) in termList" :class="{'active':termShowFlag[index]}"
                 @click="termShowFlag[index]=!termShowFlag[index]">
          <article class="jump-box-term-title">
            <i class="icon-term-downArrow"></i>
            <h3 v-show="!termFixFlag[index]">{{item.questionDesc}}</h3>
            <figure class="jump-box-term-button" v-if="item.questionType==2" v-show="!termFixFlag[index]">
              <p class="fix" @click.stop="termFixFlag[index]=true;termFixContent[index]=item.questionDesc">修改</p>
              <p class="del" @click.stop="deleteShowFlag(index)">删除

                <section class="modal-confirm show" v-if="deleteTermShowFlag[index]">
                  <article class="modal-confirm-content">
              <p>确定删除该分组吗？</p>
              <p>删除后该分组的相关问题会一起删除</p>
          </article>
          <figure class="modal-confirm-button">
            <button class="btn-ensure modal-confirm-ensure" @click.stop="deleteCallback('term',item,index)">确定</button>
            <button class="btn-primary modal-confirm-cancel" @click.stop="deleteTermShowFlag[index]=false">取消</button>
          </figure>
        </section>
        </p>
        </figure>
        <section class="jump-box-term-add" v-if="termFixFlag[index]" @click.stop="">
          <input type="text" class="add-input" placeholder="请输入分组名称" v-model="termFixContent[index]"
                 @input="contentLimit('term',index)"/>
          <figure class="term-add-button">
            <button class="btn-primary term-add-save" @click.stop="configCallback('fixTerm',item,index)">保存</button>
            <p class="term-add-cancel" @click.stop="termFixFlag[index]=false">取消</p></figure>
        </section>
        </article>
        <section class="jump-box-member" @click.stop="">
          <header class="jump-box-member-title">
            <span>相关问题</span>
            <p class="jump-box-member-add icon-add-question" @click.stop="memberFixFlag[index]['-1']=true">
              <span>添加问题</span>
            </p>
          </header>
          <article class="jump-box-member-box">
            <section class="jump-box-member-config" v-if="memberFixFlag[index]['-1']">
              <input type="text" class="jump-box-member-input" placeholder="请输入疾病部位名称"
                     v-model="memberFixContent[index]['-1']" @input="contentLimit('member',index,'-1')"/>
              <figure class="member-add-button">
                <button class="btn-primary member-add-save" @click.stop="configCallback('addMember',item,index)">保存

                </button>
                <i class="icon-member-add-cancel" @click.stop="memberFixFlag[index]['-1']=false"></i>
              </figure>
            </section>
            <article class="jump-box-member-item" v-for="(cItem,cIndex) in item.children" :key="cIndex">
              <span v-show="!memberFixFlag[index][cIndex]">{{cItem.questionDesc}}</span>
              <figure class="jump-box-member-item-button" v-if="cItem.questionType==2"
                      v-show="!memberFixFlag[index][cIndex]">
                <i class="icon-question-config"
                   @click.stop="memberFixFlag[index][cIndex]=true;memberFixContent[index][cIndex]=cItem.questionDesc"></i>
                <i class="icon-question-delete" @click.stop="deleteMemberShowSwitch(index,cIndex)">
                  <section class="modal-confirm show" v-if="deleteMemberShowFlag[index][cIndex]">
                    <article class="modal-confirm-content"><p>确定删除该问题吗？</p></article>
                    <figure class="modal-confirm-button">
                      <button class="btn-ensure modal-confirm-ensure"
                              @click.stop="deleteCallback('member',item,index,cItem,cIndex)">确定

                      </button>
                      <button class="btn-primary modal-confirm-cancel"
                              @click.stop="deleteMemberShowFlag[index][cIndex]=false">取消

                      </button>
                    </figure>
                  </section>
                </i>
              </figure>
              <section class="jump-box-member-config" v-if="memberFixFlag[index][cIndex]">
                <input type="text" class="jump-box-member-input" placeholder="请输入快捷提问"
                       v-model="memberFixContent[index][cIndex]" @input="contentLimit('member',index,cIndex)"/>
                <figure class="member-add-button">
                  <button class="btn-primary member-add-save"
                          @click.stop="configCallback('fixMember',item,index,cItem,cIndex)">保存

                  </button>
                  <p class="term-add-cancel" @click.stop="memberFixFlag[index][cIndex]=false">取消</p></figure>
              </section>
            </article>
          </article>
        </section>
      </section>
    </section>
  </section>
  </section>
</template>
<script>
  /**
   * @Desc：快速回复
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/10/19
   */

  import ajax from "@/common/js/ajax";
  import api from "@/common/js/util";
  const XHRList = {
    deleteTerm: "/call/customer/quick/question/v1/delete/",
    fixTerm: "/call/customer/quick/question/v1/save/",
    getTerm: "/call/customer/quick/question/v1/getMapList/"
  }
  export default{
    name: 'fast-reply-config',
    data(){
      return {
        termList: [],
        termShowFlag: {
          "-1": false
        },
        termFixFlag: {
          "-1": false
        },
        termFixContent: {
          "-1": ""
        },
        addInputContent: "",
        memberFixFlag: {},
        memberFixContent: {},
        deleteTermShowFlag: {},
        deleteMemberShowFlag: {}
      }
    },
    mounted(){
      this.getConfigList();
    },
    methods: {
      getConfigList(){
        let that = this;
        ajax({
          url: XHRList.getTerm,
          method: "POST",
          data: {
            sessionCustomerId: this.$store.state.userId,
            isValid: "1",
            firstResult: "0",
            maxResult: "1000",
            sortType: "2",
            sortPartIdList: "",

          },
          done(res){
            console.log(res)
            if (res.responseObject.responseData) {
              let dataList = res.responseObject.responseData.dataList;
              if (dataList && dataList.length !== 0) {
                that.termList = dataList;
                that.baseListInstall(dataList);
              }
            }
          },
          fail(){

          }
        })
      },
      baseListInstall(dataList){
        dataList.forEach((element, index) => {
          this.$set(this.termShowFlag, index, false);
          this.$set(this.termFixFlag, index, false);
          this.$set(this.termFixContent, index, "");
          this.$set(this.deleteTermShowFlag, index, false);


          this.$set(this.memberFixFlag, index, {
            "-1": false
          });
          this.$set(this.memberFixContent, index, {
            "-1": ""
          });
          this.$set(this.deleteMemberShowFlag, index, {});
          if (element.children) {
            element.children.forEach((eElement, eIndex) => {
              this.$set(this.memberFixFlag[index], eIndex, false)
              this.$set(this.memberFixContent[index], eIndex, "")
              this.$set(this.deleteMemberShowFlag[index], eIndex, false);
            });
          } else {
            element.children = [];
          }
        })
      },
      configCallback(type, item, index, cItem, cIndex){
        let flag = true;
        let that = this;
        let baseItem = {
          item,
          index,
          cItem,
          cIndex
        };
        let params = {
          customerId: this.$store.state.userId,
          treeLevel: 1,
          isValid: "1",
        };
        switch (type) {
          case "addTerm":
            if (!this.addInputContent) {
              this.addInputContent = "";
              this.termShowFlag['-1'] = false;
              flag = false;
            } else {
              params = Object.assign(params, {
                questionDesc: this.addInputContent,
                questionType: "2",
              });
            }
            break;
          case "addMember":
            if (!this.memberFixContent[index][-1]) {
              this.memberFixContent[index]['-1'] = "";
              this.memberFixFlag[index]['-1'] = false;
              flag = false;
            } else {
              params = Object.assign(params, {
                questionDesc: this.memberFixContent[index][-1],
                parentId: item.questionId,
                fullPath: item.fullPath,
                questionType: item.questionType,
              });
            }

            break;
          case "fixTerm":
            if (!this.termFixContent[index]) {
              this.termFixFlag[index] = false;
              flag = false;
            } else {
              params = Object.assign(params, {
                id: item.questionId,
                questionDesc: this.termFixContent[index],
                questionId: item.questionId,
                questionType: "2",
              });
            }
            break;
          case"fixMember":
            if (!this.memberFixContent[index][cIndex]) {
              this.memberFixFlag[index][cIndex] = false;
              flag = false;
            } else {
              params = Object.assign(params, {
                id: cItem.questionId,
                questionDesc: this.memberFixContent[index][cIndex],
                questionId: cItem.questionId,
                fullPath: cItem.fullPath,
                questionType: item.questionType,
              });
            }
            break;
        }
        if (!flag) {
          return;
        }
        this.$store.state.loadingShow = true;
        ajax({
          url: XHRList.fixTerm,
          method: "POST",
          data: params,
          done(res){
            if (res.responseObject.responseData) {
              let data = res.responseObject.responseData.dataList;
              that.$store.state.loadingShow = false;
              that.finishCallback(type, data, baseItem);
            }
          }
        })
      },
      finishCallback(type, params, base){

        switch (type) {
          case "addTerm":
            this.addInputContent = "";
            this.termShowFlag['-1'] = false;
            this.getConfigList();
            break;
          case "addMember":
            this.termList[base.index].children.unshift(params);
            this.memberFixContent[base.index]['-1'] = "";
            this.memberFixFlag[base.index]['-1'] = false;
            this.getConfigList();
            break;
          case "fixTerm":
            this.termList[base.index].questionDesc = this.termFixContent[base.index];
            this.termFixFlag[base.index] = false;
            this.termFixContent[base.index] = "";
            break;
          case "fixMember":
            this.termList[base.index].children[base.cIndex].questionDesc = this.memberFixContent[base.index][base.cIndex];
            this.memberFixContent[base.index][base.cIndex] = "";
            this.memberFixFlag[base.index][base.cIndex] = false;
            break;
        }
      },
      deleteShowFlag(index){
          for (let i in this.deleteTermShowFlag){
              this.deleteTermShowFlag[i]=false;
          }
          this.deleteTermShowFlag[index]=true;
      },
      deleteMemberShowSwitch(index,cIndex){
          for (let i in this.deleteMemberShowFlag[index]){
              this.deleteMemberShowFlag[index][i]=false;
          }
          this.deleteMemberShowFlag[index][cIndex]=true;
      },
      deleteCallback(type, item, index, cItem, cIndex){
        const that = this;
        if (type === "term") {
          ajax({
            url: XHRList.deleteTerm,
            method: "POST",
            data: {
              isValid: "0",
              questionId: item.questionId,
              isBatch: "1"
            },
            done(res){
              if (res.responseObject.responseStatus) {
                that.termList.removeByValue(item);
                that.deleteTermShowFlag[index] = false;
//                delete that.deleteTermShowFlag[index];
              }
            }
          })
        } else if (type === "member") {
          ajax({
            url: XHRList.deleteTerm,
            method: "POST",
            data: {
              isValid: "0",
              questionId: cItem.questionId
            },
            done(res){
              if (res.responseObject.responseStatus) {
                that.termList[index].children.removeByValue(cItem);
                that.deleteMemberShowFlag[index][cIndex] = false;
                delete that.deleteMemberShowFlag[index][cIndex];
              }
            }
          })
        }
      },
      contentLimit(type, index, cIndex){
        if (type === "term") {
          if (api.getByteLen(this.addInputContent) > 40 || api.getByteLen(this.termFixContent[index]) > 40) {
            if (index == -1) {
              this.addInputContent = api.getStrByteLen(this.addInputContent, 40);
            } else {

              this.termFixContent[index] = api.getStrByteLen(this.termFixContent[index], 40);
            }
          }
        } else if (type === "member") {
          if (api.getByteLen(this.memberFixContent[index][cIndex]) > 200) {
            this.memberFixContent[index][cIndex] = api.getStrByteLen(this.memberFixContent[index][cIndex], 200);
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css" rel="stylesheet/scss">
  @import "../scss/base.scss";
  @import "../scss/modules/_fastReplyConfig.scss";
  @import "../scss/modules/_modalBox.scss";
</style>
