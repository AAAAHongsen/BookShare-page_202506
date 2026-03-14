import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()
/**
 * Light 
 */
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(3, 3, 2)
scene.add(light)

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('../static/textures/4.png')
const gridAlpha = textureLoader.load('../static/textures/alpha-map.png') // 透明貼圖

/**
 * Geometry
 */
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshMatcapMaterial({ 
    matcap: matcapTexture,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 0, 0)
scene.add(sphere)
// Raycaster 與滑鼠座標
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Change map
 */
const colors = [0x44ccff, 0x00ff88, 0xffff00,0xffffff ];
const webglCanvas = document.getElementsByClassName("webgl")[0];
// console.log(webglCanvas)
let colorIndex = 0
const audio01 = new Audio('../static/music/sound03.mp3')
audio01.volume = 0.4 
// window
webglCanvas.addEventListener('click',(e)=>{
    // console.log("test-=--------------------------")
    const canvasBounds = canvas.getBoundingClientRect()
    mouse.x = ((e.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1
    mouse.y = -((e.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1

     raycaster.setFromCamera(mouse, camera)

     const intersects = raycaster.intersectObject(sphere)
 
     if (intersects.length > 0) {
         colorIndex = (colorIndex + 1) % colors.length
        sphere.material.color.set(colors[colorIndex])
        audio01.currentTime = 0;
        audio01.play()
        }
})
/**
 * Glass
 */
const glassMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 1.6,     // 透明度
    transparent: true, 
    roughness: 0.6,        // 表面粗糙度
    thickness: 1.5,        // 厚度
    metalness: 0,        // 非金屬
    clearcoat: 1,        // 額外光澤層
    clearcoatRoughness: 0.2,
    side: THREE.DoubleSide
})

glassMaterial.alphaMap = gridAlpha
glassMaterial.bumpMap = gridAlpha
glassMaterial.bumpScale = 10


const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 4),
    glassMaterial
  )
  glass.position.set(0,0,1)
  scene.add(glass)
  


/**
 * Smooth follow
 */
const target = new THREE.Vector3()
const damping = 0.01

// 用來與滑鼠射線相交的平面
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

/**
 * Size
 */
const sizes = {
 width: window.innerWidth,
    height: window.innerHeight
}

//resize
window.addEventListener('resize',() =>
{
    //UpdateSize
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,  //背景透明
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//-----------------------------------------

const canvass = document.querySelector('canvas.webgl')
let isBackgroundBlack = false; 

// 繩子（細長圓柱體）
const ropeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.55, 8)
const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
const rope = new THREE.Mesh(ropeGeometry, ropeMaterial)
ropeGeometry.translate(0, -0.5, 0)
rope.position.set(2, 2, 1.2) 
scene.add(rope)

// 拉柄（小球）
const knobGeometry = new THREE.SphereGeometry(0.03, 16, 16)
const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
const knob = new THREE.Mesh(knobGeometry, knobMaterial)
knob.position.set(2, 0.75, 1.2) // 一開始掛在繩子下方
scene.add(knob)

// 點一下拉下繩子
const audio02 = new Audio('../static/music/light-sound.mp3')
audio02.volume = 0.2 
let syncRopeUpdate = null;
window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(knob)
    if (intersects.length > 0) {
         // 新增繩子同步邏輯
        audio02.play()
        audio02.currentTime = 0;
        syncRopeUpdate = () => {
            const ropeLength = 1.72 - knob.position.y
            rope.scale.y = ropeLength
        }
        gsap.ticker.add(syncRopeUpdate)

        // knob 下拉
        gsap.to(knob.position, {
            y: 0.6,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                // 回彈
                gsap.to(knob.position, {
                    y: 0.75,
                    duration: 0.5,
                    ease: 'elastic.out(0.03, 0.2)',
                    onComplete: () => {
                        // 動畫結束後移除 ticker
                        gsap.ticker.remove(syncRopeUpdate)
                        syncRopeUpdate = null
                    }
                })
            }
        })


        // 背景顏色變更
        if (isBackgroundBlack) {
            // 如果背景是黑色，改回白色
            gsap.to(canvass.style, {
                backgroundColor: '#ffffff',
                duration: 0.5
            })
        } else {
            // 如果背景是白色，變成黑色
            gsap.to(canvass.style, {
                backgroundColor: '#000000',
                duration: 0.5
            })
        }

        // 更新背景顏色的狀態
        isBackgroundBlack = !isBackgroundBlack;
    }

})
/**
 * Animate
 */
const clock = new THREE.Clock()
const intersection = new THREE.Vector3()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    // controls.update()
    // 射線從相機射向滑鼠
    raycaster.setFromCamera(mouse, camera)

    // 找出與 z=0 的平面交點
    raycaster.ray.intersectPlane(plane, intersection)


    // 線性插值靠近目標位置
    target.lerp(intersection, damping)

    // 更新球的位置
    sphere.position.copy(target)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
