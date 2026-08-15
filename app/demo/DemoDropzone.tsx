"use client";

import { useRef, useState } from "react";

interface LocalFile {
  digest?: string;
  name: string;
  size: number;
}

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

export function DemoDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<LocalFile>();
  const [error, setError] = useState<string>();
  const [working, setWorking] = useState(false);

  async function inspect(selected?: File) {
    if (!selected) return;
    setError(undefined);
    setFile(undefined);
    if (!selected.name.toLowerCase().endsWith(".pptx")) {
      setError("Choose a PowerPoint .pptx package for this preview.");
      return;
    }
    if (selected.size > 100 * 1024 * 1024) {
      setError("The file exceeds the current 100 MiB input boundary.");
      return;
    }
    setWorking(true);
    const digest = await sha256(selected);
    setFile({ name: selected.name, size: selected.size, digest });
    setWorking(false);
  }

  return (
    <div className="demo-workspace">
      <div
        className="dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void inspect(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={(event) => void inspect(event.target.files?.[0])}
        />
        <span className="drop-icon" aria-hidden="true">⇧</span>
        <h2>Drop a PowerPoint here</h2>
        <p>The file stays in your browser. Nothing is uploaded.</p>
        <button type="button" onClick={() => inputRef.current?.click()}>
          Choose .pptx file
        </button>
      </div>

      <div className="demo-output" aria-live="polite">
        <div className="demo-output-bar">
          <span>Local inspection</span>
          <span className="status available">Browser only</span>
        </div>
        {working ? <p className="demo-empty">Reading local bytes…</p> : null}
        {error ? <p className="demo-error">{error}</p> : null}
        {!working && !error && !file ? (
          <div className="demo-empty">
            <span>01</span>
            <p>Select a package to verify its local metadata and input boundary.</p>
          </div>
        ) : null}
        {file ? (
          <div className="file-result">
            <span className="result-check">✓</span>
            <div>
              <h3>{file.name}</h3>
              <p>{formatBytes(file.size)} · valid PPTX filename</p>
              {file.digest ? <code>sha256 {file.digest}</code> : null}
            </div>
          </div>
        ) : null}
      </div>

      <p className="demo-preview-note">
        This first website slice validates local file handling only. The full
        document tree and JSON explorer will connect to the published browser
        package in the first OAKit release.
      </p>
    </div>
  );
}
