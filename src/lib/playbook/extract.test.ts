import { describe, expect, it } from "vitest";
import { extractText } from "./extract";

const bytes = (s: string) => new TextEncoder().encode(s);

// Smallest PDF with one text line; pdf.js rebuilds the missing xref table.
const PDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 100]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 10 50 Td (Hello playbook) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R/Size 6>>
%%EOF`;

describe("extractText", () => {
  it("reads txt and md as UTF-8, trimmed", async () => {
    await expect(extractText("txt", bytes("  Reply fast.\n"))).resolves.toBe("Reply fast.");
    await expect(extractText("md", bytes("# Title\nBody"))).resolves.toBe("# Title\nBody");
  });

  it("extracts the text of a pdf", async () => {
    await expect(extractText("pdf", bytes(PDF))).resolves.toContain("Hello playbook");
  });

  it("rejects a pdf that cannot be parsed", async () => {
    await expect(extractText("pdf", bytes("%PDF-1.4 garbage"))).rejects.toThrow();
  });

  it("caps very long text", async () => {
    const out = await extractText("txt", bytes("a".repeat(500_000)));
    expect(out.length).toBeLessThanOrEqual(200_000);
  });
});
