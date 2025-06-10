import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
	try {
		const { prompt } = await request.json();

		if (!prompt) {
			return NextResponse.json(
				{ error: 'Prompt is required' },
				{ status: 400 }
			);
		}

		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json(
				{ error: 'OpenAI API key is not configured' },
				{ status: 500 }
			);
		}

		console.log('Generating image with prompt:', prompt);

		const result = await openai.images.generate({
			model: "gpt-image-1",
			prompt: prompt,
			n: 1, // Generate one image
			size: "1024x1024", // Standard size
			response_format: "b64_json" // Get base64 encoded image
		});

		if (!result.data || result.data.length === 0) {
			return NextResponse.json(
				{ error: 'No image data received from OpenAI' },
				{ status: 500 }
			);
		}

		const imageBase64 = result.data[0].b64_json;

		if (!imageBase64) {
			return NextResponse.json(
				{ error: 'Failed to generate image' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			imageBase64: imageBase64,
			prompt: prompt,
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Error generating image:', error);

		if (error instanceof Error) {
			return NextResponse.json(
				{ error: `Failed to generate image: ${error.message}` },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: 'Failed to generate image' },
			{ status: 500 }
		);
	}
} 