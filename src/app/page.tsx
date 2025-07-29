"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("[Cut-Up Output Will Go Here]");
  const [cutUpMode, setCutUpMode] = useState("word");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(200, 200);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 1.5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  const handleCutUp = () => {
    const input = inputText.trim();
    let elements: string[] = [];

    if (cutUpMode === "word") {
      elements = input.split(/\s+/);
    } else if (cutUpMode === "phrase") {
      elements = input
        .split(/(?<=[.!?;])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else if (cutUpMode === "markov") {
      elements = ["[Markov mode not implemented yet]"];
    }

    const shuffled = elements.sort(() => Math.random() - 0.5);
    setOutputText(shuffled.join(" "));
  };

  return (
    <main className="flex flex-col h-screen bg-black text-lime-400 p-4 space-y-4">
      {/* Top Half: Input and 3D */}
      <div className="flex flex-1 gap-4">
        <textarea
          className="basis-2/3 bg-zinc-900 text-lime-400 p-4 rounded resize-none"
          placeholder="Enter your text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div
          ref={mountRef}
          className="basis-1/3 bg-black rounded min-h-[200px]"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <select
          value={cutUpMode}
          onChange={(e) => setCutUpMode(e.target.value)}
          className="bg-lime-400 text-black px-2 py-1 rounded"
        >
          <option value="word">Word</option>
          <option value="phrase">Phrase</option>
          <option value="markov">Markov</option>
        </select>
        <button
          onClick={handleCutUp}
          className="bg-lime-400 text-black px-4 py-1 rounded"
        >
          Cut-Up
        </button>
      </div>

      {/* Bottom Half: Output */}
      <div className="flex-1">
        <textarea
          className="w-full h-full bg-zinc-900 text-lime-400 p-4 rounded resize-none"
          value={outputText}
          readOnly
        />
      </div>
    </main>
  );
}
