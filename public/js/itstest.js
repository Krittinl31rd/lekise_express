/*const bytes = new Uint8Array([0x49, 0x54, 0x53, 0x01, 0x06, 0x02, 0xfe, 0x01, 0x02]);

//String to Byte ASCII
const text = "Hello";
const encoder = new TextEncoder();
const byteArray = encoder.encode(text);

//Byte to string
const decoder = new TextDecoder();
const decodedText = decoder.decode(byteArray);
console.log(decodedText); // "Hello"

const a = 0x01; // 13 in decimal
//10001000100010
const b = 0xffff; // 11 in decimal
const result = a ^ b;
console.log(result.toString(2)); // "0110" (6 in decimal)


function toITS(idtx, idrx, cmd, buff) {
    let its = new Uint8Array(7 + buff.length + 2);
    let sum = 0;
    its[0] = 0x49;
    its[1] = 0x54;
    its[2] = 0x53;

    its[3] = idtx;
    its[4] = (buff.length + 4);
    its[5] = idrx;
    its[6] = cmd;
    console.log(`cmd:${cmd.toString(16)} - cmd:${its[6]}`);

    sum += idtx;
    sum += (buff.length + 4);
    sum += idrx;
    sum += cmd;

    for (let i = 0; i < buff.length; i++) {
        its[7 + i] = buff[i];
        sum += buff[i];
    }

    // Compute CRC (two's complement)
    let bw = (sum ^ 0xffff) + 1;
    console.log(`CRC: ${bw.toString(16).padStart(4, '0')} (hex)`);

    // Add CRC to the end of the array
    its[7 + buff.length] = (bw >> 8) & 0xff; // High byte
    its[7 + buff.length + 1] = bw & 0xff;    // Low byte
    byteToString(its);
}

function byteToString(buff) {
    let t = '';
    buff.forEach((b, index) => {
        t += b.toString(16).padStart(2, '0');
        if (index < buff.length - 1) {
            t += ' ';
        }

    });
    console.log(t);
    return t;
}
function hexStringToByte(hexString) {
    const cleanedHexString = hexString.replace(/\s+/g, "");
    const bytes = [];
    for (let i = 0; i < cleanedHexString.length; i += 2) {
        bytes.push(parseInt(cleanedHexString.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
}

let data = '01 02';
let bytes2 = hexStringToByte(data);
toITS(0x01, 0x02, 0xfe, bytes2);
*/

window.OneSignal = window.OneSignal || [];

// Initialize OneSignal
OneSignal.push(function () {
  console.log("Initializing OneSignal...");
  OneSignal.init({
    appId: "4d28c9ad-80df-43d0-8307-47de3c108b98", // Replace with your App ID
    notifyButton: {
      enable: true,
    },
  });

  // Check and log initialization status
  OneSignal.isPushNotificationsEnabled().then(function (isEnabled) {
    console.log("Push Notifications Enabled:", isEnabled);
  }).catch(function (error) {
    console.error("Error checking push notification status:", error);
  });

  // Log subscription ID on initialization
  OneSignal.getUserId().then(function (userId) {
    if (userId) {
      console.log("Subscription ID on Load:", userId);
    } else {
      console.warn("No Subscription ID found on load.");
    }
  }).catch(function (error) {
    console.error("Error retrieving Subscription ID on load:", error);
  });
});

// Function to manually fetch Subscription ID
function fetchSubscriptionId() {
  OneSignal.push(function () {
    console.log("Fetching Subscription ID...");
    OneSignal.getUserId().then(function (userId) {
      if (userId) {
        console.log("Fetched Subscription ID:", userId);
        alert("Subscription ID: " + userId);
      } else {
        console.warn("User is not subscribed or no ID found.");
        alert("User is not subscribed or no ID found.");
      }
    }).catch(function (error) {
      console.error("Error fetching Subscription ID:", error);
      alert("Error fetching Subscription ID: " + error.message);
    });
  });
}

// Attach event listener to button
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("getIdButton");
  if (button) {
    button.addEventListener("click", fetchSubscriptionId);
  } else {
    console.error("Button with ID 'getIdButton' not found.");
  }
});


/*
window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
  console.log("Initializing OneSignal...");

  OneSignal.init({
    appId: "4d28c9ad-80df-43d0-8307-47de3c108b98", // Replace with your actual App ID
  });

  // Check for Subscription ID
  OneSignal.getUserId().then(function(userId) {
    if (userId) {
      console.log("Subscription ID:", userId);
    } else {
      console.log("User is not subscribed. Prompting for subscription...");
      OneSignal.registerForPushNotifications();
    }
  });

  // Check Notification Permissions
  OneSignal.isPushNotificationsEnabled().then(function(isEnabled) {
    console.log("Push Notifications Enabled:", isEnabled);
    if (!isEnabled) {
      console.log("User has not enabled push notifications.");
    }
  });
});
*/


//0549cef7-a1e8-472a-b17e-c7d5ade5b816