const { pipeline, env } = require('@xenova/transformers');

// Prevent caching to temp folders and use memory efficiently
env.allowLocalModels = false;
env.useBrowserCache = false;

class ExtractionService {
  constructor() {
    this.qaPipeline = null;
    this.isLoading = false;
  }

  async loadModel() {
    if (!this.qaPipeline && !this.isLoading) {
      this.isLoading = true;
      console.log("Loading local AI model for metadata extraction...");
      try {
        this.qaPipeline = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad', {
            progress_callback: (x) => {
                if(x.status === "progress" && x.progress % 10 === 0) {
                    // console.log(`Loading AI: ${x.progress}%`);
                }
            }
        });
        console.log("Local AI model loaded successfully.");
      } catch (err) {
        console.error("Failed to load local AI model:", err);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async extractMetadata(text) {
    if (!text || text.length < 10) return null;

    // Ensure model is loaded
    await this.loadModel();
    if (!this.qaPipeline) return null;

    // Truncate text to avoid exceeding token limits for DistilBERT
    const contextText = text.substring(0, 1500);

    const result = {
      subject: null,
      memo_date: null,
      document_type: null,
    };

    try {
      // 1. Extract Subject
      // First try deterministic regex for clear "SUBJECT:" or "RE:" lines
      const subjectMatch = contextText.match(/(?:SUBJECT|RE)\s*:\s*([^\n]+(?:\n\s+[^\n]+)*)/i);
      if (subjectMatch && subjectMatch[1]) {
        // Stop if it hits an empty line or a number bullet (like "1. ")
        let cleanSubject = subjectMatch[1].split(/\n\s*\n|\n\s*\d+\.\s/)[0].trim();
        result.subject = cleanSubject.replace(/\s+/g, ' ');
      }

      // If regex fails, fallback to AI Question Answering
      if (!result.subject) {
        const subjectOutput = await this.qaPipeline('What is the title or subject of this document?', contextText);
        if (subjectOutput && subjectOutput.score > 0.1) {
          // Clean up the output
          result.subject = subjectOutput.answer.replace(/^subject:?\s*/i, "").trim();
          // Capitalize first letter
          if (result.subject) {
               result.subject = result.subject.charAt(0).toUpperCase() + result.subject.slice(1);
          }
        }
      }

      // 2. Extract Date
      const dateOutput = await this.qaPipeline('What is the date of this document?', contextText);
      if (dateOutput && dateOutput.score > 0.2) {
        const parsedDate = new Date(dateOutput.answer);
        if (!isNaN(parsedDate.getTime())) {
          result.memo_date = parsedDate;
        }
      }

      // 3. Infer Document Type using simple keyword matching on the context
      const textLower = contextText.toLowerCase();
      if (textLower.includes("memorandum") || textLower.includes("memo to:")) {
        result.document_type = "Memorandum";
      } else if (textLower.includes("thesis") || textLower.includes("dissertation")) {
        result.document_type = "Thesis";
      } else if (textLower.includes("budget proposal") || textLower.includes("budget plan")) {
        result.document_type = "Budget Proposal";
      } else if (textLower.includes("disbursement")) {
        result.document_type = "Disbursement";
      } else if (textLower.includes("collection") || textLower.includes("receipt")) {
        result.document_type = "Collections";
      } else if (textLower.includes("certificate") || textLower.includes("certification")) {
        result.document_type = "Certificate";
      } else if (textLower.includes("report")) {
        result.document_type = "Report";
      } else {
        result.document_type = "Document";
      }

      console.log("AI Extraction Results:", result);
      return result;

    } catch (error) {
      console.error("AI Extraction Error:", error);
      return null;
    }
  }
}

module.exports = new ExtractionService();
