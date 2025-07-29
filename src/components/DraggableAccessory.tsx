import React, { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

interface DraggableAccessoryProps {
  children: React.ReactNode;
  position: [number, number, number];
  onPositionChange: (position: [number, number, number]) => void;
  bounds?: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
  enabled?: boolean;
}

export const DraggableAccessory: React.FC<DraggableAccessoryProps> = ({
  children,
  position,
  onPositionChange,
  bounds,
  enabled = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const dragStartPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const dragStartMouse = useRef<THREE.Vector2>(new THREE.Vector2());

  // Convert screen coordinates to world coordinates
  const getWorldPosition = useCallback(
    (clientX: number, clientY: number): THREE.Vector3 => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Create a raycaster from camera through mouse position
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(x, y), camera);

      // Create an invisible plane to intersect with
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      ray.ray.intersectPlane(plane, intersectPoint);

      return intersectPoint;
    },
    [camera, gl.domElement]
  );

  // Apply bounds constraints
  const applyBounds = useCallback(
    (pos: THREE.Vector3): THREE.Vector3 => {
      if (!bounds) return pos;

      return new THREE.Vector3(
        THREE.MathUtils.clamp(pos.x, bounds.x[0], bounds.x[1]),
        THREE.MathUtils.clamp(pos.y, bounds.y[0], bounds.y[1]),
        THREE.MathUtils.clamp(pos.z, bounds.z[0], bounds.z[1])
      );
    },
    [bounds]
  );

  const bind = useDrag(
    ({ active, event, xy: [clientX, clientY] }) => {
      if (!enabled) return;

      // Prevent orbit controls from interfering
      if (event) {
        event.stopPropagation();
      }

      if (active && !isDragging.current) {
        isDragging.current = true;
        const worldPos = getWorldPosition(clientX, clientY);
        dragStartPosition.current.copy(worldPos);
        dragStartMouse.current.set(clientX, clientY);
      } else if (!active && isDragging.current) {
        isDragging.current = false;
        dragStartPosition.current.set(0, 0, 0);
      }

      if (active && isDragging.current && groupRef.current) {
        const currentWorldPos = getWorldPosition(clientX, clientY);
        const delta = currentWorldPos.clone().sub(dragStartPosition.current);

        const newPosition = new THREE.Vector3(...position).add(delta);
        const constrainedPosition = applyBounds(newPosition);

        // Update mesh position
        groupRef.current.position.copy(constrainedPosition);

        // Call callback
        onPositionChange([
          constrainedPosition.x,
          constrainedPosition.y,
          constrainedPosition.z,
        ]);

        dragStartPosition.current.copy(currentWorldPos);
      }
    },
    {
      pointer: { capture: true },
    }
  );

  return (
    <group
      ref={groupRef}
      position={position}
      {...bind()}
      onPointerOver={(e) => {
        if (enabled) {
          e.stopPropagation();
          gl.domElement.style.cursor = 'grab';
        }
      }}
      onPointerOut={(e) => {
        if (enabled) {
          e.stopPropagation();
          gl.domElement.style.cursor = 'auto';
        }
      }}
      onPointerDown={(e) => {
        if (enabled) {
          e.stopPropagation();
          gl.domElement.style.cursor = 'grabbing';
        }
      }}
      onPointerUp={(e) => {
        if (enabled) {
          e.stopPropagation();
          gl.domElement.style.cursor = 'grab';
        }
      }}
    >
      {/* Visual feedback when dragging */}
      {isDragging.current && (
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial
            color="#ff8c00"
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* The actual accessory */}
      <group>{children}</group>
    </group>
  );
};