const THINK_OPEN_REPLACEMENT =
	"<details><summary>Thinking</summary>\n\n";
const THINK_CLOSE_REPLACEMENT = "\n\n</details>\n\n";

export const KIMI_TOOL_CALL_REASONING_FALLBACK =
	"(reasoning not preserved in chat history)";

const LOOSE_THINKING_BLOCK =
	/<details\b[^>]*>\s*<summary\b[^>]*>\s*Thinking\s*<\/summary>\s*([\s\S]*?)<\/details>/i;

function extractThinkingLoose(full: string): ThinkingSplit | null {
	const m = LOOSE_THINKING_BLOCK.exec(full);
	if (!m || m.index === undefined) return null;
	const inner = m[1].trim();
	const visibleContent = `${full.slice(0, m.index)}${full.slice(m.index + m[0].length)}`;
	return { reasoningContent: inner, visibleContent };
}

export interface ThinkingSplit {
	reasoningContent: string;
	visibleContent: string;
}

export function extractThinkingFromAssistantText(full: string): ThinkingSplit {
	if (full.length === 0) {
		return { reasoningContent: "", visibleContent: full };
	}

	const start = full.indexOf(THINK_OPEN_REPLACEMENT);
	if (start !== -1) {
		const afterOpen = start + THINK_OPEN_REPLACEMENT.length;
		const end = full.indexOf(THINK_CLOSE_REPLACEMENT, afterOpen);
		if (end !== -1) {
			const reasoningContent = full.slice(afterOpen, end).trim();
			const visibleContent = `${full.slice(0, start)}${full.slice(
				end + THINK_CLOSE_REPLACEMENT.length,
			)}`;
			return { reasoningContent, visibleContent };
		}
	}

	const loose = extractThinkingLoose(full);
	if (loose) return loose;

	return { reasoningContent: "", visibleContent: full };
}

export function reasoningContentForKimiToolCallMessage(
	extractedReasoning: string,
): string {
	const trimmed = extractedReasoning.trim();
	return trimmed.length > 0 ? trimmed : KIMI_TOOL_CALL_REASONING_FALLBACK;
}

export function assistantToolCallThinkingPayload(mergedText: string): {
	content: string;
	reasoning_content: string;
} {
	const split = extractThinkingFromAssistantText(mergedText);

	if (split.reasoningContent.trim().length > 0) {
		return {
			content: split.visibleContent,
			reasoning_content: split.reasoningContent.trim(),
		};
	}

	return {
		content: mergedText.trim(),
		reasoning_content: KIMI_TOOL_CALL_REASONING_FALLBACK,
	};
}
