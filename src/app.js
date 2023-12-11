import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
const perPage = 40; 
const lightbox = new SimpleLightbox('.gallery a');
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  page = 1; 
  loadMoreBtn.style.display = 'none'; 
  try {
    const response = await fetchImages(searchQuery, page);
    const { totalHits, hits } = response.data;
    displayImages(hits);
    if (hits.length === 0) {
      Notiflix.Notify.info('No images found.');
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    if (totalHits > perPage) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Error fetching images. Please try again.');
  }
  lightbox.refresh(); 
});
loadMoreBtn.addEventListener('click', async function () {
  page++;
  const searchQuery = form.elements.searchQuery.value.trim();
  try {
    const response = await fetchImages(searchQuery, page);
    const { hits } = response.data;
    displayImages(hits);
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure('Error fetching more images. Please try again.');
  }
});
async function fetchImages(query, currentPage) {
  const apiKey = '41169933-77b703fb51c1050a0aada1a33';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;
  return await axios.get(url);
}
function displayImages(images) {
  if (page === 1) {
    gallery.innerHTML = '';
  }
  images.forEach(image => {
    const {
      webformatURL,
      largeImageURL,
      likes,
      views,
      comments,
      downloads,
      tags,
    } = image;
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.innerHTML = `
      <a href="${largeImageURL}" data-lightbox="gallery">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    `;
    gallery.appendChild(photoCard);
  });
}
