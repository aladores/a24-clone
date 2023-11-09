const movieListLinks = document.querySelectorAll(".movie-preview-list-item");
const movieListImages = document.querySelectorAll(".movie-preview-image");

for (let i = 0; i < movieListLinks.length; i++) {
    movieListLinks[i].addEventListener("mouseover", () => {
        changeFeatured(i);
    })
}

function changeFeatured(position) {

    //Current image
    movieListImages[position].classList.add("show");
    movieListImages[position].classList.remove("hidden");

    //Previous images
    movieListImages.forEach((item, index) => {
        if (index !== position) {
            item.classList.remove("show");
            item.classList.add("hidden");
        }
    })

    //Current Link
    movieListLinks[position].classList.add("active");
    //Previous images
    movieListLinks.forEach((item, index) => {
        if (index !== position) {
            item.classList.remove("active");
        }
    })

    // // Gradually remove the blur from the current image
    // let blurAmount = 5;
    // const blurInterval = setInterval(() => {
    //     blurAmount -= 0.5; // Adjust the speed of the blur removal
    //     movieListImages[position].style.filter = `blur(${blurAmount}px)`;

    //     if (blurAmount <= 0) {
    //         clearInterval(blurInterval);
    //         movieListImages[position].style.filter = "blur(0)";
    //     }
    // }, 100); // Adjust the interval and speed as needed
}

