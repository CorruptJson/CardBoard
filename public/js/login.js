document.getElementById("loginSwitch").addEventListener("click", () => {
  document.getElementById("loginBox").style.height = "530px"
  document.getElementById("loginForm").style.display = "none"
  document.getElementById("signupForm").style.display = "block"

})

document.getElementById("signupSwitch").addEventListener("click", () => {
  document.getElementById("loginBox").style.height = "440px"
  document.getElementById("signupForm").style.display = "none"
  document.getElementById("loginForm").style.display = "block"

})
