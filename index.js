const express = require('express');
const { createUser, findUserByEmail, findProductsByName, findUserById, getMongoCollection, createSession, insertProduct, findConsumeByUserId } = require("./mongoDb");

const {
    testEmail,
    testPassword,
    testPasswordConfirmation
} = require("./funcoesAux")

const app = express()
const port = process.env.PORT ?? 3001
app.use(express.json())

//-----------------------------------------
//-----------------------------------------

const authenticate = async (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) {
        return res.status(401).json({ message: "Não foi enviado o token de autenticação!" })
    }
    const session = await findSessionById(token)
    //se não existir sessão
    if (!session) {
        // 403 e { "message": "Não existe nenhuma sessão com o token indicado!" }
        return res.status(403).json({ message: "Não existe nenhuma sessão com o token indicado!" })
    }
    const user = await findUserById(session.userId)
    req.user = user
    req.session = session
    next()
}

//-----------------------------------------
//-----------------------------------------

// SignUp
app.post("/signup", async (req, res) => {
    // console.log("🚀 ~ file: index.js ~ line 15 ~ app.post ~ req", req)
    const {
        passwordConfirmation,
        ...signupData
    } = req.body

    const {
        email,
        password,
        // weigth,
        // age,
        // heigh,
        // sex
    } = signupData

    console.log(signupData)


    const errors = {
        ...await testEmail(email),
        ...testPassword(password),
        ...testPasswordConfirmation(password, passwordConfirmation),
    }
    //separar resposta de sucesso e resposta de erro
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Os dados introduzidos não são válidos.", errors })
    }
    const id = await createUser(signupData)
    res.status(200).json({ message: "Utilizador Criado com Sucesso!", _id: id.insertedId })
})

//-----------------------------------------
//-----------------------------------------

// Efetuar Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    //verificar se o email existe
    if (!user) {
        //se não, 404 e { "message": "O utilizador não foi encontrado!" }
        return res.status(404).json({ message: "O utilizador não foi encontrado!" })
    }
    //se a password é igual
    if (user.password !== password) {
        return res.status(401).json({ message: "A password introduzida é inválida!" })
    }
    const token = await createSession({ userId: user._id })
    res.status(200).json({ token: token.insertedId })
})

//-----------------------------------------
//-----------------------------------------

app.get("/user/:id", authenticate, (req, res) => {
    //se os parametros
    // forem o id da sessao
    res.status(200).json({
        sameUser: req.params.id == String(req.session._id)
    })
})

//-----------------------------------------
//-----------------------------------------

//Procura de produtos
app.get("/products/", async (req, res) => {
    const {
        product
    } = req.body

    const products = await findProductsByName(product)

    if (!products) {
        res.status(404).json(
            "Produto não encontrado"
        )
    }
    res.status(200).json(
        products
    )
})

//-----------------------------------------
//-----------------------------------------

//Adiciona ao historico
app.post("/consume", async (req, res) => {
    const {
        userId,
        productName,
        quantity
    } = req.body
    const consume = await insertProduct(userId, productName, quantity)

    res.status(200).json(
        consume
    )
})

//-----------------------------------------
//-----------------------------------------

//get userID e date
app.get("/consume", async (req, res) => {
    const {
        userId,
        date
    } = req.body
    console.log(date)
    //console.log(userId)
    
    const consume = await findConsumeByUserId(userId, date)

    if (!consume){
        res.status(404).json(
            "Utilizador não encontrado"
        )
    }
        res.status(200).json(
            consume
        )
})


//-----------------------------------------
//-----------------------------------------


app.listen(port, () => { console.log(`À escuta em http://localhost:${port}`) })