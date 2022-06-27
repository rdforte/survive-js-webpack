// import lazy from './lazy' // ! not lazy

export default (text = HELLO) => {
	const element = document.createElement('div')

	element.className = 'rounded bg-red-100 border max-w-md m-4 p-4'
	element.innerHTML = text

	// element.onclick = () => (element.textContent = lazy) // ! not lazy

	// LAZY Loading module using dyanmic import
	element.onclick = () =>
		import('./lazy')
			.then(lazy => (element.textContent = lazy.default))
			.catch(err => console.log(err))

	return element
}
