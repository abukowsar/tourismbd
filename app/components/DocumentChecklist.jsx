"use client";

import { useState } from "react";

export default function DocumentChecklist({ items, initiallyDone = [] }) {
  const [done, setDone] = useState(initiallyDone);
  const percent = Math.round((done.length / items.length) * 100);

  function toggle(item) {
    setDone((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <>
      <div className="progress">
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
        <p>
          {done.length} of {items.length} ready
          {percent === 100 ? " — you're all set!" : ""}
        </p>
      </div>
      <div className="document-grid">
        {items.map((item) => (
          <label key={item}>
            <input type="checkbox" checked={done.includes(item)} onChange={() => toggle(item)} />
            {item}
          </label>
        ))}
      </div>
    </>
  );
}
