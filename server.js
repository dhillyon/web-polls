const express = require('express')
const app = express()
const port = 8383

const {db} = require('./firebase')
const {readDb, writeDb} = require('./dbFunctions')

console.log(db)

app.use(express.static('public'))
app.use(express.json())

// App routes
app.post("/", async (request, response) => {
    const {id, question, options} = request.body
    
    if (!id || !question || options.length == 0) {
        response.status(400).send({status:"error"})
    }

    const docRef = db.collection('polls').doc('polls');
    const res = await docRef.set({
        [id]: {
            question,
            options: options.reduce((acc, curr) => {
                return {...acc, [curr]: 0}
            }, {})
        }
      }, {merge: true});

    response.redirect('/' + id)
})

app.post('/vote', async(request, response) => {
    const {id, vote} = request.body

    const pollRef = db.collection('polls').doc('polls') 
    const polls = await pollRef.get() 
    
    const data = polls.data()
    data[id]['options'][vote] += 1
    
    const res = await pollRef.set({
        ...data
      }, {merge: true});

    response.sendStatus(200)
})

// Response is used to assert that any new ID is unique
app.get('/ids', async(request, response) => {
    const pollRef = db.collection('polls').doc('polls') 
    const data = await pollRef.get()
    const polls = data.data()
    response.status(200).send({ids: Object.keys(polls)})
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

app.get('/data/:id', async (request, response) => {
    const {id} = request.params

    const pollRef = db.collection('polls').doc('polls') 
    const data = await pollRef.get()
    const polls = data.data()
    if (!Object.keys(polls).includes(id)) {
        return response.redirect('/')
    }
    else {
        response.status(200).send({data: polls[id]})
    }

})


app.listen(port, () => console.log('Server running on port ' + port))