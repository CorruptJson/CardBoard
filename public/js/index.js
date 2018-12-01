if (window.location.hostname == 'cardboard-project.herokuapp.com') {
  var url = `https://${window.location.hostname}:${location.port}/createCategory/`
} else {
  var url = `http://${window.location.hostname}:${location.port}/createCategory/`
}

console.log(url)
document.getElementById("createCat").addEventListener("click", () => {
  fetch(url, {
      method: 'post',
      mode: 'no-cors'
  })
      .then(res => { return res.json() })
      .then(res => {
          let newDiv = document.createElement("div")
          newDiv.className = `categories`
          newDiv.dataset.id = res.id
          newDiv.dataset.title = `New Category`
          newDiv.dataset.index = res.index
          newDiv.innerHTML = `<div class="cat_title">${newDiv.dataset.title}</div>`
          document.getElementById("cat_container").insertBefore(newDiv, document.getElementById("createCat"))
          console.log(res)
      })
})
