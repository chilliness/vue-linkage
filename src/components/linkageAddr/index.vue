<template>
  <LinkageBase :cancelText="cancelText" :confirmText="confirmText" :list="list" :initVal="initVal" :linkageVal="linkageVal" @cancel="handleCancel" @confirm="handleConfirm" @over="handleOver" @init="handleInit" :isShow="isShow"></LinkageBase>
</template>

<script>
import { provList, cityList, areaList } from './js/metadata.js';

export default {
  name: 'LinkageAddr',
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
    return {
      list: [provList, cityList, areaList],
      linkageVal: [],
      lastIndex: ''
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

      let [prov, city, area] = this.initVal;
      let oProv = provList.find(item => item.val === prov);
      if (oProv === undefined) {
        return;
      }

      let oCity = oProv.pro_cities.find(item => item.val === city);
      if (oCity === undefined) {
        return;
      }

      let oArea = oCity.city_areas.find(item => item.val === area);
      if (oArea === undefined) {
        return;
      }

      this.list = [provList, oProv.pro_cities, oCity.city_areas];
    },
    handleCancel(res) {
      this.$emit('cancel', res);
    },
    handleConfirm(res) {
      this.$emit('confirm', res);
    },
    handleOver(res) {
      let { which, meta, index, bool } = res;
      let str = String(index);
      this.$emit('over', res);

      // 这步判断是必须的，防止获取不到数据报错
      if (!bool) {
        return;
      }

      if (which === 0) {
        let citys = meta[0].pro_cities;
        let areas = citys[0].city_areas;
        let cityVal = citys[0].val;
        let areaVal = areas[0].val;

        if (this.lastIndex !== str) {
          this.list = [this.list[0], citys, areas];
          this.linkageVal = [null, cityVal, areaVal];
        }
      } else if (which === 1) {
        let areas = meta[1].city_areas;
        let areaVal = areas[0].val;

        if (this.lastIndex !== str) {
          this.list = [this.list[0], this.list[1], areas];
          this.linkageVal = [null, null, areaVal];
        }
      }
      // 记录上次的联动索引，用以判断当前操作是否联动数据
      this.lastIndex = str;
    },
    handleInit(res) {
      this.lastIndex = String(res.index);
      this.$emit('init', res);
    }
  }
};
</script>

<style lang="scss" scoped></style>
