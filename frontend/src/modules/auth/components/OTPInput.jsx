import React, { useRef } from "react";

/**
 * Simple 6-digit OTP input component.
 *
 * Props:
 *  - length (default 6)
 *  - value (string)
 *  - onChange(value)
 */
export default function OTPInput({ length = 6, value = "", onChange }) {
  const inputs = Array.from({ length }).map(() => React.createRef());
  const wrapperRef = useRef();

  const handleChange = (idx, e) => {
    const ch = e.target.value.replace(/\D/g, "");
    let nextVal = value.split("");
    nextVal[idx] = ch ? ch[0] : "";
    const newVal = nextVal.join("").slice(0, length);
    onChange(newVal);

    if (ch && idx < length - 1) {
      const next = wrapperRef.current.querySelectorAll("input")[idx + 1];
      next.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      const prev = wrapperRef.current.querySelectorAll("input")[idx - 1];
      prev.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center" ref={wrapperRef}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-300"
        />
      ))}
    </div>
  );
}
