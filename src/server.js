const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


// Health check route
app.get("/", (req, res) => {
    console.log("Chatbot backend is running")
})


//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


