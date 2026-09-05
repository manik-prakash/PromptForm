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
      "type": "text|email|number|textarea|select|checkbox|radio|date",
      "placeholder": "Optional placeholder text",
      "required": true|false,
      "options": [{"value": "opt1", "label": "Option 1"}] // Only for select/radio types
    }
  ]
}

Rules:
- Use camelCase for field id
- type must be one of: text, email, number, textarea, select, checkbox, radio, date
- Include "options" array only for select and radio fields (with value and label properties)
- Use "checkbox" for a single yes/no or agree/disagree field, "radio" for choosing one of a few options, "date" for calendar dates
- Make sensible decisions about required fields
- Generate 3-10 fields based on the description
- Add helpful placeholder text where appropriate
- Output ONLY the JSON, no markdown, no explanation`;

// Free OpenRouter models, tried in order. Free models get rate-limited hard
// and occasionally rotate out without warning, so a fallback keeps generation working.
const MODELS = [
  "google/gemma-4-31b-it:free",
  "z-ai/glm-5.2:free",
  "minimax/minimax-m3:free",
];

async function callModel(model, prompt) {
  const response = await openrouter.chat.send({
    model,
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

  return JSON.parse(jsonContent);
}

export async function generateFormSchema(prompt) {
  for (const model of MODELS) {
    try {
      const schema = await callModel(model, prompt);

      if (!schema.id) {
        schema.id = `schema-${Date.now()}`;
      }
      return schema;
    } catch (error) {
      console.error(`LLM Error (${model}):`, error);
    }
  }

  throw new Error('Failed to generate form schema');
}
