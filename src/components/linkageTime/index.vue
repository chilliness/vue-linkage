<template>
  <LinkageBase :cancelText="cancelText" :confirmText="confirmText" :list="list" :initVal="initVal" @cancel="handleCancel" @confirm="handleConfirm" @over="handleOver" @init="handleInit" :isShow="isShow"></LinkageBase>
</template>

<script>
import LinkageBase from '../linkageBase';

export default {
  name: 'LinkageTime',
  components: { LinkageBase },
  props: {
    initVal: {
      type: Array,
      default() {
        return [];
      }
    },
    isShow: {
      type: Boolean,
      require: false
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  data() {
    let hourList = [...''.padEnd(24)].map((v, i) => ({
      val: String(i).padStart(2, '0')
    }));
    let minuteList = [...''.padEnd(60)].map((v, i) => ({
      val: String(i).padStart(2, '0')
    }));
    let secondList = [...''.padEnd(60)].map((v, i) => ({
      val: String(i).padStart(2, '0')
    }));

    return {
      list: [hourList, minuteList, secondList]
    };
  },
  methods: {
    handleCancel(res) {
      this.$emit('cancel', res);
    },
    handleConfirm(res) {
      this.$emit('confirm', res);
    },
    handleOver(res) {
      this.$emit('over', res);
    },
    handleInit(res) {
      this.$emit('init', res);
    }
  }
};
</script>

<style lang="scss" scoped></style>
