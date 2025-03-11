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
                You are an expert in Data Structures and Algorithms. Your task is to provide hints to solve the given problem. 
                Do not provide the full solution or code. You can give examples for clarification.

                Examples:
                <example>
                user: How can I find the maximum element in an array?
                response: \`{
                        "text": "You can iterate through the array and keep track of the maximum element found so far. For example, start with the first element as the maximum and compare each subsequent element to update the maximum."
                }\`
                </example>
                <example>
                user: How do I reverse a linked list and give me code or something like this?
                response: \`{
                        "text": "Sorry I can't provide you code . You can use three pointers to reverse the linked list: previous, current, and next. Initialize previous to null and current to the head of the list. Iterate through the list, updating the next pointer of each node to point to the previous node."
                }\`
                </example>
                IMPORTANT: Always return JSON in **this exact format**. Do NOT include explanations or additional text.
        `,
});

module.exports.checkPuzzle = async (prompt) => {
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
