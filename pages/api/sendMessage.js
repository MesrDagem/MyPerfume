// // pages/api/sendMessage.js
// export default async function handler(req, res) {
//   const botToken = "7333406976:AAHKHvTiztsPRGj9lXIVKDMoIk_F41FLa5U"; // Your bot token
//   const channelChatId = "@Ethidigital"; // Your channel chat ID

//   const messageData = {
//     chat_id: channelChatId,
//     text: "Welcome to our Food Delivery Service! Click the button below to start ordering your favorite meals.",
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Order Food Now",
//             web_app: {
//               url: "https://yourwebapp.com", // Replace with your web app URL
//             },
//           },
//         ],
//       ],
//     },
//   };

//   try {
//     const response = await fetch(
//       `https://api.telegram.org/bot${botToken}/sendMessage`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(messageData),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to send message");
//     }

//     const responseData = await response.json();
//     res.status(200).json({ success: true, data: responseData });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }
