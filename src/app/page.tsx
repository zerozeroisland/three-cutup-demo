"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [cutUpText, setCutUpText] = useState("");
  const [cutMode, setCutMode] = useState("word");

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 1.5;

    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  function handleCutUp() {
    if (cutMode === "word") {
      const words = inputText.split(/\s+/);
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setCutUpText(shuffled.join(" "));
    } else if (cutMode === "phrase") {
      const phrases = inputText.split(/(?<=[.!?])\s+/);
      const shuffled = [...phrases].sort(() => Math.random() - 0.5);
      setCutUpText(shuffled.join(" "));
    } else {
      setCutUpText("[Markov mode not yet implemented]");
    }
  }

  return (
    <main className="h-screen bg-black text-lime-400 p-4 flex flex-col gap-4">
      {/* Top Section */}
      <div className="flex flex-1 gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text"
          className="w-3/4 resize-none p-2 bg-zinc-900 text-lime-400 border border-black rounded h-full"
        />
        <div ref={mountRef} className="w-1/4 h-full bg-black rounded" />
      </div>

      {/* Dropdown + Button */}
      <div className="flex gap-2 items-center">
        <select
          value={cutMode}
          onChange={(e) => setCutMode(e.target.value)}
          className="bg-black text-lime-400 border border-lime-400 px-2 py-1 rounded"
        >
          <option value="word">Word</option>
          <option value="phrase">Phrase</option>
          <option value="markov">Markov</option>
        </select>
        <button
          onClick={handleCutUp}
          className="bg-lime-500 hover:bg-lime-400 text-black px-4 py-1 rounded"
        >
          Cut-Up
        </button>
      </div>

      {/* Bottom Output */}
      <div className="flex-1 bg-zinc-900 p-4 rounded overflow-y-auto">
        <p>{cutUpText || "[Cut-Up Output Will Go Here]"}</p>
      </div>
    </main>
  );
}
