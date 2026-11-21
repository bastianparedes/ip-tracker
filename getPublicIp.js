const { isIP } = require("node:net");

async function getPublicIp() {
  const response = await fetch("https://api64.ipify.org");

  if (!response.ok) {
    throw new Error(`Could not retrieve public IP: HTTP ${response.status}`);
  }

  const ip = (await response.text()).trim();
  if (!isIP(ip)) {
    throw new Error("The IP service returned an invalid address");
  }

  return ip;
}

module.exports = getPublicIp;
