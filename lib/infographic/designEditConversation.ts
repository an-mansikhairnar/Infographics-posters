type ChatMessage = { role: 'user' | 'assistant'; content: string };

const SHORT_CLARIFICATION = /^(?:the\s+)?(?:selected(?:\s+one)?|one|all|both|yes|yeah|yep|any(?:\s+of\s+your\s+choice)?|any\s+font|you\s+choose|choose\s+for\s+me|your\s+choice|the\s+one\s+i\s+selected|that\s+one|\d{1,3}(?:\.\d+)?(?:\s*(?:px|pixels|%))?|editorialGold|modernBlue|emeraldGrowth|sunsetCoral|midnightDark)$/i;
const FONT_SIZE_QUESTION = /\b(?:font|text)\s*size\b/i;
const CLARIFICATION_QUESTION = /\?|\b(which|what|where|how many|how large|how big|would you like|do you mean|please specify|confirm)\b/i;
const PRIOR_CONTEXT_REFERENCE = /\b(it|that|this|these|those|there|same|instead|one|another)\b/i;

export function resolveEditConversation(prompt: string, history: ChatMessage[]) {
  const trimmed = prompt.trim();
  const lastAssistantIndex = history.findLastIndex((message) => message.role === 'assistant');
  if (lastAssistantIndex < 0) return { prompt: trimmed, history: [] };
  const lastAssistantMessage = history[lastAssistantIndex].content;
  const shortAnswer = SHORT_CLARIFICATION.test(trimmed);
  const answeringClarification = shortAnswer && CLARIFICATION_QUESTION.test(lastAssistantMessage);
  const referencesPriorContext = PRIOR_CONTEXT_REFERENCE.test(trimmed);
  if (!answeringClarification && !referencesPriorContext) return { prompt: trimmed, history: [] };

  const lastUserIndex = history.findLastIndex(
    (message, index) => index < lastAssistantIndex && message.role === 'user' && !SHORT_CLARIFICATION.test(message.content.trim())
  );
  if (lastUserIndex < 0) return { prompt: trimmed, history: [] };
  const lastUserRequest = history[lastUserIndex].content;
  const relevantHistory = answeringClarification
    ? [history[lastAssistantIndex]]
    : history.slice(lastUserIndex, lastAssistantIndex + 1);

  if (answeringClarification) {
    const numericAnswer = /^\d{1,3}(?:\.\d+)?$/.test(trimmed);
    if (numericAnswer && FONT_SIZE_QUESTION.test(lastAssistantMessage)) {
      return {
        prompt: JSON.stringify({
          originalRequest: lastUserRequest,
          clarification: trimmed,
          instruction: 'Treat the number as the final absolute font size, not an increment. Continue the original request without asking again.',
        }),
        history: relevantHistory,
      };
    }

    return {
      prompt: JSON.stringify({
        originalRequest: lastUserRequest,
        clarification: trimmed,
        instruction: 'Treat this as an answer to your last clarification question. Continue the original design edit, preserve its target and requested properties, and do not ask the same question again.',
      }),
      history: relevantHistory,
    };
  }

  return { prompt: trimmed, history: relevantHistory };
}
