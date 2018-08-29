
var i = 0;

function timer(wait) {
	setTimeout(() => {
		console.log('in worker:', i);
		postMessage(i);
	}, wait);
}

timer(4000);

onmessage = function(e) {
	console.log(e.data)
}

console.log(this)