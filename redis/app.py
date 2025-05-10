import psycopg2
from flask import Flask, render_template, jsonify
import redis
import os
from flask_cors import CORS
import ast
import json
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Updated connection string with endpoint ID
DB_CONNECTION_STRING = os.getenv("NEON_DB_CONNECTION_STRING", "postgresql://car_parts_db_owner:0F4QXKRPmHBW@ep-bold-union-a698c6lj.us-west-2.aws.neon.tech/car_parts_db?sslmode=require&options=endpoint%3Dep-bold-union-a698c6lj")
REDIS_URL = os.getenv("REDIS_URL", "redis://default:dMVIwQgEv6p9YRVkiCL2JhkmHalBXI2v@redis-18397.c11.us-east-1-2.ec2.redns.redis-cloud.com:18397")

# Initialize Redis connection with error handling
try:
    r = redis.from_url(REDIS_URL)
    r.ping()  # Test the connection
    redis_available = True
    logger.info("Successfully connected to Redis")
except (redis.ConnectionError, redis.TimeoutError) as e:
    redis_available = False
    logger.warning(f"Redis connection failed: {str(e)}. Running without Redis caching.")

def get_db_connection():
    try:
        conn = psycopg2.connect(DB_CONNECTION_STRING)
        logger.info("Successfully connected to database")
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise

def fetch_trending_items():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT uoi.part_id, p.part_name, p.image_name, p.price, SUM(uoi.quantity) AS total_quantity
            FROM userorderitems uoi
            JOIN public."Parts" p ON uoi.part_id = p.part_id
            GROUP BY uoi.part_id, p.part_name, p.image_name, p.price
            ORDER BY total_quantity DESC
            LIMIT 10;
        """)

        trending_items = cur.fetchall()
        cur.close()
        conn.close()

        # Convert to list of dictionaries for JSON serialization
        trending_items_list = [
            {
                'part_id': item[0],
                'part_name': item[1],
                'image_name': item[2],
                'price': float(item[3]),
                'total_quantity': item[4]
            }
            for item in trending_items
        ]

        return trending_items_list
    except Exception as e:
        logger.error(f"Error fetching trending items: {str(e)}")
        raise

@app.route('/api/trending-products', methods=['GET'])
def get_trending_products():
    try:
        if redis_available:
            # Try to get cached data
            cached_trending = r.get("trending_items")
            if cached_trending:
                return jsonify(json.loads(cached_trending.decode('utf-8')))
        
        # If Redis is not available or cache miss, fetch from database
        trending_items_list = fetch_trending_items()
        
        # Try to cache the results if Redis is available
        if redis_available:
            try:
                r.set("trending_items", json.dumps(trending_items_list), ex=600)  # Cache for 10 minutes
            except redis.RedisError as e:
                logger.warning(f"Failed to cache trending items: {str(e)}")
        
        return jsonify(trending_items_list)
    
    except Exception as e:
        logger.error(f"Error in get_trending_products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
