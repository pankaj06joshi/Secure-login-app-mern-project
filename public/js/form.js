const sign_in_btn = document.querySelector('#sign-in-button');
const sign_up_btn = document.querySelector("#sign-up-button");
const container = document.querySelector(".container");
const signIn_signUp = document.querySelector(".signin-signup");

sign_up_btn.addEventListener('click',()=>{
    
    container.classList.add('sign-up-mode');
});

sign_in_btn.addEventListener('click',()=>{
    container.classList.remove('sign-up-mode');
    setTimeout(() => {
        signIn_signUp.style.zIndex = "10";
    }, 1000);
});


