var wrapper = document.getElementById('wrapper');
window.onload = function() {
	screenSize();
	wrapper.style.height = h + 'px';
}
function screenSize() {
	h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
	return {h:h};
}