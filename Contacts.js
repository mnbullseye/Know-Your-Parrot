/**
 * @returns {boolean} 
 */
function validateContactForm() {
    const nameInput = document.getElementById('Name');
    const emailInput = document.getElementById('Email');
    const messageInput = document.getElementById('Msg');

    if (!nameInput || !emailInput || !messageInput) {
        alert("Validation Error: Missing form elements. Check your IDs.");
        return false;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value;

    if (name.length === 0) {
        alert("Name Error: Please enter your name.");
        nameInput.focus();
        return false;
    }

    if (email.length === 0 || !email.includes('@')) {
        alert("Email Error: Please enter a valid email address (must contain '@').");
        emailInput.focus();
        return false;
    }

    const MAX_LENGTH = 200;
    if (message.length > MAX_LENGTH) {
        alert(`Message Error: Your message is too long. Please limit it to ${MAX_LENGTH} characters. You currently have ${message.length} characters.`);
        messageInput.focus();
        return false;
    }
    
    alert("Form submitted successfully!");
    return true; 
}
document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Toggle Functionality ---
    const navBtn = document.querySelector(".nav-btn");
    const closeBtn = document.querySelector(".close-icon");
    const sidebar = document.querySelector(".sidebar");

    if (navBtn && sidebar && closeBtn) {
        function toggleSidebar() {
            sidebar.classList.toggle("show");
            navBtn.classList.toggle("show"); 
        }
        navBtn.addEventListener("click", toggleSidebar);
        closeBtn.addEventListener("click", toggleSidebar);
    }
})