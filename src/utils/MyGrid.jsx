
import { Grid } from '@react-three/drei';

export default function MyGrid() {

  return <>

    <Grid
      position={[0, 0.01, 0]}
      args={[10, 10]}
      cellSize={0.5}
      cellThickness={1}
      sectionSize={10}
      sectionThickness={2}
      fadeDistance={25}
      fadeStrenght={2}
      followCamera={false}
      infiniteGrid={true}
    />

  </>
}
