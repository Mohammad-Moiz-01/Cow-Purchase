const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const openai = require('./openaiClient'); // Import the OpenAI client

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
    from: 'mohammedmoiz2006@gmail.com',
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

// Async function to get a response from OpenAI
async function getOpenAIResponse(prompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003', // or another model like 'gpt-4'
    prompt: prompt,
    max_tokens: 150
  });
  return response.data.choices[0].text.trim();
}

// Endpoint to handle Dialogflow webhook requests
app.post('/webhook', async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function cowPurchaseHandler(agent) {
    const { color, number, email, phone, address } = agent.parameters;
    const userChoices = { color, number, email, phone, address };

    const prompt = `The user wants to purchase a cow with the following details: 
      Cow Type: ${color}, 
      Budget: ${number}, 
      Email: ${email}, 
      Phone: ${phone}, 
      Location: ${address}. 
    How should I proceed with this purchase?`;

    const openAIResponse = await getOpenAIResponse(prompt);

    agent.add(`OpenAI suggests: ${openAIResponse}`);

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