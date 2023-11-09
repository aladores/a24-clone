const movieListLinks = document.querySelectorAll(".movie-preview-list-item");
const movieListImages = document.querySelectorAll(".movie-preview-image");
let index = 0;
let intervalId;

function changeFeatured(position) {
    // Hide current image 
    movieListImages[index].classList.remove("show");
    movieListLinks[index].classList.remove("active");
    movieListImages[index].classList.add("hidden");

    // Show selected image
    movieListImages[position].classList.add("show");
    movieListLinks[position].classList.add("active");
    movieListImages[position].classList.remove("hidden");

    index = position;
}

function autoChangeImage() {
    const nextIndex = (index + 1) % movieListLinks.length;
    changeFeatured(nextIndex);
}

function startInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(autoChangeImage, 4000);
}

//Start the slideshow
startInterval();

// Manually selected image via links
for (let i = 0; i < movieListLinks.length; i++) {
    movieListLinks[i].addEventListener("mouseover", () => {
        changeFeatured(i);
        startInterval();
    });
}