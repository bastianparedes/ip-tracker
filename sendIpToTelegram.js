const getPublicIp = require("./getPublicIp");
const sendTelegramMessage = require("./sendTelegramMessage");

async function sendIpToTelegram() {
  const ip = await getPublicIp();
  await sendTelegramMessage(`Mi IP pública es: ${ip}`);
  return ip;
}

module.exports = sendIpToTelegram;
