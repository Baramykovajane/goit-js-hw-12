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
} from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.getElementById("search-form");
const input = form.querySelector('input[name="search-text"]');
const gallery = getGalleryContainer();
const loadMoreBtn = getLoadMoreButton();

let currentQuery = "";
let currentPage = 1;
let totalHits = 0;
hideLoadMoreButton();

function handleEndOfResults() {
  hideLoadMoreButton();
  iziToast.info({
    icon: "fa-solid fa-ban",
    iconColor: "#2222",
    backgroundColor: "#EF4040",
    message: "We're sorry, but you've reached the end of search results.",
    timeout: 3000,
    position: "topRight",
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.error({
      icon: "fa-solid fa-ban",
      iconColor: "#222",
      message: "Please enter a search term!",
      backgroundColor: "#EF4040",
      timeout: 3000,
      position: "topRight",
    });
    return;
  }

  if (query !== currentQuery) {
    currentQuery = query;
    currentPage = 1;
    totalHits = 0;
    clearGallery();
    hideLoadMoreButton();
  }

  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits?.length) {
      iziToast.info({
        icon: "fa-solid fa-ban",
        iconColor: "#2222",
        message: "Sorry, there are no images matching your search query.",
        backgroundColor: "#EF4040",
        timeout: 3000,
        position: "topRight",
      });
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);

   totalHits = data.totalHits || totalHits;
    const pagesCount = Math.ceil(totalHits / 15);

    if (currentPage < pagesCount) {
      showLoadMoreButton();
    } else {
      handleEndOfResults();
    }

  } catch (error) {
    iziToast.error({
      icon: "fa-solid fa-ban",
      iconColor: "#2222",
      message: "Something went wrong. Please try again!",
      backgroundColor: "#EF4040",
      timeout: 3000,
      position: "topRight",
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});


 loadMoreBtn.addEventListener("click", async () => {
   try {
     showLoader();

     const nextPage = currentPage + 1;
     const data = await getImagesByQuery(currentQuery, nextPage);

     if (!data.hits?.length) {
       handleEndOfResults();
       return;
     }
     createGallery(data.hits);
     currentPage = nextPage; 
  totalHits = data.totalHits || totalHits;
     const firstCard = gallery.querySelector(".gallery-item");
     if (firstCard) {
       const { height: cardHeight } = firstCard.getBoundingClientRect();
       window.scrollBy({ top: cardHeight * 2, behavior: "smooth" });
     }
     const pagesCount = Math.ceil(totalHits / 15);
     if (currentPage >= pagesCount) {
       handleEndOfResults();
     }

   } catch (error) {
     iziToast.error({
       icon: "fa-solid fa-ban",
       iconColor: "#2222",
       message: "Something went wrong. Please try again!",
       backgroundColor: "#EF4040",
       timeout: 3000,
       position: "topRight",
     });
     console.error(error);
   } finally {
     hideLoader();
   }
 });
