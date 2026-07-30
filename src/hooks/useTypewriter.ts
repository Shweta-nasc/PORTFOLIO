"use client";

import { useEffect, useState } from "react";

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

/**
 * Cycles through a list of words with a type / delete effect.
 * Returns the current partial text to render alongside a cursor.
 */
export function useTypewriter(
  words: string[],
  { typeSpeed = 90, deleteSpeed = 45, pauseTime = 1600 }: TypewriterOptions = {},
): string {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[wordIndex % words.length];

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            isDeleting
              ? current.slice(0, prev.length - 1)
              : current.slice(0, prev.length + 1),
          );
        },
        isDeleting ? deleteSpeed : typeSpeed,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime]);

  return text;
}
