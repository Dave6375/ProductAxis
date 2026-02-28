import { z } from "zod";

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
});