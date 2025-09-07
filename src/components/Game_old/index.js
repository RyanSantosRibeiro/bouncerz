"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Circle,
  Rect,
  Group,
  Text,
  Image,
  Line,
} from "react-konva";
import Matter from "matter-js";
import Modal from "../Modal/Modal";
import WalletConnect from "../Wallet";
import Interface from "../Interface";
import { useWallet } from "../../../context/WalletContext";
import useImage from "use-image";
import { createClient } from "../../../utils/supabase/client";

const defaultMaps = [
  {
    platforms: [
      // Base central inferior (chão)
      { x: -400, y: 290, width: 800, height: 20, color: "#6c4f3d" },

      // Plataforma baixa à esquerda
      { x: -300, y: 200, width: 120, height: 20, color: "#3d6c49" },

      // Plataforma baixa à direita
      { x: 200, y: 200, width: 120, height: 20, color: "#3d6c49" },

      // Plataforma média central
      { x: 0, y: 100, width: 180, height: 20, color: "#3d6c49" },

      // Plataforma alta à esquerda
      { x: -250, y: -50, width: 100, height: 20, color: "#3d6c49" },

      // Plataforma alta à direita
      { x: 250, y: -50, width: 100, height: 20, color: "#3d6c49" },

      // Plataforma topo centro
      { x: 0, y: -150, width: 150, height: 20, color: "#3d6c49" },
    ],
  },
];

export default function Game() {
  const supabase = createClient();
  const [dimensions, setDimensions] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 100 });
  const playerPosRef = useRef({ x: 100, y: 100 });
  const platformBodies = useRef([]);
  const { user, match } = useWallet();

  const engine = useRef(
    Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0.25,
      },
    })
  );
  const playerRef = useRef();
  const [fps, forceRender] = useState(0);
  const opponentBodies = useRef({});
  const opponentsMeta = useRef({});
  const lastMoveSent = useRef(null);
  const keys = useRef({});
  const isJumping = useRef(false);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const maxSpeed = 2;
  const accel = 0.015;
  const friction = 0.02;
  const frictionAirPlayer = 0.08;
  const canJump = useRef(false);
  const [profileImg] = useImage(user?.profile?.image);
  // Chão centralizado com 50% da largura
  const groundWidth = dimensions.width / 2;
  const groundHeight = 80;
  const playerOptions = {
    restitution: 0.1,
    friction: 0.13,
    frictionAir: frictionAirPlayer,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      forceRender((n) => n + 1);
    }, 1000 / 60); // ~30 FPS (ajuste como quiser)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(velocityX.current)
    sendMove();
  }, [fps]);

  // Cria Coneção
  useEffect(() => {
    if (!match) return;
    const channel = supabase.channel(`match-${match.hash}`, {
      config: {
        broadcast: {
          self: false,
        },
      },
    });

    channel
      .on("broadcast", { event: "moves" }, ({ payload }) => {
        if (!payload?.userId || !payload?.move || payload?.userId === user?.id)
          return;

        const { userId, move, name, image } = payload;

        // Atualiza metadata
        opponentsMeta.current[userId] = { name, image };

        // 🔧 Cria o body do oponente se ainda não existir
        if (!opponentBodies.current[payload.userId]) {
          const body = Matter.Bodies.circle(
            payload.move.x,
            payload.move.y,
            20,
            {
              ...playerOptions,
              isStatic: false, // permite colisão
              label: "opponent_" + payload.userId,
            }
          );
          opponentBodies.current[payload.userId] = body;
          Matter.World.add(engine.current.world, [body]);
        }

        // 🔁 Sincroniza a posição do body com os dados recebidos
        const opponentBody = opponentBodies.current[payload.userId];
        const dx = payload.move.x - opponentBody.position.x;
        const dy = payload.move.y - opponentBody.position.y;
        Matter.Body.setVelocity(opponentBody, {
          x: dx * 0.4,
          y: dy * 0.4,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [match]);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window?.innerWidth, height: window?.innerHeight });
    };
    window.addEventListener("resize", updateSize);

    const world = engine.current.world;

    const player = Matter.Bodies.circle(100, 100, 20, {
      ...playerOptions,
      label: "player",
    });
    playerRef.current = player;

    // Chão
    const ground = Matter.Bodies.rectangle(
      dimensions.width / 2, // centro horizontal
      dimensions.height - groundHeight / 2, // parte de baixo
      groundWidth,
      groundHeight,
      {
        isStatic: true,
        label: "ground",
      }
    );

    // Plataformas dinâmicas
    const createdPlatforms = match?.map
      ? match?.map?.platforms.map((p, i) => {
          return Matter.Bodies.rectangle(
            p.x + p.width / 2,
            p.y + p.height / 2,
            p.width,
            p.height,
            {
              isStatic: true,
              label: "platform_" + i,
            }
          );
        })
      : defaultMaps[0]?.platforms.map((p, i) => {
          return Matter.Bodies.rectangle(
            p.x + p.width / 2,
            p.y + p.height / 2,
            p.width,
            p.height,
            {
              isStatic: true,
              label: "platform_" + i,
            }
          );
        });
    platformBodies.current = createdPlatforms;

    Matter.World.add(world, [player, ground, ...createdPlatforms]);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine.current);

    const update = () => {
      // Verifica se o jogador caiu abaixo do chão
      if (player.position.y > dimensions.height + 20) {
        console.log("💀 Player morreu");
        Matter.Body.setPosition(player, { x: 100, y: 100 });
        Matter.Body.setVelocity(player, { x: 0, y: 0 });
        // Aqui você pode resetar, remover do mundo, mostrar game over, etc.
      }
      const { x, y } = player.position;
      // setPlayerPos({ x, y });
      playerPosRef.current = { x, y };

      // Aplicar aceleração lateral
      if (keys.current["ArrowLeft"] || keys.current["KeyA"]) {
        velocityX.current = Math.max(velocityX.current - accel, -maxSpeed);
      } else if (keys.current["ArrowRight"] || keys.current["KeyD"]) {
        velocityX.current = Math.min(velocityX.current + accel, maxSpeed);
      } else {
        // Aplicar atrito para desacelerar
        if (velocityX.current > 0) {
          velocityX.current = Math.max(0, velocityX.current - friction);
        } else if (velocityX.current < 0) {
          velocityX.current = Math.min(0, velocityX.current + friction);
        }
      }

      // Detecta se o jogador está no ar (acima do chão)
      const isAirborne = playerRef.current.velocity.y !== 0;

      // Pressionar ↓ (ou S) acelera a queda
      if (isAirborne && (keys.current["ArrowDown"] || keys.current["KeyS"])) {
        velocityY.current = Math.max(velocityY.current + 0.002, +0.1);
      } else if (
        isAirborne &&
        (keys.current["ArrowUp"] || keys.current["KeyW"])
      ) {
        velocityY.current = Math.max(velocityY.current - 0.014, -0.08); // quase sem resistência no ar (queda rápida)
      } else {
        velocityY.current = 0;
      }

      // Aplicar velocidade horizontal
      Matter.Body.setVelocity(player, {
        x: velocityX.current,
        y: player.velocity.y + velocityY.current,
      });

      requestAnimationFrame(update);
    };

    update();

    const handleKeyDown = (e) => {
      keys.current[e.code] = true;

      if ((e.code === "ArrowUp" || e.code === "KeyW") && canJump.current) {
        Matter.Body.setVelocity(playerRef.current, {
          x: playerRef.current.velocity.x,
          y: -14.5, // suaviza o salto
        });
        canJump.current = false; // bloqueia novo salto até nova colisão
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };

    Matter.Events.on(engine.current, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        if (
          labels.includes("player") &&
          (labels.some((l) => l.startsWith("platform")) ||
            labels.includes("ground"))
        ) {
          // Verifica se a colisão está por baixo do jogador (player está em cima da plataforma)
          const playerBody =
            pair.bodyA.label === "player" ? pair.bodyA : pair.bodyB;
          const otherBody = playerBody === pair.bodyA ? pair.bodyB : pair.bodyA;

          if (playerBody.position.y < otherBody.position.y) {
            canJump.current = true;
          }
        }
      });
    });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      Matter.World.clear(world);
      Matter.Engine.clear(engine.current);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dimensions, user, match]);

  const sendMove = async () => {
    if (!match) return;
    const move = {
      userId: user?.id,
      x: playerPosRef.current.x,
      y: playerPosRef.current.y,
    };

    const channel = supabase
      .getChannels()
      .find((c) => c.topic === `realtime:match-${match.hash}`);

    if (channel) {
      await channel.send({
        type: "broadcast",
        event: "moves",
        payload: {
          userId: user.id,
          name: user.profile.username,
          image: user.profile.image,
          move,
        },
      });
    }
  };

  const DynamicImageComponent = ({ imageUrl }) => {
    if (imageUrl == undefined || imageUrl == null) {
      return <Circle x={0} y={0} radius={20} fill="#3abdf8" />;
    }
    const [opponentImg] = useImage(imageUrl); // Load the image from the provided URL

    return (
      <Circle
        x={0}
        y={0}
        radius={20}
        fill="blue"
        fillPatternImage={opponentImg}
        fillPatternScale={{
          x: 40 / opponentImg?.width,
          y: 40 / opponentImg?.height,
        }}
        fillPatternOffset={{
          x: opponentImg?.width / 2,
          y: opponentImg?.height / 2,
        }}
      />
    );
  };

  const DebugGrid = ({ width = 800, height = 600, spacing = 100 }) => {
    const lines = [];

    // Linhas verticais
    for (let x = -width; x <= width; x += spacing) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, -height, x, height]}
          stroke="#333"
          strokeWidth={0.5}
          dash={[4, 4]}
        />
      );
    }

    // Linhas horizontais
    for (let y = -height; y <= height; y += spacing) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[-width, y, width, y]}
          stroke="#333"
          strokeWidth={0.5}
          dash={[4, 4]}
        />
      );
    }

    // Linha do eixo central (x e y)
    // lines.push(
    //   <Line key="x-axis" points={[-width, 0, width, 0]} stroke="red" strokeWidth={1} />,
    //   <Line key="y-axis" points={[0, -height, 0, height]} stroke="red" strokeWidth={1} />
    // );

    return <>{lines}</>;
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Interface />

      <Stage
        width={dimensions.width}
        height={dimensions.height}
        style={{ background: "#0a1120" }}
      >
        <Layer offsetX={-dimensions.width / 2} offsetY={-dimensions.height / 2}>
          <DebugGrid width={1000} height={1000} spacing={100} />
          {/* Jogador */}
          <Group x={playerPosRef.current.x} y={playerPosRef.current.y}>
            {/* Imagem redonda com Circle (colide) */}
            {user && user?.profile?.image != null && profileImg ? (
              <Circle
                x={0}
                y={0}
                radius={20}
                fillPatternImage={profileImg}
                fillPatternScale={{
                  x: 40 / profileImg.width,
                  y: 40 / profileImg.height,
                }}
                fillPatternOffset={{
                  x: profileImg.width / 2,
                  y: profileImg.height / 2,
                }}
              />
            ) : (
              <Circle x={0} y={0} radius={20} fill={"#b3e240"} />
            )}

            {/* Texto visual flutuando em cima */}
            <Text
              text="Player"
              fontSize={12}
              fill="white"
              y={-40} // sobe 30px acima do centro do círculo
              x={-20}
              width={40}
              align="center"
              listening={false} // evita interação com mouse
            />
          </Group>
          {/* Oponene */}
          {Object.entries(opponentBodies.current).map(([userId, body]) => {
            const meta = opponentsMeta.current[userId] || {};
            return (
              <Group key={userId} x={body.position.x} y={body.position.y}>
                <DynamicImageComponent imageUrl={meta.image} />
                <Text
                  text={meta.name}
                  fontSize={12}
                  fill="white"
                  y={-40}
                  x={-20}
                  width={40}
                  align="center"
                  listening={false}
                />
              </Group>
            );
          })}
          {/* Plataformas desenhadas */}
          {match
            ? match?.map?.platforms?.map((p, i) => (
                <Rect
                  key={i}
                  x={p.x}
                  y={p.y}
                  width={p.width}
                  height={p.height}
                  fill={p.color}
                />
              ))
            : defaultMaps[0]?.platforms?.map((p, i) => (
                <Rect
                  key={i}
                  x={p.x}
                  y={p.y}
                  width={p.width}
                  height={p.height}
                  fill={p.color}
                />
              ))}
        </Layer>
      </Stage>
    </div>
  );
}
