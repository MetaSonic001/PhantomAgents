"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const initialText = `# Live SAT Question Preview

Type **Markdown + LaTeX** here.

Inline math example: John has \$50. If he spends \\(2x + 5\\) dollars, where \\(x = 10\\), how much does he have left?

Display math example:

\\[
A = \\frac{1}{2}ab\\sin(C)
\\]

Geometry question with image:

![Triangle XYZ](https://pub-8b85343e065e43cba863fcf4d05f6ba9.r2.dev/edb853d0d1936b2cb6eb150def24a855.png)

In the figure shown, the measure of angle **X** is \\(52^\\circ\\).  
The length of \\(\\overline{XY}\\) is **24** units and the length of \\(\\overline{XZ}\\) is **17** units.  
What is the area, in square units, of triangle **XYZ**?
`;

export default function Page() {
  const [value, setValue] = useState<string>(initialText);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: 600 }}>
        Question Editor (Markdown + LaTeX Preview)
      </h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "stretch",
          height: "calc(100vh - 80px)",
        }}
      >
        {/* Left: Input box */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="editor"
            style={{ fontSize: "14px", marginBottom: "8px", fontWeight: 500 }}
          >
            Raw text (Markdown + LaTeX)
          </label>
          <textarea
            id="editor"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setValue(e.target.value)
            }
            style={{
              flex: 1,
              width: "100%",
              resize: "none",
              padding: "12px",
              fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #d0d0d0",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              outline: "none",
            }}
          />
        </div>

        {/* Right: Rendered preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Preview
          </div>
          <div
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #d0d0d0",
              backgroundColor: "#ffffff",
              overflow: "auto",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              // You can customize allowed elements or override components if needed
            >
              {value}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}