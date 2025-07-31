"use server"
import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from './src/lib/utils';

export async function scrapeAmazonProduct(url: string) {
    if (!url) return;

    const BRIGHT_DATA_API_TOKEN = process.env.BRIGHT_DATA_API_TOKEN_SECRET ;

    try {
        const response = await axios.post(
            'https://api.brightdata.com/request',
            {
                zone: 'amazon_tracker',
                url: url,
                format: 'raw' 
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BRIGHT_DATA_API_TOKEN}`
                },
                timeout: 30000,
            }
        );
       
        const $ = cheerio.load(response.data);
        const title = $('#productTitle').text().trim();      
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
       );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price'));
       
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const images = 
            $('#imgBlkFront').attr('data-a-dynamic-image') || 
            $('#landingImage').attr('data-a-dynamic-image') ||
            '{}'

        const imageUrls = Object.keys(JSON.parse(images));

        
        const currency = extractCurrency($('.a-price-symbol'))
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        const description = extractDescription($)

        // console.log({title , currentPrice , originalPrice , outOfStock ,  imageUrls, })
                const data = {
                url,
                currency: currency || '$',
                image: imageUrls[0],
                title,
                currentPrice: Number(currentPrice) || Number(originalPrice),
                originalPrice: Number(originalPrice) || Number(currentPrice),
                priceHistory: [],
                discountRate: Number(discountRate),
                category: 'category',
                reviewsCount:100,
                stars: 4.5,
                isOutOfStock: outOfStock,
                description,
                lowestPrice: Number(currentPrice) || Number(originalPrice),
                highestPrice: Number(originalPrice) || Number(currentPrice),
                averagePrice: Number(currentPrice) || Number(originalPrice),
         }

            return data;
        
        // return response.data; //
    } catch (error) {
        console.error('Error scraping:', error);
        throw error;
    }
}


// import axios from 'axios';

// export async function scrapeAmazonProduct(productURL: string) {
//     if (!productURL) return;

//     const BRIGHT_DATA_API_TOKEN = '07ccfff21a29833ff7ecca22ba8b4a8b33f844ab7d62e52c2ff206a76440cd75';
//     const BRIGHT_DATA_API_TOKEN =  String(process.env.BRIGHT_DATA_API_TOKEN_SECRET) ; 

//     try {
//         const response = await axios.post(
//             'https://api.brightdata.com/request',
//             {
//                 zone: 'amazon_tracker',
//                 url: productURL,
//                 format: 'json' //  format json
//                 format: 'raw' //   format HTML brut
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${BRIGHT_DATA_API_TOKEN}`
//                 },
//                 timeout: 30000,
//             }
//         );

//         return response.data; // Contient le contenu de la page ou JSON selon 'format'
//     } catch (error) {
//         console.error('Error scraping:', error);
//         throw error;
//     }
// }
