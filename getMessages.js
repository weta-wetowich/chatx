const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  const filePath = path.join(__dirname, '..', 'messages.json');
  const messages = JSON.parse(fs.readFileSync(filePath));
  return { statusCode: 200, body: JSON.stringify(messages) };
};
