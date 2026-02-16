const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if(event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const filePath = path.join(__dirname, '..', 'messages.json');
  let messages = JSON.parse(fs.readFileSync(filePath));

  const { user, text } = JSON.parse(event.body);
  const newMessage = { user, text, createdAt: new Date().toISOString() };
  messages.push(newMessage);

  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
