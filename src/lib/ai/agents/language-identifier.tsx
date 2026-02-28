
import { generateObject } from "ai";
import { z } from "zod";
import { getModel } from "../../utils/registry";

export const languageSchema = z.object({
    language: z.enum(['python', 'javascript', 'html', 'css', 'sql', 'markdown']),
});

export async function identifyLanguage(code: string): Promise<string> {
    try {
        const { object } = await generateObject({
            model: getModel(),
            schema: languageSchema,
            prompt: `Identify the programming language of the following code snippet:\n\n${code}`,
        });
        const typedObject = object as z.infer<typeof languageSchema>;
        return typedObject.language;
    } catch (error) {
        console.error("Error identifying language:", error);
        return "javascript"; // Default fallback
    }
}
