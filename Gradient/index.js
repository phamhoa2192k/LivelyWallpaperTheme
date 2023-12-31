var renderer, controls, scene, camera, composer, circle, skelet, particle;
var thresholdX = 0,
  lastMouseX = 0;
(thresholdY = 0), (lastMouseY = 0);

var scale = 0.00002;
function onMouseMove(event) {
  // if (event.client)
  thresholdX = (event.clientX - lastMouseX) * 2 - 1;
  thresholdY = -(event.clientY - lastMouseY) * 2 + 1;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  thresholdX *= scale;
  thresholdY *= scale * 3;

  thresholdX = Math.max(Math.min(0.002, thresholdX), -0.002);
  thresholdY = Math.max(Math.min(0.002, thresholdY), -0.002);

  console.log(thresholdX, thresholdY);
}

window.addEventListener("mousemove", onMouseMove);

window.onload = function () {
  init();
  animate();
};

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById("canvas").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;
  scene.add(camera);

  circle = new THREE.Object3D();
  skelet = new THREE.Object3D();
  particle = new THREE.Object3D();

  scene.add(circle);
  scene.add(skelet);
  scene.add(particle);

  var geometry = new THREE.TetrahedronGeometry(2, 0);
  var geom = new THREE.IcosahedronGeometry(7, 1);
  var geom2 = new THREE.IcosahedronGeometry(15, 1);

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
  });

  for (var i = 0; i < 1000; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 700);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  var mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
  });

  var mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide,
  });

  var planet = new THREE.Mesh(geom, mat);
  planet.scale.x = planet.scale.y = planet.scale.z = 16;
  circle.add(planet);

  var planet2 = new THREE.Mesh(geom2, mat2);
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 10;
  skelet.add(planet2);

  var ambientLight = new THREE.AmbientLight(0x999999);
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 1);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
  lights[2].position.set(-0.75, -1, 0.5);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // particle.rotation.x += 0.0000;
  particle.rotation.y -= 0.0007;
  circle.rotation.x -= 0.002;
  circle.rotation.y -= 0.003;
  skelet.rotation.x -= 0.001;
  skelet.rotation.y += 0.002;

  particle.rotation.z -= thresholdY;
  particle.rotation.y -= thresholdX;
  circle.rotation.z -= thresholdY;
  circle.rotation.y -= thresholdX;
  skelet.rotation.z -= thresholdY;
  skelet.rotation.y -= thresholdX;

  renderer.clear();
  renderer.render(scene, camera);
}
