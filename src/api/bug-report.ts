import type { APIRoute } from 'astro';

const MAX_FIELD_LENGTH = 2000;
const MAX_EMBED_FIELD = 900;

const trimField = (value: string, maxLength = MAX_FIELD_LENGTH) => {
	if (!value) return '';
	return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
};

export const POST: APIRoute = async ({ request }) => {
	const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL ?? process.env.DISCORD_WEBHOOK_URL;
	if (!webhookUrl) {
		return new Response('Webhook not configured.', { status: 500 });
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return new Response('Invalid form submission.', { status: 400 });
	}

	const honeypot = String(formData.get('company') ?? '').trim();
	if (honeypot) {
		return new Response('OK', { status: 200 });
	}

	const modName = trimField(String(formData.get('modName') ?? '').trim(), 120);
	const modVersion = trimField(String(formData.get('modVersion') ?? '').trim(), 120);
	const modLoader = trimField(String(formData.get('modLoader') ?? '').trim(), 60);
	const mcVersion = trimField(String(formData.get('mcVersion') ?? '').trim(), 60);
	const message = trimField(String(formData.get('message') ?? '').trim(), 1000);
	const crashLog = trimField(String(formData.get('crashLog') ?? '').trim(), MAX_EMBED_FIELD);
	const contact = trimField(String(formData.get('contact') ?? '').trim(), 120);

	if (!modName || !modVersion || !modLoader || !mcVersion || !message) {
		return new Response('Missing required fields.', { status: 400 });
	}

	const payload = {
		username: 'ModWiki Reporter',
		embeds: [
			{
				title: `${modName} - ${modVersion}`,
				color: 16744703,
				fields: [
					{ name: 'Loader', value: modLoader, inline: true },
					{ name: 'Minecraft', value: mcVersion, inline: true },
					{ name: 'Contact', value: contact || 'Not provided', inline: true },
					{ name: 'Report', value: message || 'No details provided.' },
					{
						name: 'Crash Log',
						value: crashLog ? `\`\`\`\n${crashLog}\n\`\`\`` : 'Not provided.',
					},
				],
				timestamp: new Date().toISOString(),
			},
		],
	};

	const response = await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		return new Response('Failed to send to Discord.', { status: 502 });
	}

	return new Response('Report sent.', { status: 200 });
};
