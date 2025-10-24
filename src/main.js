import { getImagesByQuery } from "./js/pixabay-api.js";
import {
createGallery,
clearGallery,
showLoader,
hideLoader,
showLoadMoreButton,
hideLoadMoreButton,
getGalleryContainer,
getLoadMoreButton,
} from './js/render-functions.js';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="search-text"]');
const gallery = getGalleryContainer();
const loadMoreBtn = getLoadMoreButton();


let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.error({
      icon: 'fa-solid fa-ban',
      iconColor: '#2222',
      message: "Please enter a search term!",
      backgroundColor: "#EF4040",
      timeout: 3000,
      close: false,
      position: "topRight"
    });
    return;
  }
  if (query !== currentQuery) {
currentQuery = query;
currentPage = 1;
clearGallery();
hideLoadMoreButton();
}


try {
showLoader();
  const data = await getImagesByQuery(currentQuery, currentPage);
  if (!data.hits || data.hits.length === 0) {
iziToast.info({
icon: 'fa-solid fa-ban',
iconColor: '#2222',
message: "Sorry, there are no images matching your search query. Please try again!",
backgroundColor: '#EF4040',
timeout: 3000,
close: false,
position: 'topRight',
});
hideLoadMoreButton();
return;
  }
  createGallery(data.hits);


  totalHits = data.totalHits || 0;
  const pagesCount = Math.ceil(totalHits / 15);


if (currentPage < pagesCount) {
showLoadMoreButton();
} else {
hideLoadMoreButton();
iziToast.info({
message: "We're sorry, but you've reached the end of search results.",
timeout: 4000,
position: 'topRight',
});
  }
  currentPage += 1;
} catch (error) {
iziToast.error({
icon: 'fa-solid fa-ban',
iconColor: '#2222',
message: 'Something went wrong. Please try again!',
backgroundColor: '#EF4040',
timeout: 3000,
close: false,
position: 'topRight',
});
console.error(error);
} finally {
hideLoader();
}
});
loadMoreBtn.addEventListener('click', async () => {
try {
showLoader();
const data = await getImagesByQuery(currentQuery, currentPage);


if (!data.hits || data.hits.length === 0) {
hideLoadMoreButton();
iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
return;
}


  createGallery(data.hits);
  const firstCard = gallery.querySelector('.gallery-item');
if (firstCard) {
const { height: cardHeight } = firstCard.getBoundingClientRect();
window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}


totalHits = data.totalHits || totalHits;
const pagesCount = Math.ceil(totalHits / 15);


if (currentPage >= pagesCount) {
hideLoadMoreButton();
iziToast.info({ message: "We're sorry, but you've reached the end of search results.", timeout: 3000 });
} else {
showLoadMoreButton();
}


currentPage += 1;
} catch (error) {
iziToast.error({ message: 'Something went wrong. Please try again!' });
console.error(error);
} finally {
hideLoader();
}
});


  