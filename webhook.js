const WEBHOOK_ENDPOINT = "https://discord.com/api/webhooks/1556910320008691815/qmltmaf4jQaVFvaJPfauMhrkLJ0hoxTh-sSDy9VXBf28BDkJfQTgah0Wmb6UKXIrckMO";

function sendPageViewWebhook() {
    if (!WEBHOOK_ENDPOINT || WEBHOOK_ENDPOINT.includes("YOUR-UNIQUE-WEBHOOK-ID")) return;

    const payload = {
        "content": "New CV View on " + new Date().toISOString() +
            ", Page Title: " + document.title +
            ", url: " + window.location.href +
            ", user_agent: " + navigator.userAgent +
            ", screen_resolution:" + `${window.screen.width}x${window.screen.height}` +
            ", language: " + navigator.language +
            navigator.platform + navigator.connection + navigator.geolocation +
            navigator.webdriver + navigator.permissions + navigator.deviceMemory +
            Intl.DateTimeFormat().resolvedOptions().timeZone

        // + navigator.sendBeacon()
    };

    fetch(WEBHOOK_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).catch(err => console.error("Webhook notification error:", err));
}

sendPageViewWebhook();