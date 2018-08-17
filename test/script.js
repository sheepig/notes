var App = 
    `<div>
        <child></child>
        <component-a></component-a>
    </div>`;

var componentA = Vue.component('component-a', {
    template: '<div>{{name}}</div>',
    data: function() {
        return {
            name: 'component-A'
        }
    }
});

var Child = Vue.component('child', {
    template: '<div><span>{{name}}</span><span>{{desc}}</span><button @click="change">change name</button></div>',
    data: function () {
        return {
		    name: 'yang',
            desc: 'child'
        }
    },
    methods: {
        change() {
            this.name = "woo";
        }
    }
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
    }
});