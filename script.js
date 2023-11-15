let lethargy = new Lethargy(5, 120, 0.05);
//0.adr, 1. tc, 2. tzoi
const movieImageSources = ["assets/tc/tc.webp", "assets/adr/adr.webp", "assets/tzoi/tzoi.webp"];
const movieGifSources = ["assets/tc/tc_gif.gif", "assets/adr/adr_gif.gif", "assets/tzoi/tzoi_gif.gif"];
const moviePreviewWrapper = document.querySelector(".movie-preview-wrapper");
const movieTitles = document.querySelectorAll(".movie-preview-title-container ");
const movieImages = document.querySelectorAll(".movie-preview-image");
const movieMobileTitles = document.querySelectorAll(".movie-preview-mobile-title");
const positionIndicator = document.querySelector(".position-indicator");
const testSection = document.querySelector(".test-sections");

const desktopModule = (function () {
    let index = 0;
    let intervalId;
    let initialized = false;

    function initDesktop() {
        resetToDesktopView();
        if (!initialized) {
            for (let i = 0; i < movieTitles.length; i++) {
                if (isDesktopWidth())
                    movieTitles[i].addEventListener("mouseover", () => {
                        changeFeatured(i);
                        movieImages[i].src = movieGifSources[i];
                        resetInterval();
                        intervalId = setInterval(autoChangeImage, 4000);
                    });
            }
            initialized = true;
        }
    }

    function changeFeatured(nextPosition) {
        // Hide current image/gif
        movieImages[index].classList.remove("show");
        movieImages[index].classList.add("hidden");
        movieTitles[index].classList.remove("active");
        // Show selected image/gif
        // If image is a gif change it back to the original image
        if (movieImages[nextPosition].src != movieImageSources[nextPosition]) {
            movieImages[nextPosition].src = movieImageSources[nextPosition];
        }
        movieImages[nextPosition].classList.add("show");
        movieImages[nextPosition].classList.remove("hidden");
        movieTitles[nextPosition].classList.add("active");
        index = nextPosition;
    }


    function resetToDesktopView() {
        for (let i = 0; i < movieImages.length; i++) {
            //Hide all images that is not the current desktop index
            if (i !== index) {
                movieImages[i].classList.remove("show");
                movieImages[i].classList.add("hidden");
            }
        }
        //Start at desktop index 
        movieImages[index].classList.add("show");
        movieImages[index].classList.remove("hidden");
        movieTitles[index].classList.add("show");
        movieTitles[index].classList.remove("hidden");

        resetInterval();
        intervalId = setInterval(autoChangeImage, 4000);
    }


    function autoChangeImage() {
        const nextIndex = (index + 1) % movieTitles.length;
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
    let wheelEnabled = true;
    const maxLineHeight = 60;
    function initMobile() {

        resetToMobileView();
        if (!initialized) {

            //For changing carousel image and hiding carousel
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
                    handleMobileGesture("touch");
                }
            });

            moviePreviewWrapper.addEventListener("wheel", (e) => {
                e.preventDefault();
                if (lethargy.check(e)) {
                    if (!isDesktopWidth() && wheelEnabled) {
                        wheelEnabled = false;
                        clearTimeout(wheelTimer);
                        wheelTimer = setTimeout(() => {
                            wheelEnabled = true;
                        }, 300);
                        handleMobileGesture("wheel", e.deltaY);
                    };
                }
            });

            //For showing carousel only
            testSection.addEventListener('wheel', (e) => {
                setTimeout(() => {
                    if (window.scrollY === 0 && moviePreviewWrapper.classList.contains("hide")) {
                        console.log(e);
                        moviePreviewWrapper.classList.remove("hide");
                    }
                }, 100)
            });

            testSection.addEventListener('touchend', () => {
                const difference = touchStartY - touchEndY;
                if (difference > 50) {
                    if (window.scrollY === 0 && moviePreviewWrapper.classList.contains("hide")) {
                        moviePreviewWrapper.classList.remove("hide");
                    }
                }
            });
            initialized = true;
        }
    }

    function handleMobileGesture(type, delta) {
        if (type === "touch") {
            const difference = touchStartY - touchEndY;
            if (difference > 100 && mobileIndex < movieTitles.length - 1) {
                changeMobileFeatured(mobileIndex + 1);
                changePositionIndicator("next");
            }
            else if (difference < -100 && mobileIndex > 0) {
                changeMobileFeatured(mobileIndex - 1);
                changePositionIndicator("prev");
            }
            else if (difference > 100 && mobileIndex === movieTitles.length - 1) {
                moviePreviewWrapper.classList.add("hide");
            }
        }
        else if (type === "wheel") {
            if (delta > 0 && mobileIndex < movieTitles.length - 1) {
                changeMobileFeatured(mobileIndex + 1);
                changePositionIndicator("next");
            } else if (delta < 0 && mobileIndex > 0) {
                changeMobileFeatured(mobileIndex - 1);
                changePositionIndicator("prev");
            }
            else if (delta > 0 && mobileIndex === movieTitles.length - 1) {
                moviePreviewWrapper.classList.add("hide");
            }
        }
    }

    function changeMobileFeatured(nextPosition) {
        movieImages[mobileIndex].classList.remove("show");
        movieImages[mobileIndex].classList.add("hidden");
        movieMobileTitles[mobileIndex].classList.add("hidden");

        movieImages[nextPosition].classList.add("show");
        movieImages[nextPosition].classList.remove("hidden");
        movieMobileTitles[nextPosition].classList.remove("hidden");

        mobileIndex = nextPosition;
    }

    function changePositionIndicator(command) {
        const currentPosition = positionIndicator.querySelector(".current-position");
        const positionLine = positionIndicator.querySelector(".position-line");
        const positionMax = positionIndicator.querySelector(".position-max");
        const positionArrow = positionIndicator.querySelector(".position-arrow");
        const currentHeight = positionLine.offsetHeight;
        const incrementHeight = Math.round(maxLineHeight / movieImages.length - 1);
        let newHeight;

        if (movieImages.length - 1 === mobileIndex) {
            newHeight = 0;
            positionMax.classList.add("display-none");
            positionArrow.classList.remove("hidden");
        }
        else {
            newHeight = (command === "next") ? currentHeight - incrementHeight : currentHeight + incrementHeight;
            positionMax.classList.remove("display-none");
            positionArrow.classList.add("hidden");
        }

        currentPosition.innerText = `${mobileIndex + 1}`;
        positionLine.style.height = `${newHeight}px`;
    }

    function resetToMobileView() {
        for (let i = 0; i < movieImages.length; i++) {
            //Reset all gifs to images
            if (movieImages[i].src != movieImageSources[i]) {
                movieImages[i].src = movieImageSources[i];
            }
            //Hide all images that is not the current mobile index
            if (i !== mobileIndex) {
                movieImages[i].classList.remove("show");
                movieImages[i].classList.add("hidden");
            }
        }
        //Start at mobile index 
        movieImages[mobileIndex].classList.add("show");
        movieImages[mobileIndex].classList.remove("hidden");
        movieMobileTitles[mobileIndex].classList.add("show");
        movieMobileTitles[mobileIndex].classList.remove("hidden");
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