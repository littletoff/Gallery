//pop-ups and click events

function onMouseClick(event) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(artworkMeshes);
  if (intersects.length > 0) {
    showModal(intersects[0].object.userData.url);
  }
}

function showModal(imageUrl) {
  document.getElementById("modalImage").src = imageUrl;
  document.getElementById("artworkModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("artworkModal").style.display = "none";
}
