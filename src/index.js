import Vue from 'vue';
import MyText from './components/text';
import ButtonCounterContainer from './components/demo';


Vue.component('my-component', {
    template: '<span>{{data}}</span>',
    data() {
      return {
        data: 11
      }
    }
  })

var app = new Vue({
    components: {MyText, ButtonCounterContainer},
    el: '#app',
    data: {
      message: 'Hello Vue!1111'
    }
  })