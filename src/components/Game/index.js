"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Rect, Group, Text, Image } from "react-konva";
import Matter from "matter-js";
import Modal from "../Modal/Modal";
import WalletConnect from "../Wallet";
import Interface from "../Interface";
import { useWallet } from "../../../context/WalletContext";
import useImage from "use-image";

export default function Game() {
  const [dimensions, setDimensions] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 100 });
  const [mapData, setMapData] = useState(null);
  const platformBodies = useRef([]);
  const { user } = useWallet();

  const engine = useRef(
    Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0.5,
      },
    })
  );
  const playerRef = useRef();
  const keys = useRef({});
  const isJumping = useRef(false);
  const velocityX = useRef(0);
  const maxSpeed = 5;
  const accel = 0.15;
  const friction = 0.2;
  const frictionAirPlayer = 0.04;
  const canJump = useRef(false);
  const [profileImg] = useImage(user?.profile?.image);
  // Chão centralizado com 50% da largura
    const groundWidth = dimensions.width / 2;
    const groundHeight = 80;

  useEffect(() => {
    // Load JSON map
    fetch("/maps/map1.json")
      .then((res) => res.json())
      .then((data) => setMapData(data));
  }, []);

  useEffect(() => {
    console.log(mapData);
    if (!mapData || !user) return;

    const updateSize = () => {
      setDimensions({ width: window?.innerWidth, height: window?.innerHeight });
    };
    window.addEventListener("resize", updateSize);

    const world = engine.current.world;

    const player = Matter.Bodies.circle(100, 100, 20, {
      restitution: 0.1,
      friction: 0.13,
      frictionAir: frictionAirPlayer,
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
    const createdPlatforms = mapData.platforms.map((p, i) => {
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
      setPlayerPos({ x, y });

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
        playerRef.current.frictionAir = frictionAirPlayer - 0.03; // quase sem resistência no ar (queda rápida)
      } else if (
        isAirborne &&
        (keys.current["ArrowUp"] || keys.current["KeyW"])
      ) {
        playerRef.current.frictionAir = frictionAirPlayer + 0.02; // quase sem resistência no ar (queda rápida)
      } else {
        playerRef.current.frictionAir = frictionAirPlayer; // padrão
      }

      // Aplicar velocidade horizontal
      Matter.Body.setVelocity(player, {
        x: velocityX.current,
        y: player.velocity.y,
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
  }, [mapData, dimensions, user]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Interface />

      <Stage
        width={dimensions.width}
        height={dimensions.height}
        style={{ background: "#0a1120" }}
      >
        <Layer>
          {/* Jogador */}
          <Group x={playerPos.x} y={playerPos.y}>
            {/* Imagem redonda com Circle (colide) */}
            {profileImg && (
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
          {/* Plataformas desenhadas */}
          {mapData?.platforms.map((p, i) => (
            <Rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.width}
              height={p.height}
              fill="#6c4f3d"
            />
          ))}
          {/* Chão */}
          <Rect
            x={(dimensions.width - groundWidth) / 2}
            y={dimensions.height - groundHeight}
            width={groundWidth}
            height={groundHeight}
            fill="#d8c49c"
          />
        </Layer>
      </Stage>
    </div>
  );
}
