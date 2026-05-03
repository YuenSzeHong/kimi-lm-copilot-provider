export const KIMI_TOOL_CALL_REASONING_FALLBACK =
	"(reasoning not preserved in chat history)";

export function assistantToolCallThinkingPayload(mergedText: string): {
	content: string;
	reasoning_content: string;
} {
	const trimmed = mergedText.trim();
	if (trimmed.length === 0) {
		return { content: "", reasoning_content: KIMI_TOOL_CALL_REASONING_FALLBACK };
	}

	return { content: mergedText, reasoning_content: KIMI_TOOL_CALL_REASONING_FALLBACK };
}
