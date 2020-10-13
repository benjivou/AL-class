

const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
app.use(cors())
const bodyParser = require('body-parser')



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next()
});


app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('short'))





const ticketCheckService_router = require('./app/api/index.js')

app.use('/ticketCheck',ticketCheckService_router)




app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOOOT")
})


// localhost:3003
app.listen(3003, () => {
    console.log(" Ticket ckeck Server is up and listening on 3003...")
})
