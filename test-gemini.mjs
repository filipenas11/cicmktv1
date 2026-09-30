import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: 'Teste simples',
        });
        console.log("Success gemini-3.8-flash:", response.text);
    } catch (e) {
        console.error("Error gemini-3.8-flash:", e.message);
    }
}

test();
