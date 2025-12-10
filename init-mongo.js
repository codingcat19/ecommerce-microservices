// Initialize MongoDB with sample data
db = db.getSiblingDB('ecommerce');

// Create products collection with sample data
db.products.insertMany([
  {
    name: "Wireless Headphones",
    description: "High-quality Bluetooth headphones with noise cancellation",
    price: 99.99,
    category: "Electronics",
    stock: 50,
    createdAt: new Date()
  },
  {
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor",
    price: 199.99,
    category: "Electronics",
    stock: 30,
    createdAt: new Date()
  },
  {
    name: "Running Shoes",
    description: "Comfortable athletic shoes for running",
    price: 79.99,
    category: "Sports",
    stock: 100,
    createdAt: new Date()
  },
  {
    name: "Yoga Mat",
    description: "Non-slip exercise mat",
    price: 29.99,
    category: "Sports",
    stock: 75,
    createdAt: new Date()
  },
  {
    name: "Coffee Maker",
    description: "Programmable drip coffee maker",
    price: 59.99,
    category: "Home",
    stock: 40,
    createdAt: new Date()
  }
]);

// Create users collection (will be populated via API)
db.createCollection("users");

print('✅ MongoDB initialized with sample data');