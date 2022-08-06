const toggleButton = document.querySelector(".toggle-button");
const navlinks = document.querySelector(".nav-links");

toggleButton.addEventListener("click", () => {
    navlinks.classList.toggle("active");
});
