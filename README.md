## 仿iOS省市区三级联动

``` bash
A Vue.js project

本实例是基于vue 2.0和mint-ui 2.0仿iOS省市区三级联动
```

> 效果

![Image text](https://raw.githubusercontent.com/chilliness/linkage/master/src/assets/demo.gif)

> 注意事项

``` bash
1、所用数据和组件均在src/components/linkage文件夹

2、本实例是用vue-cli提供的webpack模板构建

3、CSS代码使用了sass编写，JS代码部分使用了ES6

4、如果你想直接使用，请确保你安装了mint-ui、node-sass、sass-loader及babel

5、使用的时候请在main.js中加入下面三行代码

import 'mint-ui/lib/style.css';
import {Picker} from 'mint-ui';
Vue.component(Picker.name, Picker);
```

> 最后一句

虽然[mint-ui](http://mint-ui.github.io/#!/zh-cn)功能强大，但是官方文档做的不太友好，希望官方能借鉴一下[element ui](http://element.eleme.io/#/zh-CN)的文档，最后感谢饿了么团队的无私奉献。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
