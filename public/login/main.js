const { xPost } = require("requests");

function error(message) {
    const errorMessageText = document.querySelector(".error-message-text");
    errorMessageText.parentElement.style.display = !message ? "none" : null;
    errorMessageText.innerHTML = message;
}


const loginForm = document.querySelector("form#login");
const loginBtn = document.querySelector("input[value='Login']");
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const formProps = Object.fromEntries(formData);
    formProps.remember = formProps.remember === "on" ? true : false;
    xPost("/api/v1/user/login", formProps).then((res) => {
        if (res.status === 200) {
            window.location.href = window.location.origin + "/app/timer";
        } else if (res.status === 401) {
            error("Invalid username or password!");
        } else {
            error("Unknown error!");
        }
    });
});