//This script initializes the 3D scene, loads the walls, floor, and artworks, and adds a door for navigation.

// main.js - Main Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Room dimensions
const roomWidth = 3, roomHeight = 2.5, roomDepth = 3;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Load Floor Texture
const floorTexture = textureLoader.load('./static/images/floor.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(roomWidth * 2, roomDepth * 2);

const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Walls
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide });
const wallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
scene.add(backWall);

const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
scene.add(rightWall);

// Load Artwork
const artworks = [
  { url: './static/images/art1.jpg', width_cm: 50, height_cm: 70 },
  { url: './static/images/art2.jpg', width_cm: 60, height_cm: 80 },
  { url: './static/images/art3.jpg', width_cm: 60, height_cm: 80 },
];




const artworkMeshes = [];
artworks.forEach((artwork, index) => {
  textureLoader.load(artwork.url, (texture) => {
    const width = artwork.width_cm / 100, height = artwork.height_cm / 100;
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { url: artwork.url };

    if (index === 0) mesh.position.set(0, 1.5, -roomDepth / 2 + 0.1);
    else if (index === 1) {
      mesh.position.set(-roomWidth / 2 + 0.1, 1.5, 0);
      mesh.rotation.y = Math.PI / 2;
    } else {
      mesh.position.set(roomWidth / 2 - 0.1, 1.5, 0);
      mesh.rotation.y = -Math.PI / 2;
    }

    scene.add(mesh);
    artworkMeshes.push(mesh);
  });
});

// Load and position the logo
const logoTexture = textureLoader.load('./static/images/logo.png');
const logoGeometry = new THREE.PlaneGeometry(0.5, 0.25); // Adjust the size
const logoMaterial = new THREE.MeshStandardMaterial({
    map: logoTexture,
    transparent: true
});
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(0, 2, -roomDepth / 2 + 0.05); // Position above artworks
scene.add(logo);


// Load Door to Another Room
const doorGeometry = new THREE.PlaneGeometry(1, 2);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 1, roomDepth / 2 - 0.01);
scene.add(door);
door.userData = { isDoor: true };

// Load the plant model
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('./static/models/plant/potted_plant_02_2k.gltf', (gltf) => {
    const plant = gltf.scene;
    plant.scale.set(1.5, 1.5, 1.5); // Scale it up
    plant.position.set(1.2, 0, -1.2); // Near back-left corner

    plant.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    scene.add(plant);
});


// Camera & Controls
camera.position.set(0, 1.7, 2);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.5, 0);
controls.minDistance = 1.5;
controls.maxDistance = 4;

function onKeyDown(event) {
    if (event.key === "Escape") {
        closeModal();
    }
}


// Event Listeners
window.addEventListener("mousedown", onMouseClick);
window.addEventListener("keydown", onKeyDown);

// Animation loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
