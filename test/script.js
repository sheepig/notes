

var app = new Vue({
	el: '#app',
	template: '<div><child></child></div>',
	component: {
		child
	}
});

var child = Vue.component('child', {
	name: 'child',
	template: '<div>{{name}}</div>',
	data() {
		return {
			name: 'child'
		}
	}
})








