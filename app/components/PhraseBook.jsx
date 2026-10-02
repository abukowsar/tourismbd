"use client";

import { useEffect, useState } from "react";
import { phrases } from "../data/tourism";
import Icon from "./Icon";

export default function PhraseBook() {
  const [canSpeak, setCanSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(null);

  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
  }, []);

  function speak(phrase) {
    const synth = window.speechSynthesis;
    synth.cancel();

    const bengaliVoice = synth
      .getVoices()
      .find((voice) => voice.lang?.toLowerCase().startsWith("bn"));
    const utterance = new SpeechSynthesisUtterance(
      bengaliVoice ? phrase.bangla.replace("...", "") : phrase.roman.replace("...", ""),
    );

    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
      utterance.lang = bengaliVoice.lang;
    }
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    setSpeaking(phrase.english);
    synth.speak(utterance);
  }

  return (
    <div className="phrase-grid">
      {phrases.map((phrase) => (
        <article key={phrase.english} className="phrase-card">
          <p className="phrase-en">{phrase.english}</p>
          <strong lang="bn">{phrase.bangla}</strong>
          <span className="phrase-roman">{phrase.roman}</span>
          {canSpeak ? (
            <button
              type="button"
              className={`listen-button${speaking === phrase.english ? " is-playing" : ""}`}
              onClick={() => speak(phrase)}
              aria-label={`Listen to “${phrase.roman}”`}
            >
              <Icon name="sound" size={16} />
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
