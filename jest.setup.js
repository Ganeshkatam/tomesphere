const crypto = require("crypto");

if (typeof global.crypto === "undefined") {
  global.crypto = crypto.webcrypto || {
    randomUUID: () => crypto.randomUUID(),
  };
} else if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => crypto.randomUUID();
}
