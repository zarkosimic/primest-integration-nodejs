# Primest Lead Integration Middleware

A custom Node.js middleware designed to receive, filter, and transform solar leads for a high-volume LeadGen environment. This project was built as a solution for the Primest Developer Test Task.

## 🚀 Live Demo
- **Dashboard:** [https://primest-integration-nodejs.onrender.com/](https://primest-integration-nodejs.onrender.com/)
- **Live Logs:** [https://primest-integration-nodejs.onrender.com/system/logs](https://primest-integration-nodejs.onrender.com/system/logs)
- **Webhook Endpoint:** `https://primest-integration-nodejs.onrender.com/webhook/primest-leads`

## 🛠 Features
- **Strict Filtering:** Only accepts leads from ZIP region `66***` and property owners.
- **Data Transformation:** Automates address splitting (street/number) and numeric data sanitization.
- **Lead Scoring (Extra Point):** Analyzes incoming leads and assigns priority based on energy consumption.
- **Real-time Monitoring:** Custom dashboard and live log feed for system observability.
- **VETRO Pattern:** Built using the Validate-Enrich-Transform-Route-Operate architecture.

## 💻 Tech Stack
- **Runtime:** Node.js (Express.js).
- **Communication:** Axios for external API integration.
- **Hosting:** Render.com (Production environment).

## 🔧 Installation & Setup
1. Clone the repository.
2. Run `npm install`.
3. Set your environment variables (API tokens/User IDs).
4. Start the server with `npm start`.

## 🧪 Testing the Workflow
You can trigger a lead from **Endpoint 1** to this middleware using:
```bash
curl --location 'https://contactapi.static.fyi/lead/trigger/fake/USER_ID/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer API_TOKEN' \
--data '{
  "url": "https://primest-integration-nodejs.onrender.com/webhook/primest-leads",
  "headers": {
    "Content-Type": "application/json"
  }
}'
