const id = window.location.pathname.replaceAll('/', '')
const url = window.location.href
console.log(window.location.href)
const urlDiv = document.getElementById('url')
urlDiv.innerText = url
const question = document.querySelector('main > h1')
const optionsList = document.querySelector('ul')
let optionsFromServer = []

// Redirects to homepage if ID is invalid
async function onLoad() {
    const idsRes = await fetch('/ids')
    const {ids} = await idsRes.json()

    if (!ids.includes(id)) {
        window.location.href = '/'
    }

    const response = await fetch('/data/' + id) 
    const {data} = await response.json()

    optionsFromServer = data.options
    question.innerText = data.question + (data.question.includes('?') ? '' : '?')

    let newInnerListHTML = ''
    Object.keys(data.options).forEach((option, index) => {
        newInnerListHTML += `<li id="${option}"><i class="fa-solid fa-arrow-right"></i>${option}</li>`
    })

    optionsList.innerHTML = newInnerListHTML
    const optionsLi = document.querySelectorAll('li')
    optionsLi.forEach(option => {
        option.addEventListener('click', clicked)
    })
}
onLoad()

async function clicked(index) {
    const selected = index.target.id
    var maxNumberOfVotes = Math.max(...Object.values(optionsFromServer)) 

    const optionsLi = document.querySelectorAll('li')
    optionsLi.forEach(val => {
        const option = val.id
        
        val.removeEventListener('click', clicked) 
        val.style.background = `#F8F0E3`
        val.style.border = `0.5px solid #444444`

        if (maxNumberOfVotes !== 0) {
            if (optionsFromServer[option] + 1 > maxNumberOfVotes) {
                maxNumberOfVotes = optionsFromServer[option] + 1
            }
            if (selected === option) {
                var result = ((optionsFromServer[option] +1) / maxNumberOfVotes)
                val.style.width =  `${result*100}%`
            } else {
                var result = (optionsFromServer[option] / maxNumberOfVotes)
                val.style.width =  `${result*100}%`
            }

        }
        else {
            if (selected === option) {
                if (optionsFromServer[option] + 1 > maxNumberOfVotes) {
                    maxNumberOfVotes = optionsFromServer[option] + 1
                }
                val.style.width = `100%`
            } else {
                var result = (optionsFromServer[option] / maxNumberOfVotes)
                val.style.width = `0%`
            }
        }
    })

    // Send result to server
    const response = await fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify( {
            id,
            vote: selected
        })
    })
}