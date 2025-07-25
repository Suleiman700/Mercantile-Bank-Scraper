const puppeteer = require('puppeteer');
require('dotenv').config();

// Load credentials from environment variables
const credentials = {
    id: process.env.CREDENTIALS_ID,
    password: process.env.CREDENTIALS_PASSWORD,
    code: process.env.CREDENTIALS_CODE
};

// Validate that all required environment variables are set
const requiredEnvVars = ['CREDENTIALS_ID', 'CREDENTIALS_PASSWORD', 'CREDENTIALS_CODE'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Error: Missing required environment variables:');
    missingVars.forEach(varName => console.error(`- ${varName}`));
    console.error('\nPlease copy .env.example to .env and fill in your credentials');
    process.exit(1);
}

class Scraper {
    constructor(options = {}) {
        this.browser = null;
        this.page = null;
        this.debug = options.debug || false;
        this.headless = options.headless !== false; // default to true if not specified
        this.log('Debug mode enabled');
    }

    log(...args) {
        if (this.debug) {
            console.log('[DEBUG]', ...args);
        }
    }

    async initialize() {
        this.log('Initializing browser...');
        const launchOptions = {
            headless: this.headless,
            defaultViewport: null,
            args: ['--start-maximized'],
            ...(this.debug && { 
                headless: false,
                devtools: true,
                slowMo: 50 // Slow down by 50ms to see what's happening
            })
        };

        this.log('Launch options:', JSON.stringify(launchOptions, null, 2));
        
        try {
            this.browser = await puppeteer.launch(launchOptions);
            this.log('Browser launched successfully');

            // Create a new page
            this.page = await this.browser.newPage();
            this.log('New page created');
            
            // Set a default timeout for page actions
            this.page.setDefaultTimeout(30000);
            
            // Enable request/response logging if debug is on
            if (this.debug) {
                // Log console messages from the page
                this.page.on('console', msg => this.log(`CONSOLE: ${msg.text()}`));
                
                // Log page errors
                this.page.on('pageerror', error => this.log(`PAGE ERROR: ${error.message}`));
                
                // Log unhandled promise rejections
                this.page.on('error', error => this.log(`ERROR: ${error.message}`));
                
                // Log requests
                this.page.on('request', request => this.log(`REQUEST: ${request.method()} ${request.url()}`));
                
                // Log responses
                this.page.on('response', response => 
                    this.log(`RESPONSE: ${response.status()} ${response.url()}`)
                );
            }
        } catch (error) {
            const errorMsg = `Error during initialization: ${error instanceof Error ? error.message : String(error)}`;
            this.log(errorMsg);
            
            // Take a screenshot on error if debug is enabled
            if (this.debug && this.page) {
                await this.page.screenshot({ path: 'debug-error.png' });
                this.log('Error screenshot saved as debug-error.png');
            }
            
            throw error;
        }
    }

    async login() {
        if (!this.page) {
            const errorMsg = 'Page not initialized. Call initialize() first.';
            this.log(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            this.log('Navigating to login page...');
            await this.page.goto('https://start.telebank.co.il/login/?bank=m', { 
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            this.log('Login page loaded');
            
            // Take a screenshot if debug is enabled
            if (this.debug) {
                await this.page.screenshot({ path: 'debug-login-page.png' });
                this.log('Screenshot saved as debug-login-page.png');
            }
            
            this.log('Entering credentials...');
            // Enter the ID
            await this.page.type('input#tzId', credentials.id, { delay: 50 });
            this.log('Entered ID');
            
            // Enter the password
            await this.page.type('input#tzPassword', credentials.password, { delay: 50 });
            this.log('Entered password');
            
            // Enter the code
            await this.page.type('input#aidnum', credentials.code, { delay: 50 });
            this.log('Entered code');
            
            this.log('Successfully entered all credentials');
            
            // Take another screenshot after entering credentials
            if (this.debug) {
                await this.page.screenshot({ path: 'debug-credentials-entered.png' });
                this.log('Screenshot after entering credentials saved as debug-credentials-entered.png');
            }
            
            // Click the login button
            this.log('Clicking login button...');
            await this.page.click('.login-form button[type="submit"]');
            this.log('Login button clicked');
            
            // Wait for navigation to complete
            this.log('Waiting for navigation...');
            await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
            this.log('Navigation complete');
            
            // Take a screenshot after login
            if (this.debug) {
                await this.page.screenshot({ path: 'debug-after-login.png' });
                this.log('Screenshot after login saved as debug-after-login.png');
            }
            
        } catch (error) {
            const errorMsg = `Error during login: ${error instanceof Error ? error.message : String(error)}`;
            this.log(errorMsg);
            
            // Take a screenshot on error if debug is enabled
            if (this.debug && this.page) {
                await this.page.screenshot({ path: 'debug-error.png' });
                this.log('Error screenshot saved as debug-error.png');
            }
            
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Example usage
async function main() {
    // Enable debug mode and show browser window
    const scraper = new Scraper({ 
        debug: true,
        headless: false
    });
    
    try {
        await scraper.initialize();
        await scraper.login();
        
        // Keep the browser open for 30 seconds for demonstration
        console.log('Keeping browser open for 30 seconds...');
        await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    } finally {
        console.log('Closing browser...');
        await scraper.close();
        console.log('Browser closed');
    }
}

// Run the example
main();

module.exports = Scraper;
