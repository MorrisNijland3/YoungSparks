feather.replace();

function toggleNav() {
    var nav = document.querySelector('.navbar');
    var body = document.querySelector('body');
    var computedStyle = window.getComputedStyle(nav).left;
    if (computedStyle === '-250px') {
        nav.style.left = '0'; 
        body.style.marginLeft = '250px';
    } else {
        nav.style.left = '-250px'; 
        body.style.marginLeft = '0';
    }
}