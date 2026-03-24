import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Pane } from "tweakpane";
const canvas = document.querySelector("canvas");

const textInput = document.querySelector(".text-input");
const generateBtn = document.querySelector(".generate-btn");

const pane = new Pane({
  container: document.querySelector(".tweak-container"),
});

const texturLoader = new THREE.TextureLoader();

// TEXTURES
const texture = texturLoader.load("./textures/matcaps/1.png");
const texture1 = texturLoader.load("./textures/matcaps/2.png");
const texture2 = texturLoader.load("./textures/matcaps/3.png");
const texture3 = texturLoader.load("./textures/matcaps/4.png");
const texture4 = texturLoader.load("./textures/matcaps/5.png");
const texture5 = texturLoader.load("./textures/matcaps/6.png");
const texture6 = texturLoader.load("./textures/matcaps/7.png");
const texture7 = texturLoader.load("./textures/matcaps/8.png");

const params = {
  color: "#30c5b6",
  mainTexture: "Texture 1",
  textures: {
    "Texture 1": texture,
    "Texture 2": texture1,
    "Texture 3": texture2,
    "Texture 4": texture3,
    "Texture 5": texture4,
    "Texture 6": texture5,
    "Texture 7": texture6,
    "Texture 8": texture7,
  },
};

const scene = new THREE.Scene();
const material = new THREE.MeshMatcapMaterial({ matcap: texture });
const taurusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const capsuleGeometry = new THREE.CapsuleGeometry(0.3, 1, 10, 45);
const decahedronGeometry = new THREE.DodecahedronGeometry(0.5, 12);
const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.5, 1);

const objectsGroup = new THREE.Group();

const textureParam = {
  geometry: "Taurus",
  materials: {
    Taurus: taurusGeometry,
    Capsule: capsuleGeometry,
    Decahedron: decahedronGeometry,
    Tetrahedron: tetrahedronGeometry,
  },
  mainMaterial: texture,
};

const updateShape = () => {
  const newGeo = textureParam.geometry;
  objectsGroup.children.forEach((child) => {
    if (child.isMesh) {
      child.geometry.dispose();
      child.geometry = newGeo;
    }
  });
};

const inputShape = () => {
  for (let i = 0; i < 300; i++) {
    const donusObject = new THREE.Mesh(taurusGeometry, material);

    donusObject.position.x = (Math.random() - 0.5) * 30;
    donusObject.position.y = (Math.random() - 0.5) * 30;
    donusObject.position.z = (Math.random() - 0.5) * 30;

    donusObject.rotation.x = Math.PI * Math.random();
    donusObject.rotation.y = Math.PI * Math.random();

    const randomer = Math.random();
    donusObject.scale.set(randomer, randomer, randomer);

    objectsGroup.add(donusObject);
  }
  scene.add(objectsGroup);

  pane
    .addBinding(textureParam, "geometry", {
      options: textureParam.materials,
    })
    .on("change", updateShape);
};

inputShape();

// LOAD FONT
const fontLoader = new FontLoader();

let textMesh, textureDat;

const renderText = () => {
  fontLoader.load("/fonts/font.json", (font) => {
    const textGeometry = new TextGeometry(textInput.value || "Adeyemi Faruq", {
      font,
      size: 0.9,
      height: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelOffset: 0,
      bevelSegments: 2,
      bevelSize: 0.04,
      depth: 0.2,
    });
    textGeometry.center();

    textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);

    textureDat = pane
      .addBinding(params, "mainTexture", { options: params.textures })
      .on("change", () => {
        material.matcap = params.mainTexture;
      });
  });
};
renderText();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  200,
);
scene.add(camera);
camera.position.z = 6;
camera.position.x = 2;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const animation = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};

animation();

generateBtn.addEventListener("click", () => {
  if (textInput.value.length > 0) {
    if (textMesh) {
      scene.remove(textMesh);
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      //   gui.remove(textureDat);
    }
    renderText();
  }
});

// WINDOW RESIZING
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
