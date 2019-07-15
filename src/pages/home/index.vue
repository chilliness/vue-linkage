<template>
  <div class="home-wrap">
    <div class="img-box">
      <img class="img" src="./img/logo.png" alt="logo">
    </div>
    <!-- 自定义选择 -->
    <div class="input-box">
      <input class="input" type="text" v-model="base">
      <div class="btn" @click="baseFlag = true">自定义选择</div>
    </div>
    <LinkageBase @cancel="baseFlag = false" @confirm="handleConfirm(arguments, 'base')" :isShow="baseFlag"></LinkageBase>
    <!-- 时间选择 -->
    <div class="input-box">
      <input class="input" type="text" v-model="time">
      <div class="btn" @click="timeFlag = true">时间选择</div>
    </div>
    <LinkageTime cancelText="cancel" confirmText="confirm" @cancel="timeFlag = false" @confirm="handleConfirm(arguments, 'time', ':')" :isShow="timeFlag"></LinkageTime>
    <!-- 日期选择 -->
    <div class="input-box">
      <input class="input" type="text" v-model="date">
      <div class="btn" @click="dateFlag = true">日期选择</div>
    </div>
    <LinkageDate @cancel="dateFlag = false" @confirm="handleConfirm(arguments, 'date')" :isShow="dateFlag"></LinkageDate>
    <!-- 地址选择 -->
    <div class="input-box">
      <input class="input" type="text" v-model="addr">
      <div class="btn" @click="addrFlag = true">地址选择</div>
    </div>
    <LinkageAddr :initVal="['海南省', '三亚市', '天涯区']" @cancel="addrFlag = false" @confirm="handleConfirm(arguments, 'addr')" :isShow="addrFlag"></LinkageAddr>
  </div>
</template>

<script>
import LinkageTime from '@/components/linkageTime/index.vue';
import LinkageDate from '@/components/linkageDate/index.vue';
import LinkageAddr from '@/components/linkageAddr/index.vue';

export default {
  name: 'Home',
  components: { LinkageTime, LinkageDate, LinkageAddr },
  data() {
    return {
      base: '',
      baseFlag: false,
      time: '',
      timeFlag: false,
      date: '',
      dateFlag: false,
      addr: '',
      addrFlag: false
    };
  },
  methods: {
    handleConfirm(args, type, divide = '-') {
      let { val, bool } = args[0];
      if (bool) {
        this[type] = val.join(divide);
        this[`${type}Flag`] = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home-wrap {
  font-size: 14px;
  padding: 10px;
  .img-box {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .input-box {
    position: relative;
    display: flex;
    align-items: center;
    height: 38px;
    margin-top: 30px;
    padding-left: 10px;
    border: 1px solid #ccc;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: calc(100% - 100px);
    }
    .input {
      display: flex;
      align-items: center;
      height: inherit;
      font-size: inherit;
      border: 0 none;
      background: none;
      width: calc(100% - 100px);
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: inherit;
      background: #ccc;
    }
  }
}
</style>
