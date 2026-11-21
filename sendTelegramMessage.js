const { existsSync } = require("node:fs");
const { loadEnvFile } = require("node:process");
const { join } = require("node:path");

const envFilePath = join(__dirname, ".env");
if (existsSync(envFilePath)) {
  loadEnvFile(envFilePath);
}

async function sendTelegramMessage(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    },
  );
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      `Could not send Telegram message: ${result.description || `HTTP ${response.status}`}`,
    );
  }

  return result.result;
}

async function getTelegramChatId() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN must be set");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/getUpdates`,
  );
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      `Could not retrieve Telegram updates: ${result.description || `HTTP ${response.status}`}`,
    );
  }

  const chatIds = [
    ...new Set(
      result.result.flatMap((update) =>
        [
          update.message,
          update.edited_message,
          update.channel_post,
          update.edited_channel_post,
        ]
          .map((message) => message?.chat?.id)
          .filter((chatId) => chatId !== undefined),
      ),
    ),
  ];

  if (chatIds.length === 0) {
    throw new Error("No chat ID found. Send a message to the bot and try again.");
  }

  if (chatIds.length > 1) {
    throw new Error(`Multiple chat IDs found: ${chatIds.join(", ")}`);
  }

  return chatIds[0];
}

module.exports = sendTelegramMessage;
module.exports.getTelegramChatId = getTelegramChatId;
