"use client";

import { useRef, useState } from "react";

type Direction = "json-to-office" | "office-to-json";
type OfficeFormat = "pptx" | "xlsx" | "docx";
type PreviewTab = "preview" | "json" | "diagnostics";

interface LocalFile {
  digest?: string;
  name: string;
  size: number;
}

const formats: Record<
  OfficeFormat,
  { description: string; label: string; mime: string }
> = {
  pptx: {
    label: "Presentation",
    description: "Slides, notes, shapes, charts, and media",
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  xlsx: {
    label: "Workbook",
    description: "Sheets, cells, formulas, tables, and charts",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  docx: {
    label: "Document",
    description: "Sections, paragraphs, tables, and media",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
};

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MiB`;
}

async function sha256(file: File): Promise<string | undefined> {
  if (!globalThis.crypto?.subtle) return undefined;
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer(),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function FormatPreview({
  fileName,
  format,
  ready,
}: {
  fileName?: string;
  format: OfficeFormat;
  ready: boolean;
}) {
  return (
    <div className={`format-preview ${format}`} aria-label={`${formats[format].label} preview`}>
      {format === "pptx" ? (
        <>
          <div className="slide-rail" aria-hidden="true">
            <span className="active">1</span><span>2</span><span>3</span>
          </div>
          <div className="slide-canvas">
            <span>PPTX</span>
            <strong>Slide preview</strong>
            <p>Layout, text, shapes, tables, charts, and media.</p>
          </div>
        </>
      ) : null}

      {format === "xlsx" ? (
        <div className="sheet-canvas">
          <div className="sheet-tabs"><span className="active">Sheet 1</span><span>Sheet 2</span></div>
          <div className="sheet-grid" aria-hidden="true">
            <span /><b>A</b><b>B</b><b>C</b><b>D</b>
            {[1, 2, 3, 4, 5].flatMap((row) => [
              <b key={`${row}-label`}>{row}</b>,
              ...["a", "b", "c", "d"].map((column) => (
                <i key={`${row}-${column}`} />
              )),
            ])}
          </div>
        </div>
      ) : null}

      {format === "docx" ? (
        <div className="document-canvas">
          <span>DOCX</span>
          <strong>Page preview</strong>
          <i /><i /><i /><i className="short" />
        </div>
      ) : null}

      <div className={`preview-readiness${ready ? " has-input" : ""}`}>
        <span>{ready ? "Input ready" : "Empty preview"}</span>
        <p>
          {fileName ? `${fileName} is local and ready for the ` : "The "}
          OAKit renderer adapter.
        </p>
      </div>
    </div>
  );
}

export function DemoWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [direction, setDirection] = useState<Direction>("office-to-json");
  const [format, setFormat] = useState<OfficeFormat>("pptx");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("json");
  const [file, setFile] = useState<LocalFile>();
  const [jsonText, setJsonText] = useState("");
  const [parsedJson, setParsedJson] = useState<unknown>();
  const [error, setError] = useState<string>();
  const [working, setWorking] = useState(false);
  const [dragging, setDragging] = useState(false);

  function resetInput() {
    setFile(undefined);
    setJsonText("");
    setParsedJson(undefined);
    setError(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  function selectDirection(next: Direction) {
    setDirection(next);
    setPreviewTab(next === "office-to-json" ? "json" : "preview");
    resetInput();
  }

  function selectFormat(next: OfficeFormat) {
    setFormat(next);
    resetInput();
  }

  function validateJson(value = jsonText) {
    setError(undefined);
    setParsedJson(undefined);
    if (!value.trim()) {
      setError("Paste JSON or choose a .json file before validating.");
      return;
    }
    try {
      setParsedJson(JSON.parse(value));
      setPreviewTab("preview");
    } catch {
      setError("The input is not valid JSON. Fix its syntax and try again.");
      setPreviewTab("diagnostics");
    }
  }

  async function inspect(selected?: File) {
    if (!selected) return;
    setWorking(true);
    setError(undefined);
    setFile(undefined);
    setParsedJson(undefined);

    try {
      if (direction === "office-to-json") {
        const extension = `.${format}`;
        if (!selected.name.toLowerCase().endsWith(extension)) {
          setError(`Choose a ${extension.toUpperCase()} file for the selected format.`);
          setPreviewTab("diagnostics");
          return;
        }
        if (selected.size > 100 * 1024 * 1024) {
          setError("The Office file exceeds the current 100 MiB local input boundary.");
          setPreviewTab("diagnostics");
          return;
        }
        const digest = await sha256(selected);
        setFile({ name: selected.name, size: selected.size, digest });
        setPreviewTab("preview");
        return;
      }

      if (!selected.name.toLowerCase().endsWith(".json")) {
        setError("Choose a .json file for JSON-to-Office mode.");
        setPreviewTab("diagnostics");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError("The JSON file exceeds the current 10 MiB editor boundary.");
        setPreviewTab("diagnostics");
        return;
      }
      const text = await selected.text();
      const digest = await sha256(selected);
      setJsonText(text);
      try {
        setParsedJson(JSON.parse(text));
        setFile({ name: selected.name, size: selected.size, digest });
        setPreviewTab("preview");
      } catch {
        setError("The selected file is not valid JSON.");
        setPreviewTab("diagnostics");
      }
    } finally {
      setWorking(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const accepts = direction === "office-to-json"
    ? `.${format},${formats[format].mime}`
    : ".json,application/json";
  const hasInput = Boolean(file || parsedJson);
  const formattedJson = parsedJson === undefined
    ? undefined
    : JSON.stringify(parsedJson, null, 2);

  return (
    <section className="demo-studio" aria-label="Office and JSON conversion workspace">
      <header className="demo-studio-topbar">
        <div className="direction-switch" aria-label="Conversion direction">
          <button
            aria-pressed={direction === "office-to-json"}
            onClick={() => selectDirection("office-to-json")}
            type="button"
          >
            Office <span>→</span> JSON
          </button>
          <button
            aria-pressed={direction === "json-to-office"}
            onClick={() => selectDirection("json-to-office")}
            type="button"
          >
            JSON <span>→</span> Office
          </button>
        </div>
        <div className="local-runtime"><i /> Local browser workspace</div>
      </header>

      <div className="format-switcher" aria-label="Office format">
        {(Object.keys(formats) as OfficeFormat[]).map((value) => (
          <button
            aria-pressed={format === value}
            key={value}
            onClick={() => selectFormat(value)}
            type="button"
          >
            <span className={`format-mark ${value}`}>{value.slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{value.toUpperCase()}</strong>
              <small>{formats[value].label}</small>
            </span>
            <i>{format === value ? "Selected" : "UI ready"}</i>
          </button>
        ))}
      </div>

      <div className="demo-studio-grid">
        <section className="studio-panel input-panel" aria-labelledby="demo-input-title">
          <header className="studio-panel-header">
            <div>
              <span>01 · Input</span>
              <h2 id="demo-input-title">
                {direction === "office-to-json" ? `${format.toUpperCase()} document` : "OAKit JSON"}
              </h2>
            </div>
            <span className="panel-security">Never uploaded</span>
          </header>

          <div
            className={`workspace-dropzone${dragging ? " dragging" : ""}`}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              void inspect(event.dataTransfer.files[0]);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accepts}
              aria-label="Choose a local input file"
              onChange={(event) => void inspect(event.target.files?.[0])}
            />
            <span className="workspace-drop-icon" aria-hidden="true">＋</span>
            <strong>
              Drop {direction === "office-to-json" ? `.${format}` : ".json"} here
            </strong>
            <p>Read from this browser tab only.</p>
            <button type="button" onClick={() => inputRef.current?.click()}>
              Choose local file
            </button>
          </div>

          {direction === "json-to-office" ? (
            <div className="json-editor-wrap">
              <div><span>Or paste structured JSON</span><span>{jsonText.length.toLocaleString()} chars</span></div>
              <textarea
                aria-label="OAKit JSON input"
                onChange={(event) => {
                  setJsonText(event.target.value);
                  setParsedJson(undefined);
                  setError(undefined);
                }}
                placeholder={'{\n  "format": "pptx",\n  "document": { ... }\n}'}
                spellCheck={false}
                value={jsonText}
              />
              <button type="button" onClick={() => validateJson()}>
                Validate JSON
              </button>
            </div>
          ) : null}

          {working ? <p className="workspace-progress">Reading local bytes…</p> : null}
          {file ? (
            <div className="workspace-file">
              <span>✓</span>
              <div>
                <strong>{file.name}</strong>
                <small>{formatBytes(file.size)} · local input accepted</small>
                {file.digest ? <code>sha256 {file.digest}</code> : null}
              </div>
              <button type="button" onClick={resetInput}>Remove</button>
            </div>
          ) : null}
        </section>

        <section className="studio-panel output-panel" aria-labelledby="demo-output-title">
          <header className="studio-panel-header output-header">
            <div>
              <span>02 · Output</span>
              <h2 id="demo-output-title">
                {direction === "office-to-json" ? "Structured JSON" : `${formats[format].label} preview`}
              </h2>
            </div>
            <span className="adapter-status">Adapter pending</span>
          </header>

          <div className="preview-tabs" role="tablist" aria-label="Output views">
            {(["preview", "json", "diagnostics"] as PreviewTab[]).map((tab) => (
              <button
                aria-selected={previewTab === tab}
                key={tab}
                onClick={() => setPreviewTab(tab)}
                role="tab"
                type="button"
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="preview-viewport" role="tabpanel">
            {previewTab === "preview" ? (
              <FormatPreview fileName={file?.name} format={format} ready={hasInput} />
            ) : null}

            {previewTab === "json" ? (
              formattedJson ? (
                <pre className="json-preview"><code>{formattedJson}</code></pre>
              ) : (
                <div className="studio-empty-state">
                  <span>{"{ }"}</span>
                  <strong>{direction === "office-to-json" ? "Document JSON will appear here" : "No validated JSON yet"}</strong>
                  <p>{direction === "office-to-json" ? "The parser output activates after the npm package adapter is connected." : "Paste or choose JSON, then validate it locally."}</p>
                </div>
              )
            ) : null}

            {previewTab === "diagnostics" ? (
              <div className={`studio-diagnostics${error ? " has-error" : ""}`} aria-live="polite">
                <span>{error ? "!" : "✓"}</span>
                <div>
                  <strong>{error ? "Input needs attention" : "No diagnostics reported"}</strong>
                  <p>{error ?? (hasInput ? "The local input boundary passed. Format diagnostics begin after adapter integration." : "Select an input to begin local validation.")}</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <footer className="export-tray">
        <div>
          <span>03 · Export</span>
          <strong>Downloads connect to package writers.</strong>
          <p id="download-status">Disabled until the verified npm exports are integrated.</p>
        </div>
        <div className="export-actions" hidden={direction !== "office-to-json"}>
          <button aria-describedby="download-status" disabled type="button">
            Download JSON <span>npm pending</span>
          </button>
        </div>
        <div className="export-actions" hidden={direction !== "json-to-office"}>
          {(Object.keys(formats) as OfficeFormat[]).map((value) => (
            <button aria-describedby="download-status" disabled key={value} type="button">
              Download {value.toUpperCase()} <span>npm pending</span>
            </button>
          ))}
        </div>
      </footer>

      <div className="integration-boundary">
        <span>UI contract ready</span>
        <p>Input → parse or generate → normalized model → preview adapter → local download</p>
      </div>
    </section>
  );
}
