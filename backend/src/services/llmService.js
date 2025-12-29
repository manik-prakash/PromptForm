import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const SYSTEM_PROMPT = `You are a form schema generator. Convert natural language form descriptions into structured JSON form schemas.

Output ONLY valid JSON in this exact format:
{
  "title": "Form Title",
  "description": "Brief description of the form",
  "fields": [
    {
      "id": "fieldName",
      "label": "Field Label",
      "type": "text|email|number|textarea|select",
      "placeholder": "Optional placeholder text",
      "required": true|false,
      "options": [{"value": "opt1", "label": "Option 1"}] // Only for select type
    }
  ]
}

Rules:
- Use camelCase for field id
- type must be one of: text, email, number, textarea, select
- Include "options" array only for select fields (with value and label properties)
- Make sensible decisions about required fields
- Generate 3-10 fields based on the description
- Add helpful placeholder text where appropriate
- Output ONLY the JSON, no markdown, no explanation`;

export async function generateFormSchema(prompt) {
  try {
    const response = await openrouter.chat.send({
      model: "google/gemma-3-27b-it:free  ",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;

    let jsonContent = content.trim();
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const schema = JSON.parse(jsonContent);

    if (!schema.id) {
      schema.id = `schema-${Date.now()}`;
    }
    // console.log(schema);
    return schema;
  } catch (error) {
    console.error('LLM Error:', error);
    throw new Error('Failed to generate form schema');
  }
}
