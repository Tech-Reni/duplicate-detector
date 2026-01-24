/* =============== SHOW MENU =============== */
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close'),
      navOverlay = document.getElementById('nav-overlay');

/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
        navOverlay.classList.add('show-overlay')
    })
}

/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
        navOverlay.classList.remove('show-overlay')
    })
}

/* Close menu when clicking overlay */
if(navOverlay){
    navOverlay.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
        navOverlay.classList.remove('show-overlay')
    })
}

/* =============== REMOVE MENU MOBILE ON LINK CLICK =============== */
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    const navOverlay = document.getElementById('nav-overlay')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
    navOverlay.classList.remove('show-overlay')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/* =============== CHANGE BACKGROUND HEADER =============== */
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/* =============== SCROLL REVEAL ANIMATION =============== */
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true // Animations repeat
})

sr.reveal(`.home__data`)
sr.reveal(`.about__img-box`, {origin: 'left'})
sr.reveal(`.about__data`, {origin: 'right'})
sr.reveal(`.pricing__card`, {interval: 100})
sr.reveal(`.footer__container`, {origin: 'bottom'})
sr.reveal(`.info__container`, {origin: 'bottom', delay: 200})