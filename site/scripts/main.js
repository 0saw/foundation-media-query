document.addEventListener('breakpoint-change', breakpointEventListener);

function breakpointEventListener() {
	switch (mq.current) {
		case 'large':
			alert("You've hit the right spot");
			break;
	}
}
