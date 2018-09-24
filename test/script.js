var btn = document.getElementById('btn');
var box = document.getElementsByClassName('box')[0];
btn.addEventListener('click', function(e) {
	box.className = "box1";
  doBigCal(1000000);
});
function doBigCal(val) {
  while(val > 0) {
    val--;
  }
}