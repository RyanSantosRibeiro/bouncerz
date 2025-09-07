"use client";

import { Application, extend, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Engine, Runner, Bodies, Composite, Body, Events } from "matter-js";
import { useWallet } from "./../../../context/WalletContext"; // ajuste para o caminho correto

extend({ Container, Graphics });

function PlayerBall({ id, isLocal, ws, map, snapshot, lastAck }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const engineRef = useRef(null);
  const bodyRef = useRef(null);
  const runnerRef = useRef(null);
  const keysRef = useRef({});
  const inputBufferRef = useRef([]);
  const myPosRef = useRef({ x: 0, y: 0 }); 
  const canJumpRef = useRef(false);

  // REMOTE PLAYER
  if (!isLocal) {
    const draw = useCallback((g) => {
      g.clear();
      g.beginFill(0x40a0f0);
      g.drawCircle(0, 0, 20);
      g.endFill();
    }, []);
    return (
      <pixiGraphics draw={draw} x={snapshot?.x ?? 0} y={snapshot?.y ?? 0} />
    );
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
          const other = pair.bodyA === body ? pair.bodyB : pair.bodyA;
          if (other.isStatic && body.position.y < other.position.y) {
            canJumpRef.current = true;
          }
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

  const applyInput = useCallback((body, input, canJump = false) => {
    const force = 0.0008;
    const jumpForce = -0.04;
    if (input.keys.a) Body.applyForce(body, body.position, { x: -force, y: 0 });
    if (input.keys.d) Body.applyForce(body, body.position, { x: force, y: 0 });
    if (input.keys.w && canJump) {
      Body.applyForce(body, body.position, { x: 0, y: jumpForce });
    }
  }, []);

  useTick(() => {
    const body = bodyRef.current;
    if (!body) return;

    const now = Date.now();
    const input = {
      keys: {
        a: keysRef.current["a"],
        d: keysRef.current["d"],
        w: keysRef.current["w"] && canJumpRef.current, // 🔒 aplica pulo só se permitido
      },
      timestamp: now,
    };

    inputBufferRef.current.push(input);
    applyInput(body, input, canJumpRef.current);

    if (input.keys.w && canJumpRef.current) {
      canJumpRef.current = false; // 🔁 reseta após aplicar pulo
    }

    ws?.send(JSON.stringify({ type: "input", ...input }));

    const pos = body.position;
    setPosition({ x: pos.x, y: pos.y });
    myPosRef.current = { x: pos.x, y: pos.y };

    if (Math.abs(pos.y) > 1000) {
      Body.setPosition(body, { x: 0, y: 0 });
      Body.setVelocity(body, { x: 0, y: 0 });
    }
  });

  useEffect(() => {
    if (!snapshot || !bodyRef.current || lastAck == null) return;

    // REPLAY usando snapshot + inputBuffer
    const inputsToReplay = inputBufferRef.current.filter(
      (input) => input.timestamp > lastAck
    );

    const simEngine = Engine.create();
    const clonedBody = Bodies.circle(snapshot.x, snapshot.y, 20, {
      restitution: 0,
      friction: 0.05,
    });

    const clonedPlatforms = map.map((p) =>
      Bodies.rectangle(p.x, p.y, p.w, p.h, { isStatic: true })
    );

    Composite.add(simEngine.world, [clonedBody, ...clonedPlatforms]);

    let simCanJump = false;
    Events.on(simEngine, "collisionStart", (e) => {
      e.pairs.forEach((pair) => {
        if (pair.bodyA === clonedBody || pair.bodyB === clonedBody) {
          const other = pair.bodyA === clonedBody ? pair.bodyB : pair.bodyA;
          if (other.isStatic && clonedBody.position.y < other.position.y) {
            simCanJump = true;
          }
        }
      });
    });

    for (const input of inputsToReplay) {
      applyInput(clonedBody, input, simCanJump);
      simCanJump = false; // permite só um pulo por replay
      Engine.update(simEngine, 1000 / 60);
    }

    Body.setPosition(bodyRef.current, clonedBody.position);
    Body.setVelocity(bodyRef.current, clonedBody.velocity);

    setPosition({ x: clonedBody.position.x, y: clonedBody.position.y });
    myPosRef.current = { x: clonedBody.position.x, y: clonedBody.position.y };

    inputBufferRef.current = inputsToReplay;
  }, [snapshot, lastAck, applyInput, map]);

  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(0xb3e240);
    g.drawCircle(0, 0, 20);
    g.endFill();
  }, []);

  return <pixiGraphics draw={draw} x={position.x} y={position.y} />;
}

export default function Sandbox() {
  const { user, match } = useWallet();

  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null);
  const [map, setMap] = useState([]);
  const [players, setPlayers] = useState({});
  const [lastAcks, setLastAcks] = useState({});
  const [viewport, setViewport] = useState({ width: 800, height: 600 });

  const myIdRef = useRef(null);

  // Fullscreen resize
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // set once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conexão WebSocket
  useEffect(() => {
    if (!match?.hash) return;

    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", match: match.hash }));
    };

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
  }, [match]);

  const drawPlatform = useCallback((g, { w, h }) => {
    g.clear();
    g.beginFill(0x3d6c49);
    g.drawRect(-w / 2, -h / 2, w, h);
    g.endFill();
  }, []);

  if (!match?.hash || !id) return <div>Conectando à sala...</div>;

  return (
    <Application
      width={viewport.width}
      height={viewport.height}
      background={"#0a1120"}
    >
      {/* Centro da tela é (0, 0) do mundo */}
      <pixiContainer x={viewport.width / 2} y={viewport.height / 2}>
        {map.map((p, i) => (
          <pixiGraphics
            key={i}
            x={p.x}
            y={p.y}
            draw={(g) => drawPlatform(g, p)}
          />
        ))}

        <PlayerBall
          id={id}
          isLocal
          ws={ws}
          map={map}
          snapshot={players[id]}
          lastAck={lastAcks[id]}
        />

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
