import axios from "axios";
const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "52792458-b846233229dd28b7897b8b61b";
const PER_PAGE = 15;
export async function getImagesByQuery(query, page = 1) {
try {
const url = new URL(BASE_URL);
url.searchParams.set('key', API_KEY);
url.searchParams.set('q', query);
url.searchParams.set('image_type', 'photo');
url.searchParams.set('orientation', 'horizontal');
url.searchParams.set('safesearch', 'true');
url.searchParams.set('per_page', PER_PAGE.toString());
url.searchParams.set('page', String(page));


const response = await fetch(url.toString());
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
return data; 
} catch (error) {
console.error('Error fetching images:', error);
throw error;
}
}
