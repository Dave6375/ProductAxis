import { createStreamableUI, createStreamableValue } from "@ai-sdk/rsc";
import { LLMSelection } from "@/lib/types";
import { streamText } from "ai";
import { getModel } from "@/lib/utils/registry";
import { BotCard } from "../../../app/chat/chat-components";

export  interface StepGenerator {
    steps: string[];
    description: string;

}

export async function stepGenerator(
    uiStream: ReturnType<typeof createStreamableUI>,
    code: string,
    llm: LLMSelection,

): Promise<StepGenerator> {
    let fullResponse = "";
    const  streamableAnswer = createStreamableValue<string>("");

    uiStream.append(
        <BotCard showAvatar={false}>
            <div className="text-sm font-semibold mb-2">Analysis:</div>
        </BotCard>
    );

    const SYSTEM_PROMPT = `Analyze this code and provide: 
    1. A brief description of what the code does
    2. 4-5 key execution steps in a numbered list
   
   Format:
   Description: [one sentence]
   Steps:
   1. [step 1]
   2. [step 2]
   etc.`;

    try {
        const result = await streamText({
            model: getModel(llm),
            messages: [
                {
                    role: "user",
                    content: `Analyze this code and break down its execution into a list of steps: ${code}`,
                }
            ],
            system: SYSTEM_PROMPT,
            onFinish: (event) => {
                fullResponse = event.text;
                streamableAnswer.done();
            },
        });

        for await (const text of result.textStream) {
            if (text) {
                fullResponse += text;
                uiStream.update(
                    <BotCard showAvatar={false}>
                        <div className="text-sm font-semibold mb-2">Analysis:</div>
                        <div className="text-sm whitespace-pre-wrap">{fullResponse}</div>
                    </BotCard>
                );
            }
        }

        uiStream.update(
            <BotCard showAvatar={false}>
                <div className="text-sm font-semibold mb-2">Analysis:</div>
                <div className="text-sm whitespace-pre-wrap">{fullResponse}</div>
            </BotCard>
        );

        // Parse the response
        const descMatch = fullResponse.match(/Description:\s*(.+)/);
        const stepsMatch = fullResponse.match(/Steps:\s*\n((?:\d+\.\s+.+?\n)+)/);

        const description = descMatch ? descMatch[1].trim() : "Code execution";
        const stepsText = stepsMatch ? stepsMatch[1] : "";
        const steps = stepsText.split('\n')
            .filter(line => /^\d+\.\s/.test(line))
            .map((line) => line.replace(/^\d+\.\s/, ''))

            return { steps: steps.length > 0 ? steps : ["Execute code"], description }
    } catch (error) {
        return {
            steps: ["Execute code"],
            description: "Code execution",
        }
    }
}
