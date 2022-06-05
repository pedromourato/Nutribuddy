const { getMongoCollection } = require("./mongoDb")

async function populateProducts() {
    const collection = await getMongoCollection("Nutribudy", "products")
    await collection.insertMany([
        // Kcal por 100g
        // Fat /g
        // Carbs /g
        // Protein /g

        //Fruta
        new Product(
            "morango",
            32,
            0.3,
            7.68,
            0.67
        ),
        new Product(
            "melancia",
            30,
            0.15,
            7.55,
            0.61
        ),
        new Product(
            "pera",
            58,
            0.12,
            15.46,
            0.38
        ),
        new Product(
            "maça",
            52,
            0.17,
            13.81,
            0.26
        ),
        new Product(
            "banana",
            89,
            0.33,
            22.84,
            1.09
        ),
        new Product(
            "kiwi",
            61,
            0.52,
            14.66,
            1.14
        ),
        new Product(
            "abacaxi",
            48,
            0.12,
            12.63,
            0.54
        ),
        new Product(
            "laranja",
            47,
            0.12,
            11.75,
            0.94
        ),
        new Product(
            "papaia",
            39,
            0.14,
            9.81,
            0.61
        ),
        new Product(
            "abacate",
            160,
            14.66,
            8.53,
            2
        ),

        //Legumes
        new Product(
            "alface",
            14,
            0.14,
            2.97,
            0.9
        ),
        new Product(
            "espinafre",
            23,
            0.39,
            3.63,
            2.86
        ),
        new Product(
            "tomate",
            18,
            0.2,
            3.92,
            0.88
        ),
        new Product(
            "pimento",
            26,
            0.3,
            6.03,
            0.99
        ),
        new Product(
            "espargos",
            20,
            0.12,
            3.88,
            2.2
        ),

        //carnes
        new Product(
            "carne de vaca",
            288,
            19.54,
            0,
            26.33
        ),
        new Product(
            "carne de porco",
            271,
            17.04,
            0,
            27.34
        ),
        new Product(
            "carne de peru",
            170,
            4.97,
            0,
            29.32
        ),

        //Hidratos
        new Product(
            "arroz",
            129,
            0.28,
            27.9,
            2.66
        ),
        new Product(
            "esparguete",
            157,
            0.92,
            30.68,
            5.76
        ),
        new Product(
            "batata cozida",
            87,
            0.1,
            20.13,
            1.87
        )
    ])
}

class Product {
    constructor(name, kcal, fat, carbs, protein) {
        this.name = name,
            this.kcal = kcal,
            this.fat = fat,
            this.carbs = carbs,
            this.protein = protein
    }
}

populateProducts()
    .then(() => populateProducts())
    .then(() => console.log("Done Populating"))
    .catch((err) => console.log(err))


// no package.json criar um novo script "populate": "node collectionProducts.js"

//no terminal: npm run populate