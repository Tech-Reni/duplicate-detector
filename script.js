document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeBtn = document.querySelector(".close-btn");
    const overlay = document.querySelector(".overlay");

    // Open Menu
    hamburger.addEventListener("click", function () {
        mobileMenu.style.right = "0";
        overlay.style.display = "block";
    });

    // Close Menu
    closeBtn.addEventListener("click", function () {
        mobileMenu.style.right = "-70%";
        overlay.style.display = "none";
    });

    // Close on overlay click
    overlay.addEventListener("click", function () {
        mobileMenu.style.right = "-70%";
        overlay.style.display = "none";
    });
});
