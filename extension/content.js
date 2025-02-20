// content.js
function scrapeVehicleData() {
  const vehicleData = {};
  console.log("Starting scrape...");

  try {
    // Debug current URL
    console.log("Current URL:", window.location.href);

    // Get photos - with debugging
    const photoElements = document.querySelectorAll(
      "img.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x5yr21d.xl1xv1r.xh8yej3"
    );
    console.log("Found photo elements:", photoElements.length);
    vehicleData.photos = Array.from(photoElements).map((img) => img.src);

    // Get title - with more specific selector and debugging
    const titleElement = document.querySelector(
      'div[aria-hidden="false"] h1.html-h1 span.x193iq5w'
    );
    console.log("Title element found:", titleElement);
    if (titleElement) {
      const titleText = titleElement.innerText;
      console.log("Raw title text:", titleText);
      if (titleText.match(/^\d{4}/)) {
        // Check if starts with 4 digits (year)
        const titleParts = titleText.split(" ");
        vehicleData.year = titleParts[0];
        vehicleData.make = titleParts[1];
        vehicleData.model = titleParts.slice(2).join(" ");
        vehicleData.title = titleText;
      } else {
        console.log("Title does not match expected format");
      }
    }

    // Get mileage - with more specific selector
    const mileageElement = document.querySelector("div.xamitd3 span.x193iq5w");
    console.log("Mileage element found:", mileageElement);
    if (mileageElement) {
      vehicleData.mileage = mileageElement.innerText.replace("Driven ", "");
    }

    // Get location and date - with more specific selector
    const locationDateElement = document.querySelector("div.x1yztbdb");
    console.log("Location/Date element found:", locationDateElement);
    if (locationDateElement) {
      const locationElement = locationDateElement.querySelector(
        'a[href*="/marketplace/"] span.x193iq5w.xeuugli'
      );
      const dateElement = locationDateElement.querySelector("abbr[aria-label]");
      vehicleData.location = locationElement?.innerText || "N/A";
      vehicleData.listingDate =
        dateElement?.getAttribute("aria-label") ||
        dateElement?.innerText ||
        "N/A";
    }

    // Get description - with more specific selector

    // Get description - with specific and generic selector for the current vehicle’s seller description, text only, ensuring current listing
    const descriptionElement =
      document.querySelector(
        'div.xz9dl7a span.x193iq5w.x1lliihq.xo1l8bm:not(.x1n2onr6):not(.xk50ysn):not(.x1yc453h)[dir="auto"]'
      ) ||
      document.querySelector(
        'div.x9f619 span.x193iq5w.x1lliihq.xo1l8bm:not(.x1n2onr6):not(.xk50ysn):not(.x1yc453h)[dir="auto"]'
      ) ||
      document.querySelector(
        'div.xu06os2 span.x193iq5w.x1lliihq.xo1l8bm:not(.x1n2onr6):not(.xk50ysn):not(.x1yc453h)[dir="auto"]'
      ) ||
      document.querySelector(
        'span.x193iq5w.x1lliihq.xo1l8bm.x6prxxf:not(.x1n2onr6):not(.xk50ysn):not(.x1yc453h)[dir="auto"]:nth-of-type(7)'
      );
    console.log("Description element found:", descriptionElement);
    // Use only if the text is long enough and likely a full description (e.g., > 150 characters to avoid titles/summaries), and matches the current vehicle
    const titleText = vehicleData.title || ""; // Use the title scraped earlier to verify the description
    vehicleData.description =
      descriptionElement &&
      descriptionElement.innerText.length > 150 &&
      (descriptionElement.innerText.includes(titleText.split(" ")[0]) || // Check if description starts with year
        descriptionElement.innerText
          .toLowerCase()
          .includes(titleText.toLowerCase().split(" ")[1] || "")) // Check if description includes make
        ? descriptionElement.innerText.trim()
        : "N/A";

    // Get seller name - with more specific selector
    const sellerElement = document.querySelector(
      'a[href*="/marketplace/profile/"] span.x193iq5w'
    );
    console.log("Seller element found:", sellerElement);
    if (sellerElement) {
      vehicleData.seller = sellerElement.innerText;
    }

    console.log("Final scraped data:", vehicleData);
    return vehicleData;
  } catch (error) {
    console.error("Error scraping data:", error);
    return null;
  }
}

// Add message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    console.log("Received scrape request");
    const data = scrapeVehicleData();
    console.log("Sending response:", data);
    sendResponse({ data: data });
  }
  return true;
});

// Log when the script loads
console.log("Content script loaded");
