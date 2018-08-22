var App = 
    `<div>
        <h1>{{ msg }}</h1>
        <child></child>
    </div>`;

var ComponentA = Vue.component('component-a', {
    template: '<div>component-a</div>'
})

var Child = Vue.component('child', {
    template: 
    		`<div>
    			<h3>{{name}}</h3>
                <component-a/>
    		</div>`,
    components: {
        ComponentA
    },
    data: function () {
        return {
		    name: 'child',
            list: [{
            	key: 1,
            	title: 'item1'
            }, {
            	key: 2,
            	title: 'item2'
            }],
            obj: {
            	a: 'aa'
            }
        }
    },
    methods: {
        addItem() {
        	this.list.push({
        		key: 3,
        		title: 'item3'
        	});
        	this.obj.b = 'bb'
        },
        changeItem3() {
        	this.list[2].title = 'new item3';
        	this.obj.b = 'BBB'
        }
    }
});


var App = new Vue({
    el: '#app',
    template: App,
    data: function(){
        return {
            msg: 'App'
        }
    },
    components: {
        Child,
    }
});










