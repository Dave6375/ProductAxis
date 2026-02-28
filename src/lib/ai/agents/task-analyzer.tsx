import { z } from "zod";
import {CoreMessage, generateObject} from "ai";
import {getModel} from "../../utils/registry";
import {LLMSelection} from "../../types";

export const taskAnalysisSchema = z.object({
    taskType: z.enum([
        'data_processing',
        'web_scraping',
        'file_conversion',
        'api_integration',
        'code_generation',
        'code_execution',
        'ui_generation',
        'data_visualization',
        'mathematical_computation',
        'system_automation',
        'content_generation',
        'other'
    ]),
    languages: z.enum(['python', 'javascript', 'html', 'css', 'sql', 'markdown']),
    complexity: z.enum(['low', 'medium', 'high']),
    steps: z.array(z.string()).describe('High-level steps to accomplishg the task'),
});

export type TaskAnalysis = z.infer<typeof taskAnalysisSchema>;

export async function taskAnalyzer(
    messages: CoreMessage[],
    llm: LLMSelection,
): Promise<TaskAnalysis | null> {
    try {
        const { object } = await generateObject({
            model: getModel(llm),
            schema: taskAnalysisSchema,
            messages,
            system: 'You are an automation task analyzer. Analyze the users request and determine the type of task, the programming languages involved, the complexity level, and the high-level steps needed to accomplish the task.' +
                '1. Type of task (data processing, web scraping, etc.)' +
                '2. Languages involved (python, javascript, etc.)' +
                '3. Complexity level (low, medium, high)' +
                '4. High-level steps to accomplish the task',
        })

        return object as TaskAnalysis;
    } catch (error) {
        console.error("Error in taskAnalyzer:", error);
        return null;
    }
}