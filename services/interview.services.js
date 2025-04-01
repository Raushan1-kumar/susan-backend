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
        You are a senior HR professional with 20 years of experience conducting technical interviews. 
        Your role is to evaluate candidate responses to interview questions.
        
        Analyze the answer based on:
        1. Technical accuracy
        2. Communication clarity
        3. Problem-solving approach
        4. Depth of understanding
        
        Format your response as JSON with the following structure:
        {
            "evaluation": {
                "feedback": "Detailed feedback on the answer",
                "suggestedImprovement": "Areas for improvement if any",
                "score": "Score out of 10"
            }
        } Example:
        <example>
        question: "What is dependency injection and why is it important?"
        answer: "Dependency injection is a design pattern where dependencies are passed into an object instead of being created inside. It helps with testing and loose coupling."
        response: {
            "evaluation": {

                "feedback": "Good basic understanding of DI. Clear and concise explanation of both the concept and its benefits.",
                "suggestedImprovement": "Could have mentioned real-world examples and different types of DI",
                "score": "8"
            }
        }
        </example>

        If the answer is correct, include words of encouragement in the feedback.
        If incorrect, provide constructive criticism and the correct approach.
        Always maintain a professional and supportive tone.
        IMPORTANT: Always return JSON in the exact format shown above.
    `,
});

module.exports.interview = async ({question, answer}) => {
  try {
    const question1 =`question: ${question} answer: ${answer}`;
    const result = await model.generateContent(question1);
    const responseText = result.response.text(); // Get AI response as text
    // Ensure the response is valid JSON
    const jsonResponse = JSON.parse(responseText)
    return jsonResponse;
  } catch (error) {
    console.error("❌ Error parsing AI response:", error);
    return { text: "Error: Invalid response from AI." };
  }
};
