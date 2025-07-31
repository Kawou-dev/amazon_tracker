"use server"
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { scrapeAmazonProduct } from "../scrapers";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { connectDB } from "../config/connectDB";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { User } from "@/types";

export async function scrapeAndStoreProduct(ProductURL:string) {
    if(!ProductURL) return ; 
     
    try{
       const scrapedProduct = await scrapeAmazonProduct(ProductURL) ; 
       if(!scrapedProduct) return ; 

       connectDB() ; 

       let product = scrapedProduct ; 

       const existingProduct = await Product.findOne({ url : product.url  }) ; 

       if(existingProduct){
           
        const updatedPriceHistory: any = [...existingProduct.priceHistory, { price: scrapedProduct.currentPrice }]    
       
        product = {...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
    
   } catch (error) {
        console.log(error) ; 
   }
}


export async function getProductById(productId: string){
    try {
        connectDB() ; 
        const product = await Product.findOne({_id: productId}) ; 
        if(!product) return null ; 
        return product;         
    } catch (error) {
        console.log("Error while getting product Id" , error) ;
    }
}

export async function getAllProducts(){
    try {
        connectDB() ; 
        const products = await Product.find({}) ; 
        if(!products) return null ; 
        return products ; 
    } catch (error) {
        console.log("Error while getting the product " , error) ; 
    }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectDB();

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({_id: { $ne: productId },}).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    connectDB(); 
    const product = await Product.findById(productId);
 

    if(!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}