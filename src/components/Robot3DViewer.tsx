import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment } from '@react-three/drei';
import { useRobotStore } from '@/stores/robotStore';
import * as THREE from 'three';

// Simple robot arm visualization using primitives
const RobotArm = () => {
  const { currentConfig } = useRobotStore();

  if (!currentConfig) return null;

  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const joints = currentConfig.joints;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#a855f7" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Joint 1 - Base rotation */}
      <group rotation={[0, toRad(joints[0]?.angle || 0), 0]} position={[0, 0.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} />
          <meshStandardMaterial color="#c026d3" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Joint 2 - Shoulder */}
        <group rotation={[toRad(joints[1]?.angle || 0), 0, 0]} position={[0, 0.3, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Joint 3 - Elbow */}
          <group rotation={[toRad(joints[2]?.angle || 0), 0, 0]} position={[0, 1, 0]}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshStandardMaterial color="#8b5cf6" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Joint 4 - Wrist 1 */}
            <group rotation={[0, 0, toRad(joints[3]?.angle || 0)]} position={[0, 0.8, 0]}>
              <mesh position={[0, 0.15, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
                <meshStandardMaterial color="#a855f7" metalness={0.7} roughness={0.3} />
              </mesh>

              {/* Joint 5 - Wrist 2 */}
              <group rotation={[toRad(joints[4]?.angle || 0), 0, 0]} position={[0, 0.3, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
                  <meshStandardMaterial color="#c026d3" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Joint 6 - Wrist 3 / End Effector */}
                <group rotation={[0, toRad(joints[5]?.angle || 0), 0]} position={[0, 0.15, 0]}>
                  <mesh castShadow>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial 
                      color="#06b6d4" 
                      metalness={0.9} 
                      roughness={0.1}
                      emissive="#06b6d4"
                      emissiveIntensity={0.3}
                    />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const Robot3DViewer = () => {
  return (
    <div className="card-premium rounded-xl overflow-hidden h-[600px]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 3, 3]} fov={50} />
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a855f7" />
        <pointLight position={[5, 2, 5]} intensity={0.5} color="#06b6d4" />

        {/* Environment */}
        <Environment preset="city" />
        
        {/* Grid */}
        <Grid
          infiniteGrid
          cellSize={0.5}
          cellThickness={0.5}
          sectionSize={2}
          sectionThickness={1}
          fadeDistance={20}
          fadeStrength={1}
          cellColor="#4a5568"
          sectionColor="#a855f7"
        />

        {/* Robot */}
        <RobotArm />

        {/* Ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Robot3DViewer;
