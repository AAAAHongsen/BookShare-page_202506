let scene, camera, renderer, model, mixer;

function init() {
    // 創建場景
    scene = new THREE.Scene();
    
    // 創建相機
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;
    camera.position.y = 2;
    
    // 創建渲染器
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas3d'),
        alpha: true
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    
    // 燈光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);
    
    
    // 加載模型
    const loader = new THREE.GLTFLoader();
    const modelPath = '../static/gltf/stylized_hand_painted_scene/scene.gltf';
    console.log('正在加載模型:', modelPath);
    
    loader.load(
        modelPath,
        function (gltf) {
            console.log('模型加載成功');
            model = gltf.scene;
            
            // 調整模型大小和位置
            model.scale.set(-0.3, 0.2, 0.3);
            model.position.set(-5, -2, -10);
            
            // 調整模型旋轉
            model.rotation.y = -Math.PI*2;
            
            // 將模型添加到場景
            scene.add(model);
            console.log('模型已添加到場景');
            
            // 檢查模型結構
            console.log('模型結構:', model);
            
            // 播放模型動畫
            if (gltf.animations && gltf.animations.length) {
                console.log('找到動畫:', gltf.animations.length, '個');
                mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            } else {
                console.log('模型沒有動畫');
            }
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% 加載中');
        },
        function (error) {
            console.error('模型加載錯誤:', error);
        }
    );
    
    // 動畫循環
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // 更新模型動畫
    if (mixer) {
        mixer.update(0.016);
    }
    
    renderer.render(scene, camera);
}

// 處理窗口大小變化
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
}

// 初始化場景
init(); 