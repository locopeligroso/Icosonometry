import { OrthographicCamera, PerspectiveCamera, SoftShadows } from '@react-three/drei';
import { useControls } from 'leva';
import { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";
import MyGrid from "./utils/MyGrid";
import { cube, plane } from "./utils/geometries.js";
import { material, planeMaterial } from "./utils/materials.js";

export default function App() {
  const [isInFocus, setisInFocus] = useState(false);

  const cameraRef = useRef();
  const perspectiveCameraRef = useRef();
  const controller = useRef();
  const cubeRefOne = useRef();
  const cubeRefTwo = useRef();

  const { showGrid } = useControls("grid", { showGrid: true });
  const { toggleCamera, cameraRotationX, cameraRotationY, cameraRotationZ } = useControls("camera",
    {
      toggleCamera: false,
      cameraRotationX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: "X" },
      cameraRotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: "Y" },
      cameraRotationZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: "Z" },
    }
  );

  useEffect(() => {
    if (cameraRef.current && controller.current) {
      cameraRef.current.lookAt(controller.current.position);
    }

    if (perspectiveCameraRef.current) {
      perspectiveCameraRef.current.lookAt(0, 0, 0);
    }

  }, [toggleCamera]);

  function focus(ref, zoom) {
    if (controller.current) {
      gsap.to(controller.current.position, {
        x: ref.current.position.x,
        y: ref.current.position.y,
        z: ref.current.position.z,
        ease: "power2.out",
        duration: 1
      });
      gsap.to(controller.current.rotation, {
        y: Math.PI * 0.5, duration: 1.5, ease: "power2.out",
        onUpdate: () => {
          cameraRef.current.updateProjectionMatrix();
        }
      })

      gsap.to(cameraRef.current, {
        zoom,
        duration: 1,
        ease: "power2.out",

        onUpdate: () => {
          cameraRef.current.updateProjectionMatrix();
        }
      });
      setisInFocus(true);
      return
    }
  }

  function resetCamera() {
    gsap.to(controller.current.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "power2.out",

    });

    gsap.to(cameraRef.current, {
      zoom: 100,
      duration: 1,
      ease: "power2.out",

      onUpdate: () => {
        cameraRef.current.updateProjectionMatrix();
      }

    })
    gsap.to(controller.current.rotation, {
      y: 0, duration: 1,
      onUpdate: () => {
        cameraRef.current.updateProjectionMatrix();
      }
    })

    setisInFocus(false);
    return
  }

  function handleFocus(ref, zoom) {
    if (!isInFocus && ref.current) {
      focus(ref, zoom)
    } else {
      resetCamera()
    }
  }

  return (
    <>
      {toggleCamera ? (
        <group ref={controller} position={[0, 0, 0]} rotation={[cameraRotationX, 0, cameraRotationZ]}>
          <OrthographicCamera
            ref={cameraRef}
            makeDefault
            zoom={100}
            position={[10, 10, 10]}
            rotation={[-Math.PI / 6, Math.PI / 6, 0]}
            near={0.1}
            far={100}
          />
        </group>
      ) : (
        <PerspectiveCamera
          makeDefault
          fov={10}
          ref={perspectiveCameraRef}
          position={[40, 40, 40]}
          near={0.1}
          far={1000}
        />
      )}

      <directionalLight
        castShadow
        position={[10, 15, -10]}
        intensity={4}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      <ambientLight intensity={0.5} />
      {/* <SoftShadows size={50} focus={0} samples={20} /> */}
      {showGrid && <MyGrid />}

      <mesh
        ref={cubeRefOne}
        onClick={() => handleFocus(cubeRefOne, 300)}
        material={material}
        castShadow
        geometry={cube}
        position={[3, 0.5, 5]}
      />

      <mesh
        ref={cubeRefTwo}
        onClick={() => handleFocus(cubeRefTwo, 200)}
        castShadow
        position={[-2, 1.5, -2]}
        material={material}
      >
        <boxGeometry args={[1, 3, 1]} />
      </mesh>

      <mesh
        receiveShadow
        position={[1, -0.001, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={50}
        material={planeMaterial}
        geometry={plane}
      />
    </>
  )
}

