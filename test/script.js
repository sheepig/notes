var App = 
    `<div>
        <child
            @click="clickFromApp">
        </child>
        <component-a></component-a>
    </div>`;

var componentA = Vue.component('component-a', {
    template: '<div>componentA</div>'
});

var Child = Vue.component('child', {
    template: '<div>{{name}}</div>',
    data: function () {
        return {
		    name: 'yang',
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
        Child,
        componentA
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