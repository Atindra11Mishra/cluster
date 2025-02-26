const axios = require("axios");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

exports.getUserDetails = async (username) => { // ✅ Accept `username` as an argument
    if (!username) {
        throw new Error("Username is required");
    }

    try {
        console.log(`Fetching data for username: ${username}`);

        const options = {
            method: "GET",
            url: "https://twitter241.p.rapidapi.com/user",
            headers: {
                "X-RapidAPI-Key": 'f91ba3c075mshe69a83db1cb1c4bp1a506ejsn4a581f4789f9',
                "X-RapidAPI-Host": 'twitter241.p.rapidapi.com',
                "Content-Type": "application/json"
            },
            params: { username } // ✅ Use params instead of body
        };

        const response = await axios.request(options);
        console.log("Twitter API Response:", response.data);

        const userData = response.data?.result || null;

        if (!userData) {
            throw new Error("User not found");
        }

        return userData; // ✅ Return data instead of `res.json()`
    } catch (error) {
        console.error("Error fetching Twitter user data:", error);
        throw new Error("Failed to fetch user data");
    }
};
