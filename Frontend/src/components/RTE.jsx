import React, { useId } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import config from "../config/config.js";
export default function RTE({ name, control, label, defaultValue = "" }) {
  const editorId = useId();

  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#000000] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,225,221,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(119,141,169,0.18),transparent_30%),linear-gradient(180deg,rgba(65,90,119,0.15),transparent_36%)]" />
      <div className="relative mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div className="max-w-2xl">
          {label && (
            <label
              htmlFor={editorId}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#e0e1dd]"
            >
              <span className="h-2 w-2 rounded-full bg-[#778da9] shadow-[0_0_0_4px_rgba(119,141,169,0.2)]" />
              {label}
            </label>
          )}
          <p className="mt-2 pl-4 text-sm leading-6 text-[#e0e1dd]/72">
            Compose with a calm, editorial surface: bold headings, generous
            spacing, and a focused writing area that keeps attention on the
            content.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#e0e1dd]/85 backdrop-blur">
          Rich Text Studio
        </div>
      </div>
      <Controller
        name={name || "Content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            id={editorId}
            apiKey={config.tinyMceApiKey}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 620,
              menubar: false,
              branding: false,
              promotion: false,
              statusbar: false,
              toolbar_mode: "sliding",
              toolbar_sticky: true,

              skin: "oxide",
              content_css: "default",

              placeholder: "Start writing your story...",

              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],

              toolbar:
                "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media table | link code | removeformat | help",

              toolbar_items_size: "small",

              content_style: `
    html, body {
      margin: 0;
      padding: 0;
      background: #edede9;
    }

    body {
      font-family: "Space Grotesk", Helvetica, Arial, sans-serif;
      font-size: 15px;
      line-height: 1.8;
      color: #1b263b;
      background: #edede9;

      padding-top: 1.5rem;
      padding-right: 2rem;
      padding-bottom: 1.5rem;
      padding-left: 2rem;

      box-sizing: border-box;
    }

    .mce-content-body {
      outline: none;
      min-height: 100%;
    }

    .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
      color: rgba(27, 38, 59, 0.5);

      left: 2rem !important;
      top: 1.5rem;
      right: 2rem;

      font-size: 15px;
      line-height: 1.8;
    }

    p {
      margin: 0 0 1rem;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: "Space Grotesk", Helvetica, Arial, sans-serif;
      line-height: 1.15;
      margin: 1.4rem 0 0.85rem;
      color: #0d1b2a;
      letter-spacing: -0.02em;
    }

    h1 {
      font-size: 2.35rem;
    }

    h2 {
      font-size: 1.9rem;
    }

    h3 {
      font-size: 1.45rem;
    }

    a {
      color: #1b263b;
      text-decoration: underline;
      text-decoration-color: #415a77;
      text-underline-offset: 0.2em;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 1rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    }

    blockquote {
      margin: 1.3rem 0;
      padding: 1rem 1.1rem;
      border-left: 4px solid #415a77;
      background: #f5f5f5;
      border-radius: 0.95rem;
      color: #1b263b;
    }

    pre,
    code {
      font-family: "SFMono-Regular", Consolas, monospace;
      background: #f5f5f5;
      color: #1b263b;
      border-radius: 0.9rem;
    }

    pre {
      padding: 1rem 1.1rem;
      overflow: auto;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    code {
      padding: 0.15rem 0.45rem;
    }

    hr {
      border: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      margin: 1.5rem 0;
    }

    ul,
    ol {
      padding-left: 1.5rem;
      margin: 0 0 1rem;
    }

    li {
      margin: 0.35rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      overflow: hidden;
      border-radius: 0.9rem;
    }

    th,
    td {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.8rem 0.9rem;
    }

    th {
      background: #d6d6d6;
      color: #0d1b2a;
      text-align: left;
    }

    ::selection {
      background: rgba(65, 90, 119, 0.3);
      color: #000;
    }
  `,
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
