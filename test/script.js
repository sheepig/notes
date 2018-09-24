Vue.use(Vuex);

var state = {
	START_PARAM: {},
	title: 'home page'
};

var mutations =  {
	getParam (state, obj) {
		state['START_PARAM'] = obj;
	}
	
};

var getters = {};
var actions = {};


const moduleA = {
  state: {
  	a: 'aa'
  },
  mutations,
  actions: {},
  getters: {}
}
const moduleB = {
  state: {
  	name: 'bb'
  },
  mutations: {},
  actions: {}
}
const store = new Vuex.Store({
  state: {},
  mutations,
  modules: {
    a: moduleA,
    b: moduleB
  }
})

var child = Vue.component('child', {
	name: 'child',
	template: '<div>{{name}}</div>',
	data() {
		return {
			name: 'child'
		}
	}
})

var app = new Vue({
	el: '#app',
	template: '<div><child></child></div>',
	store,
	component: {
		child
	},
	created() {
		console.log(this.$store)
		this.$store.commit('getParam', {
			key: 1,
		})
	},
	computed: {
		...mapState({
			title: state => state.title
		})
	}
});










