'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AlignCenter, Check, Italic, MessageCircle, PenLine, Send, Sparkles, Sun, Type, X, type LucideIcon } from 'lucide-react';
import type { ChatOperation } from '@/lib/infographic/designEditOperations';

export type { ChatOperation } from '@/lib/infographic/designEditOperations';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };
type ChatResult = {
  inScope: boolean;
  reply: string;
  operations: ChatOperation[];
  preview: string[];
  revision: string;
  scopePrompt: string;
};

type DesignChatProps = {
  onSend: (prompt: string, history: ChatMessage[]) => Promise<ChatResult>;
  onApply: (operations: ChatOperation[], prompt: string, revision: string) => Promise<void>;
  onClose: () => void;
};

type Starter = { icon: LucideIcon; title: string; text: string };

const STARTER_PROMPTS: Starter[] = [
  { icon: Italic, title: 'Style text', text: 'Make the selected text italic' },
  { icon: Sun, title: 'Change colors', text: 'Change the color theme to blue' },
  { icon: Type, title: 'Swap the font', text: 'Use a cleaner, more modern font' },
  { icon: PenLine, title: 'Rewrite text', text: 'Replace the selected text with “5 Steps to Better Sleep” keep its style unchanged.' },
  { icon: Sun, title: 'Lighten the page', text: 'Make the background lighter' },
  { icon: AlignCenter, title: 'Align text', text: 'Align the selected text to the center' },
];

const MAX_LENGTH = 1000;
const MAX_INPUT_HEIGHT = 120;

const palette = {
  ink: '#0f172a',
  muted: '#64748b',
  line: '#e2e8f0',
  surface: '#ffffff',
  subtle: '#f8fafc',
  bubble: '#f1f5f9',
  accent: '#2563eb',
  accentDeep: '#1d4ed8',
  accentTint: '#eff6ff',
  accentLine: '#bfdbfe',
  danger: '#b91c1c',
  dangerTint: '#fef2f2',
  dangerLine: '#fecaca',
};

const css = `
@keyframes dc-rise { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes dc-dot { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@keyframes dc-spin { to { transform: rotate(360deg); } }
.dc-panel { animation: dc-rise .22s ease-out; }
.dc-dot { width: 6px; height: 6px; border-radius: 50%; background: ${palette.muted}; animation: dc-dot 1.1s infinite ease-in-out; }
.dc-dot:nth-child(2) { animation-delay: .15s; }
.dc-dot:nth-child(3) { animation-delay: .3s; }
.dc-spin { animation: dc-spin .8s linear infinite; }
.dc-starter { transition: background-color .15s, border-color .15s; }
.dc-starter:hover { background: ${palette.accentTint}; border-color: ${palette.accentLine}; }
.dc-icon-btn { transition: background-color .15s; }
.dc-icon-btn:hover { background: ${palette.bubble}; }
.dc-btn-primary { transition: background-color .15s; }
.dc-btn-primary:hover:not(:disabled) { background: ${palette.accentDeep}; }
.dc-btn-ghost { transition: background-color .15s; }
.dc-btn-ghost:hover:not(:disabled) { background: ${palette.accentTint}; }
.dc-composer { transition: border-color .15s, box-shadow .15s; }
.dc-composer:focus-within { border-color: ${palette.accent}; box-shadow: 0 0 0 3px rgba(37, 99, 235, .15); }
.dc-panel button:focus-visible { outline: 2px solid ${palette.accent}; outline-offset: 2px; }
.dc-fab:focus-visible { outline: 2px solid ${palette.accent}; outline-offset: 3px; }
.dc-scroll::-webkit-scrollbar { width: 8px; }
.dc-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; border: 2px solid ${palette.surface}; }
@media (max-width: 480px) {
  .dc-panel { right: 12px !important; bottom: 12px !important; height: min(80vh, 560px) !important; }
}
@media (prefers-reduced-motion: reduce) {
  .dc-panel, .dc-dot { animation: none; }
}
`;

function Avatar() {
  return (
    <span
      aria-hidden="true"
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: 8,
        background: palette.accentTint,
        color: palette.accent,
      }}>
      <Sparkles size={14} />
    </span>
  );
}

export default function DesignChat({ onSend, onApply, onClose }: Readonly<DesignChatProps>) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Tell me what you would like to change in your infographic.' },
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{
    operations: ChatOperation[];
    preview: string[];
    prompt: string;
    scopePrompt: string;
    revision: string;
  } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const actionInFlightRef = useRef(false);

  const showStarters = messages.length === 1 && !pending && !loading;
  const inputDisabled = loading || Boolean(pending);
  const canSend = !inputDisabled && Boolean(prompt.trim());

  // Focus the input when the panel opens.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the newest content in view.
  // On the initial screen (greeting + starters) stay at the top so the greeting is visible.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (showStarters) {
      el.scrollTo({ top: 0 });
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, pending, loading, error, showStarters]);

  // Grow the textarea with its content.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [prompt]);

  function pickStarter(text: string) {
    setPrompt(text);
    inputRef.current?.focus();
  }

  async function submit() {
    const request = prompt.trim();
    if (!request || loading || pending || actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    const history = messages.slice(-8);
    setMessages((current) => [...current, { role: 'user', content: request }]);
    setPrompt('');
    setLoading(true);
    setError(null);
    try {
      const result = await onSend(request, history);
      if (result.inScope && result.operations.length) {
        setPending({
          operations: result.operations,
          preview: result.preview,
          prompt: request,
          scopePrompt: result.scopePrompt,
          revision: result.revision,
        });
      }
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: result.operations.length ? `Proposed: ${result.reply}` : result.reply,
        },
      ]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'The design assistant could not respond. Please try again.';
      setPrompt(request);
      setError(message);
    } finally {
      actionInFlightRef.current = false;
      setLoading(false);
    }
  }

  async function applyPending() {
    if (!pending || loading || actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    setLoading(true);
    setError(null);
    try {
      await onApply(pending.operations, pending.scopePrompt, pending.revision);
      setPending(null);
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'Applied the approved changes. You can undo them from the editor toolbar.' },
      ]);
      inputRef.current?.focus();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The design changes could not be applied.');
    } finally {
      actionInFlightRef.current = false;
      setLoading(false);
    }
  }

  function discardPending() {
    setPending(null);
    setMessages((current) => [...current, { role: 'assistant', content: 'Changes discarded. Your design was not changed.' }]);
    inputRef.current?.focus();
  }

  return (
    <>
      <style>{css}</style>
      <section
        className="dc-panel"
        aria-label="AI design assistant"
        style={{
          position: 'fixed',
          zIndex: 100,
          right: 24,
          bottom: 24,
          width: 'min(400px, calc(100vw - 24px))',
          height: 540,
          maxHeight: 'min(78vh, 680px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: palette.surface,
          color: palette.ink,
          border: `1px solid ${palette.line}`,
          borderRadius: 18,
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22), 0 2px 6px rgba(15, 23, 42, 0.06)',
        }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 12px 12px 16px',
            borderBottom: `1px solid ${palette.line}`,
            background: palette.surface,
          }}>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 10,
              color: '#fff',
              background: `linear-gradient(135deg, ${palette.accent}, #4f46e5)`,
            }}>
            <Sparkles size={17} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: 'block', fontSize: 14, lineHeight: 1.25 }}>AI design assistant</strong>
            <span style={{ display: 'block', color: palette.muted, fontSize: 12, lineHeight: 1.3 }}>Edits to your infographic only</span>
          </div>
          <button type="button" className="dc-icon-btn" aria-label="Close design assistant" onClick={onClose} style={iconButtonStyle}>
            <X size={18} />
          </button>
        </header>

        <div
          ref={listRef}
          className="dc-scroll"
          aria-live="polite"
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: 16,
            background: palette.subtle,
          }}>
          {messages.map((message, index) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={`${message.role}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                }}>
                {!isUser && <Avatar />}
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    padding: '9px 12px',
                    borderRadius: 14,
                    borderBottomRightRadius: isUser ? 4 : 14,
                    borderBottomLeftRadius: isUser ? 14 : 4,
                    background: isUser ? palette.accent : palette.surface,
                    color: isUser ? '#fff' : palette.ink,
                    border: isUser ? 0 : `1px solid ${palette.line}`,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                  }}>
                  {message.content}
                </div>
              </div>
            );
          })}

          {showStarters && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ color: palette.muted, fontSize: 12, margin: '2px 0 2px' }}>Try one of these:</span>
              {STARTER_PROMPTS.map(({ icon: Icon, title, text }) => (
                <button
                  key={text}
                  type="button"
                  className="dc-starter"
                  title={title}
                  onClick={() => pickStarter(text)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    width: '100%',
                    padding: '7px 10px',
                    border: `1px solid ${palette.line}`,
                    borderRadius: 10,
                    background: palette.surface,
                    color: palette.ink,
                    fontSize: 12.5,
                    lineHeight: 1.35,
                    textAlign: 'left',
                    cursor: 'pointer',
                    font: 'inherit',
                  }}>
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: palette.accentTint,
                      color: palette.accent,
                    }}>
                    <Icon size={13} />
                  </span>
                  <span style={{ minWidth: 0, fontSize: 12.5 }}>{text}</span>
                </button>
              ))}
            </div>
          )}

          {pending && (
            <div
              style={{
                alignSelf: 'stretch',
                border: `1px solid ${palette.accentLine}`,
                background: palette.accentTint,
                borderRadius: 14,
                padding: 12,
                color: '#1e3a8a',
                fontSize: 12.5,
              }}>
              <strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                {pending.preview.length === 1 ? 'Review this change' : `Review ${pending.preview.length} changes`}
              </strong>
              <ul style={{ listStyle: 'none', margin: '0 0 12px', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pending.preview.map((item, index) => (
                  <li key={`${index}-${item}`} style={{ display: 'flex', gap: 8, lineHeight: 1.4 }}>
                    <Check size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2, color: palette.accent }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="dc-btn-primary"
                  onClick={() => void applyPending()}
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: 0,
                    borderRadius: 9,
                    background: palette.accent,
                    color: '#fff',
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: loading ? 'wait' : 'pointer',
                  }}>
                  {loading ? 'Applying…' : 'Apply changes'}
                </button>
                <button
                  type="button"
                  className="dc-btn-ghost"
                  onClick={discardPending}
                  disabled={loading}
                  style={{
                    border: `1px solid ${palette.accentLine}`,
                    borderRadius: 9,
                    background: palette.surface,
                    color: '#1e3a8a',
                    padding: '8px 12px',
                    fontSize: 13,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}>
                  Discard
                </button>
              </div>
            </div>
          )}

          {loading && !pending && (
            <div
              style={{ display: 'flex', alignItems: 'flex-end', gap: 8, alignSelf: 'flex-start' }}
              role="status"
              aria-label="Updating your design">
              <Avatar />
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  padding: '13px 14px',
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  background: palette.surface,
                  border: `1px solid ${palette.line}`,
                }}>
                <span className="dc-dot" />
                <span className="dc-dot" />
                <span className="dc-dot" />
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                border: `1px solid ${palette.dangerLine}`,
                background: palette.dangerTint,
                color: palette.danger,
                borderRadius: 11,
                padding: '8px 11px',
                fontSize: 12.5,
                lineHeight: 1.4,
              }}>
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          style={{ padding: '10px 12px 12px', borderTop: `1px solid ${palette.line}`, background: palette.surface }}>
          <div
            className="dc-composer"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              padding: '6px 6px 6px 12px',
              border: `1px solid #cbd5e1`,
              borderRadius: 13,
              background: inputDisabled ? palette.subtle : palette.surface,
            }}>
            <textarea
              ref={inputRef}
              aria-label="Describe a design edit"
              rows={1}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  void submit();
                }
              }}
              placeholder={pending ? 'Apply or discard the changes above first' : 'e.g. Make the title larger and blue'}
              maxLength={MAX_LENGTH}
              disabled={inputDisabled}
              style={{
                flex: 1,
                minWidth: 0,
                resize: 'none',
                border: 0,
                outline: 'none',
                background: 'transparent',
                padding: '7px 0',
                font: 'inherit',
                fontSize: 13.5,
                lineHeight: 1.45,
                color: palette.ink,
                maxHeight: MAX_INPUT_HEIGHT,
              }}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!canSend}
              style={{
                ...iconButtonStyle,
                width: 34,
                height: 34,
                flexShrink: 0,
                color: '#fff',
                background: canSend ? palette.accent : '#cbd5e1',
                border: 0,
                borderRadius: 10,
                cursor: canSend ? 'pointer' : 'not-allowed',
              }}>
              <Send size={16} />
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 6,
              padding: '0 2px',
              color: palette.muted,
              fontSize: 11,
            }}>
            <span>Enter to send · Shift+Enter for a new line</span>
            {prompt.length > MAX_LENGTH * 0.8 && (
              <span style={{ color: prompt.length >= MAX_LENGTH ? palette.danger : palette.muted }}>
                {prompt.length}/{MAX_LENGTH}
              </span>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

export function DesignChatButton({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <>
      <style>{css}</style>
      <button
        type="button"
        className="dc-fab"
        onClick={onClick}
        style={{
          position: 'fixed',
          zIndex: 99,
          right: 24,
          bottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: 0,
          borderRadius: 999,
          padding: '12px 18px',
          color: '#fff',
          background: `linear-gradient(135deg, ${palette.accent}, #4f46e5)`,
          boxShadow: '0 8px 24px rgba(37, 99, 235, .32)',
          fontSize: 14,
          fontWeight: 650,
          cursor: 'pointer',
        }}>
        <MessageCircle size={18} /> Ask AI to edit
      </button>
    </>
  );
}

const iconButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 0,
  borderRadius: 9,
  background: 'transparent',
  color: palette.muted,
  cursor: 'pointer',
};
