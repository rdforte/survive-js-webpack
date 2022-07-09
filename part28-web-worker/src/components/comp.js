export default (text = HELLO) => {
	const element = document.createElement('div')
	const worker = new Worker(new URL('./worker.js', import.meta.url))
	const state = { text }

	worker.addEventListener('message', ({ data: { text } }) => {
		console.log('text:', text)
		state.text = text
		element.innerHTML = text
	})

	element.innerHTML = state.text
	element.onclick = () => worker.postMessage({ text: state.text })

	return element
}
