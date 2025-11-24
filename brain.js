const navBtn = document.querySelector(".nav-btn");
const closeBtn = document.querySelector(".close-icon");
const sidebar = document.querySelector(".sidebar");

function toggleSidebar() {
    sidebar.classList.toggle("show");
    navBtn.classList.toggle("show"); 
}

navBtn.addEventListener("click", toggleSidebar);
closeBtn.addEventListener("click", toggleSidebar);