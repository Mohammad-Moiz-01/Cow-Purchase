const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware
app.use(bodyParser.json());

// Nodemailer transporter setup (replace with your actual transporter configuration)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohammedmoiz2006@gmail.com',
    pass: 'oned pcop nihd cfty'
  }
});

// Async function to send email
async function sendConfirmationEmail(userChoices) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userChoices.email, // Recipient's email
    subject: 'Cow Purchase Confirmation',
    text: `
      Thank you for your purchase!

      Your choices:
      - Cow Type: ${userChoices.color}
      - Budget: ${userChoices.number}
      - Email: ${userChoices.email}
      - Phone: ${userChoices.phone}
      - Location: ${userChoices.address}

      We will process your request shortly.
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', result);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

// Endpoint to handle Dialogflow webhook requests
app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function cowPurchaseHandler(agent) {
    const { color, number, email, phone, address } = agent.parameters;
    const userChoices = { color, number, email, phone, address };

    agent.add(
      PurchaseCow = `Let me summarize your choices: ${color}, ${number}, ${email}, ${phone}, ${address}. Can I proceed with the purchase?`
    );

    // Simulate user confirmation
    if (true) { // Replace with actual confirmation logic
      sendConfirmationEmail(userChoices); // Call the function to send email
    }
  }

  // Map Dialogflow intent names to fulfillment functions
  let intentMap = new Map();
  intentMap.set('PurchaseCow', cowPurchaseHandler);

  agent.handleRequest(intentMap);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});