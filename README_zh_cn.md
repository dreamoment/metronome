<h1 align="center">metronome</h1>

语言: [English](README.md) | 中文简体

## metronome 是什么 ?

循环执行你的代码片段，就像节拍器一样。

> 注意：使用`metronome`之前，请确保浏览器支持`Web Worker`

## 特性

- 轻量易用

- 开关控制

- 帧率调节

- 支持后台运行

- 支持`typescript`

## 安装

```
npm i @dreamoment/metronome
```

## 示例

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import Metronome from '@dreamoment/metronome'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const ambientLight = new THREE.AmbientLight(0xffffff)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1)
scene.add(ambientLight, directionalLight)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const params = {
  FPS: 60,
  enable: true,
  enableRunningInBG: false,
}

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const gui = new GUI()
gui.add(params, 'FPS', 1, 300, 1)
gui.add(params, 'enable')
gui.add(params, 'enableRunningInBG')

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhysicalMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

const animate = (delta: number) => {
  stats.begin()
  cube.rotation.x += 1 * delta
  cube.rotation.y += 1 * delta
  controls.update()
  renderer.render(scene, camera)
  stats.end()
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize)

const metronome = new Metronome(params.FPS)
gui.onFinishChange((payload: any) => {
  switch (payload.property) {
    case 'FPS':
      metronome.setFPS(payload.value)
      break
    case 'enable':
      payload.value ? metronome.start() : metronome.stop()
      break
    case 'enableRunningInBG':
      metronome.allowRunningInBG(payload.value)
      break
  }
})

metronome.on(animate)
metronome.start()

// before the application ends...
// metronome.dispose()
```

## API

```
new Metronome(FPS: number)
```

### on

设置回调函数，回调参数为 相邻两帧的时间间隔

```
type Callback = (delta: number) => void

on(callback: Callback): void
```

### start

开始循环运行回调函数

```
start(): void
```

### stop

停止运行回调函数

```
stop(): void
```

### setFPS

设置帧率

```
setFPS(FPS: number): void
```

### allowRunningInBG

是否允许后台运行

```
allowRunningInBG(enable: boolean): void
```

### dispose

销毁实例

```
dispose(): void
```