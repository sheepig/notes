var App = 
    `<div>
        <child
            @hook:created="hookFromApp"
            v-bind:appmsg="msg"
            @click="clickFromApp">
        </child>
    </div>`;

var Child = Vue.component('child', {
    template: '<div>{{hello}}<input v-model="hello"></input></div>',
    data: function () {
        return {
            childMsg: 'msg from child',
            hello: '',
            egg: {
            	e1: 1,
            	e2: 2
            }
        }
    },
    watch: {
    	hello: 'ogg'
    },
    props: {
    	appmsg: '',
    	nothing: {
    		type: Boolean
    	}
    },
    methods: {
        showChildMsg() {
        },
        changeHello() {
        	this.hello = '?';
        }
    },
    created() {
    },
    mounted() {
    },
});

new Vue({
    el: '#app',
    template: App,
    data: function(){
        return {
            msg: 'msg from app'
        }
    },
    components: {
        Child
    },
    methods: {
        hookFromApp() {
        	console.log('hookFromApp')
        },
        clickFromApp() {
        }
    },
    created() {
    },
    mounted() {
    }
});