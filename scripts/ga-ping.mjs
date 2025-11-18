// Simple dev utility to ping the GA proxy once
const endpoint = process.env.GA_PING_URL || "https://app.trackfluence.app/api/ga/collect";
const payload = {
  client_id: crypto.randomUUID(),
  events: [{ name: "test_event", params: { source: "ga:ping" } }],
  debug: true,
};

const res = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});

console.log("Status:", res.status);
try {
  const json = await res.json();
  console.log("Response:", json);
} catch {
  console.log("No JSON body");
}


