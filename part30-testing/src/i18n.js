import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
	const [language, setLanguage] = useState('en')
	const [hello, setHello] = useState('')

	const changeLanguage = () => {
		setLanguage(language == 'en' ? 'fi' : 'en')
	}

	useEffect(() => {
		translate(language, 'hello')
			.then(setHello)
			.catch(err => console.log(err))
	})

	return (
		<div>
			<button onClick={changeLanguage}>Change Language</button>
			<div>{hello}</div>
		</div>
	)
}

const translate = (locale, text) => {
	return getLocaleData(locale).then(messages => messages[text])
}

const getLocaleData = async locale => {
	return import(`./translations/${locale}.json`)
}

const root = document.createElement('div')
root.setAttribute('id', 'app')
document.body.appendChild(root)

ReactDOM.render(<App />, root)
