import 'react'
import 'react-dom'
import comp from 'components/comp'
import { bake } from 'components/shake'
import './main.css'

bake()

document.body.appendChild(comp())
