import axios from "axios";
const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "52792458-b846233229dd28b7897b8b61b";
const PER_PAGE = 15;
export async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
       params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
      },
    });


    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}
