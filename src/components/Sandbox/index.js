"use client";

import { Application, extend, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Engine, Runner, Bodies, Composite, Body, Events } from "matter-js";

extend({ Container, Graphics });

const WIDTH = 800;
const HEIGHT = 600;

function PlayerBall({ id, isLocal, ws, map, snapshot, lastAck }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const engineRef = useRef(null);
  const bodyRef = useRef(null);
  const runnerRef = useRef(null);
  const keysRef = useRef({});
  const inputBufferRef = useRef([]); // Armazena todos os inputs com timestamp

  // For rollback
  const myPosRef = useRef({ x: 0, y: 0 });
  const canJumpRef = useRef(false);

  // Remote player
  if (!isLocal) {
    const draw = useCallback((g) => {
      g.clear();
      g.beginFill(0x40a0f0);
      g.drawCircle(0, 0, 20);
      g.endFill();
    }, []);
    return <pixiGraphics draw={draw} x={snapshot?.x ?? 0} y={snapshot?.y ?? 0} />;
  }

  useEffect(() => {
    const engine = Engine.create();
    const runner = Runner.create();
    const body = Bodies.circle(0, 0, 20, { restitution: 0, friction: 0.05 });

    const platformBodies = map.map((p) =>
      Bodies.rectangle(p.x, p.y, p.w, p.h, { isStatic: true })
    );

    Composite.add(engine.world, [body, ...platformBodies]);
    Runner.run(runner, engine);

    engineRef.current = engine;
    bodyRef.current = body;
    runnerRef.current = runner;

    Events.on(engine, "collisionStart", (e) => {
      e.pairs.forEach((pair) => {
        if (pair.bodyA === body || pair.bodyB === body) {
          canJumpRef.current = true;
        }
      });
    });

    const down = (e) => (keysRef.current[e.key.toLowerCase()] = true);
    const up = (e) => (keysRef.current[e.key.toLowerCase()] = false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [map]);

  const applyInput = useCallback((body, input) => {
    const force = 0.0008;
    const jumpForce = -0.04;

    if (input.keys.a) Body.applyForce(body, body.position, { x: -force, y: 0 });
    if (input.keys.d) Body.applyForce(body, body.position, { x: force, y: 0 });
    if (input.keys.w && canJumpRef.current) {
      Body.applyForce(body, body.position, { x: 0, y: jumpForce });
      canJumpRef.current = false;
    }
  }, []);

  // Prediction + envio de input
  useTick(() => {
    const body = bodyRef.current;
    if (!body) return;

    const now = Date.now();
    const input = {
      keys: {
        a: keysRef.current["a"],
        d: keysRef.current["d"],
        w: keysRef.current["w"],
      },
      timestamp: now,
    };

    // Salva input localmente
    inputBufferRef.current.push(input);

    // Aplica input local (prediction)
    applyInput(body, input);

    // Envia para o servidor
    ws?.send(JSON.stringify({ type: "input", ...input }));

    // Atualiza posição para render
    const pos = body.position;
    setPosition({ x: pos.x, y: pos.y });
    myPosRef.current = { x: pos.x, y: pos.y };

    // Respawn se cair
    if (Math.abs(pos.y) > HEIGHT / 2 + 200) {
      Body.setPosition(body, { x: 0, y: 0 });
      Body.setVelocity(body, { x: 0, y: 0 });
    }
  });

  // Reconciliation com rollback + re-simulação
  useEffect(() => {
    if (!snapshot || !bodyRef.current || lastAck == null) return;

    // Corrige a posição com o snapshot do servidor
    Body.setPosition(bodyRef.current, { x: snapshot.x, y: snapshot.y });
    myPosRef.current = { x: snapshot.x, y: snapshot.y };

    // Remove os inputs já processados pelo servidor
    inputBufferRef.current = inputBufferRef.current.filter(
      (input) => input.timestamp > lastAck
    );

    // Re-simula os inputs restantes
    inputBufferRef.current.forEach((input) => {
      applyInput(bodyRef.current, input);
    });

    // Atualiza posição exibida após re-simulação
    const pos = bodyRef.current.position;
    setPosition({ x: pos.x, y: pos.y });
  }, [snapshot, lastAck, applyInput]);

  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(0xb3e240);
    g.drawCircle(0, 0, 20);
    g.endFill();
  }, []);

  return <pixiGraphics draw={draw} x={position.x} y={position.y} />;
}

export default function Sandbox() {
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null);
  const [map, setMap] = useState([]);
  const [players, setPlayers] = useState({});
  const [lastAcks, setLastAcks] = useState({});
  const myIdRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "welcome") {
        setId(data.id);
        myIdRef.current = data.id;
        setMap(data.map);
      }

      if (data.type === "snapshot") {
        const newPlayers = {};
        const newAcks = {};

        data.players.forEach((p) => {
          newPlayers[p.id] = { x: p.x, y: p.y };
          newAcks[p.id] = p.lastProcessedInput;
        });

        setPlayers(newPlayers);
        setLastAcks(newAcks);
      }
    };

    return () => socket.close();
  }, []);

  const drawPlatform = useCallback((g, { w, h }) => {
    g.clear();
    g.beginFill(0x3d6c49);
    g.drawRect(-w / 2, -h / 2, w, h);
    g.endFill();
  }, []);

  if (!id) return <div>Conectando...</div>;

  return (
    <Application width={WIDTH} height={HEIGHT} background={"#0a1120"}>
      <pixiContainer x={WIDTH / 2} y={HEIGHT / 2}>
        {/* Plataformas */}
        {map.map((p, i) => (
          <pixiGraphics key={i} x={p.x} y={p.y} draw={(g) => drawPlatform(g, p)} />
        ))}

        {/* Jogador local */}
        <PlayerBall
          id={id}
          isLocal
          ws={ws}
          map={map}
          snapshot={players[id]}
          lastAck={lastAcks[id]}
        />

        {/* Jogadores remotos */}
        {Object.entries(players).map(([pid, snap]) =>
          pid === id ? null : (
            <PlayerBall
              key={pid}
              id={pid}
              isLocal={false}
              ws={ws}
              map={map}
              snapshot={snap}
            />
          )
        )}
      </pixiContainer>
    </Application>
  );
}
