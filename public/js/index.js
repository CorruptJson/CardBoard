if (window.location.hostname == 'cardboard-project.herokuapp.com') {
  var url = `https://${window.location.hostname}:${location.port}`
} else {
  var url = `http://${window.location.hostname}:${location.port}`
}



console.log(url)
const addCat = () => {
  fetch(`${url}/createCategory`, {
    method: 'post',
  })
    .then(res => { return res.json() })
    .then(res => {
      let newDiv = document.createElement("div")
      newDiv.className = `categories`
      newDiv.dataset.id = res.id
      newDiv.dataset.title = `New Category`
      newDiv.dataset.index = res.index
      newDiv.innerHTML = `<div class="cat_title">${newDiv.dataset.title}<button onclick="deleteCat(this)">..</button></div>`
      document.getElementById("cat_container").insertBefore(newDiv, document.getElementById("createCat"))
      console.log(res)
    })
}

const deleteCat = (self => {
  const id = self.parentNode.parentNode.dataset.id
  const index = parseInt(self.parentNode.parentNode.dataset.index)
  const categories = document.getElementsByClassName("categories")
  const data = { id: id }
  for (let i = 0; i < categories.length; i++) {
    console.log(categories[i])
    if (parseInt(categories[i].dataset.index) > index) {
      categories[i].dataset.index -= 1
    }
  }
  self.parentNode.parentNode.remove()
  fetch(`${url}/deleteCategory`, {
    method: 'post',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  /* For testing deletions
    .then(res => { return res.json() })
    .then(res => {
      if (res) {
        console.log('deleted')
      } else {
        console.error('card does not exist')
      }
    })
  */


})
