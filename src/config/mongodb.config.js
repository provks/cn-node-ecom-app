import { MongoClient } from 'mongodb'

// Connection URL
const url = process.env.DB_URL;
console.log("process.env.DB_URL", process.env.DB_URL)
const client = new MongoClient(url);
// const client = new MongoClient('mongodb://localhost:27017/');

// Database Name
// const dbName = 'movies';
let clientInstance;
let db;
export async function connectToDB() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        // clientInstance = client;
        console.log('Connected successfully to Database');
        //   const db = client.db(dbName);
        // db = client.db();
        // createIdCounter(client.db());
        // await createIndex(client.db());
    } catch (error) {
        console.log(error);
    }
//   const collection = db.collection('highest_rated');
//   // console.log(await collection.find({}));
//   const movies = await collection.find({}).toArray();
//   console.log('Found documents =>', movies);

  // the following code examples can be pasted here...
}

// get the client for transaction
export function getClient() {
    return client;
}

export function getDatabase() {
    // return db;
    return client.db('ecommerce');
}


// create the counter for the cartItem collection
// const createIdCounter = async(db) => {
//     const exisitngCounter = await db.collection('counters').findOne({_id: 'cartItem' });
//     if(!exisitngCounter) {
//         await db.collection('counters').insertOne({_id: 'cartItem', count: 0});
//     }
// }

// const createIndex = async(db) => {
//     // const indexes = await db.collection('products').getIndexes();   
//     // console.log("indexes =====>", indexes);
//     await db.collection('products').createIndex({ price: 1 });  // add index in ascending order for price
//     // await db.collection('products').dropIndex("price_1");  // drop index by name
//     await db.collection('products').createIndex( {name: 1,category: -1,} );
//     await db.collection('products').createIndex( {description: "text"} )
// }