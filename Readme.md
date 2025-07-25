# Mercantile Bank Data Scraper

A Node.js application that scrapes banking data from Mercantile Bank using Puppeteer and Chrome. The application provides a REST API endpoint to retrieve account information, balances, loans, and debit authorizations.

## Features

- 🏦 Scrapes comprehensive bank account data
- 🔐 Secure login with user credentials
- 📊 Retrieves account details, balances, loans, and debit authorizations
- 🐳 Dockerized for easy deployment
- 🌐 REST API interface
- 💾 Option to save data to file or return in response

## Prerequisites

- Docker installed on your system
- Valid Mercantile Bank credentials (ID, password, and security code)

## Quick Start

### 1. Build the Docker Image

```bash
# Build the image
docker build -t scraper-app .
```

### 2. Run the Container

```bash
# Run the container with a name and port mapping
docker run -d -p 8083:8083 --name my-scraper scraper-app
```

The application will be available at `http://localhost:8083`

### 3. Make API Requests

Send a POST request to the `/api/scrape` endpoint with your credentials:

**Endpoint:** `POST http://localhost:8083/api/scrape`

**Request Body (JSON):**
```json
{
    "id": "your_bank_id",
    "password": "your_password",
    "code": "your_security_code",
    "mode": "json"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:8083/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123456789",
    "password": "your_password",
    "code": "1234",
    "mode": "json"
  }'
```

## API Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Your bank ID/username |
| `password` | string | Yes | Your bank password |
| `code` | string | Yes | Your security code |
| `mode` | string | No | Response mode: `"json"` (default) or `"save"` |

## Response Modes

### JSON Mode (default)
Returns the scraped data directly in the API response:

```json
{
  "success": true,
  "data": {
    "userAccounts": { ... },
    "accountDetails": { ... },
    "debitAuthorizations": { ... },
    "dashboardBalances": { ... },
    "loansData": { ... }
  }
}
```

### Save Mode
Saves the data to a file on the server:

```json
{
  "success": true,
  "message": "Data saved successfully",
  "filename": "scrape-2024-01-15T10-30-45-123Z.json"
}
```

## Data Retrieved

The scraper collects the following information:

- **User Accounts**: Account numbers and nicknames
- **Account Details**: Balance information and account details
- **Debit Authorizations**: Standing orders and automatic payments
- **Dashboard Balances**: Summary of all account balances
- **Loans Data**: Information about loans and credit facilities

## Docker Management

### View Container Logs
```bash
docker logs my-scraper
```

### Stop the Container
```bash
docker stop my-scraper
```

### Remove the Container
```bash
docker rm my-scraper
```

### Restart the Container
```bash
docker restart my-scraper
```

## Development

If you want to run the application locally without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Google Chrome (required for Puppeteer)

3. Start the server:
   ```bash
   node server.js
   ```

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (missing required fields)
- **500**: Internal Server Error (scraping failed)

Example error response:
```json
{
  "success": false,
  "error": "Missing required fields: id, password, code"
}
```

## Security Notes

⚠️ **Important Security Considerations:**
* This application handles sensitive banking credentials
* Always use HTTPS in production environments
* Consider implementing authentication for the API endpoint
* Regularly update dependencies for security patches
* Never commit credentials to version control

## Troubleshooting
### Common Issues

Container fails to start: Ensure port 8083 is not already in use
Login failures: Verify your credentials are correct
Timeout errors: The bank's website might be slow; the scraper has a 30-second timeout

### Debug Mode
The scraper runs in debug mode by default, providing detailed logs. Check container logs for troubleshooting:

```bash
docker logs my-scraper
```

## License
This project is for educational and personal use only. Please ensure compliance with your bank's terms of service and applicable laws regarding automated access to banking systems.

## Disclaimer
This software is provided "as is" without warranty. Use at your own risk. The authors are not responsible for any misuse or damage caused by this software.