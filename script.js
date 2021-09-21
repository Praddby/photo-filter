const attrs = [
	{name: 'blur', val: 0, sizing: 'px'},
	{name: 'invert', val: 0, sizing: '%'},
	{name: 'sepia', val: 0, sizing: '%'},
	{name: 'saturate', val: 100, sizing: '%'},
	{name: 'hue', val: 0, sizing: 'deg'},
];
const root = document.querySelector(':root');
const editor = document.querySelector('.editor');
const filter = document.querySelector('.filters');
const btnFullScreen = document.querySelector('.fullscreen');
const imgTag = document.querySelector('img');
let numberImeg = 1;

resetting();

function resetting() {
	attrs.forEach(it => {
		root.style.setProperty('--' + it.name, it.val + it.sizing);
		document.querySelector(`input[name=${it.name}]`).value = it.val;
		document.querySelector(`input[name=${it.name}] + output`).innerText = it.val;
	})
}

function nextImg(number) {
	const img = new Image();
	const hours = (new Date()).getHours();
	let src = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
	if (hours >= 6 && hours < 12) src += 'morning/';
	else if (hours >= 12 && hours < 17) src += 'day/';
	else if (hours >= 18 && hours < 23) src += 'evening/';
	else src += 'night/';
	src += (''+number).length === 1 ? '0' + number + '.jpg' : number + '.jpg';
	img.src = src;
	imgTag.style.setProperty('opacity', 0.1);
	img.onload = () => {
		setTimeout(function () {
			imgTag.style.setProperty('opacity', 1);
			imgTag.src = src;
		}, 200);
	}
	number === 20 ? numberImeg = 1 : numberImeg++;
}

function loadImg() {
	const btnLoad = document.querySelector('#btnInput')
	const file = btnLoad.files[0];
	console.log('btnLoad', btnLoad)
	console.log('file', file)
	if (file) {
		imgTag.style.setProperty('opacity', 0.1)
		setTimeout(function () {
			imgTag.style.setProperty('opacity', 1);
			imgTag.src = URL.createObjectURL(file);
		}, 200)
	}
	btnLoad.value = null;
}

function saveImg() {
	const img = new Image();
	const canvas = document.createElement('canvas');
	img.setAttribute('crossOrigin', 'anonymous');
	img.src = imgTag.src;
	img.onload = () => {
		canvas.width = imgTag.naturalWidth;
		canvas.height = imgTag.naturalHeight;
		const ctx = canvas.getContext('2d');
		let filtersStr = '';
		for (let i of root.style) {
			if (i === '--hue') {
				filtersStr += `hue-rotate(${root.style.getPropertyValue(i)})`; 
			} else if (i === '--blur') {
				filtersStr += `blur(${+(root.style.getPropertyValue(i).slice(0, -2))*(imgTag.naturalWidth/imgTag.width)}px) `;
			} else {
				filtersStr += `${i.slice(2)}(${root.style.getPropertyValue(i)}) `;
			}
		}
		ctx.filter = filtersStr;
		ctx.drawImage(img, 0, 0);
		let link = document.createElement('a');
		link.href = canvas.toDataURL("image/png");
		link.download = 'download.png';
		link.click();
		link.delete;
	}
}

filter.addEventListener('input', e => {
	root.style.setProperty('--' + e.target.name, e.target.value + e.target.dataset.sizing);
	document.querySelector(`input[name=${e.target.name}] + output`).innerText = e.target.value;
})

editor.addEventListener('click', e => {
	if (e.target.type === 'submit') {
		document.querySelector('.btn-active').classList.remove('btn-active');
		e.target.classList.add('btn-active');
		if (e.target.classList.contains('btn-reset')) resetting();
		if (e.target.classList.contains('btn-next')) nextImg(numberImeg);
		if (e.target.classList.contains('btn-save')) saveImg();
	}
	if (e.target.type === 'file') {
		document.querySelector('.btn-active').classList.remove('btn-active');
		document.querySelector('label.btn-load').classList.add('btn-active');
	}
})

editor.addEventListener('change', e => {
	if (e.target.type === 'file') loadImg();
})

btnFullScreen.addEventListener('click', () => {
	document.fullscreenElement ? document.exitFullscreen() : document.querySelector('body').requestFullscreen();
})