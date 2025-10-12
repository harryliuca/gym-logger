import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const { audioBase64 } = JSON.parse(event.body || '{}');

    if (!audioBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No audio data provided' }),
      };
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Step 1: Transcribe audio using Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.webm', { type: 'audio/webm' }),
      model: 'whisper-1',
    });

    const transcript = transcription.text;
    console.log('Transcript:', transcript);

    // Step 2: Parse transcript into structured workout data using GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a workout logging assistant. Parse the user's workout description into structured JSON.

Output format:
{
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        {"reps": 15, "weight": 55},
        {"reps": 12, "weight": 55}
      ]
    }
  ]
}

Rules:
- Extract exercise names, sets, reps, and weights
- If multiple sets have same reps/weight, list them separately
- If user says "3 sets of 15 reps at 55 pounds", create 3 identical sets
- Default weight unit is pounds (lb)
- Normalize exercise names (e.g., "chest press" → "Chest Press")
- If weight not mentioned for a set, use empty string
- Be flexible with phrasing and natural language`,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsedData = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('Parsed data:', parsedData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        exercises: parsedData.exercises || [],
      }),
    };
  } catch (error: any) {
    console.error('Error processing voice:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'Failed to process voice input',
      }),
    };
  }
};
