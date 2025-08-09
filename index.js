const signUpButton = document.getElementById('signUp')
const signInButton = document.getElementById('signIn')
const container = document.getElementById('container')

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active")
})
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active")
})

// Sign-in elements
const signinForm = document.querySelector('.sign-in-container form');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

// Admin credentials
const validEmail = 'bnoob2398@gmail.com';
const validPassword = 'Jarvis@deep1';

// LocalStorage helper functions
function getUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}
function saveUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}
function emailExists(email) {
    return getUsers().some(user => user.email === email);
}
function registerUser(name, email, password) {
    const users = getUsers();
    users.push({
        id: Date.now(),
        name,
        email,
        password,
        registeredAt: new Date().toISOString()
    });
    saveUsers(users);
}
function validateUser(email, password) {
    if (email === validEmail && password === validPassword) {
        return { success: true, user: { name: 'Admin', email } };
    }
    const user = getUsers().find(u => u.email === email && u.password === password);
    return user ? { success: true, user } : { success: false };
}

// Sign-up elements
const signupForm = document.querySelector('.sign-up-container form');
const signupName = signupForm ? signupForm.querySelector('input[placeholder="Name"]') : null;
const signupEmail = signupForm ? signupForm.querySelector('input[placeholder="Email"]') : null;
const signupPassword = signupForm ? signupForm.querySelector('input[placeholder="Password"]') : null;

// Sign-up form submission
if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const button = signupForm.querySelector('button[type="submit"]');

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        const originalText = button.textContent;
        button.textContent = 'Creating Account...';
        button.disabled = true;
        button.style.background = '#007B9A';

        setTimeout(() => {
            if (emailExists(email)) {
                button.textContent = 'Email Already Exists';
                button.style.background = '#dc3545';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '#008CBA';
                }, 2000);
            } else {
                registerUser(name, email, password);
                button.textContent = 'Account Created!';
                button.style.background = '#28a745';

                signupName.value = '';
                signupEmail.value = '';
                signupPassword.value = '';

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

// Sign-in form submission
if (signinForm) {
    signinForm.addEventListener('submit', e => {
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

// Optional logout function if you want to use
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html'; // Your sign-in page
    }
}
