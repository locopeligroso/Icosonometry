import { OrthographicCamera, PerspectiveCamera, SoftShadows } from '@react-three/drei';
import { useControls } from 'leva';
import { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";
import MyGrid from "./utils/MyGrid";
import { cube, plane } from "./utils/geometries.js";
import { material } from "./utils/materials.js";

export default function App() {
  const [isInFocus, setisInFocus] = useState(false);

  const cameraRef = useRef();
  const perspectiveCameraRef = useRef();
  const target = useRef();
  const cubeRefOne = useRef();
  const cubeRefTwo = useRef();

  const { showGrid } = useControls("grid", { showGrid: false });
  const { toggleCamera } = useControls("camera", { toggleCamera: true });

  useEffect(() => {
    if (cameraRef.current && target.current) {
      cameraRef.current.lookAt(target.current.position);
    }
  }, [toggleCamera]);

  useEffect(() => {
    if (perspectiveCameraRef.current) {
      perspectiveCameraRef.current.lookAt(0, 0, 0);
    }
  }, [toggleCamera]);

  function resetCamera() {
    gsap.to(target.current.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1
    });

    gsap.to(cameraRef.current, {
      zoom: 100,
      duration: 1,
      onUpdate: () => {
        cameraRef.current.updateProjectionMatrix();
      }

    })

    setisInFocus(false);
  }

  function focusOnCubeOne(ref, zoom) {
    if (!isInFocus && ref.current) {
      console.log(ref.current)
      gsap.to(target.current.position, {
        x: ref.current.position.x,
        y: ref.current.position.y,
        z: ref.current.position.z,
        duration: 1
      });

      gsap.to(cameraRef.current, {
        zoom,
        duration: 1,
        onUpdate: () => {
          cameraRef.current.updateProjectionMatrix();
        }
      });
      setisInFocus(true);
    } else {
      resetCamera()
    }
  }

  return (
    <>
      {toggleCamera ? (
        <group ref={target} position={[0, 0, 0]}>
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
          ref={perspectiveCameraRef}
          position={[10, 10, 10]}
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
        onClick={() => focusOnCubeOne(cubeRefOne, 200)}
        material={material}
        castShadow
        geometry={cube}
        position={[3, 0.5, 5]}
      />

      <mesh
        ref={cubeRefTwo}
        onClick={() => focusOnCubeOne(cubeRefTwo, 200)}
        castShadow
        geometry={cube}
        position={[-3, 0.5, -2]}
      />

      <mesh
        receiveShadow
        position={[1, 0.001, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={50}
        material={material}
        geometry={plane}
      />
    </>
  )
}

