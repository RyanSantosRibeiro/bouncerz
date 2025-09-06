"use client";

import {
  Application,
  extend,
  useApp,
  useTick,
} from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Engine, Runner, Bodies, Composite, Body } from "matter-js";

extend({ Container, Graphics });

const defaultMaps = [
  {
    platforms: [
      { x: -400, y: 290, width: 800, height: 20, color: "#6c4f3d" },
      { x: -300, y: 200, width: 120, height: 20, color: "#3d6c49" },
      { x: 200, y: 200, width: 120, height: 20, color: "#3d6c49" },
      { x: 0, y: 100, width: 180, height: 20, color: "#3d6c49" },
      { x: -250, y: -50, width: 100, height: 20, color: "#3d6c49" },
      { x: 250, y: -50, width: 100, height: 20, color: "#3d6c49" },
      { x: 0, y: -150, width: 150, height: 20, color: "#3d6c49" },
    ],
  },
];

function PlayerBall({ x, y }) {
  const [position, setPosition] = useState({ x, y });
  const bodyRef = useRef(null);

  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  const keysRef = useRef({});

  useEffect(() => {
    console.log("Renderizando")
    // criar bola
    const body = Bodies.circle(x, y, 20, {
      restitution: 0.2,
      friction: 0.1,
    });
    bodyRef.current = body;

    // chão
    const ground = Bodies.rectangle(400, 590, 820, 20, { isStatic: true });

    Composite.add(engineRef.current.world, [body, ground]);
    Runner.run(runnerRef.current, engineRef.current);

    // controles
    const handleKeyDown = (e) => (keysRef.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e) => (keysRef.current[e.key.toLowerCase()] = false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      Runner.stop(runnerRef.current);
      Engine.clear(engineRef.current);
    };
  }, [x, y]);

  useTick(() => {
    const body = bodyRef.current;
    if (!body) return;

    const force = 0.002;
    if (keysRef.current["w"]) Body.applyForce(body, body.position, { x: 0, y: -force });
    if (keysRef.current["s"]) Body.applyForce(body, body.position, { x: 0, y: force });
    if (keysRef.current["a"]) Body.applyForce(body, body.position, { x: -force, y: 0 });
    if (keysRef.current["d"]) Body.applyForce(body, body.position, { x: force, y: 0 });

    // atualizar posição para o Pixi
    setPosition({ x: body.position.x, y: body.position.y });
  });

  // desenhar bolinha
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(0xb3e240);
    g.drawCircle(0, 0, 20);
    g.endFill();
  }, []);

  return <pixiGraphics draw={draw} x={position.x} y={position.y} />;
}

const Sandbox = () => {
  const map = defaultMaps[0];

  const drawPlatform = useCallback((g, { width, height, color }) => {
    g.clear();
    g.beginFill(color);
    g.drawRect(0, 0, width, height);
    g.endFill();
  }, []);

  return (
    <Application width={800} height={600} background={"#0a1120"}>
      <pixiContainer>
        {map.platforms.map((platform, i) => (
          <pixiGraphics
            key={i}
            x={platform.x + 400}
            y={platform.y + 300}
            draw={(g) => drawPlatform(g, platform)}
          />
        ))}

        <PlayerBall x={400} y={100} />
      </pixiContainer>
    </Application>
  );
};

export default Sandbox;
