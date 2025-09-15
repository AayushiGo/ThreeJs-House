import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x87ceeb); // blue sky

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Sky
 */

const sky = new Sky();
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);
sky.scale.set(100, 100, 100);
scene.add(sky);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2("#04343f", 0.01);
/**
 * House
 */
const house = new THREE.Group();

// Wall
const wallTexture = textureLoader.load(
  "./textures/castleBrickBroken/castleBrick.jpg"
);
const wallDisp = textureLoader.load(
  "./textures/castleBrickBroken/castleBrickDis.png"
);
const wallNormal = textureLoader.load(
  "./textures/castleBrickBroken/castleNor.exr"
);
const wallRough = textureLoader.load(
  "./textures/castleBrickBroken/castleRough.exr"
);

wallTexture.colorSpace = THREE.SRGBColorSpace;

const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
    aoMap: wallDisp,
    metalnessMap: wallDisp,
    normalMap: wallNormal,
    roughnessMap: wallRough,
  })
);
wall.position.y = 1.25;

// Roof
const roofTexture = textureLoader.load("./textures/brickWall/color.jpg");
const roofDisp = textureLoader.load("./textures/brickWall/dis.png");
const roofNormal = textureLoader.load("./textures/brickWall/normal.exr");
const roofRough = textureLoader.load("./textures/brickWall/rough.exr");

roofTexture.colorSpace = THREE.SRGBColorSpace;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.8, 2, 4),
  new THREE.MeshStandardMaterial({
    map: roofTexture,
    aoMap: roofDisp,
    normalMap: roofNormal,
    roughnessMap: roofRough,
  })
);
roof.position.y = 3.5;
roof.rotation.y = Math.PI / 4;

// Door
const doorColor = textureLoader.load("./textures/door/color.jpg");
const doorAo = textureLoader.load("./textures/door/ambientOcclusion.jpg");
const doorAlpha = textureLoader.load("./textures/door/alpha.jpg");
const doorNormal = textureLoader.load("./textures/door/normal.jpg");
const doorRough = textureLoader.load("./textures/door/roughness.jpg");
const doorHeight = textureLoader.load("./textures/door/height.jpg");

doorColor.colorSpace = THREE.SRGBColorSpace;

const door = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.8, 0.09),
  new THREE.MeshStandardMaterial({
    map: doorColor,
    aoMap: doorAo,
    alphaMap: doorAlpha,
    normalMap: doorNormal,
    roughnessMap: doorRough,
    displacementMap: doorHeight,
    // transparent: true,
  })
);
door.position.set(0, 0.9, 2.05);

house.add(wall, roof, door);
scene.add(house);

/**
 * Windmill
 * 
 */

const bodyT = textureLoader.load("./textures/rockConcreteWall/rock_embedded_concrete_wall_diff_1k.jpg")
const bodyAO = textureLoader.load("./textures/rockConcreteWall/rock_embedded_concrete_wall_disp_1k.png")
const bodyNor = textureLoader.load("./textures/rockConcreteWall/rock_embedded_concrete_wall_nor_gl_1k.exr")
const bodyRough = textureLoader.load("./textures/rockConcreteWall/rock_embedded_concrete_wall_rough_1k.exr")

bodyT.colorSpace = THREE.SRGBColorSpace
const windmill = new THREE.Group();

// Body
const body = new THREE.Mesh(
  new THREE.ConeGeometry(2, 10, 4),
  new THREE.MeshStandardMaterial({ map: bodyT, aoMap: bodyAO, normalMap:bodyNor, roughnessMap: bodyRough})
);
body.position.set(-7, 5, -5);

// Flaps

const flaps = new THREE.Group();

function createFlap(angle) {
  const group = new THREE.Group();

  const flapText = textureLoader.load("./textures/wood/color.jpg");
  const flapAo = textureLoader.load("./textures/wood/disp.png");
  const flapNor = textureLoader.load("./textures/wood/nor.exr");
  const flapRough = textureLoader.load("./textures/wood/rough.jpg");
  flapText.colorSpace = THREE.SRGBColorSpace;

  const flap = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 2.8, 0.05),
    new THREE.MeshStandardMaterial({
      map: flapText,
      aoMap: flapAo,
      normalMap: flapNor,
      roughnessMap: flapRough,
    })
  );

  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 4, 10),
    new THREE.MeshStandardMaterial({ color: "grey" })
  );

  flap.position.set(0, 2, 1.2);
  rod.position.set(0, 0, 1.2);

  group.add(flap, rod);
  group.rotation.z = angle;

  return group;
}

flaps.add(createFlap(0));
flaps.add(createFlap(Math.PI / 2));
flaps.add(createFlap(Math.PI));
flaps.add(createFlap((3 * Math.PI) / 2));
flaps.position.set(-7, 10, -5);

const supporter = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 1.5, 10),
  new THREE.MeshStandardMaterial({ color: "grey" })
);
supporter.position.set(-7, 10, -4.2);
supporter.rotation.x = Math.PI / 2;

windmill.add(body, flaps, supporter);
scene.add(windmill);

/**
 * Bushes
 */
const bushTexture = textureLoader.load(
  "./textures/coastSandRocks/coastDiff.jpg"
);
const bushDisp = textureLoader.load("./textures/coastSandRocks/coastDis.png");
const bushNormal = textureLoader.load("./textures/coastSandRocks/coastNor.exr");
const bushRough = textureLoader.load("./textures/coastSandRocks/coastRou.exr");

const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushTexture,
  aoMap: bushDisp,
  normalMap: bushNormal,
  roughnessMap: bushRough,
});

function createBush(scale, position) {
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    bushMaterial
  );
  bush.scale.set(scale, scale, scale);
  bush.position.set(...position);
  return bush;
}

scene.add(
  createBush(0.5, [1, 0.2, 2.2]),
  createBush(0.25, [1.6, 0.1, 2.1]),
  createBush(0.4, [-1, 0.1, 2.2]),
  createBush(0.15, [-1.2, 0.05, 2.6])
);

/**
 road
 */

 const wheel = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5,0.5,0.7,8),
  new THREE.MeshStandardMaterial({color: "red"})
 )

 scene.add(wheel)

//  ///////////////////////////////////////////////////////



/**
 * Floor
 */
const floorAlphaTexture = textureLoader.load("./textures/floor/alpha.jpg");
const floorColorText = textureLoader.load(
  "./textures/coastSandRocks/coastDiff.jpg"
);
const floorDisp = textureLoader.load("./textures/coastSandRocks/coastDis.png");
const floorNorText = textureLoader.load(
  "./textures/coastSandRocks/coastNor.exr"
);
const floorRoughText = textureLoader.load(
  "./textures/coastSandRocks/coastRou.exr"
);

floorColorText.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    map: floorColorText,
    displacementMap: floorDisp,
    displacementScale: 0.2,
    normalMap: floorNorText,
    roughnessMap: floorRoughText,
    transparent: true,
    side: THREE.DoubleSide,
  })
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights - Daytime
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 4); // softer ambient
gui.add(ambientLight, "intensity").min(0).max(2).step(0.01);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff4cc, 1.5); // warm sunlight
sunLight.position.set(10, 15, -10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

gui.add(sunLight, "intensity").min(0).max(5).step(0.01);
gui.add(sunLight.position, "x").min(-20).max(20).step(0.1);
gui.add(sunLight.position, "y").min(0).max(20).step(0.1);
gui.add(sunLight.position, "z").min(-20).max(20).step(0.1);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(10, 10, 10);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// 
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  controls.update();

  flaps.rotation.z += 0.02;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
