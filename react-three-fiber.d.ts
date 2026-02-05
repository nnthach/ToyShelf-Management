import type { Object3D } from "three";
import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        primitive: {
          object: Object3D;
        };
      }
    }
  }
}

export {};
