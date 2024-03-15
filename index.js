//fetch the About page content
async function fetchAboutPageContent() {
  try {
    const pageId = "9";
    const apiUrl = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/pages/${pageId}`;

    // Fetch the specific About page
    const response = await fetch(apiUrl);
    const aboutPage = await response.json();
    if (aboutPage) {
      // elements for the title and content
      const titleElement = document.createElement("h1");
      const contentElement = document.createElement("div");

      //innerHTML elements
      titleElement.innerHTML = aboutPage.title.rendered;
      contentElement.innerHTML = aboutPage.content.rendered;

      const aboutSection = document.querySelector("#about-section .bio");
      aboutSection.appendChild(titleElement);
      aboutSection.appendChild(contentElement);
    } else {
      console.error("About page not found.");
    }
  } catch (error) {
    console.error("Error fetching about page content:", error);
  }
}

// Carousel
let currentPostIndex = 0;
const postIDs = [40, 34, 25];

function populateCarousel(postID) {
  const carouselContainer = document.getElementById("posts-carousel");
  const fetchUrl = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/posts/${postID}`;

  // Clear
  carouselContainer.innerHTML = "";

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((post) => {
      const projectTitle = post.acf.project_title;
      const designFullscreen = post.acf.design_fullscreen;
      const overview = truncateText(post.acf.overview, 100);
      const readMoreLink = `specific.html?postId=${postID}`;

      // design fullscreen
      const imageUrl = designFullscreen
        ? designFullscreen.url
        : "default-image.jpg";
      const imageAlt = designFullscreen ? designFullscreen.alt : projectTitle;

      // carousel item
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
  currentPostIndex = (currentPostIndex + 1) % postIDs.length;
  populateCarousel(postIDs[currentPostIndex]);
}

function showPrevPost() {
  currentPostIndex = (currentPostIndex - 1 + postIDs.length) % postIDs.length;
  populateCarousel(postIDs[currentPostIndex]);
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
  const carouselContainer = document.getElementById("posts-carousel");
  if (carouselContainer) {
    populateCarousel(postIDs[currentPostIndex]);
    carouselNavigation();
    fetchAboutPageContent();
  }

  // looking for specific elements
  const projectTitleElement = document.getElementById("projectTitle");
  if (projectTitleElement) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");
    if (postId) {
      fetchPostDetails(postId);
    }
  }
});

//fetch tag names by their IDs
function fetchTagNames(tagIds, callback) {
  const fetchUrl = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/tags?include=${tagIds.join(
    ","
  )}`;

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((tags) => callback(tags.map((tag) => tag.name).join(", "))) // Join the tag names with a comma
    .catch((error) => console.error("Error fetching tag names:", error));
}

//fetch tag names by their IDs, update the DOM
function fetchCodingLanguagesNames(ids, callback) {
  const endpoint = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/tags`;
  const params = ids.map((id) => `include[]=${id}`).join("&");

  fetch(`${endpoint}?${params}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((tags) => {
      const names = tags.map((tag) => tag.name);
      callback(names);
    })
    .catch((error) => {
      console.error("Error fetching coding languages:", error);
    });
}

//display coding languages
function displayCodingLanguages(names, detailsContainer) {
  const codingLanguagesDiv = document.createElement("div");
  codingLanguagesDiv.className = "coding-languages";

  names.forEach((name) => {
    const tagDiv = document.createElement("div");
    tagDiv.className = "coding-tag";
    tagDiv.textContent = name;
    codingLanguagesDiv.appendChild(tagDiv);
  });

  detailsContainer.appendChild(codingLanguagesDiv);
}
// Function to create a div with content only
function createDetailDiv(content) {
  const detailDiv = document.createElement("div");
  detailDiv.className = "detail-div";

  // Create the content element
  const contentElement = document.createElement("p");
  contentElement.className = "detail-content";
  contentElement.textContent = content;

  // Append the content element to the detailDiv
  detailDiv.appendChild(contentElement);

  return detailDiv;
}

// Function to create a div with an image
function createImageDiv(label, imageObject) {
  const imageDiv = document.createElement("div");
  imageDiv.innerHTML = `<img src="${imageObject.url}" alt="${imageObject.alt}" />`;
  return imageDiv;
}

// Function to create a div with a video player
function createVideoDiv(label, videoUrl) {
  const videoDiv = document.createElement("div");
  videoDiv.innerHTML = `<video controls><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
  return videoDiv;
}

// Function to create a div with a hyperlink
function createLinkDiv(label, url) {
  const linkDiv = document.createElement("div");
  linkDiv.className = "link-div";
  linkDiv.innerHTML = `<a href="${url}" target="_blank">${label}</a>`;
  return linkDiv;
}

// slideshow
function createSlideshow(mediaItems) {
  const slideshowContainer = document.createElement("div");
  slideshowContainer.className = "slideshow";

  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.className = "slide-nav-button prev";
  prevButton.onclick = () => showPrevSlide(slideshowContainer);

  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.className = "slide-nav-button next";
  nextButton.onclick = () => showNextSlide(slideshowContainer);

  mediaItems.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = `slide ${index === 0 ? "active" : ""}`;
    slide.style.display = index === 0 ? "block" : "none";

    if (item.type === "image") {
      slide.innerHTML = `<img src="${item.url}" alt="${item.alt}">`;
    } else if (item.type === "video") {
      slide.innerHTML = `<video controls><source src="${item.url}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }

    slideshowContainer.appendChild(slide);
  });

  slideshowContainer.appendChild(prevButton);
  slideshowContainer.appendChild(nextButton);

  return slideshowContainer;
}
function showPrevSlide(slideshowContainer) {
  const slides = slideshowContainer.getElementsByClassName("slide");
  let currentSlide = slideshowContainer.querySelector(".slide.active");
  let currentIndex = Array.from(slides).indexOf(currentSlide);

  currentSlide.classList.remove("active");
  currentSlide.style.display = "none";
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;

  slides[currentIndex].classList.add("active");
  slides[currentIndex].style.display = "block";
}

function showNextSlide(slideshowContainer) {
  const slides = slideshowContainer.getElementsByClassName("slide");
  let currentSlide = slideshowContainer.querySelector(".slide.active");
  let currentIndex = Array.from(slides).indexOf(currentSlide);

  currentSlide.classList.remove("active");
  currentSlide.style.display = "none";
  currentIndex = (currentIndex + 1) % slides.length;

  slides[currentIndex].classList.add("active");
  slides[currentIndex].style.display = "block";
}

// fetch the details single post
function fetchPostDetails(postId) {
  const fetchUrl = `https://portefolio.kristinebjorgan.com/wp-json/wp/v2/posts/${postId}`;

  fetch(fetchUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((post) => {
      const {
        project_title,
        design_fullscreen,
        mockup_desktop,
        mockup_video,
        design_file,
        date_created,
        overview,
        coding_languages,
        font_specs,
        color_palette,
        github_repo,
        report,
        netlify,
      } = post.acf;

      const detailsContainer = document.getElementById("details-container");
      detailsContainer.innerHTML = "";

      // project title
      if (project_title) {
        detailsContainer.appendChild(createDetailDiv(project_title));
      }

      //media items for the slideshow
      const mediaItems = [];
      if (mockup_desktop) {
        mediaItems.push({
          type: "image",
          url: mockup_desktop.url,
          alt: "Mockup Fullscreen",
        });
      }
      if (design_fullscreen) {
        mediaItems.push({
          type: "image",
          url: design_fullscreen.url,
          alt: "Design Fullscreen",
        });
      }
      if (design_file) {
        mediaItems.push({
          type: "image",
          url: design_file.url,
          alt: "Design File",
        });
      }
      if (color_palette) {
        mediaItems.push({
          type: "image",
          url: color_palette.url,
          alt: "Color Palette",
        });
      }

      //slideshow if there are media items
      if (mediaItems.length > 0) {
        detailsContainer.appendChild(createSlideshow(mediaItems));
      }

      //date created
      if (date_created) {
        detailsContainer.appendChild(createDetailDiv(date_created));
      }

      //overview
      if (overview) {
        detailsContainer.appendChild(createDetailDiv(overview));
      }

      //coding languages by their IDs
      if (coding_languages) {
        fetchCodingLanguagesNames(coding_languages, (names) => {
          displayCodingLanguages(names, detailsContainer);
        });
      }

      //font specifications
      if (font_specs) {
        detailsContainer.appendChild(createDetailDiv(font_specs));
      }

      // repo + report
      const linksContainer = document.createElement("div");
      linksContainer.className = "links-container";

      // GitHub repo
      if (github_repo) {
        linksContainer.appendChild(createLinkDiv("GitHub", github_repo));
      }

      // Report
      if (report) {
        linksContainer.appendChild(createLinkDiv("Report", report));
      }

      // live linik
      if (report) {
        linksContainer.appendChild(createLinkDiv("Netlify", netlify));
      }

      detailsContainer.appendChild(linksContainer);

      //video
      if (mockup_video) {
        detailsContainer.appendChild(
          createVideoDiv("Mockup Video", mockup_video)
        );
      }
    })
    .catch((error) => console.error("Error fetching post details:", error));
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");
  if (postId) {
    fetchPostDetails(postId);
  }
});
