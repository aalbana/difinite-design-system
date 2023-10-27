// Toggle password show and hidden button

document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".toggle-show-password");
    const passwordInputs = document.querySelectorAll(".input-password");
  
    toggleButtons.forEach((toggleButton, index) => {
      toggleButton.addEventListener("click", function () {
        if (passwordInputs[index].type === "password") {
          passwordInputs[index].type = "text";
          toggleButton.classList.remove("bi-eye-slash-fill");
          toggleButton.classList.add("bi-eye-fill");
        } else {
          passwordInputs[index].type = "password";
          toggleButton.classList.remove("bi-eye-fill");
          toggleButton.classList.add("bi-eye-slash-fill");
        }
      });
    });
  });


// Select Script
import Select from "./select.js"

const selectElements = document.querySelectorAll("[data-custom]")

selectElements.forEach(selectElement => {
  new Select(selectElement)
})
