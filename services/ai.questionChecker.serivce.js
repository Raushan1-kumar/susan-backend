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
                You are an expert MERN developer. Your task is to evaluate the efficiency of the provided code and return an optimized version if possible. 
                Always return a JSON object without any extra text.

                Examples:
                <example>
                user: Here is my code: const add = (a, b) => a + b;
                response: \`{
                        "text": "The provided code is efficient.",
                        "optimizedCode": "const add = (a, b) => a + b;"
                }\`
                </example>
                <example>
                user: Here is my code: for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }
                response: \`{
                        "text": "The provided code can be optimized.",
                        "optimizedCode": "arr.forEach(item => console.log(item));"
                }\`
                </example>
                IMPORTANT: Always return JSON in **this exact format**. Do NOT include explanations or additional text.
        `,
});

module.exports.generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); // Get AI response as text
    console.log("🔥 Raw AI Response:", responseText); // Log full response

    // Ensure the response is valid JSON
    const jsonResponse = JSON.parse(responseText);

    return jsonResponse;
  } catch (error) {
    console.error("❌ Error parsing AI response:", error);
    return { text: "Sorry currently ai is not working please try again later or try again " };
  }
};

