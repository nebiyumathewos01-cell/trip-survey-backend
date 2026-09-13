const sendToAegis = async (rawAlert) => {
  try {
    const response = await fetch(process.env.https://aegis-1-15r0.onrender.com/api/webhook/alert, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.aegis_Pbl1BBmiRo4MLublkWqTSnQ6JFAazJbFNtRPBHYnf7Q,
      },
      body: JSON.stringify({
        raw_alert: rawAlert,
        source: "trip-survey",
        auto_analyze: true,
      }),
    });

    const result = await response.text();

    console.log("Aegis status:", response.status);
    console.log("Aegis response:", result);

    return response.ok;
  } catch (error) {
    console.error("Aegis webhook error:", error);
    return false;
  }
};

module.exports = { sendToAegis };
