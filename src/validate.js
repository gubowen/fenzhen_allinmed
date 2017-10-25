/**
 * Created by ALLIN on 2017/8/31.
 */
import Vue from "vue"
import VeeValidate, {Validator} from  'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN';//引入中文文件

//配置中文
Validator.addLocale(zh_CN);

const config = {
  locale: 'zh_CN'
};

Vue.use(VeeValidate, config);

//自定义validate
const dictionary = {
  zh_CN: {
    message: {
      email: () => '请输入正确的邮箱格式',
      required: (field) => "请输入" + field
    },
    attributes: {
      email: '邮箱',
      passWord: '密码',
      name: "姓名",
      userName: '用户名',
      phone:'手机号',
      validateCode:'验证码',
      newPassword:'新密码',
      newPassword2:'新密码',
      mobile:'手机号码',
      mailBox:'邮箱'

    }
  }
};

Validator.updateDictionary(dictionary);

//手机号验证
Validator.extend('mobile', {
  messages: {
    zh_CN: field => field + '输入有误',
  },
  validate: value => {
    return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
  }
});

//邮箱验证
Validator.extend('mailBox', {
  messages: {
    en: (field, args) => {
      return field + "输入有误，请重新输入"
    },
    cn: (field, args) => {
      return field + "输入有误，请重新输入"
    },
    zh_CN: (field, args) => {
      return field + "输入有误，请重新输入"
    }
  },
  validate: value => {
    return (/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g).test(value)
  }
});

//非空判断
Validator.extend('required', {
  messages: {
    en: (field, args) => {
      return field + "不能为空"
    },
    cn: (field, args) => {
      return field + "不能为空"
    },
    zh_CN: (field, args) => {
      return field + "不能为空"
    }
  },
  validate: value => {
    return value.length > 0;
  }
});

//匹配6-20位的任何字类字符，包括下划线。与“[A-Za-z0-9_]”等效。
Validator.extend('passw', {
  messages: {
    en: (field, args) => {
      return field + "长度应在6-20位之间"
    },
    cn: (field, args) => {
      return field + "长度应在6-20位之间"
    },
    zh_CN: (field, args) => {
      return field + "长度应在6-20位之间"
    }
  },
  validate: value => {
    return /^(\w){6,20}$/.test(value)
  }
});

//姓名不能有空格
Validator.extend('nameSpace', {
  messages: {
    en: (field, args) => {
      return field + "不能有空格"
    },
    cn: (field, args) => {
      return field + "不能有空格"
    },
    zh_CN: (field, args) => {
      return field + "不能有空格"
    }
  },
  validate: value => {
    return !/(^\s+)|(\s+$)/g.test(value)
  }
});

//验证码4位阿拉伯
Validator.extend('num_length', {
  messages: {
    en: field => '验证码为4位阿拉伯数字',
    cn: field => '验证码为4位阿拉伯数字',
    zh_CN: field => '验证码为4位阿拉伯数字',
  },
  validate: (value,args) => {
    let len = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i].match(/[^\x00-\xff]/ig) !== null){
        len += 2;
      }
      else{
        len += 1;
      }
    }
    return len === parseInt(args[0]);
  }
});

