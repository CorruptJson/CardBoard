const parseNodeList = (nodeList) => {
  return Array.prototype.slice.call(nodeList)
}

const flash_mode = (self) => {
  let container = parseNodeList(self.parentNode.childNodes).filter(el => el.id == "card_container")[0]
  let labelList = parseNodeList(container.childNodes).filter(el => el.tagName == "LABEL")
  //console.log(labelList)
  let cardList = labelList.map(label => parseNodeList(label.childNodes).filter(el => el.tagName == "DIV")[0])
  let valueList = cardList.map(el => {
    return {
      front: el.dataset.front,
      back: el.dataset.back
    };
  })
  let array = createDisplayDivs(valueList)

  let randomArray = shuffle(array)

  showDisplay(randomArray)
  //console.log(randomArray)

}

const showDisplay = (array) => {
  let index = 0
  const screen = document.createElement("div")
  const forwardButt = document.createElement("button")
  const backwardButt = document.createElement("button")
  const shuffleButt = document.createElement("button")
  const radioDiv = document.createElement("div")

  forwardButt.id = "forwardButt"
  backwardButt.id = "backwardButt"
  shuffleButt.id = "shuffleButt"
  backwardButt.innerHTML = "<"
  forwardButt.innerHTML = ">"
  shuffleButt.innerHTML = "Shuffle"
  screen.id = "screen"
  radioDiv.id = "radioDiv"
  document.body.appendChild(screen)


  //radio
  for (let i in array) {
    let radio = document.createElement("input")
    radio.type = "radio"
    radio.name = "cardSelect"
    radio.dataset.number = i
    console.log(i)
    radio.addEventListener("change", () => {
      if (radio.checked) {
        console.log(i)
        index = i

        array.forEach((el) => {
          el.style.display = "none"
        })
        array[index].style.display = "block"
      }
    })
    radioDiv.appendChild(radio)
  }
  const radioList = parseNodeList(radioDiv.childNodes)

  //click background to remove everything
  screen.addEventListener("click", () => {
    screen.remove()
    backwardButt.remove()
    forwardButt.remove()
    shuffleButt.remove()
    array.forEach(el => el.remove())
    radioDiv.remove()

  })

  if (array.length > 0) {
    radioList.filter(el => el.dataset.number == index)[0].checked = true
    forwardButt.addEventListener("click", () => {
      index++
      if (index >= array.length) {
        index = 0
      }

      array.forEach((el) => {
        el.style.display = "none"
      })
      array[index].style.display = "block"
      radioList.filter(el => el.dataset.number == index)[0].checked = true
    })

    backwardButt.addEventListener("click", () => {
      index--
      if (index < 0) {
        index = array.length - 1
      }

      array.forEach((el) => {
        el.style.display = "none"
      })
      array[index].style.display = "block"
      radioList.filter(el => el.dataset.number == index)[0].checked = true

    })

    // Shuffles cards and unflips
    shuffleButt.addEventListener("click", () => {
      array = shuffle(array)
      index = 0
      array.forEach((el) => {
        el.style.display = "none"
      })
      array[0].style.display = "block"

      //unflip
      array.forEach(card => {
        parseNodeList(card.childNodes).filter(el => el.tagName = "INPUT")
          .forEach(box => {
            box.checked = false
          })
      })
      radioList.filter(el => el.dataset.number == index)[0].checked = true
    })

    //show first in array
    array.forEach((el) => {
      el.style.display = "none"
    })
    array[0].style.display = "block"
  }
  //append everything
  array.forEach((el) => {
    document.body.appendChild(el)
  })
  document.body.appendChild(forwardButt)
  document.body.appendChild(backwardButt)
  document.body.appendChild(shuffleButt)
  document.body.appendChild(radioDiv)

  console.log(index)


}


const createDisplayDivs = (valueList) => {
  const array = []
  valueList.forEach((el) => {
    let newLabel = document.createElement("label")
    let newDiv = document.createElement("div")
    let newCheckbox = document.createElement("input")
    let newFront = document.createElement("div")
    let newBack = document.createElement("div")


    newLabel.className = "flip display"
    newCheckbox.type = "checkbox"
    newCheckbox.className = "invisCheck"
    newDiv.className = `card`

    newFront.className = "front"
    newFront.innerHTML = `<h3>${el.front}</h3>`
    newBack.className = "back"
    newBack.innerHTML = `<p>${el.back}</p>`

    newDiv.appendChild(newFront)
    newDiv.appendChild(newBack)
    newLabel.appendChild(newCheckbox)
    newLabel.appendChild(newDiv)

    newCheckbox.addEventListener("change", (e) => {
      if (newCheckbox.checked) {
        newCheckbox.parentNode.childNodes[1].childNodes[0].style.pointerEvents = "none"
      } else {
        newCheckbox.parentNode.childNodes[1].childNodes[0].style.pointerEvents = "initial"
      }
    })
    array.push(newLabel)
  })
  return array
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


/*
var flash_cards = [];
var stack = [];
var index = 0;

const flash_mode = (self) => {
  let next_card = document.getElementById("next_card");
  let card = self.parentNode.childNodes
  var i = 0
  card.forEach(function (el) {
    if (el.tagName == "LABEL") {
      let newLabel = document.createElement("label")
      let newDiv = document.createElement("div")
      let newCheckbox = document.createElement("input")
      let newFront = document.createElement("div")
      let newBack = document.createElement("div")
      var dot = '<input type="radio" name="dot" value =' + i + ' id="radio' + i + '" onclick="spec_card()">'

      newLabel.className = "flip"

      newCheckbox.type = "checkbox"
      newCheckbox.className = "invisCheck"

      newCheckbox.addEventListener("change", (e) => {
        if (newCheckbox.checked) {
          newCheckbox.parentNode.childNodes[1].childNodes[0].style.pointerEvents = "none"
        } else {
           newCheckbox.parentNode.childNodes[1].childNodes[0].style.pointerEvents = "initial"
        }
      })

      newDiv.className = `card`
      newDiv.id = i
      newDiv.front = el.childNodes[3].childNodes[1].childNodes[0].innerHTML
      newDiv.back = el.childNodes[3].childNodes[3].childNodes[0].innerHTML
      newDiv.index = el.index

      newFront.className = "front"
      newFront.innerHTML = `<h3>${newDiv.front}</h3>`
      newBack.className = "back"
      newBack.innerHTML = `<p>${newDiv.back}</p>`

      newLabel.appendChild(newCheckbox)
      newLabel.appendChild(newDiv)

      newDiv.appendChild(newFront)
      newDiv.appendChild(newBack)
      // self.parentNode.insertBefore(newLabel, self.parentNode.childNodes[self.parentNode.childNodes.length - 2])
      newLabel.id = "unik"

      document.getElementById("dots").innerHTML += dot;

      flash_cards.push(newLabel);
      i ++
      //stack = flash_cards.slice();
    };
  })
  if (flash_cards != 0) {
    document.getElementById("stack_back").style.display = "block";
    document.getElementById("stack_container").style.display = "block";

    for (i = 0; i < flash_cards.length; i++) {
      stack.splice(Math.floor(Math.random() * stack.length), 0, flash_cards[i])
    }

    document.getElementById("radio0").checked = true;
    stack_card.innerHTML = '';
    stack_card.appendChild(stack[index]);

    for (i = 0; i < flash_cards.length; i++) {
      stack.splice(Math.floor(Math.random() * stack.length), 0, flash_cards[i])
    }
    stack_card.innerHTML = '';
    stack_card.appendChild(stack[index]);

    if (index == stack.length - 1) {
      document.getElementById("back_card").style.display = "inline-block";
      document.getElementById("next_card").style.display = "none";
    }
  }
}

const next_card = () => {
  let stack_card = document.getElementById("stack_card");
  if (index < (stack.length - 1)) {
    document.getElementById("reverse_card").style.display = "inline-block";
    index += 1;
  }
  if (index == stack.length - 1) {
    document.getElementById("back_card").style.display = "inline-block";
    document.getElementById("next_card").style.display = "none";

  }
  if (index == stack.length - 1) {
    document.getElementById("back_card").style.display = "inline-block";
    document.getElementById("next_card").style.display = "none";
  }
  document.getElementById("radio" + index).checked = true;
  stack_card.innerHTML = '';
  stack_card.appendChild(stack[index]);
}

const reverse_button = () => {
  let stack_card = document.getElementById("stack_card");
  if (index > 0) {
    index -= 1;
    document.getElementById("back_card").style.display = "none";
    document.getElementById("next_card").style.display = "inline-block";
  }
  if (index == 0) {
    document.getElementById("reverse_card").style.display = "none";

  }
  document.getElementById("radio" + index).checked = true;
  stack_card.innerHTML = '';
  stack_card.appendChild(stack[index]);
}

const spec_card = () => {
  let stack_card = document.getElementById("stack_card");
  let radiobtn = document.getElementById("radio" + index);
  for (i = 0; i < stack.length; i++) {
       if (document.getElementById("radio" + i).checked == true) {
        index = i;
       }
    }
  if (index == 0) {
    document.getElementById("reverse_card").style.display = "none";
    document.getElementById("back_card").style.display = "none";
    document.getElementById("next_card").style.display = "inline-block";
  } else if (index == stack.length - 1) {
    document.getElementById("reverse_card").style.display = "inline-block";
    document.getElementById("back_card").style.display = "inline-block";
    document.getElementById("next_card").style.display = "none";
  } else {
    document.getElementById("reverse_card").style.display = "inline-block";
    document.getElementById("back_card").style.display = "none";
    document.getElementById("next_card").style.display = "inline-block";
  }
  stack_card.innerHTML = '';
  stack_card.appendChild(stack[index]);
}

const take_a_life = () => {
  flash_cards = [];
  stack = [];
  index = 0;
  document.getElementById("back_card").style.display = "none";
  document.getElementById("reverse_card").style.display = "none";
  document.getElementById("stack_container").style.display = "none";
  document.getElementById("stack_back").style.display = "none";
  document.getElementById("next_card").style.display = "inline-block";

  while (document.getElementById("dots").firstChild) {
    document.getElementById("dots").removeChild(document.getElementById("dots").firstChild);
  }
}


*/
