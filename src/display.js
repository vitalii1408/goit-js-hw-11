export function displayImages(images, gallery, updateLoadedImagesCount) {
    images.forEach(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
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
      updateLoadedImagesCount();
    });
  }
  