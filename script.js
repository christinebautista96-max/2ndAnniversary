const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const gallery = document.getElementById('gallery');
const clearBtn = document.getElementById('clearBtn');
const slide = document.getElementById('slide');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.getElementById('closeModal');

let images = [];
let currentIndex = 0;
let playing = false;
let playInterval = null;

function preventDefaults(e){ e.preventDefault(); e.stopPropagation(); }
['dragenter','dragover','dragleave','drop'].forEach(ev => dropArea.addEventListener(ev, preventDefaults, false));

dropArea.addEventListener('drop', (e)=>{
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
});

fileInput.addEventListener('change', () => handleFiles(fileInput.files));
clearBtn.addEventListener('click', clearGallery);

function handleFiles(fileList){
  const list = Array.from(fileList).filter(f => f.type && f.type.startsWith('image/'));
  if(list.length === 0) return;
  list.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      images.push({url: ev.target.result, name: file.name});
      renderGallery();
      if(images.length === 1) showSlide(0);
    };
    reader.readAsDataURL(file);
  });
}

function renderGallery(){
  gallery.innerHTML = '';
  images.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'thumb';
    div.innerHTML = `
      <img src="${img.url}" alt="img-${i}" loading="lazy">
      <button class="view" data-index="${i}">❤</button>
    `;
    gallery.appendChild(div);
  });
  document.querySelectorAll('.view').forEach(b => {
    b.onclick = (ev)=>{
      const i = Number(ev.currentTarget.dataset.index);
      openModal(i);
    };
  });
}

function clearGallery(){
  images = [];
  currentIndex = 0;
  renderGallery();
  showSlideText('Choose pictures to start the slideshow');
  stopSlideshow();
}

function openModal(index){
  const img = images[index];
  if(!img) return;
  modalImg.src = img.url;
  modalCaption.textContent = img.name || '';
  modal.classList.remove('hidden');
}
closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden'); });

function showSlide(index){
  if(images.length === 0) { showSlideText('Choose pictures to start the slideshow'); return; }
  currentIndex = (index + images.length) % images.length;
  slide.innerHTML = `<img src="${images[currentIndex].url}" alt="slide">`;
}
function showSlideText(text){ slide.innerHTML = `<div class="slide-placeholder">${text}</div>`; }

prevBtn.addEventListener('click', ()=>{ if(images.length) showSlide(currentIndex-1); });
nextBtn.addEventListener('click', ()=>{ if(images.length) showSlide(currentIndex+1); });

playBtn.addEventListener('click', ()=>{
  if(!playing){ startSlideshow(); } else { stopSlideshow(); }
});

function startSlideshow(){
  if(images.length === 0) return;
  playing = true; playBtn.textContent = 'Pause';
  playInterval = setInterval(()=>{ showSlide(currentIndex+1); }, 2500);
}
function stopSlideshow(){
  playing = false; playBtn.textContent = 'Play';
  if(playInterval) clearInterval(playInterval);
}

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') modal.classList.add('hidden');
  if(e.key === 'ArrowRight') showSlide(currentIndex+1);
  if(e.key === 'ArrowLeft') showSlide(currentIndex-1);
});
