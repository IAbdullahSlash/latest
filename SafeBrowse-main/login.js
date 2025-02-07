const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


    function redirectToOutput() {
        window.location.href = 'latest-main/latest-main/index.html'; 
    }
    
    
    document.querySelector('.form-container.sign-in button').addEventListener('click', (event) => {
        event.preventDefault(); 
        redirectToOutput(); 
    });
