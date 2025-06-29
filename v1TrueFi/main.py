# v1TrueFi/main.py
import uvicorn
import logging
import os # Import the 'os' module to access environment variables

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(name)s - %(funcName)s - %(message)s')
logger = logging.getLogger(__name__) # Gets a logger named "main"

if __name__ == "__main__":
    # Get the port number from the environment variable provided by Cloud Run
    # If the PORT variable isn't set (e.g., when running locally), it defaults to 8000.
    port = int(os.environ.get("PORT", 8080))
    logger.info(f"Starting Uvicorn server for TrueFi.ai V1 on port {port}...")
    uvicorn.run(
        "app.api:app",  # Tells Uvicorn to find 'app' in app/api.py
        host="0.0.0.0",
        port=port,
        reload=False,  # Enable reload for development
        log_config=None 
    )