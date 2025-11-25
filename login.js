/**
 * @returns {boolean} 
 */
function validateForm() {
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');

    if (!emailInput || !passwordInput) {
        alert("Validation Error: Missing email or password input fields (check your IDs).");
        return false;
    }

    const email = emailInput.value.trim();
    if (email.length === 0 || !email.includes('@')) {
        alert("Email Error: Please enter a valid email address (must contain '@').");
        emailInput.focus(); 
        return false;
    }

    const password = passwordInput.value;
    
    const hasCapital = /[A-Z]/.test(password);

    if (password.length < 1) { 
         alert("Password Error: Password cannot be empty.");
         passwordInput.focus();
         return false;
    }
    
    if (!hasCapital) {
        alert("Password Error: Your password must contain at least one capital letter.");
        passwordInput.focus();
        return false;
    }

    alert("Validation Successful! Submitting form...");
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