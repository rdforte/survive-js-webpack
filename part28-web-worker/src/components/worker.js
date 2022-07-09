self.onmessage = ({ data: { text } }) => {
	self.postMessage({ text: text + ' -> hello from the webworker' })
}
