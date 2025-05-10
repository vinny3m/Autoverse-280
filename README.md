# E-commerce Application with Chatbot Integration

This repository contains an e-commerce application which sells car parts, with an integrated chatbot feature.

## Key Features
- Ecommerce web page for Car parts
- SSO using Keycloak
- Two factor autentication using Keycloak
- Federated signup using Facebook
- SQL Database using Neon
- OPENAPI spec based REST API - Swagger
- Automated email confirmations
- Message queuing with RabbitMQ
- Cache using Redis
- Observability & Metrics with Grafana/Prometheus
- BI Dashboard with Tableau
- LLM Chatbot

## Project Components

### Frontend Application
- Located in `/ecommerce-frontend`
- Built with Reactjs
- Includes automated testing suite

### Backend Service
- Located in `/ecommerce-backend`
- Built with Node.js
- OpenAPI spec based REST API - Swagger
- Includes automated testing suite

### Natural Language Processing API (Chatbot)
- Located in `/ecommerce-chatbot`
- Built with Python 3.9
- Integrates with OpenAI API
- Requires database configuration

### Redis Application
- Located in `/redis`
- Built with Python 3.9
- Handles caching and data persistence

### RabbitMq
- Located in `/messaging queue`
- Used for message queuing to enable reliable and asynchronous communication between components

### Observability & Metrics
- Located in `/observability`
- These tools provide real-time observability and analytics for the infrastructure and application

## Environment Variables

### Frontend application
```
REACT_APP_KEYCLOAK_URL
REACT_APP_KEYCLOAK_REALM
REACT_APP_KEYCLOAK_CLIENT_ID
```

### Backend application
```
KEYCLOAK_URL
KEYCLOAK_REALM
KEYCLOAK_CLIENT_ID
KEYCLOAK_CLIENT_SECRET
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_DIALECT
```

### NL API Requirements
```
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_DIALECT
OPENAI_API_KEY
```

### Redis App Requirements
```
DB_HOST
DB_NAME
DB_USER
DB_PASSWORD
DB_PORT
DB_SSL_MODE
REDIS_HOST
REDIS_PORT
LOG_LEVEL
```

### RabbitMq Requirements
```
DB_HOST
DB_NAME
DB_USER
DB_PASSWORD
DB_PORT
DB_SSL_MODE
RABBITMQ_HOST
RABBITMQ_PORT
RABBITMQ_USER
RABBITMQ_PASS
SMTP_SERVER
SMTP_PORT
EMAIL_USER
EMAIL_PASSWORD
LOG_LEVEL
```

## Getting Started

1. Clone the repository
2. For local development, create `.env` files in the respective directories with the required environment variables
3. Install dependencies for each component:

### Frontend Setup
```bash
cd ecommerce-frontend
npm install
npm start
```

### Backend Setup
```bash
cd ecommerce-backend
npm install
npm start
```

### Chatbot Setup
```bash
cd ecommerce-chatbot
pip install -r requirements.txt
python NLapi.py
```

### Redis Setup
```bash
cd redis
pip install -r requirements.txt
python app.py
```

### Message Queue Setup
```bash
cd "messaging queue"
pip install -r requirements.txt
python main.py
```

### Start RabbitMQ server:
```bash
rabbitmq-server start
```
