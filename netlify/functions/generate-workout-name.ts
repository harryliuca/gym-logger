import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { exercises } = JSON.parse(event.body || '{}');

    if (!exercises) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No exercises provided' }),
      };
    }

    // Generate category name using GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a workout naming assistant. Given a list of exercises, generate a SHORT, catchy workout category name (2-4 words max).

Examples:
- "Bench Press, Chest Fly, Push-ups" → "Chest Day"
- "Squats, Leg Press, Lunges" → "Leg Day"
- "Deadlift, Barbell Row, Pull-ups" → "Back Day"
- "Chest Press, Lat Pulldown, Squats" → "Full Body"
- "Bench Press, Squats, Deadlift" → "Compound Day"
- "Bicep Curl, Tricep Extension" → "Arm Day"

Be creative but concise. Focus on the muscle groups or workout type. Return ONLY the category name, nothing else.`,
        },
        {
          role: 'user',
          content: exercises,
        },
      ],
    });

    const categoryName = completion.choices[0].message.content?.trim() || 'Custom Workout';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryName,
      }),
    };
  } catch (error: any) {
    console.error('Error generating category name:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'Failed to generate category name',
      }),
    };
  }
};
