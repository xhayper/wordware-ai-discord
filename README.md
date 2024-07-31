# Discord Personality 🐦🧠

![Discord Personality](https://twitter.wordware.ai/social/og.png)

Discord Personality is a web application that analyzes your Discord handle to create a personalized personality profile using Wordware AI Agent. This project leverages cutting-edge AI technologies to provide users with unique insights into their Discord persona. 🚀

You can explore the AI agent and prompts used in this app by visiting [this Wordware link](https://app.wordware.ai/share/8de15a3d-3759-4b8d-bbd4-dd0a78401a34/playground).

## Setting Up the Project 🛠️

To set up the Discord Personality project on your local machine, follow these steps:

1. **Clone the Repository** 📂: Clone the Discord Personality repository from GitHub to your local machine using your preferred method (e.g., Git Bash, GitHub Desktop, or the command line).
2. **Install Dependencies** 📦: Navigate to the project directory and run `npm install` to install all the required dependencies.
3. **Environment Variables** 🔐: Create a `.env.local` file in the project root directory and add the following environment variables:
   - `DATABASE_URL`: Your Neon database URL (Do not expose these credentials to the browser).
   - `APIFY_API_KEY`: Your Apify API key for web scraping.
   - `WORDWARE_API_KEY`: Your Wordware API key for AI processing.
   - `WORDWARE_PROMPT_ID`: The specific Wordware prompt ID for this project.
   - `NEXT_PUBLIC_BASE_URL`: The base URL for your application (e.g., http://localhost:3000 for local development).
   - `LOOPS_API_KEY`: Your Loops API key for newsletter functionality.

Example `.env.local` file content:
