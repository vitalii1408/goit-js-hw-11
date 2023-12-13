import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const apiKey = '41169933-77b703fb51c1050a0aada1a33';
export async function fetchImages(query, page, perPage = 40) {
  const url = `?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const response = await axios.get(url);
  return response.data;
}
