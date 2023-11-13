//0.adr, 1. tc, 2. tzoi
const movieImageSources = ["assets/tc/tc.webp", "assets/adr/adr.webp", "assets/tzoi/tzoi.webp"];
const movieGifSources = ["assets/tc/tc_gif.gif", "assets/adr/adr_gif.gif", "assets/tzoi/tzoi_gif.gif"];
const moviePreviewWrapper = document.querySelector(".movie-preview-wrapper");
const movieListLinks = document.querySelectorAll(".movie-preview-list-item");
const movieListImages = document.querySelectorAll(".movie-preview-image");
const movieListMobile = document.querySelectorAll(".movie-preview-mobile-title");

const desktopModule = (function () {
    let index = 0;
    let intervalId;
    let initialized = false;

    function initDesktop() {
        resetToDesktopView();
        if (!initialized) {
            for (let i = 0; i < movieListLinks.length; i++) {
                if (isDesktopWidth())
                    movieListLinks[i].addEventListener("mouseover", () => {
                        changeFeatured(i);
                        movieListImages[i].src = movieGifSources[i];
                        resetInterval();
                        intervalId = setInterval(autoChangeImage, 4000);
                    });
            }
            initialized = true;
        }
    }

    function changeFeatured(nextPosition) {
        // Hide current image/gif
        movieListImages[index].classList.remove("show");
        movieListImages[index].classList.add("hidden");
        movieListLinks[index].classList.remove("active");

        // Show selected image/gif
        // If image is a gif change it back to the original image
        if (movieListImages[nextPosition].src != movieImageSources[nextPosition]) {
            movieListImages[nextPosition].src = movieImageSources[nextPosition];
        }
        movieListImages[nextPosition].classList.add("show");
        movieListImages[nextPosition].classList.remove("hidden");
        movieListLinks[nextPosition].classList.add("active");
        index = nextPosition;
    }


    function resetToDesktopView() {
        for (let i = 0; i < movieListImages.length; i++) {
            //Hide all images that is not the current desktop index
            if (i !== index) {
                movieListImages[i].classList.remove("show");
                movieListImages[i].classList.add("hidden");
            }
        }
        //Start at desktop index 
        movieListImages[index].classList.add("show");
        movieListImages[index].classList.remove("hidden");
        movieListLinks[index].classList.add("show");
        movieListLinks[index].classList.remove("hidden");

        resetInterval();
        intervalId = setInterval(autoChangeImage, 4000);
    }


    function autoChangeImage() {
        const nextIndex = (index + 1) % movieListLinks.length;
        changeFeatured(nextIndex);
    }

    function resetInterval() {
        clearInterval(intervalId);
    }

    return {
        initDesktop,
        resetInterval,
    }
})();

const mobileModule = (function () {
    let mobileIndex = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let initialized = false;
    let wheelTimer;
    let wheelEnabled = true

    function initMobile() {

        resetToMobileView();
        if (!initialized) {
            moviePreviewWrapper.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                e.preventDefault();

            });

            moviePreviewWrapper.addEventListener('touchmove', (e) => {
                touchEndY = e.touches[0].clientY;
                e.preventDefault();
            });

            moviePreviewWrapper.addEventListener('touchend', () => {
                if (!isDesktopWidth()) {
                    handleTouchGesture("touch");
                }
            });

            moviePreviewWrapper.addEventListener("wheel", (e) => {
                if (!isDesktopWidth() && wheelEnabled) {
                    wheelEnabled = false;
                    clearTimeout(wheelTimer);
                    wheelTimer = setTimeout(() => {
                        wheelEnabled = true;
                    }, 1200);
                    handleTouchGesture("wheel", e.deltaY);
                }
            });
            initialized = true;
        }
    }

    function handleTouchGesture(type, delta) {
        if (type === "touch") {
            const difference = touchStartY - touchEndY;
            if (difference > 100 && mobileIndex < movieListLinks.length - 1) {
                changeMobileFeatured(mobileIndex + 1);
            } else if (difference < -100 && mobileIndex > 0) {
                changeMobileFeatured(mobileIndex - 1);
            }
        }
        else if (type === "wheel") {
            if (delta > 0 && mobileIndex < movieListLinks.length - 1) {
                changeMobileFeatured(mobileIndex + 1);
            } else if (delta < 0 && mobileIndex > 0) {
                changeMobileFeatured(mobileIndex - 1);
            }
        }

    }

    function changeMobileFeatured(nextPosition) {
        movieListImages[mobileIndex].classList.remove("show");
        movieListImages[mobileIndex].classList.add("hidden");
        movieListMobile[mobileIndex].classList.add("hidden");

        movieListImages[nextPosition].classList.add("show");
        movieListImages[nextPosition].classList.remove("hidden");
        movieListMobile[nextPosition].classList.remove("hidden");

        mobileIndex = nextPosition;
    }

    function resetToMobileView() {
        for (let i = 0; i < movieListImages.length; i++) {
            //Reset all gifs to images
            if (movieListImages[i].src != movieImageSources[i]) {
                movieListImages[i].src = movieImageSources[i];
            }
            //Hide all images that is not the current mobile index
            if (i !== mobileIndex) {
                movieListImages[i].classList.remove("show");
                movieListImages[i].classList.add("hidden");
            }
        }
        //Start at mobile index 
        movieListImages[mobileIndex].classList.add("show");
        movieListImages[mobileIndex].classList.remove("hidden");
        movieListMobile[mobileIndex].classList.add("show");
        movieListMobile[mobileIndex].classList.remove("hidden");
    }

    return {
        initMobile,
    };
})();


window.addEventListener('load', checkView);
window.addEventListener('resize', checkView);

function checkView() {
    //desktop
    if (isDesktopWidth()) {
        desktopModule.initDesktop();
    }
    //mobile
    else {
        mobileModule.initMobile();
        desktopModule.resetInterval();
    }
}

function isDesktopWidth() {
    if (window.innerWidth > 640) {
        return true;
    }
    return false;
}