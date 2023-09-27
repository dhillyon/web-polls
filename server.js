const express = require('express')
const app = express()
const port = 8383

app.use(express.static('public'))

// App routes
app.post("/", (request, response) => {
    response.send("wiajdoawjd")
})

app.listen(port, () => console.log('Server running on port ' + port))