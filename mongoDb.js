//Função Default
const { MongoClient, ObjectId } = require('mongodb')
const URL = process.env.MONGO_URL ?? "mongodb://localhost:27017"
const DB_NAME = "Nutribudy"
const COLLECTION_USERS = "users"
const COLLECTION_PRODUCTS = "products"
const COLLECTION_SESSIONS = "sessions"
const COLLECTION_CONSUME = "consume"

let client

async function connectToMongo() {
  try {
    if (!client) {
      client = await MongoClient.connect(URL)
    }
    return client;
  } catch (err) {
    console.log(err)
  }
}
//Função Default
async function getMongoCollection(dbName, collectionName) {
  const client = await connectToMongo()
  return client.db(dbName).collection(collectionName)
}

//-----------------------------------------
//-----------------------------------------

//Outras Funções
//Criar user
async function createUser(data) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_USERS)
  return await collection.insertOne(data)
}

//-----------------------------------------
//-----------------------------------------

//Procurar User Por E-mail
async function findUserByEmail(email) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_USERS)
  return await collection.findOne({ email: email })
}

//-----------------------------------------
//-----------------------------------------

//Procurar Productos por ID
//async function findProductsById(id) {

//PERGUNTAR:
async function findProductsByName(product) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_PRODUCTS)
  //return await collection.findOne({ _id: ObjectId(id) })
  //PERGUNTAR:
  return await collection.findOne({ name: product })
}

//-----------------------------------------
//-----------------------------------------

//
async function createSession(data) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_SESSIONS)
  return await collection.insertOne(data)
}


//-----------------------------------------
//-----------------------------------------

//Encontar o User pelo ID
async function findUserById(id) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_USERS)
  return await collection.findOne({ _id: ObjectId(id) })
}

//-----------------------------------------
//-----------------------------------------

//Inserir produto Para Historico
async function insertProduct(userId, product, quantity) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_CONSUME)
  const productObj = await findProductsByName(product)
  return await collection.insertOne({
    userId: new ObjectId(userId),
    kcal: (productObj.kcal / 100) * quantity * (productObj.servingSize ?? 100),
    // fat: (productObj.fat / 100) * quantity,
    // carbs: (productObj.carbs / 100) * quantity,
    // protein: (productObj.protein / 100) * quantity,
    product: product,
    date: new Date()
  })
}

//-----------------------------------------
//-----------------------------------------
//Procura de Histórico
async function findConsumeByUserId(userId, date) {
  const collection = await getMongoCollection(DB_NAME, COLLECTION_CONSUME)
  const startDate = new Date(date)
  startDate.setHours(0)
  startDate.setMinutes(0)
  startDate.setSeconds(0)

  const endDate = new Date(date)
  endDate.setDate(endDate.getDate() + 1)
  endDate.setHours(0)
  endDate.setMinutes(0)
  endDate.setSeconds(0)
  return collection.find({
    $and: [
      { userId: new ObjectId(userId) },
      { date: { $gte: startDate } },
      { date: { $lt: endDate } },
    ]

  }).toArray()
}



//Não esquecer dos module.exports
module.exports = {
  getMongoCollection,
  findUserByEmail,
  findUserById,
  createUser,
  findProductsByName,
  //findProductsById,
  createSession,
  insertProduct,
  findConsumeByUserId
}