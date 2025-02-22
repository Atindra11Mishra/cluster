const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const twitterRoutes = require("./routes/twitterRoutes");

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/twitter", twitterRoutes);

app.get("/", (req, res) => {
    console.log("Backend received a request!");
    res.send("hii from backend");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
