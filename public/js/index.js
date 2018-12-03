//Set url to '/'
window.history.pushState("", "", '/')

//if url is heroku, us https
if (window.location.hostname == 'cardboard-project.herokuapp.com') {
  var url = `https://${window.location.hostname}:${location.port}`
} else {
  var url = `http://${window.location.hostname}:${location.port}`
}

console.log(url)
//Edit button <button class="card-edit" onclick="edit_card(this)">Edit</button>

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
        let newLabel = document.createElement("label")
        let newDiv = document.createElement("div")
        let newCheckbox = document.createElement("input")
        let newFront = document.createElement("div")
        let newBack = document.createElement("div")

        newLabel.className = "flip"

        newCheckbox.type = "checkbox"

        newDiv.className = `card`
        newDiv.dataset.id = res.id
        newDiv.dataset.front = res.front
        newDiv.dataset.back = res.back
        newDiv.dataset.index = res.index

        newFront.className = "front"
        newFront.innerHTML = `<h3>${escape_HTML(newDiv.dataset.front)}</h3><button class="card-edit" onclick="edit_card(this)">Edit</button>`
        newBack.className = "back"
        newBack.innerHTML = `<p>${escape_HTML(newDiv.dataset.back)}</p><button class="card-edit" onclick="edit_card(this)">Edit</button>`

        newLabel.appendChild(newCheckbox)
        newLabel.appendChild(newDiv)

        newDiv.appendChild(newFront)
        newDiv.appendChild(newBack)
        self.parentNode.insertBefore(newLabel, self.parentNode.childNodes[self.parentNode.childNodes.length - 2])

      } else {
        console.error('Error creating card')
      }
    })
}

const edit_card = (self) => {
  event.stopPropagation()
  event.preventDefault()
  let card = self.parentNode
  let area = document.createElement("textarea")
  let confirm = document.createElement("button")
  area.style.position = "relative"
  area.style.height = "160px"
  area.style.width = "230px"
  confirm.className = "confirm-card"
  confirm.innerHTML = "✔"

  if (card.className == "front") {
    let text = card.parentNode.dataset.front
    area.innerHTML = text
    area.maxLength = 150

    confirm.addEventListener("click", () => {
      event.stopPropagation()
      event.preventDefault()
      card.parentNode.dataset.front = area.value
      card.innerHTML = `<h3>${escape_HTML(area.value)}</h3><button class="card-edit" onclick="edit_card(this)">Edit</button>`

    })
  } else {
    let text = card.parentNode.dataset.back
    area.innerHTML = text
    area.maxLength = 300

    confirm.addEventListener("click", () => {
      event.stopPropagation()
      event.preventDefault()
      card.parentNode.dataset.back = area.value
      card.innerHTML = `<p>${escape_HTML(area.value)}</p><button class="card-edit" onclick="edit_card(this)">Edit</button>`
    })
  }
  card.innerHTML = ''



  card.appendChild(area)
  card.appendChild(confirm)

}

const escape_HTML = (str) => {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


/*
for (let i = 0; i < document.getElementsByClassName("card-edit").length; i++) {
  console.log(document.getElementsByClassName("card-edit")[i])
  document.getElementsByClassName("card-edit")[i].addEventListener("click", (event) => {
    event.stopPropagation()
    event.preventDefault()
  })
}
*/
