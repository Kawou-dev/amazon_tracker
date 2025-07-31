"use server"

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40;
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Amazon Tracker for ${shortenedTitle}`;
      body = `
        <div>
          <h2>Welcome to Amazon Tracker 🚀</h2>
          <p>You are now tracking ${product.title}.</p>
          <p>Here's an example of how you'll receive updates:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} is back in stock!</h3>
            <p>We're excited to let you know that ${product.title} is now back in stock.</p>
            <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

// Utilisation de RESEND à la place de Nodemailer
export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  try {
    const { data, error } = await resend.emails.send({  
      from: 'amazon@tanzimly.kawoulabs.com',
      to: sendTo,
      subject: emailContent.subject,
      html: emailContent.body,
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email avec Resend :', error);
      return;
    }

    console.log('Email envoyé avec succès avec Resend :', data);
  } catch (err) {
    console.error('Erreur inattendue lors de l\'envoi de l\'email avec Resend :', err);
  }
};













// "use server"

// import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
// import nodemailer from 'nodemailer';
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY!) ; 

// const Notification = {
//   WELCOME: 'WELCOME',
//   CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
//   LOWEST_PRICE: 'LOWEST_PRICE',
//   THRESHOLD_MET: 'THRESHOLD_MET',
// }

// export async function generateEmailBody(
//   product: EmailProductInfo,
//   type: NotificationType
//   ) {
//   const THRESHOLD_PERCENTAGE = 40;
//   // Shorten the product title
//   const shortenedTitle =
//     product.title.length > 20
//       ? `${product.title.substring(0, 20)}...`
//       : product.title;

//   let subject = "";
//   let body = "";

//   switch (type) {
//     case Notification.WELCOME:
//       subject = `Welcome to Price Tracking for ${shortenedTitle}`;
//       body = `
//         <div>
//           <h2>Welcome to PriceWise 🚀</h2>
//           <p>You are now tracking ${product.title}.</p>
//           <p>Here's an example of how you'll receive updates:</p>
//           <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
//             <h3>${product.title} is back in stock!</h3>
//             <p>We're excited to let you know that ${product.title} is now back in stock.</p>
//             <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
//             <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
//           </div>
//           <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
//         </div>
//       `;
//       break;

//     case Notification.CHANGE_OF_STOCK:
//       subject = `${shortenedTitle} is now back in stock!`;
//       body = `
//         <div>
//           <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
//           <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
//         </div>
//       `;
//       break;

//     case Notification.LOWEST_PRICE:
//       subject = `Lowest Price Alert for ${shortenedTitle}`;
//       body = `
//         <div>
//           <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
//           <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
//         </div>
//       `;
//       break;

//     case Notification.THRESHOLD_MET:
//       subject = `Discount Alert for ${shortenedTitle}`;
//       body = `
//         <div>
//           <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
//           <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
//         </div>
//       `;
//       break;

//     default:
//       throw new Error("Invalid notification type.");
//   }

//   return { subject, body };
// }





// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587, // 465 si tu souhaites SSL
//   secure: false, // true si port 465
//   auth: {
//     user: 'levieux426@gmail.com', // email expéditeur configuré sur Brevo
//     pass: process.env.BREVO_SMTP_KEY, // ta clé SMTP Brevo stockée en variable d'environnement
//   },
//   pool: true,
//   maxConnections: 1,
// });

// export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
//   // const mailOptions = {
//   //   from: 'levieux426@gmail.com', // expéditeur
//   //   to: sendTo, // destinataires
//   //   subject: emailContent.subject,
//   //   html: emailContent.body,
//   // };

//   const mailOptions = {
//   from: 'ton_email@tondomaine.com',
//   to: 'ton_email@tondomaine.com', // facultatif
//   bcc: sendTo, // tous recevront l'email sans voir les autres adresses
//   subject: emailContent.subject,
//   html: emailContent.body,
// };


//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Erreur lors de l\'envoi de l\'email :', error);
//       return;
//     }
//     console.log('Email envoyé avec succès :', info);
//   });
// };


// // export const sendEmail = async() => {

// //   const { data, error } = await resend.emails.send({
// //     from: 'Kawou Company <onboarding@resend.dev>',
// //     to: ['levieux426@gmail.com'],
// //     subject: 'Hello from Kawou',
// //     html: '<strong>Trust in GOD </strong>',
// //   });

// //   if (error) {
// //     return console.error({ error });
// //   }

// //   console.log({ data });
// // }






// // const transporter = nodemailer.createTransport({
// //   pool: true,
// //   service: 'hotmail',
// //   port: 2525,
// //   auth: {
// //     user: 'ici_mon_email',
// //     pass: process.env.EMAIL_PASSWORD,
// //   },
// //   maxConnections: 1
// // })

// // export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
// //   const mailOptions = {
// //     from: 'ici_mon_email',
// //     to: sendTo,
// //     html: emailContent.body,
// //     subject: emailContent.subject,
// //   }

// //   transporter.sendMail(mailOptions, (error: any, info: any) => {
// //     if(error) return console.log(error);
    
// //     console.log('Email sent: ', info);
// //   })
// // }

