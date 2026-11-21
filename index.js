const sendIpToTelegram = require("./sendIpToTelegram");

const interval = {
  seconds: 0,
  minutes: 1,
  hours: 0,
  days: 0,
};
const intervalMs =
  (interval.seconds +
    interval.minutes * 60 +
    interval.hours * 60 * 60 +
    interval.days * 24 * 60 * 60) *
  1000;

if (
  Object.values(interval).some(
    (value) => !Number.isInteger(value) || value < 0,
  ) ||
  intervalMs === 0
) {
  throw new Error("The interval must contain non-negative integers and be greater than zero.");
}

if (intervalMs > 2_147_483_647) {
  throw new RangeError("The interval cannot exceed Node.js's maximum timer delay.");
}

let isSending = false;

async function sendIp() {
  if (isSending) {
    console.warn("Skipping this run because the previous send is still in progress.");
    return;
  }

  isSending = true;
  try {
    const ip = await sendIpToTelegram();
    console.log(`Public IP sent to Telegram: ${ip}`);
  } catch (error) {
    console.error(`Could not send public IP to Telegram: ${error.message}`);
  } finally {
    isSending = false;
  }
}

sendIp();
setInterval(sendIp, intervalMs);
