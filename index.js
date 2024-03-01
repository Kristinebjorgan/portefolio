// Function to fetch the About page content
async function fetchAboutPageContent() {
  try {
    // Assuming you know the ID of the About page, replace 'about-page-id' with the actual ID.
    const pageId = "9"; // Replace with the actual ID of the About page
    const apiUrl = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/pages/${pageId}`;

    // Fetch the specific About page
    const response = await fetch(apiUrl);
    const aboutPage = await response.json();

    // Check if the About page is found (response will be the page object if successful)
    if (aboutPage) {
      // Create elements for the title and content
      const titleElement = document.createElement("h1");
      const contentElement = document.createElement("div");

      // Set the innerHTML of the elements
      titleElement.innerHTML = aboutPage.title.rendered;
      contentElement.innerHTML = aboutPage.content.rendered;

      // Insert the title and content into the about-section
      const aboutSection = document.querySelector("#about-section .bio");
      aboutSection.appendChild(titleElement);
      aboutSection.appendChild(contentElement);
    } else {
      console.error("About page not found.");
    }
  } catch (error) {
    // Handle errors (e.g., network issues, invalid JSON response, etc.)
    console.error("Error fetching about page content:", error);
  }
}

// Carousel
let currentPostIndex = 0; // Start from the first index
const postIDs = [40, 34, 25]; // Replace with actual post IDs

function populateCarousel(postID) {
  const carouselContainer = document.getElementById("posts-carousel");
  const fetchUrl = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/posts/${postID}`;

  // Clear current carousel items
  carouselContainer.innerHTML = "";

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((post) => {
      // Assuming 'acf' fields are always present, but add checks if they might not be
      const projectTitle = post.acf.project_title;
      const designFullscreen = post.acf.design_fullscreen;
      const overview = truncateText(post.acf.overview, 100);
      const readMoreLink = post.link;

      // Use the first image in the design_fullscreen object, if it exists
      const imageUrl = designFullscreen ? designFullscreen.url : "default-image.jpg";
      const imageAlt = designFullscreen ? designFullscreen.alt : projectTitle;

      // Construct carousel item HTML
      const postElement = document.createElement("div");
      postElement.classList.add("carousel-item");
      postElement.innerHTML = `
        <h3>${projectTitle}</h3>
        <img src="${imageUrl}" alt="${imageAlt}" />
        <p>${overview}</p>
        <a href="${readMoreLink}" target="_blank" class="read-more">Read more</a>
      `;

      carouselContainer.appendChild(postElement);
    })
    .catch((error) => {
      console.error("Error fetching carousel post:", error);
    });
}

function showNextPost() {
  currentPostIndex = (currentPostIndex + 1) % postIDs.length; // Cycle through postIDs
  populateCarousel(postIDs[currentPostIndex]); // Populate carousel with the next post
}

function showPrevPost() {
  currentPostIndex = (currentPostIndex - 1 + postIDs.length) % postIDs.length; // Cycle through postIDs backwards
  populateCarousel(postIDs[currentPostIndex]); // Populate carousel with the previous post
}

function carouselNavigation() {
  const prevButton = document.getElementById("prevBtn");
  const nextButton = document.getElementById("nextBtn");

  prevButton.addEventListener("click", showPrevPost);
  nextButton.addEventListener("click", showNextPost);
}

function truncateText(text, length) {
  if (text && text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
}

document.addEventListener("DOMContentLoaded", () => {
  populateCarousel(postIDs[currentPostIndex]); // Initialize the carousel with the first post
  carouselNavigation();
  fetchAboutPageContent(); // Fetch and display the About page content
});
