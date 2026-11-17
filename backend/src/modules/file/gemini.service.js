const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * GeminiService provides Intelligent Cloud Vision OCR and Multimodal Document Analysis.
 * It delivers human-grade text transcription, auto-cropping of application chrome (Word/browser UI),
 * multi-column reading order reconstruction, and university document taxonomy classification.
 */
class GeminiService {
  constructor() {
    this.defaultModel = "gemini-3.1-flash-lite";
    this.apiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
    this.fallbackModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-2.5-flash-lite",
      "gemini-3.8-flash",
    ];
  }

  /**
   * Checks whether the Gemini API key is configured in the environment.
   * @returns {boolean}
   */
  isConfigured() {
    const key = process.env.GEMINI_API_KEY;
    return typeof key === "string" && key.trim().length > 0;
  }

  /**
   * Retrieves the configured Gemini model identifier.
   * @returns {string}
   */
  getModel() {
    return (process.env.GEMINI_MODEL || this.defaultModel).trim();
  }

  /**
   * Resolves the canonical MIME type for supported image and PDF document formats.
   * @param {string} filePath
   * @param {string} [hintMime]
   * @returns {string|null}
   */
  resolveMimeType(filePath, hintMime = null) {
    if (hintMime && hintMime.includes("/") && hintMime !== "application/octet-stream") {
      return hintMime;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };

    return mimeMap[ext] || null;
  }

  /**
   * Analyzes an uploaded document or image using Gemini Multimodal Vision.
   * 
   * @param {string} filePath - Absolute or relative file path on disk.
   * @param {string} [providedMimeType] - Optional MIME type hint.
   * @returns {Promise<{clean_ocr_text: string, document_type: string, subject: string|null, title: string|null, memo_date: Date|null, summary: string, confidence_score: number, provider: string, model: string}|null>}
   */
  async analyzeDocumentWithGemini(filePath, providedMimeType = null) {
    if (!this.isConfigured()) {
      return null;
    }

    if (!filePath || !fs.existsSync(filePath)) {
      console.warn(`[GeminiService] File not found for analysis: ${filePath}`);
      return null;
    }

    const mimeType = this.resolveMimeType(filePath, providedMimeType);
    if (!mimeType) {
      console.warn(`[GeminiService] Unsupported file type for vision analysis: ${filePath}`);
      return null;
    }

    const apiKey = process.env.GEMINI_API_KEY.trim();

    // Prepare candidate models: primary model first, followed by fallbacks
    const primaryModel = this.getModel();
    const modelsToTry = [
      primaryModel,
      ...this.fallbackModels,
    ].filter((m, i, arr) => arr.indexOf(m) === i);

    let base64Data = null;
    try {
      const fileBuffer = fs.readFileSync(filePath);
      base64Data = fileBuffer.toString("base64");
    } catch (err) {
      console.error("[GeminiService] Failed to read file buffer:", err.message);
      return null;
    }

    const prompt = `You are an expert archivist and OCR specialist for Zamboanga Peninsula Polytechnic State University (ZPPSU) Guidance Office Records System.
Analyze the attached document carefully and accurately.

CRITICAL INSTRUCTIONS:
1. FOCUS EXCLUSIVELY ON THE DOCUMENT BODY: If the image is a screenshot or photo containing computer window borders, Microsoft Word / browser ribbons, menus, scrollbars, status bars, zoom sliders, or operating system taskbars, COMPLETELY IGNORE AND EXCLUDE THEM. Transcribe only the actual document contents.
2. PRESERVE STRUCTURE & READING ORDER: If the document is formatted in columns or multiple pages side-by-side, transcribe the text in its natural sequential reading order. Maintain clear paragraph breaks.
3. EXTRACT METADATA PRECISELY:
   - Identify the official Document Title (look for 'TITLE:' or main heading).
   - Identify the Subject (look for 'SUBJECT:' or summary topic).
   - Classify document into university taxonomy: 'Memorandum', 'Thesis', 'Budget Proposal', 'Disbursement', 'Collections', 'Certificate', 'Report', or 'Document'.
   - Extract official date if present (YYYY-MM-DD).

Return a valid JSON object matching this schema:
{
  "clean_ocr_text": "string (The complete, accurate text transcribed from the document body only. Do not hallucinate or omit text.)",
  "document_type": "string (One of: 'Memorandum', 'Thesis', 'Budget Proposal', 'Disbursement', 'Collections', 'Certificate', 'Report', or 'Document')",
  "title": "string (The main document title)",
  "subject": "string (The official subject or topic. Max 150 chars)",
  "memo_date": "string or null (Document date formatted as YYYY-MM-DD, or null if no date exists)",
  "summary": "string (A concise 1-2 sentence executive summary of the document purpose and content)",
  "confidence_score": 0.98
}`;

    // Try candidate models in order
    for (const model of modelsToTry) {
      const endpoint = `${this.apiBaseUrl}/${model}:generateContent?key=${apiKey}`;

      try {
        console.log(`[GeminiService] Attempting OCR & Analysis with model: ${model}...`);
        const payload = {
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.1,
          },
        };

        const response = await axios.post(endpoint, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 25000,
        });

        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          console.warn(`[GeminiService] Empty response from model ${model}, trying next...`);
          continue;
        }

        // Sanitize code blocks
        let sanitizedText = rawText.trim();
        if (sanitizedText.startsWith("```json")) {
          sanitizedText = sanitizedText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
        } else if (sanitizedText.startsWith("```")) {
          sanitizedText = sanitizedText.replace(/^```\s*/, "").replace(/```\s*$/, "");
        }

        const parsed = JSON.parse(sanitizedText);

        // Date validation
        let parsedDate = null;
        if (parsed.memo_date) {
          const d = new Date(parsed.memo_date);
          if (!isNaN(d.getTime())) {
            parsedDate = d;
          }
        }

        // Taxonomy normalization
        const validTypes = [
          "Memorandum",
          "Thesis",
          "Budget Proposal",
          "Disbursement",
          "Collections",
          "Certificate",
          "Report",
          "Document",
        ];
        let docType = (parsed.document_type || "Document").trim();
        if (!validTypes.includes(docType)) {
          docType = "Document";
        }

        const resolvedSubject = parsed.subject || parsed.title || null;

        const result = {
          clean_ocr_text: typeof parsed.clean_ocr_text === "string" ? parsed.clean_ocr_text.trim() : "",
          document_type: docType,
          title: typeof parsed.title === "string" ? parsed.title.trim() : null,
          subject: typeof resolvedSubject === "string" && resolvedSubject.trim().length > 0 ? resolvedSubject.trim() : null,
          memo_date: parsedDate,
          summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
          confidence_score: typeof parsed.confidence_score === "number" ? parsed.confidence_score : 0.95,
          provider: "gemini",
          model: model,
        };

        console.log(`[GeminiService] Successfully processed document with ${model} (DocType: ${result.document_type}, Subject: "${result.subject || 'N/A'}", Text: ${result.clean_ocr_text.length} chars)`);
        return result;
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.error?.message || err.message;
        console.warn(`[GeminiService] Model ${model} failed (${status || 'Network/Timeout'}: ${msg}).`);
        // If 404 or 503, try next fallback model
        continue;
      }
    }

    console.warn("[GeminiService] All Gemini models exhausted. Gracefully returning null to trigger local fallback.");
    return null;
  }
}

module.exports = new GeminiService();
