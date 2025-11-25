/**
 * @returns {boolean} 
 */
function validateSignupForm() {
    const nameInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');
    const confirmPasswordInput = document.getElementById('ConfirmPassword');

    const name = nameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (name.length === 0) {
        alert("Name Error: Name cannot be empty.");
        nameInput.focus();
        return false;
    }

    if (password.length === 0) {
        alert("Password Error: Password cannot be empty.");
        passwordInput.focus();
        return false;
    }

    if (confirmPassword.length === 0) {
        alert("Confirm Password Error: Confirm Password cannot be empty.");
        confirmPasswordInput.focus();
        return false;
    }

    if (password !== confirmPassword) {
        alert("Password Match Error: The password and confirm password fields do not match.");
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        passwordInput.focus();
        return false;
    }

    alert("Signup details are valid! Proceeding with registration...");
    return true; 
}document.addEventListener('DOMContentLoaded', () => {
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
