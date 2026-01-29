function signup(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const role = document.getElementById("signupRole")?.value || "user"; // optional

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("queuecraftUsers")) || [];

  // Check existing
  if (users.some(u => u.email === email)) {
    alert("User already exists. Please login.");
    window.location.href = "login.html";
    return;
  }

  users.push({ name, email, password, role });
  localStorage.setItem("queuecraftUsers", JSON.stringify(users));

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

function login(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("queuecraftUsers")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid credentials.");
    return;
  }

  // set session
  localStorage.setItem("queuecraftSession", JSON.stringify({
    email: user.email,
    role: user.role
  }));

  alert("Login successful!");

  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("queuecraftSession");
  window.location.href = "login.html";
}

// Check session on protected pages
function requireAuth() {
  const session = JSON.parse(localStorage.getItem("queuecraftSession"));
  if (!session) {
    alert("Session expired. Please login.");
    window.location.href = "login.html";
  }
}
