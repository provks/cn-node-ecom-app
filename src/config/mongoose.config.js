import mongoose from 'mongoose';
import Category from '../features/product/category.schema.js';

const url = process.env.DB_URL;

// main().catch(err => console.log(err));

export async function connectToDBWithMongoose() {
  try {
    await mongoose.connect(url);
    addCategories();
    console.log("Connected to DB successfully using mongoose")
  } catch (error) {
    console.log("Error connecting with db", error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

async function addCategories() {
  // check if categories exist
  const categories = await Category.find();
  if (!categories || categories.length == 0){
    // create categories if it doesn't exist
    await Category.insertMany([
      { name: 'Books' },
      { name: 'Clothing' },
      { name: 'Smartphones' },
      { name: 'Electronics' },
    ]);
    console.log("Categories are added successfully!")
  }

}