/**
 * Some bootstrap code
 */
var layout = document.querySelector('.b-layout');
var previousTargetElement = null;
document.querySelector('.b-nav__button').addEventListener('click', function (e) {
	e.stopPropagation();

	var state = document.body.classList.contains('pushed');
	if (state) {
		closeMenu();
	} else {
		if (document.body.classList.contains('pushing')) {
			return;
		}

		previousTargetElement = document.activeElement;
		previousTargetElement.blur();

		document.body.classList.add('pushed');
		document.body.classList.add('pushing');
	}
});

document.body.addEventListener('click', function (e) {
	if (!e.target || !document.body.classList.contains('pushed')) {
		return;
	}

	if (e.target.closest('.b-layout__push-menu')) {
		return;
	}

	e.preventDefault();
	closeMenu();
});

window.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		if (!document.body.classList.contains('pushed')) {
			return;
		}

		e.preventDefault();
		closeMenu();
	}
});

function closeMenu() {
	if (!document.body.classList.contains('pushed')) {
		return;
	}

	layout.addEventListener('transitionend', transitionEndListener);

	document.body.classList.remove('pushed');
}

function transitionEndListener(e) {
	if (e.target === layout)  {
		layout.removeEventListener('transitionend', transitionEndListener);
		document.body.classList.remove('pushing');

		if (previousTargetElement) {
			previousTargetElement.focus();
		}
	}
}

function breakpointEventListener() {
	if (mq.is('xlarge')) {
		closeMenu();
	}
}
breakpointEventListener();

/**
 * fixing overflow: hidden;
 */
let style = null;

function getBodyScrollWidth() {
	return window.innerWidth - document.body.clientWidth;
}

window.addEventListener('resize', debounce(recalc, 500));
recalc();

function recalc() {
	let scrollbarWidth = getBodyScrollWidth();

	if (!style) {
		style = document.createElement('style');
		document.head.appendChild(style);
	}

	if (scrollbarWidth <= 0) {
		style.innerHTML = '';
	} else {
		style.innerHTML = `.pushed,.pushing{padding-right: ${scrollbarWidth}px}`;
	}
}

function debounce(func, wait, immediate) {
	let timeout;
	return function () {
		let context = this, args = arguments;
		let later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}