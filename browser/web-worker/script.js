var myWorker = new Worker('task.js');

myWorker.onmessage = function(e) {
	console.log('in mainr:', e.data)
}


myWorker.postMessage({
	msg: 'from main'
})