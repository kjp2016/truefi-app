# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the file that lists your Python dependencies
COPY requirements.txt .

# Install all the Python dependencies listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your application code and data from your local project 
# into the /app directory inside the container.
COPY ./app ./app
COPY ./data ./data
COPY ./tools ./tools
COPY main.py .

# Tell Docker that the container will listen on port 8080
EXPOSE 8080
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8080"]
