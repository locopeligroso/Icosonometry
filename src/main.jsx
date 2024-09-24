import "./styles.css"
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App.jsx'
import { StrictMode } from 'react'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'


const root = ReactDOM.createRoot(document.querySelector('#root'))

const created = ({ scene }) => {
  scene.background = new THREE.Color("#303035")
}

root.render(
  <StrictMode>

    <Canvas shadows onCreated={created}>
      <Perf position="top-left" />
      <App />
    </Canvas>
  </StrictMode>
)
