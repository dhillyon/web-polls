const labels = document.querySelectorAll('form label')

labels.forEach(label => {
    label.innerHTML = '<i class="fa-solid fa-arrow-right"></i>' + label.innerHTML
})

const addButton = document.getElementById('add')
const buttons = document.getElementById('buttons')
const form = document.querySelector('form')
var labelCount = 2

addButton.addEventListener('click', addNewOption)

function addNewOption() {
    labelCount ++
    const newNode = document.createElement('label')
    form.insertBefore(newNode, buttons)
    document.querySelector('label:last-of-type').innerHTML = '<i class="fa-solid fa-arrow-right"></i>' + 
    '<input type="text" required class="options" placeholder="Option ' + labelCount+ '"/>'
}

async function funcSubmit(e) {
    e.preventDefault()
    
    const question = document.getElementById('question').value 
    const options = Array.from(document.querySelectorAll('.options')).map(option => option.value)
    const uniqueOptions = [...new Set(options)]
    
    const idsRes = await fetch('/ids')
    const {ids} = await idsRes.json()
    const id = ids.length === 0 ? 1: Math.max(...ids) + 1

    const response = await fetch('/', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            id,
            question,
            options: uniqueOptions
        })
    })

    if (response.redirected) {
        window.location.href = `/${id}`
    }
    
    return
}