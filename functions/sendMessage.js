const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const filePath = path.join(__dirname, "..", "messages.json");

  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync(filePath));
  } catch {}

  const { from, to, text } = JSON.parse(event.body);

  messages.push({
    from,
    to,
    text,
    time: new Date().toISOString()
  });

  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
