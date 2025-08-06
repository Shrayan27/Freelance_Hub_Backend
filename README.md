# 🚀 Complete Setup Guide - Freelance Marketplace

This guide will walk you through setting up the complete freelance marketplace application with all features.

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **Git** installed
- **Stripe Account** (for payments)
- **Cloudinary Account** (for image uploads)

## 🛠️ Step-by-Step Setup

### 1. Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd freelance-marketplace

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Backend Environment (.env in server directory)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/freelance-marketplace
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/freelance-marketplace

# JWT Configuration
JWT_KEY=your-super-secret-jwt-key-here-make-it-long-and-random

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend Environment (.env in client directory)

Create a `.env` file in the `client` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Third-Party Service Setup

#### Stripe Setup

1. **Create Stripe Account**:
   - Go to [stripe.com](https://stripe.com)
   - Sign up for a free account
   - Get your API keys from the dashboard

2. **Get API Keys**:
   - **Publishable Key**: `pk_test_...` (for frontend)
   - **Secret Key**: `sk_test_...` (for backend)

3. **Test Cards**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

#### Cloudinary Setup

1. **Create Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get Credentials**:
   - Cloud Name
   - API Key
   - API Secret

### 4. Database Setup

#### Local MongoDB

1. **Install MongoDB**:
   ```bash
   # macOS (using Homebrew)
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   
   # Windows: Download from mongodb.com
   ```

2. **Start MongoDB**:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongodb
   ```

#### MongoDB Atlas (Cloud)

1. **Create Atlas Account**:
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create free account

2. **Create Cluster**:
   - Choose free tier
   - Select your preferred region

3. **Get Connection String**:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 5. Start the Application

#### Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
Server is running on port: 5000
Database Connected
```

#### Start Frontend Application

```bash
cd client
npm start
```

The application will open at: `http://localhost:3000`

## 🧪 Testing the Application

### 1. User Registration

1. **Register as a Client**:
   - Go to `/register`
   - Select "Hire" (client)
   - Fill in details
   - Create account

2. **Register as a Seller**:
   - Go to `/register`
   - Select "Work" (seller)
   - Fill in details
   - Create account

### 2. Create a Gig (Seller)

1. **Login as Seller**
2. **Go to Profile** → **Add New Service**
3. **Fill Gig Details**:
   - Title and description
   - Category and price
   - Upload cover image
   - Add features
4. **Save Gig**

### 3. Purchase a Gig (Client)

1. **Login as Client**
2. **Browse Gigs** at `/gigs`
3. **Click on a Gig**
4. **Click "Continue to Order"**
5. **Complete Payment**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry
   - Any CVC

### 4. Test Messaging

1. **From Gig Page**: Click "Contact Seller"
2. **Send Messages**: Real-time chat should work
3. **Check Messages Page**: View all conversations

### 5. Test Order Management

1. **Client**: Check orders at `/orders`
2. **Seller**: Mark orders as complete
3. **Both**: View order status and payment info

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error**: `MongoServerSelectionError`

**Solution**:
```bash
# Check if MongoDB is running
# Local MongoDB
brew services list | grep mongodb

# Or start MongoDB
brew services start mongodb-community
```

#### 2. CORS Error

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Check that backend is running on port 5000
- Verify CORS configuration in `server.js`
- Ensure frontend is calling correct API URL

#### 3. Stripe Payment Error

**Error**: `Invalid API key provided`

**Solution**:
- Verify Stripe keys in environment files
- Ensure you're using test keys (not live)
- Check Stripe dashboard for correct keys

#### 4. Image Upload Error

**Error**: `Cloudinary upload failed`

**Solution**:
- Verify Cloudinary credentials
- Check Cloudinary account status
- Ensure image file size is within limits

#### 5. Socket.io Connection Error

**Error**: `WebSocket connection failed`

**Solution**:
- Check that backend server is running
- Verify Socket.io is properly configured
- Check browser console for connection errors

### Debug Commands

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :5000

# Check MongoDB status
brew services list | grep mongodb

# Check Node.js version
node --version

# Check npm version
npm --version
```

## 🚀 Production Deployment

### Backend Deployment (Render)

1. **Connect Repository**:
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Configure Service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Set Environment Variables**:
   - Add all variables from `.env` file
   - Use production MongoDB URI
   - Use live Stripe keys

### Frontend Deployment (Vercel)

1. **Connect Repository**:
   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Build**:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Set Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Live Stripe key

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Socket.io Documentation](https://socket.io/docs/)

### Useful Tools
- [Postman](https://postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Stripe Dashboard](https://dashboard.stripe.com/) - Payment management

## 🆘 Getting Help

If you encounter issues:

1. **Check the console** for error messages
2. **Verify environment variables** are set correctly
3. **Check network connectivity** for external services
4. **Review the logs** in both frontend and backend
5. **Open an issue** in the repository with detailed error information

---

**Happy Coding! 🎉**

Your freelance marketplace is now ready to use with all features including:
- ✅ User authentication
- ✅ Gig creation and management
- ✅ Real-time messaging
- ✅ Payment processing
- ✅ Order management
- ✅ Reviews and ratings
- ✅ Image uploads
- ✅ Responsive design 
