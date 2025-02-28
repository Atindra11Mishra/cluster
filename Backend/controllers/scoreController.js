const { getUserDetails } = require("./twitterController.js");
const { getWalletDetails } = require("./BlockchainController.js");

async function calculateScore(req, res) {
    try {
        console.log("🔍 Request Params Received:", req.params);

        let { username, address } = req.params;

        if (!username) {
            return res.status(400).json({ error: "Provide Twitter username" });
        }

        // ✅ Convert `"null"` to `null` for proper handling
        if (address === "null") {
            address = null;
        }

        console.log(`📢 Fetching data for: Twitter(${username}), Wallet(${address || "None"})`);

        // ✅ Fetch Twitter user data
        const userData = await getUserDetails(username);
        if (!userData) {
            return res.status(500).json({ error: "Error fetching Twitter user data" });
        }

        let walletData = {}; // ✅ Default to empty wallet data

        // ✅ Fetch wallet data only if address is provided
        if (address) {
            walletData = await getWalletDetails(address);
        }

        console.log("✅ User Data:", userData);
        console.log("✅ Wallet Data:", walletData);

        // ✅ Generate score even if wallet data is missing
        const { score, title } = generateScore(userData, walletData);

        return res.json({ score, title });

    } catch (error) {
        console.error("❌ Error calculating score:", error);
        return res.status(500).json({ error: "Server Error" });
    }
}

// ✅ Updated Scoring Logic
function generateScore(userData, walletData = {}) {
    let socialScore = 0;

    // ✅ Extract user data safely
    const user = userData?.data?.user?.result || {};

    const followers = user.followers_count || 0;
    socialScore += followers > 10000000 ? 40 : followers > 1000000 ? 30 : followers > 100000 ? 20 : 10;

    const engagement = (user.favourites_count || 0) + (user.media_count || 0) + (user.listed_count || 0);
    socialScore += engagement > 50000 ? 10 : engagement > 10000 ? 5 : 0;

    if (user.is_blue_verified) socialScore += 5;
    socialScore = Math.min(socialScore, 40);

    // ✅ Handle missing wallet data
    let cryptoScore = 0;
    const activeChains = walletData?.activeChains?.length || 0; // ✅ Fixes `.activeChains.activeChains`
    cryptoScore += activeChains > 1 ? 20 : activeChains === 1 ? 10 : 0;

    if ((walletData?.nativeBalance || 0) > 1) cryptoScore += 10;
    if ((walletData?.defiPositionsSummary?.length || 0) > 0) cryptoScore += 10;

    let nftScore = (walletData?.walletNFTs?.length || 0) > 0 ? 20 : 0;

    let communityScore =
        (user.creator_subscriptions_count || 0) >= 5
            ? 10
            : (user.creator_subscriptions_count || 0) > 0
            ? 5
            : 0;

    // ✅ Calculate total score
    const totalScore = socialScore + cryptoScore + nftScore + communityScore;

    // ✅ Assign title based on score
    let title = "ALL ROUNDOOR";
    if (totalScore >= 90) title = "ALPHA TRADOOR";
    else if (totalScore >= 70) title = "NFT EXPLOROOR";
    else if (totalScore >= 50) title = "DAO DIPLOMAT";
    else if (totalScore >= 30) title = "COMMUNITY ANALYST";

    return { score: totalScore, title };
}

module.exports = { calculateScore };
