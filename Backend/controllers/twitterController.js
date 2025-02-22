const axios = require("axios");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

exports.getUserDetails = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    

    try {
        console.log(`Fetching data for username: ${username}`);

        const options = {
            method: "GET",
            url: "https://twitter241.p.rapidapi.com/user", // ✅ Use the correct endpoint
            headers: {
                "X-RapidAPI-Key": 'f91ba3c075mshe69a83db1cb1c4bp1a506ejsn4a581f4789f9',
                "X-RapidAPI-Host": 'twitter241.p.rapidapi.com',
                "Content-Type": "application/json"
            },
            params: { username }
        };

        const response = await axios.request(options);
        console.log(response)

        // ✅ Extract only user data from the response
        const userData = response.data?.result?.data?.user || null;

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching Twitter user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};
