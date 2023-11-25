
const express = require("express")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const db = require("./db/db")
const UserModel = require("./models/user")
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post("/signup", (req, res) => {
    const { username, password, name, age } = req.body;
    const user = new UserModel({ username, password, name, age })
    user.save().then(() => {
        res.send({ message: "User creted successfully" })
    })
})

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    //CHECK AUTHENTICATION
    const jwtSecretKey = process.env.SECRETKEY;
    //GENERATE A UNIQUE TOKEN FOR AUTHORIZATION
    const token = jwt.sign({ name: user?.name, age: user?.age }, jwtSecretKey, { expiresIn: "1d" })
    res.send({ message: "sign in success", token })
})

app.get("/profile/:id", async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    const token = req.headers["authorization"]?.split(" ")[1] || ""
    const jwtSecretKey = process.env.SECRETKEY;
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        // console.log(decoded, "askjaskh")
        if (decoded) {
            return res.send(user)
        }
        return res.status(403).send("Forbidden");
    } catch (error) {
        console.log(error)
        return res.status(403).send("Forbidden");
    }


})

app.listen(8080, () => {
    db.then(() => {
        console.log("server started on http://localhost:8080/")
    })

})