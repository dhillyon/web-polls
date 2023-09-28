const express = require('express')
const app = express()
const port = 8383

const {readDb, writeDb} = require('./dbFunctions')

app.use(express.static('public'))
app.use(express.json())

// App routes
app.post("/", (request, response) => {
    const {id, question, options} = request.body
    
    if (!id || !question || options.length == 0) {
        response.status(400).send({status:"error"})
    }

    const currentPolls = readDb()
    writeDb({
        ...currentPolls,
        [id]: {
            question,
            options: options.reduce((acc, curr) => {
                return {...acc, [curr]: 0}
            }, {})
        }
    })

    response.sendStatus(200)
})

// Response is used to assert that any new ID is unique
app.get('/ids', (request, response) => {
    const ids = readDb()
    response.status(200).send({ids: Object.keys(ids)})
})

app.get('/:id', (request, response) => {
    const {id} = request.params
    try {
        return response.status(200).sendFile('poll.html', {root: __dirname + '/public'})
    } catch (err) {
        console.error(err)
        response.sendStatus(500)
    }
})

app.get('/data/:id', (request, response) => {
    const {id} = request.params
    const data = readDb()[id]

    response.status(200).send({data})
})

app.listen(port, () => console.log('Server running on port ' + port))