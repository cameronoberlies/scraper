document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Scraping...';

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Execute the content script
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });

        // Send a message to trigger the scraping
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrape' });
        
        if (response && response.data) {
            statusDiv.textContent = 'Data scraped successfully!';
            sendDataToServer(response.data);
        } else {
            statusDiv.textContent = 'No data found';
        }
    } catch (error) {
        statusDiv.textContent = 'Error: ' + error.message;
        console.error('Scraping error:', error);
    }
});

function sendDataToServer(data) {
    fetch('http://localhost:3000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => console.log('Data sent successfully:', response))
    .catch(error => console.error('Error sending data:', error));
}