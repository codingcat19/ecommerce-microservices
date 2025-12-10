from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://admin:admin123@mongodb:27017/ecommerce?authSource=admin')
client = MongoClient(MONGO_URI)
db = client.ecommerce
users_collection = db.users

print('✅ User Service connected to MongoDB')

# Helper function to serialize MongoDB documents
def serialize_user(user):
    if user:
        user['_id'] = str(user['_id'])
        user.pop('password', None)  # Never send password to client
    return user

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'user-service'}), 200

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find())
        users = [serialize_user(user) for user in users]
        return jsonify({'success': True, 'count': len(users), 'data': users}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get single user
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        return jsonify({'success': True, 'data': serialize_user(user)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Create user (Register)
@app.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        # Check if user already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'success': False, 'error': 'User already exists'}), 409
        
        # Create user document
        user_doc = {
            'name': data.get('name', ''),
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'address': data.get('address', ''),
            'phone': data.get('phone', ''),
            'createdAt': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        user_doc['_id'] = str(result.inserted_id)
        
        return jsonify({'success': True, 'data': serialize_user(user_doc)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Login user
@app.route('/users/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        user = users_collection.find_one({'email': email})
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
        
        return jsonify({'success': True, 'data': serialize_user(user), 'message': 'Login successful'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Update user
@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        
        # Remove password if present (use separate endpoint for password change)
        data.pop('password', None)
        
        result = users_collection.find_one_and_update(
            {'_id': ObjectId(user_id)},
            {'$set': data},
            return_document=True
        )
        
        if not result:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        return jsonify({'success': True, 'data': serialize_user(result)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Delete user
@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = users_collection.delete_one({'_id': ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        return jsonify({'success': True, 'message': 'User deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)