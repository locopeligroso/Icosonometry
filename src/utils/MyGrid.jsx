
import { Grid } from '@react-three/drei';

export default function MyGrid() {

  return <>

    <Grid
      position={[0, 0.00001, 0]}
      args={[10, 10]}
      cellSize={0.5}
      cellThickness={1}
      cellColor="black"
      sectionSize={10}
      sectionThickness={2}
      sectionColor="#ffffff"
      fadeDistance={25}
      fadeStrenght={2}
      followCamera={false}
      infiniteGrid={true}
    />

  </>
}
