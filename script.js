//0.adr, 1. tc, 2. tzoi
const movieImageSources = ["assets/tc/tc.webp", "assets/adr/adr.webp", "assets/tzoi/tzoi.webp"];
const movieGifSources = ["assets/tc/tc_gif.gif", "assets/adr/adr_gif.gif", "assets/tzoi/tzoi_gif.gif"];
const movieListLinks = document.querySelectorAll(".movie-preview-list-item");
const movieListImages = document.querySelectorAll(".movie-preview-image");
let index = 0;
let intervalId;

function changeFeatured(currPosition) {
    // Hide current image/gif
    movieListImages[index].classList.remove("show");
    movieListLinks[index].classList.remove("active");
    movieListImages[index].classList.add("hidden");

    // Show selected image/gif
    // If image is a gif change it back to the original image
    if (movieListImages[currPosition].src != movieImageSources[currPosition]) {
        movieListImages[currPosition].src = movieImageSources[currPosition];
    }
    movieListImages[currPosition].classList.add("show");
    movieListLinks[currPosition].classList.add("active");
    movieListImages[currPosition].classList.remove("hidden");

    index = currPosition;
}


function autoChangeImage() {
    const nextIndex = (index + 1) % movieListLinks.length;
    changeFeatured(nextIndex);
}

function startInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(autoChangeImage, 4000);
}

function changeToGif(currPosition) {
    movieListImages[currPosition].src = movieGifSources[currPosition];
}

//Start the slideshow
startInterval();

// Manually selected image via links
for (let i = 0; i < movieListLinks.length; i++) {
    movieListLinks[i].addEventListener("mouseover", () => {
        changeFeatured(i);
        changeToGif(i);
        startInterval();
    });
}