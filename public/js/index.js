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
      if (res) {
        let newDiv = document.createElement("div")
        newDiv.className = `categories`
        newDiv.dataset.id = res.id
        newDiv.dataset.title = `New Category`
        newDiv.dataset.index = res.index
        newDiv.innerHTML = `<div class="cat_title">${newDiv.dataset.title}<button onclick="deleteCat(this)">..</button></div><button id="createCard" onclick="createCard(this)">+</button> `

        document.getElementById("cat_container").insertBefore(newDiv, document.getElementById("createCat"))
      } else {
        console.error('Error creating category')
      }
    })
}

const deleteCat = (self) => {
  const id = self.parentNode.parentNode.dataset.id
  const categories = document.getElementsByClassName("categories")
  const data = { id: id }
  fetch(`${url}/deleteCategory`, {
    method: 'post',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => { return res.json() })
    .then(res => {
      if (res) {
        const index = parseInt(self.parentNode.parentNode.dataset.index)
        for (let i = 0; i < categories.length; i++) {
          if (parseInt(categories[i].dataset.index) > index) {
            categories[i].dataset.index -= 1
          }
        }
        self.parentNode.parentNode.remove()
      } else {
        console.error('Error deleting card')
      }
    })
}

const createCard = (self) => {
  const category_id = self.parentNode.dataset.id
  const data = { id: category_id }
  fetch(`${url}/createCard`, {
    method: 'post',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => { return res.json() })
    .then(res => {
      console.log(res)
      if (res) {
        let newDiv = document.createElement("div")
        newDiv.className = `cards`
        newDiv.dataset.id = res.id
        newDiv.dataset.front = res.front
        newDiv.dataset.back = res.back
        newDiv.dataset.index = res.index
        newDiv.innerHTML = newDiv.dataset.front
        console.log(newDiv, self.parentNode.childNodes[self.parentNode.childNodes.length -2])
        self.parentNode.insertBefore(newDiv, self.parentNode.childNodes[self.parentNode.childNodes.length -2])
      } else {
        console.error('Error creating card')
      }
    })
}
