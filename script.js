const movieListItems = document.querySelectorAll(".movie-preview-list-item");
const movieListImages = document.querySelectorAll(".movie-preview-image");


function changeFeatured(moveListItem, position) {

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

    // Gradually remove the blur from the current image
    let blurAmount = 5;
    const blurInterval = setInterval(() => {
        blurAmount -= 0.5; // Adjust the speed of the blur removal
        movieListImages[position].style.filter = `blur(${blurAmount}px)`;

        if (blurAmount <= 0) {
            clearInterval(blurInterval);
            movieListImages[position].style.filter = "blur(0)";
        }
    }, 100); // Adjust the interval and speed as needed
}

// function changeFeatured(position) {
//     const previousImage = document.querySelector(".movie-preview-image.show");
//     const currentImage = movieListImages[position];

//     // Apply blur to the newly shown image
//     currentImage.style.filter = "blur(5px)";
//     currentImage.classList.add("show");
//     currentImage.classList.remove("hidden");

//     if (previousImage) {
//         // Remove blur from the previously shown image

//         previousImage.style.filter = "blur(0)";
//         previousImage.classList.remove("show");
//         previousImage.classList.add("hidden");
//     }
// }
for (let i = 0; i < movieListItems.length; i++) {
    movieListItems[i].addEventListener("mouseover", () => {
        changeFeatured(movieListItems[i], i);
    })
}
