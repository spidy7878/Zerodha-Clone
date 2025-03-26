require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const qs = require('querystring');
const authenticateToken = require("./authMiddleware");

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Adding Dummy Data of Holdings to Database.

/*app.get("/addHoldings", async (req, res) => {
  try {
    const tempHoldings = [
      {
        name: "BHARTIARTL",
        qty: 2,
        avg: 538.05,
        price: 541.15,
        net: "+0.58%",
        day: "+2.99%",
      },
      {
        name: "HDFCBANK",
        qty: 2,
        avg: 1383.4,
        price: 1522.35,
        net: "+10.04%",
        day: "+0.11%",
      },
      {
        name: "HINDUNILVR",
        qty: 1,
        avg: 2335.85,
        price: 2417.4,
        net: "+3.49%",
        day: "+0.21%",
      },
      {
        name: "INFY",
        qty: 1,
        avg: 1350.5,
        price: 1555.45,
        net: "+15.18%",
        day: "-1.60%",
        isLoss: true,
      },
      {
        name: "ITC",
        qty: 5,
        avg: 202.0,
        price: 207.9,
        net: "+2.92%",
        day: "+0.80%",
      },
      {
        name: "KPITTECH",
        qty: 5,
        avg: 250.3,
        price: 266.45,
        net: "+6.45%",
        day: "+3.54%",
      },
      {
        name: "M&M",
        qty: 2,
        avg: 809.9,
        price: 779.8,
        net: "-3.72%",
        day: "-0.01%",
        isLoss: true,
      },
      {
        name: "RELIANCE",
        qty: 1,
        avg: 2193.7,
        price: 2112.4,
        net: "-3.71%",
        day: "+1.44%",
      },
      {
        name: "SBIN",
        qty: 4,
        avg: 324.35,
        price: 430.2,
        net: "+32.63%",
        day: "-0.34%",
        isLoss: true,
      },
      {
        name: "SGBMAY29",
        qty: 2,
        avg: 4727.0,
        price: 4719.0,
        net: "-0.17%",
        day: "+0.15%",
      },
      {
        name: "TATAPOWER",
        qty: 5,
        avg: 104.2,
        price: 124.15,
        net: "+19.15%",
        day: "-0.24%",
        isLoss: true,
      },
      {
        name: "TCS",
        qty: 1,
        avg: 3041.7,
        price: 3194.8,
        net: "+5.03%",
        day: "-0.25%",
        isLoss: true,
      },
      {
        name: "WIPRO",
        qty: 4,
        avg: 489.3,
        price: 577.75,
        net: "+18.08%",
        day: "+0.32%",
      },
    ];

    for (const item of tempHoldings) {
      try {
        const newHolding = new HoldingsModel({
          name: item.name,
          qty: item.qty,
          avg: item.avg,
          price: item.price,
          net: item.net,
          day: item.day,
          isLoss: item.isLoss || false,
        });

        await newHolding.save(); // Wait for save to complete
        console.log(`✅ Saved: ${item.name}`);
      } catch (err) {
        console.error(`❌ Error saving ${item.name}:`, err.message);
      }
    }

    res.send("✅ All holdings processed!");
  } catch (error) {
    console.error("❌ Error in /addHoldings:", error.message);
    res.status(500).send("Failed to add holdings.");
  }
});*/

/*app.get("/addPositions", async (req, res) => {
  try {
    const tempPositions = [
      {
        product: "CNC",
        name: "EVEREADY",
        qty: 2,
        avg: 316.27,
        price: 312.35,
        net: "+0.58%",
        day: "-1.24%",
        isLoss: true,
      },
      {
        product: "CNC",
        name: "JUBLFOOD",
        qty: 1,
        avg: 3124.75,
        price: 3082.65,
        net: "+10.04%",
        day: "-1.35%",
        isLoss: true,
      },
    ];
    for (const item of tempPositions) {
      try {
        const newPosition = new PositionsModel({
          product: item.product,
          name: item.name,
          qty: item.qty,
          avg: item.avg,
          price: item.price,
          net: item.net,
          day: item.day,
          isLoss: item.isLoss || false,
        });

        await newPosition.save(); // Wait for save to complete
        console.log(`✅ Saved: ${item.name}`);
      } catch (err) {
        console.error(`❌ Error saving ${item.name}:`, err.message);
      }
    }

    res.send("✅ All holdings processed!");
  } catch (error) {
    console.error("❌ Error in /addHoldings:", error.message);
    res.status(500).send("Failed to add holdings.");
  }
});*/

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  newOrder.save();

  res.send("Order Saved");
});

// Replace with your actual credentials
const CLIENT_ID = "1342038116738928742";
const CLIENT_SECRET = "bXQv-uWHaYy1krDWeUj-rQUCahrm1jvs";
const REDIRECT_URI = "http://localhost:3002/oauth-callback";
const JWT_SECRET = "xby/XnhNf/tMgzxf8xo5uHgIQWt3f8j2Vd843GK46tc="; // Store this securely in env vars!

app.get("/oauth-callback", async (req, res) => {
  const { code, state } = req.query;

  // 1️⃣ Validate the state (if you stored it, compare here)
  if (state !== "secureRandomState123") {
    return res.status(400).send("Invalid state parameter");
  }

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    // 2️⃣ Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, token_type } = tokenResponse.data;

    // 3️⃣ Use the access token to get user information
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const user = userResponse.data;

    console.log("Discord User:", user);

    // 4️⃣ Generate a JWT for your app
    const tokenPayload = {
      discordId: user.id,
      username: user.username,
      avatar: user.avatar,
      email: user.email, // Only if scope includes 'email'
    };

    const jwtToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    // 5️⃣ Redirect to frontend with token or set it as cookie
    // Option 1: Redirect with JWT as a query param (easier but less secure)
    res.redirect(`http://localhost:3001/apps?token=${jwtToken}`);

    // Option 2 (Better): Set HttpOnly cookie (requires frontend adjustment)
    // res.cookie('token', jwtToken, { httpOnly: true, secure: true }).redirect('http://localhost:3001/apps');
  } catch (error) {
    console.error(
      "OAuth callback error:",
      error.response?.data || error.message
    );
    res.status(500).send("Authentication failed");
  }
});

app.listen(PORT, () => {
  console.log("App Started!");
  mongoose.connect(uri);
  console.log("DB Connected");  
});

/*require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRoute = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ DB Connected"))
.catch((err) => console.error("❌ DB Connection Error:", err.message));

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Auth Routes (public)
app.use("/api/auth", authRoute);

// Protected Routes (add `protect` middleware)
app.get("/allHoldings", protect, async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", protect, async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.post("/newOrder", protect, async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    await newOrder.save();
    res.status(201).send("✅ Order Saved");
  } catch (error) {
    res.status(500).json({ message: "Failed to save order" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/
