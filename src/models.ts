import type * as vscode from "vscode";

const KIMI_CONFIGURATION_SCHEMA = {
	properties: {
		thinkingMode: {
			type: "string",
			title: "Thinking",
			enum: ["enabled", "disabled"],
			enumItemLabels: ["On", "Off"],
			default: "enabled",
			group: "navigation",
		},
	},
} as const;

type ModelPickerInformation = vscode.LanguageModelChatInformation & {
	configurationSchema?: unknown;
};

interface KimiModelInfo {
	id: string;
	name: string;
	family: string;
	version: string;
	maxInputTokens: number;
	maxOutputTokens: number;
	tooltip: string;
	baseUrl: string;
	thinking: boolean;
	/**
	 * When true, streaming must include a terminal `data: [DONE]` SSE event (strict Moonshot behavior).
	 * Kimi Coding API may omit it; set false for those models.
	 */
	requireSseDoneMarker: boolean;
	capabilities: {
		imageInput: boolean;
		toolCalling: boolean;
	};
}

export const KIMI_MODELS: KimiModelInfo[] = [
	{
		id: "kimi-for-coding",
		name: "Kimi for Coding",
		family: "kimi",
		version: "for-coding",
		tooltip: "Moonshot AI",
		maxInputTokens: 262144,
		maxOutputTokens: 32768,
		baseUrl: "https://api.kimi.com/coding/v1",
		thinking: true,
		requireSseDoneMarker: false,
		capabilities: { imageInput: true, toolCalling: true },
	},
];

export function toLanguageModelChatInformation(
	model: KimiModelInfo,
): ModelPickerInformation {
	const {
		id,
		name,
		family,
		version,
		tooltip,
		maxInputTokens,
		maxOutputTokens,
		capabilities,
	} = model;

	return {
		id,
		name,
		family,
		version,
		tooltip,
		detail: tooltip,
		maxInputTokens,
		maxOutputTokens,
		capabilities,
		configurationSchema: KIMI_CONFIGURATION_SCHEMA,
	};
}
