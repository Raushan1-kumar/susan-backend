const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `
                You are an expert in solving puzzles. Your task is to compare the user's answer to the provided puzzle question and give feedback. 
                If the answer is incorrect, provide the correct logic.

                Example:
                <example>
                user: You are standing outside a room with three switches, but only one switch controls a light bulb inside the room. You can toggle the switches as many times as you like, but once you open the door to check the bulb, you cannot touch the switches again. How do you determine which switch controls the bulb?
                response: \`{
                        "text": "Turn on the first switch and wait a few minutes. Then turn it off and turn on the second switch. Enter the room. The bulb that is on corresponds to the second switch, and the bulb that is warm corresponds to the first switch."
                }\`
                </example>
                IMPORTANT: Always return JSON in **this exact format**. Do NOT include explanations or additional text.

        `,
});

module.exports.puzzle = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); // Get AI response as text
    // Ensure the response is valid JSON
    const jsonResponse = JSON.parse(responseText);

    return jsonResponse;
  } catch (error) {
    console.error("❌ Error parsing AI response:", error);
    return { text: "Error: Invalid response from AI." };
  }
};
