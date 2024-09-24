import { OrthographicCamera } from '@react-three/drei';
import { Environment } from '@react-three/drei';
import { useControls, folder } from 'leva';

import { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";


import MyGrid from "./utils/MyGrid"
import { cube, plane } from "./utils/geometries.js";
import { material } from "./utils/materials.js";

export default function App() {
  const cameraRef = useRef()
  const target = useRef()
  const cubeRefOne = useRef()



  const { targetX, targetY, targetZ } = useControls("Camera", {
    cameraZoom: {
      value: 100,
      min: 50,
      max: 1000,
      step: 1,
    },
    targetX: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01,
    },
    targetY: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01,
    },
    targetZ: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01,
    }
  });

  useEffect(() => {
    if (cameraRef.current && target.current) {
      cameraRef.current.lookAt(target.current.position);
    }
  }, [targetX, targetY, targetZ]);

  function getPosition() {
    console.log(cubeRefOne.current.position);
    console.log(cameraRef.current)

    gsap.to(target.current.position, {
      x: cubeRefOne.current.position.x,
      y: cubeRefOne.current.position.y,
      z: cubeRefOne.current.position.z,
      duration: 1
    });

    gsap.to(cameraRef.current, {
      zoom: 200,
      duration: 3,
      onUpdate: () => {
        cameraRef.current.updateProjectionMatrix()
      }
    });

  }

  return (
    <>
      <group ref={target} position={[targetX, targetY, targetZ]}>
        <OrthographicCamera
          ref={cameraRef}
          makeDefault
          zoom={100}
          position={[10, 10, 10]}
          rotation={[-Math.PI / 6, Math.PI / 6, 0]}
          near={0.1}
          far={1000}
        />
      </group>
      <MyGrid />
      <Environment preset="city" />

      <mesh
        ref={cubeRefOne}
        onClick={getPosition}
        castShadow
        geometry={cube}
        position={[3, 0.5, 5]}
      />

      <mesh
        castShadow
        geometry={cube}
        position={[-3, 0.5, -2]}
      />
      <mesh
        castShadow
        position={[1, -0.001, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={10}
        material={material}
        geometry={plane}
      />
    </>
  );
}

