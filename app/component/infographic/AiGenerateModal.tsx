"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, X, Loader2, AlertCircle, Check, Wand2 } from "lucide-react";
import type { ThemeKey } from "@/lib/infographic/aiCompiler";

export interface ThemeOption {
  key: ThemeKey;
  name: string;
  primary: string;
  secondary?: string;
  bg?: string;
  cardBg?: string;
  [key: string]: unknown;
}

export interface AiInfographicModalProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  theme?: ThemeKey;
  setTheme?: (theme: ThemeKey) => void;
  error?: string | null;
  loading: boolean;
  onGenerate: () => void;
  suggestions?: string[];
  themes?: Record<string, ThemeOption>;
}

export default function AiInfographicModal({
  open,
  onClose,
  prompt,
  setPrompt,
  error,
  loading,
  onGenerate,
  suggestions = [],
}: AiInfographicModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const timer = setTimeout(() => textareaRef.current?.focus(), 80);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !loading) onClose();
      };
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      setMounted(false);
    }
  }, [open, loading, onClose]);

  if (!open) return null;

  const canSubmit = !loading && prompt.trim().length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(6px)",
        padding: "16px",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transform: mounted
            ? "scale(1) translateY(0)"
            : "scale(0.96) translateY(8px)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          color: "#0F172A",
        }}
      >

        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #06B6D4, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
                flexShrink: 0,
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0F172A",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Generate with AI
                </h2>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: "#ECFEFF",
                    color: "#0891B2",
                    border: "1px solid #A5F3FC",
                  }}
                >
                  AI Studio
                </span>
              </div>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: "13px",
                  color: "#64748B",
                }}
              >
                Type your topic and let AI structure stats, charts, and steps.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F1F5F9";
              e.currentTarget.style.color = "#334155";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#94A3B8";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Comfortably sized, no ugly inner scrollbars) */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Prompt input */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label
                htmlFor="ai-prompt"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Wand2 size={13} color="#0891B2" />
                Describe your topic or paste notes
              </label>
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                {prompt.length > 0
                  ? `${prompt.length} chars`
                  : "Include stats & steps"}
              </span>
            </div>

            <div
              style={{
                borderRadius: "12px",
                border: "1.5px solid #CBD5E1",
                backgroundColor: "#F8FAFC",
                overflow: "hidden",
                transition:
                  "border-color 0.15s, box-shadow 0.15s, background-color 0.15s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0284C7";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(2, 132, 199, 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#CBD5E1";
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <textarea
                id="ai-prompt"
                ref={textareaRef}
                rows={3}
                value={prompt}
                disabled={loading}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    (e.metaKey || e.ctrlKey) &&
                    e.key === "Enter" &&
                    canSubmit
                  ) {
                    e.preventDefault();
                    onGenerate();
                  }
                }}
                placeholder="e.g. 5 benefits of daily morning exercise. Include statistics on energy levels, 3 steps to build consistency, and a comparison of walking vs running."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#0F172A",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 14px 8px",
                  backgroundColor: "#FFFFFF",
                  borderTop: "1px solid #F1F5F9",
                  fontSize: "11px",
                  color: "#94A3B8",
                }}
              >
                <span>
                  Mention numbers or comparisons to automatically generate
                  charts
                </span>
                <span
                  style={{
                    backgroundColor: "#F1F5F9",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    color: "#64748B",
                    fontSize: "10px",
                  }}
                >
                  Ctrl + Enter
                </span>
              </div>
            </div>
          </div>

          {/* Quick inspiration chips (Horizontal wrap, compact badges) */}
          {suggestions.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "6px",
                }}
              >
                Quick Ideas:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setPrompt(item);
                      textareaRef.current?.focus();
                    }}
                    style={{
                      fontSize: "11.5px",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      backgroundColor: "#FFFFFF",
                      color: "#475569",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#0284C7";
                      e.currentTarget.style.backgroundColor = "#F0F9FF";
                      e.currentTarget.style.color = "#0369A1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                      e.currentTarget.style.color = "#475569";
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}



          {/* Error Message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#B91C1C",
                fontSize: "12px",
              }}
            >
              <AlertCircle
                size={15}
                color="#DC2626"
                style={{ flexShrink: 0 }}
              />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "11.5px", color: "#64748B" }}>
            Fully customizable in the editor after generation
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "9px 18px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                backgroundColor: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F1F5F9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFFFFF")
              }
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canSubmit}
              style={{
                padding: "9px 22px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#FFFFFF",
                background: canSubmit
                  ? "linear-gradient(135deg, #06B6D4, #2563EB)"
                  : "#94A3B8",
                border: "none",
                borderRadius: "10px",
                cursor: canSubmit ? "pointer" : "not-allowed",
                boxShadow: canSubmit
                  ? "0 4px 12px rgba(6, 182, 212, 0.35)"
                  : "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                if (canSubmit) e.currentTarget.style.opacity = "0.92";
              }}
              onMouseLeave={(e) => {
                if (canSubmit) e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Generating Infographic…
                </>
              ) : (
                <>Generate Infographic</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
