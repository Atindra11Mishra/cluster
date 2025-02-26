const { getUserDetails } = require("./twitterController.js");
const { getWalletDetails } = require("./blockchainController.js");

async function calculateScore(req, res) {
    try {
        console.log("Request Body Received:", req.body); // ✅ Debugging Log

        if (!req.body) {
            return res.status(400).json({ error: "No request body received" });
        }

        const { username, address } = req.body;

        if (!username) return res.status(400).json({ error: "Provide Twitter username" });
        if (!address) return res.status(400).json({ error: "Provide wallet address" });

        console.log(`Fetching data for: Twitter(${username}), Wallet(${address})`);

        const userData = await getUserDetails(username);
        const walletData = await getWalletDetails(address);

        console.log("User Data:", userData);
        console.log("Wallet Data:", walletData);

        if (!userData || !walletData) {
            return res.status(500).json({ error: "Error fetching user data" });
        }

        const { score, title } = generateScore(userData, walletData);

        return res.json({ score, title });

    } catch (error) {
        console.error("Error calculating score:", error);
        return res.status(500).json({ error: "Server Error" });
    }
}

// Scoring Logic
function generateScore(userData, walletData) {
    let socialScore = 0;

    const followers = userData.data.user.result.followers_count;
    socialScore += followers > 10000000 ? 40 : followers > 1000000 ? 30 : followers > 100000 ? 20 : 10;

    const engagement =
    userData.data.user.result.favourites_count +
    userData.data.user.result.media_count +
    userData.data.user.result.listed_count;
    socialScore += engagement > 50000 ? 10 : engagement > 10000 ? 5 : 0;

    if (userData.data.user.result.is_blue_verified) socialScore += 5;
    socialScore = Math.min(socialScore, 40);

    let cryptoScore = 0;
    const activeChains = walletData.activeChains.activeChains.length;
    cryptoScore += activeChains > 1 ? 20 : activeChains === 1 ? 10 : 0;
    if (walletData.nativeBalance > 1) cryptoScore += 10;
    if (walletData.defiPositionsSummary.length > 0) cryptoScore += 10;

    let nftScore = walletData.walletNFTs.length > 0 ? 20 : 0;
    let communityScore =
    userData.data.user.result.creator_subscriptions_count >= 5
            ? 10
            :userData.data.user.result.creator_subscriptions_count > 0
            ? 5
            : 0;

    const totalScore = socialScore + cryptoScore + nftScore + communityScore;

    let title = "ALL ROUNDOOR";
    if (totalScore >= 90) title = "ALPHA TRADOOR";
    else if (totalScore >= 70) title = "NFT EXPLOROOR";
    else if (totalScore >= 50) title = "DAO DIPLOMAT";
    else if (totalScore >= 30) title = "COMMUNITY ANALYST";

    return { score: totalScore, title };
}

module.exports = { calculateScore };
