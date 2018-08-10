var App = 
    `<div>
        <child
           
            @click="clickFromApp">
        </child>
    </div>`;

var Child = Vue.component('child', {
    template: '<div>{{name}}></div>',
    data: function () {
        return {
		    name: 'yang',
		    city: 'Beijing',
		    friends: [{
		        name: 'Lizi',
		        city: 'unknow'
		    }, {
		        name: 'Judy',
		        city: 'sg'
		    }],
		    contact: {
		    	phone: '1234566654',
		    	wechat: 'xv221',
		    	qq: '1123342',
		    	emai: {
		    		qq: '2323@qq.com',
		    		netease: '235r@163.com'
		    	}
		    }
        }
    },
    methods: {
        showChildMsg() {
        },
        changeHello() {
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