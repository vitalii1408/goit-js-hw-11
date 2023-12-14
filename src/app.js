import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import { fetchImages } from './api'; 
import { displayImages } from './display'; 
const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let totalHits = 0;
let loadedImagesCount = 0;
const perPage = 40;
const lightbox = new SimpleLightbox('.gallery a');
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();
  if (!searchQuery) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  page = 1;
  try {
    const data = await fetchImages(searchQuery, page, perPage);
    totalHits = data.totalHits;
    loadedImagesCount = 0;
    gallery.innerHTML = ''; 
    displayImages(data.hits, gallery, updateLoadedImagesCount);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    loadMoreBtn.style.display = totalHits > perPage ? 'block' : 'none';
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
    const data = await fetchImages(searchQuery, page, perPage);
    displayImages(data.hits, gallery, updateLoadedImagesCount);
    if (loadedImagesCount >= totalHits) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure('Error fetching more images. Please try again.');
  }
  lightbox.refresh();
});
function updateLoadedImagesCount() {
  loadedImagesCount++;
  if (loadedImagesCount >= totalHits) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
