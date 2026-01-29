const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// Handle sign-in form submission
const signInForm = document.querySelector('.sign-in-container form');
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;
    const role = signInForm.querySelector('input[name="role"]:checked').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login based on role
  if (role === "admin") {
    localStorage.setItem("role", "admin");
    window.location.href = "../admin/dashboard.html";
} else if (role === "staff") {
    localStorage.setItem("role", "staff");
    window.location.href = "../staff/dashboard.html";
} else if (role === "user") {
    localStorage.setItem("role", "user");
    window.location.href = "../user/dashboard.html";
}


});

// Handle sign-up form submission
// Handle sign-in form submission
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;
    const role = signInForm.querySelector('input[name="role"]:checked').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (role === "admin") {
        if (email === USERS.admin.email && password === USERS.admin.password) {
            window.location.href = "../admin/dashboard.html";
        } else {
            alert("Wrong admin email or password");
        }
    } else if (role === "staff") {
        if (email === USERS.staff.email && password === USERS.staff.password) {
            window.location.href = "../staff/dashboard.html";
        } else {
            alert("Wrong staff email or password");
        }
    } else if (role === "user") {
        // For now allow any user login
        window.location.href = "../user/dashboard.html";
    }
});


