import { GoogleGenAI } from "@google/genai";
import "dotenv/config"

type AIResponse = {
    status: boolean,
    message: string
}

class DocumentationAIAnalyzer {

    private geminiInstance: GoogleGenAI;
    private model: string = "gemini-2.5-flash";
    private mantissa: string = `Respond me with this standard: { status: true, message: ""},
                                where status is the boolean answer and message is a very short explanation of why.`

    constructor() {
        this.geminiInstance = new GoogleGenAI({
            apiKey: process.env.GEMINI_KEY
        })
    }

    analyze = async (question: string): Promise<AIResponse> => {

        const response = await this.geminiInstance.models.generateContent({
            model: this.model,
            contents: {
                text: this.mantissa + `Question: ${question}`
            },
            config: {
                responseMimeType: "application/json",
                thinkingConfig: {
                    thinkingBudget: 0
                }
            }
        })


        if (response.text) {
            return JSON.parse(response.text) as AIResponse
        }

        return <AIResponse>{
            status: false,
            message: "Cannot get the gemini response"
        }
    }

}

async function main() {
    const documentAnalyzer = new DocumentationAIAnalyzer()
    const response = await documentAnalyzer.analyze("How to find love?")

    console.log(response.status)
    console.log(response.message)


}

main()
