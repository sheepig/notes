// console.log(process.arch);
// console.log(process.memoryUsage());

process.stdin.resume();
process.on('SIGNUP', function() {
    console.log('reloading...');
});
console.log('pid:', process.pid);
// setTimeout(function(){
//     console.log('sending...');
//     process.kill(process.pid, 'SIGNUP');
// }, 3000);
module.exports = {};
