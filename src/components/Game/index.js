// client
"use client";

import { Application, extend, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Engine, Runner, Bodies, Composite, Body, Events } from "matter-js";
import Interface from "../Interface";
import { useWallet } from "./../../../context/WalletContext"; // ajuste para o caminho correto
import GameStatus from "./Status";

const PLAYER_BOUNCE = 0.3; // bounce ao cair
const IMPACT_THRESHOLD = 6; // velocidade mínima para reação de impacto
const IMPACT_FORCE = 0.01; // força aplicada ao quique entre bolas
const RIGID_MIN_DURATION = 300; // tempo mínimo ativo após soltar

extend({ Container, Graphics, Text });

function hexTo0x(hex) {
  return hex?.replace("#", "0x");
}

function PlayerBall({ id, isLocal, ws, map, snapshot, lastAck, status }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const engineRef = useRef(null);
  const bodyRef = useRef(null);
  const runnerRef = useRef(null);
  const keysRef = useRef({});
  const inputBufferRef = useRef([]);
  const myPosRef = useRef({ x: 0, y: 0 });
  const canJumpRef = useRef(false);
  const [isRigid, setIsRigid] = useState(false);
  const rigidReleaseTimerRef = useRef(0); // ms
  const lastReconciliationTimeRef = useRef(0);

  // REMOTE PLAYER
  if (!isLocal) {
    const draw = useCallback(
      (g) => {
        g.clear();
        g.beginFill(
          snapshot?.alive ? hexTo0x(snapshot?.color) || 0x40a0f0 : 0x666666
        ); // morto = cinza
        g.lineStyle(2, snapshot?.isRigid ? 0x000000 : 0x40a0f0, 1);
        g.drawCircle(0, 0, 20);
        g.endFill();
      },
      [snapshot?.alive]
    );
    return (
      <>
        <pixiGraphics draw={draw} x={snapshot?.x ?? 0} y={snapshot?.y ?? 0} />
        <pixiText
          text={snapshot?.username ?? ""}
          x={snapshot?.x ?? 0}
          y={(snapshot?.y ?? 0) - 30} // sobe o texto 30px acima do círculo
          anchor={0.5} // centraliza horizontalmente
          style={{ fill: 0xffffff, fontSize: 14, fontWeight: "bold" }}
        />
      </>
    );
  }

  // LOCAL PLAYER
  useEffect(() => {
    const engine = Engine.create();
    engine.gravity.y = 0.6;
    const runner = Runner.create();
    const body = Bodies.circle(0, 0, 20, {
      restitution: PLAYER_BOUNCE,
      friction: 0.05,
    });
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
          if (other.isStatic) {
            const verticalDiff = body.position.y - other.position.y;
            if (verticalDiff < 25) {
              canJumpRef.current = true;
            }
          }
        }
      });
    });

    const down = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.code === "Space") keysRef.current["space"] = true;
    };
    const up = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.code === "Space") keysRef.current["space"] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [map]);

  const applyInput = useCallback(
    (body, input, canJump = false, isRigid = false) => {
      let force = 0.0005; // movimento lateral mais lento
      let jumpForce = -0.03;

      if (isRigid) {
        // Fica mais pesado (menos responsivo)
        force *= 0.5;
        jumpForce *= 0.7;
      }

      if (input.keys.a)
        Body.applyForce(body, body.position, { x: -force, y: 0 });
      if (input.keys.d)
        Body.applyForce(body, body.position, { x: force, y: 0 });
      if (input.keys.w && canJump) {
        Body.applyForce(body, body.position, { x: 0, y: jumpForce });
      }
    },
    []
  );

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (isRigid) {
      Body.setMass(body, 10);
    } else {
      Body.setMass(body, 1);
    }
  }, [isRigid]);

  useTick(() => {
    const body = bodyRef.current;
    if (!body) return;

    const now = Date.now();

    const input = {
      keys: {
        a: keysRef.current["a"],
        d: keysRef.current["d"],
        w: keysRef.current["w"],
        space: keysRef.current["space"] || false,
      },
      timestamp: now,
    };

    inputBufferRef.current.push(input);
    applyInput(body, input, canJumpRef.current, isRigid);

    // ===== Rigid logic with min duration =====
    if (input.keys.space) {
      setIsRigid(true);
      rigidReleaseTimerRef.current = RIGID_MIN_DURATION;
    } else if (rigidReleaseTimerRef.current > 0) {
      rigidReleaseTimerRef.current -= 1000 / 60; // assume 60fps
      setIsRigid(true);
    } else {
      setIsRigid(false);
    }
    // =========================================

    if (input.keys.w && canJumpRef.current) {
      canJumpRef.current = false;
    }

    const payload = { type: "input", ...input };
    ws?.send(JSON.stringify(payload));

    const pos = body.position;
    // setPosition({ x: pos.x, y: pos.y });
    // myPosRef.current = { x: pos.x, y: pos.y };

    if (snapshot) {
      setPosition({ x: snapshot.x, y: snapshot.y });
      myPosRef.current = { x: snapshot.x, y: snapshot.y };
    }

    if (Math.abs(pos.y) > 1000) {
      Body.setPosition(body, { x: 0, y: 0 });
      Body.setVelocity(body, { x: 0, y: 0 });
    }
  });

  // reconciliation
  useEffect(() => {
    if (!snapshot || !bodyRef.current || lastAck == null) return;

    const now = Date.now();
    const minInterval = 100; // só reconcilia a cada 100ms

    if (now - lastReconciliationTimeRef.current < minInterval) {
      return;
    }
    console.log(
      "Tempo desde última reconciliação:",
      now - lastReconciliationTimeRef.current,
      "ms"
    );

    const inputsToReplay = inputBufferRef.current.filter(
      (input) => input.timestamp > lastAck
    );

    if (inputsToReplay.length === 0) {
      // Nenhum input novo foi processado desde o snapshot
      // Melhor não reconciliar ainda — estamos em espera
      return;
    }

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
      applyInput(clonedBody, input, simCanJump, input.keys.space); // space = isRigid
      simCanJump = false;
      Engine.update(simEngine, 1000 / 60);
    }

    // Reconciliação suave
    const body = bodyRef.current;
    const dx = clonedBody.position.x - body.position.x;
    const dy = clonedBody.position.y - body.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const SNAP_THRESHOLD = 80;
    const LERP_THRESHOLD = 10;
    // console.log("Reconciliando... distância =", distance);
    if (distance > SNAP_THRESHOLD) {
      // Snap se completamente fora do eixo
      Body.setPosition(body, clonedBody.position);
      Body.setVelocity(body, clonedBody.velocity);
    } else if (distance > LERP_THRESHOLD) {
      // Interpolação suave se diferença moderada
      const lerpFactor = 0.1; // menor = mais suave
      const newX = body.position.x + dx * lerpFactor;
      const newY = body.position.y + dy * lerpFactor;

      Body.setPosition(body, { x: newX, y: newY });
      Body.setVelocity(body, {
        x:
          body.velocity.x +
          (clonedBody.velocity.x - body.velocity.x) * lerpFactor,
        y:
          body.velocity.y +
          (clonedBody.velocity.y - body.velocity.y) * lerpFactor,
      });
    }

    inputBufferRef.current = inputsToReplay;
  }, [snapshot, lastAck, applyInput, map]);

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(snapshot?.alive ? 0xb3e240 : 0x555555);
      g.lineStyle(2, isRigid ? 0x000000 : 0xb3e240, 1);
      g.drawCircle(0, 0, 20);
      g.endFill();
    },
    [snapshot?.alive, isRigid]
  );

  return (
    <>
      {/* Local (interpolado / reconciliado) */}
      <pixiGraphics draw={draw} x={position.x} y={position.y} />
      <pixiText
          text={snapshot?.username ?? "Local"}
          x={snapshot?.x ?? 0}
          y={(snapshot?.y ?? 0) - 30} // sobe o texto 30px acima do círculo
          anchor={0.5} // centraliza horizontalmente
          style={{ fill: 0xffffff, fontSize: 14, fontWeight: "bold" }}
        />

      {/* Snapshot do servidor - DEBUG */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // g.lineStyle(2, 0xff0000, 1); // contorno vermelho
          g.beginFill(0x000000, 0); // preenchimento transparente
          g.drawCircle(0, 0, 20);
          g.endFill();
        }}
        x={snapshot?.x ?? 0}
        y={snapshot?.y ?? 0}
      />
    </>
  );
}

export default function Sandbox() {
  const { match, user } = useWallet();
  const [ws, setWs] = useState(null);
  const [ping, setPing] = useState(0);
  const [id, setId] = useState(null);
  const [map, setMap] = useState([
    { x: 0, y: 290, w: 800, h: 20 },
    { x: -300, y: 200, w: 120, h: 20 },
    { x: 200, y: 200, w: 120, h: 20 },
    { x: 0, y: 100, w: 180, h: 20 },
    { x: -250, y: -50, w: 100, h: 20 },
    { x: 250, y: -50, w: 100, h: 20 },
    { x: 0, y: -150, w: 150, h: 20 },
  ]);
  const [players, setPlayers] = useState({});
  const [lastAcks, setLastAcks] = useState({});
  const [viewport, setViewport] = useState(null);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({});
  const [roundOver, setRoundOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState({
    type: null,
    data: null,
  });

  const myIdRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conexão WebSocket
  useEffect(() => {
    console.log({
      dev1: "Conectando ao WebSocket da partida:",
      match,
      user,
      ws,
    });
    if (user === null || ws !== null || !match?.hash) return;

    // Railway
    const socket = new WebSocket("ws://localhost:8080");
    // const socket = new WebSocket(
    //   "ws://bouncerz-server-production.up.railway.app"
    // );
    // const socket = new WebSocket("wss://bouncerz-server.onrender.com");
    // const socket = new WebSocket("ws://127.0.0.1:54321/functions/v1/bouncerz-server");
    console.log("🔌 Conectando ao WebSocket...", socket);
    setWs(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", match: match.hash, user }));
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.type) {
        case "welcome":
          setId(data.id);
          myIdRef.current = data.id;
          setMap(data.map);
          setRound(data.round || 1);
          console.log("📥 [welcome]", data);
          setStatus({ type: "welcome", data: data.id });
          break;

        case "snapshot":
          console.log("📥 [snapshot]", data);
          const newPlayers = {};
          const newAcks = {};
          data.players.forEach((p) => {
            newPlayers[p.id] = {
              x: p.x,
              y: p.y,
              alive: p.alive,
              score: p.score,
              isRigid: p.isRigid || false,
              color: p.color || "#40a0f0",
              username: p.username || p.id,
            };
            newAcks[p.id] = p.lastProcessedInput;
          });

          setPlayers(newPlayers);
          setLastAcks(newAcks);
          setScores(data.scores || {});
          setRound(data.round || round);
          break;

        case "start":
          console.log(`🚦 Rodada ${data.round} começou!`);
          setRoundOver(false);
          setWinner(null);
          setStatus({
            type: "start",
            data: data.round,
          });
          setTimeout(() => {
            setStatus({ type: "game", data: null });
          }, 2000);
          break;

        case "scoreUpdate":
          console.log("📊 Score atualizado:", data.scores);
          setScores(data.scores || {});
          setStatus({ type: "scoreUpdate", data: data.scores });
          break;

        case "roundWinner":
          console.log(
            data.winner === "draw"
              ? "⚖️ Rodada empatada"
              : `🏆 Rodada vencida por: ${data.winner}`
          );
          setRoundOver(true);
          setWinner(data.winner);
          setStatus({ type: "roundWinner", data: data.winner });
          break;

        case "matchWinner":
          console.log(`🎉 Vencedor da partida: ${data.winner}`);
          setRoundOver(true);
          setWinner(data.winner);
          setStatus({ type: "matchWinner", data: data.winner });
          break;

        case "pongTest":
          const now = Date.now();
          const rtt = now - data.clientTime; // ida + volta
          const oneWay = rtt / 2; // latência aproximada
          console.log(`📡 Now: ${now}ms - Server: ${data.clientTime}ms`);
          console.log(`📡 Ping: ${oneWay}ms`);
          setPing(oneWay);
          break;
        default:
          console.log("📨 Mensagem desconhecida:", data);
      }
    };

    return () => socket.close();
  }, [user, match]);

  function sendPing() {
    const now = Date.now();
    console.log("Ping enviado:", now);
    ws.send(JSON.stringify({ type: "pingTest", time: now }));
  }

  useEffect(() => {
    if (!ws) return;

    const interval = setInterval(sendPing, 3000);
    return () => clearInterval(interval);
  }, [ws]);

  const drawPlatform = useCallback((g, { w, h }) => {
    g.clear();
    g.beginFill(0x3d6c49);
    g.drawRect(-w / 2, -h / 2, w, h);
    g.endFill();
  }, []);

  if (!viewport) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Interface />
      <GameStatus status={status} />
      {status.type === "game" ? (
        <div className="fixed top-3 right-3 text-emerald-600 border border-emerald-600 bg-emerald-200 p-2 rounded-2xl text-xs font-semibold">
          Ping: {ping} ms
        </div>
      ) : (
        <></>
      )}
      {/* HUD */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          zIndex: 10,
          fontFamily: "monospace",
        }}
      >
        <div>Round: {round}</div>
        <div>
          Placar:
          {Object.entries(scores).map(([pid, pts]) => (
            <div key={pid}>
              {pid === id ? "You" : players?.[pid]?.username}: {pts}
            </div>
          ))}
        </div>
      </div>

      {/* <p>x={viewport.width / 2} y={viewport.height / 2}</p> */}

      {/* Jogo */}
      <Application
        width={viewport.width}
        height={viewport.height}
        background={"#0a1120"}
      >
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
            status={status}
            id={id}
            isLocal
            ws={ws}
            map={map}
            snapshot={players[id] || { x: 0, y: 0, alive: true }}
            lastAck={lastAcks[id] || null}
          />

          {Object.entries(players).map(([pid, snap]) =>
            pid === id ? null : (
              <PlayerBall
                status={status}
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
    </div>
  );
}
