let dragged = null;

// Handle tab switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove 'active' from all tabs
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Hide all content sections
    tabContents.forEach(c => c.style.display = 'none');

    // Show the selected tab's content
    const selectedTab = document.getElementById(`${btn.dataset.tab}-tab`);
    if (selectedTab) {
      selectedTab.style.display = 'block';
    }
  });
});

// Get grid containers
const feedGrid = document.getElementById('feed-grid');
const reelsGrid = document.getElementById('reels-grid');

// Populate both grids with 12 draggable/uploadable cells
for (let i = 0; i < 12; i++) {
  feedGrid.appendChild(createCell('both'));   // Feed: image or video
  reelsGrid.appendChild(createCell('video')); // Reels: video only
}

// Create one draggable cell
function createCell(type = 'both') {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.setAttribute('draggable', true);
  cell.innerHTML = `
    <label class="upload">
      📷
      <input type="file" ${type === 'video' ? 'accept="video/*"' : 'accept="image/*,video/*"'} onchange="loadMedia(event, this, '${type}')">
    </label>
  `;

  // Drag & drop support
  cell.addEventListener('dragstart', () => { dragged = cell; });
  cell.addEventListener('dragover', e => e.preventDefault());
  cell.addEventListener('drop', e => {
    e.preventDefault();
    if (dragged !== cell) {
      const temp = cell.innerHTML;
      cell.innerHTML = dragged.innerHTML;
      dragged.innerHTML = temp;
    }
  });

  return cell;
}

// Handle image/video upload
window.loadMedia = function (event, input, type) {
  const file = input.files[0];
  if (!file) return;

  const cell = input.closest(".cell");
  const reader = new FileReader();

  reader.onload = function (e) {
    let mediaEl = '';
    if (file.type.startsWith('image')) {
      mediaEl = `<img src="${e.target.result}" alt="Uploaded Image">`;
    } else if (file.type.startsWith('video')) {
      mediaEl = `<video src="${e.target.result}" autoplay muted loop></video>`;
    } else {
      alert("Unsupported file type");
      return;
    }

    cell.innerHTML = `
      ${mediaEl}
      <label class="upload">
        📷
        <input type="file" ${type === 'video' ? 'accept="video/*"' : 'accept="image/*,video/*"'} onchange="loadMedia(event, this, '${type}')">
      </label>
      <button class="delete" onclick="deleteMedia(this, '${type}')">🗑️</button>
    `;
  };

  reader.readAsDataURL(file);
};

// Delete uploaded media
window.deleteMedia = function (btn, type) {
  const cell = btn.closest(".cell");
  cell.innerHTML = `
    <label class="upload">
      📷
      <input type="file" ${type === 'video' ? 'accept="video/*"' : 'accept="image/*,video/*"'} onchange="loadMedia(event, this, '${type}')">
    </label>
  `;
};