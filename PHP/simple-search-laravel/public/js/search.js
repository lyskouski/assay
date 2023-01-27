const imgList = document.getElementsByClassName('spa-image');

Array.from(imgList).forEach((el) => {
    el.onclick = () => {
        const result = el.classList.toggle('spa-image--focus');
    };
});