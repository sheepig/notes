var App = 
    `<div>
        <child
            @hook:created="hookFromApp"
            :appMsg="msg"
            @click="clickFromApp">
        </child>
    </div>`;

var Child = Vue.component('child', {
    template: '<div>{{appMsg}}</div>',
    data: function () {
        return {
            childMsg: 'msg from child'
        }
    },
    props: ['appMsg'],
    methods: {
        showChildMsg() {
        }
    },
    created() {
    },
    mounted() {
    }
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
        },
        clickFromApp() {
        }
    },
    created() {
    },
    mounted() {
    }
});