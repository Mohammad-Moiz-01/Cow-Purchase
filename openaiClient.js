
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: 'your-openai-api-key', // Replace with your OpenAI API key
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
