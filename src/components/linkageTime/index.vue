<template>
  <LinkageBase :cancelText="cancelText" :confirmText="confirmText" :list="list" :initVal="initVal" @emitCancel="handleCancel" @emitConfirm="handleConfirm" @emitOver="handleOver" @emitInit="handleInit" :isShow="isShow"></LinkageBase>
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
    let hourList = Array(24)
      .fill('')
      .map((v, i) => ({
        val: String(i).padStart(2, '0')
      }));
    let minuteList = Array(60)
      .fill('')
      .map((v, i) => ({
        val: String(i).padStart(2, '0')
      }));
    let secondList = Array(60)
      .fill('')
      .map((v, i) => ({
        val: String(i).padStart(2, '0')
      }));

    return {
      list: [hourList, minuteList, secondList]
    };
  },
  methods: {
    handleCancel(res) {
      this.$emit('emitCancel', res);
    },
    handleConfirm(res) {
      this.$emit('emitConfirm', res);
    },
    handleOver(res) {
      this.$emit('emitOver', res);
    },
    handleInit(res) {
      this.$emit('emitInit', res);
    }
  }
};
</script>

<style lang="scss" scoped></style>
