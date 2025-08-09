const signUpButton = document.getElementById('signUp')
const signInButton = document.getElementById('signIn')
const conatainer = document.getElementById('container')

signUpButton.addEventListener('click',() => {
    conatainer.classList.add("right-panel-active")
})
signInButton.addEventListener('click', () => {
    conatainer.classList.remove("right-panel-active")
}) 
// Add IDs to your email and password inputs in your HTML first:
// <input type="email" id="emailInput" placeholder="Email">
// <input type="password" id="passwordInput" placeholder="Password">

// Get the sign-in form and inputs
const signinForm = document.querySelector('.sign-in-container form');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

// Valid credentials
const validEmail = 'bnoob2398@gmail.com';
const validPassword = 'Jarvis@deep1';

// Add form submission handler
signinForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Check credentials
    if (email === validEmail && password === validPassword) {
        // Successful login - redirect to portfolio
        window.location.href = 'portfolio.html';
    } else {
        // Invalid credentials - show error
        alert('Invalid credentials. Please try again.');
        passwordInput.value = ''; // Clear password field
    }
});
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html'; // Change to your sign-in page filename
    }
}

// Your existing code stays the same, just add this:

// Get the sign-up form
const signupForm = document.querySelector('.sign-up-container form');
const signupName = signupForm ? signupForm.querySelector('input[placeholder="Name"]') : null;
const signupEmail = signupForm ? signupForm.querySelector('input[placeholder="Email"]') : null;
const signupPassword = signupForm ? signupForm.querySelector('input[placeholder="Password"]') : null;

// Load existing users from localStorage
function getUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// Check if email already exists
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Register new user
function registerUser(name, email, password) {
    const users = getUsers();
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        registeredAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return true;
}

// Validate user credentials (updated)
function validateUser(email, password) {
    const users = getUsers();
    
    // Check against default admin account
    if (email === 'bnoob2398@gmail.com' && password === 'Jarvis@deep1') {
        return { success: true, user: { name: 'Admin', email: email } };
    }
    
    // Check against registered users
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        return { success: true, user: user };
    }
    
    return { success: false };
}

// Handle sign-up form submission
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const button = signupForm.querySelector('button[type="submit"]');
        
        // Validation
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Show loading state
        const originalText = button.textContent;
        button.textContent = 'Creating Account...';
        button.disabled = true;
        button.style.background = '#007B9A';
        
        setTimeout(() => {
            if (emailExists(email)) {
                // Email already exists
                button.textContent = 'Email Already Exists';
                button.style.background = '#dc3545';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '#008CBA';
                }, 2000);
            } else {
                // Register new user
                registerUser(name, email, password);
                button.textContent = 'Account Created!';
                button.style.background = '#28a745';
                
                // Clear form
                signupName.value = '';
                signupEmail.value = '';
                signupPassword.value = '';
                
                // Switch to sign-in panel
                setTimeout(() => {
                    container.classList.remove("right-panel-active");
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '#008CBA';
                    alert('Account created successfully! Please sign in.');
                }, 1500);
            }
        }, 1500);
    });
}

// Update your existing sign-in handler
if (signinForm) {
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const button = signinForm.querySelector('button[type="submit"]');
        
        const originalText = button.textContent;
        button.textContent = 'Signing In...';
        button.disabled = true;
        button.style.background = '#007B9A';
        
        setTimeout(() => {
            const result = validateUser(email, password);
            
            if (result.success) {
                button.textContent = 'Success!';
                button.style.background = '#28a745';
                
                // Store current user info for portfolio
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                
                setTimeout(() => {
                    window.location.href = 'portfolio.html';
                }, 500);
            } else {
                button.textContent = 'Invalid Credentials';
                button.style.background = '#dc3545';
                passwordInput.value = '';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '#008CBA';
                }, 2000);
            }
        }, 1500);
    });
}

