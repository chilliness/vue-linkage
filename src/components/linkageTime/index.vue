<template>
  <LinkageBase :cancelText="cancelText" :confirmText="confirmText" :list="list" :initVal="initVal" @cancel="handleCancel" @confirm="handleConfirm" @over="handleOver" @init="handleInit" :isShow="isShow"></LinkageBase>
</template>

<script>
export default {
  name: 'LinkageTime',
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
    let hourList = Array.from(Array(24).keys(), num => ({
      val: String(num).padStart(2, '0')
    }));
    let minuteList = Array.from(Array(60).keys(), num => ({
      val: String(num).padStart(2, '0')
    }));
    let secondList = Array.from(Array(60).keys(), num => ({
      val: String(num).padStart(2, '0')
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
