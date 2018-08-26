let resolver = function(resolve) {
	var number = 0;
    resolve(++number);
};

new Promise(resolver).then((num) => {
	console.log(num);
}).then((num) => {
	console.log(num)
})







