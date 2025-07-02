const cells = document.querySelectorAll('.cell');
let dragged = null;

cells.forEach(cell => {
  cell.addEventListener("dragstart", function () {
    dragged = this;
  });

  cell.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  cell.addEventListener("drop", function (e) {
    e.preventDefault();
    if (dragged !== this) {
      const temp = this.innerHTML;
      this.innerHTML = dragged.innerHTML;
      dragged.innerHTML = temp;
    }
  });
});

window.loadImage = function (event, input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const cell = input.closest(".cell");
      cell.innerHTML = `
        <img src="${e.target.result}" alt="Uploaded Image">
        <label class="upload">
          📷
          <input type="file" accept="image/*" onchange="loadImage(event, this)">
        </label>
        <button class="delete" onclick="deleteImage(this)">🗑️</button>
      `;
    };
    reader.readAsDataURL(file);
  }
};

window.deleteImage = function (btn) {
  const cell = btn.closest(".cell");
  cell.innerHTML = `
    <label class="upload">
      📷
      <input type="file" accept="image/*" onchange="loadImage(event, this)">
    </label>
  `;
};