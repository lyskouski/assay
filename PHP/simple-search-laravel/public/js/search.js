const imgList = document.getElementsByClassName('spa-image');

Array.from(imgList).forEach((el) => {
    el.onclick = () => {
        const result = el.classList.toggle('spa-image--focus');
        if (result) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', window.location + '/../listen', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                image: el.dataset.image,
                _token: document.getElementById('spa-token').value
            }));
        }
    };
});

const bmList = document.getElementsByClassName('spa-save');

Array.from(bmList).forEach((el) => {
    el.onclick = () => {
        const name = 'favorites';
        const cookie = getCookie(name);
        setCookie(name, cookie + el.dataset.scope, 1);
        const item = el.closest('.spa-item');
        document.getElementById('spa-favorites').append(item);
    };
});


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
    }
    return "";
}

function setCookie(cname, cvalue, hours) {
    const d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }