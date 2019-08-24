<template>
  <LinkageBase :cancelText="cancelText" :confirmText="confirmText" :list="list" :initVal="initVal" :linkageVal="linkageVal" @cancel="handleCancel" @confirm="handleConfirm" @over="handleOver" @init="handleInit" :isShow="isShow"></LinkageBase>
</template>

<script>
import LinkageBase from '../linkageBase';

export default {
  name: 'LinkageDate',
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
    let yearList = [];
    let range = { min: -5, max: 5 };
    let year = String(new Date().getFullYear());

    for (let i = range.min; i <= range.max; i++) {
      yearList.push({ val: String(+year + i) });
    }

    let monthList = [...''.padEnd(12)].map((v, i) => ({
      val: String(i + 1).padStart(2, '0')
    }));
    let dateList = [...''.padEnd(31)].map((v, i) => ({
      val: String(i + 1).padStart(2, '0')
    }));

    return {
      list: [yearList, monthList, dateList],
      linkageVal: []
    };
  },
  mounted() {
    this.handleInitPos();
  },
  methods: {
    handleInitPos() {
      if (!this.initVal.length) {
        return;
      }

      let [year, month, date] = this.initVal;
      let oYear = this.list[0].find(item => item.val === year);
      if (oYear === undefined) {
        return;
      }

      let oMonth = this.list[1].find(item => item.val === month);
      if (oMonth === undefined) {
        return;
      }

      let oDate = this.list[2].find(item => item.val === date);
      if (oDate === undefined) {
        return;
      }

      let days = new Date(year, month, 0).getDate();
      let dateList = [...''.padEnd(days)].map((v, i) => ({
        val: String(i + 1).padStart(2, '0')
      }));
      this.list = [this.list[0], this.list[1], dateList];
    },
    handleCancel(res) {
      this.$emit('cancel', res);
    },
    handleConfirm(res) {
      this.$emit('confirm', res);
    },
    handleOver(res) {
      let { which, val, bool } = res;
      this.$emit('over', res);

      // 这步判断是必须的，防止获取不到数据报错
      if (!bool) {
        return;
      }

      if (which !== 2) {
        let days = new Date(val[0], val[1], 0).getDate();
        let dateList = [...''.padEnd(days)].map((v, i) => ({
          val: String(i + 1).padStart(2, '0')
        }));
        this.list = [this.list[0], this.list[1], dateList];

        if (days < val[2]) {
          this.linkageVal = [null, null, String(days).padStart(2, '0')];
        }
      }
    },
    handleInit(res) {
      this.$emit('init', res);
    }
  }
};
</script>

<style lang="scss" scoped></style>
