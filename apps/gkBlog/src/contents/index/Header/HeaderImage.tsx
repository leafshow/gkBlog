/* eslint-disable react/no-unknown-property */
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import clsx from "clsx";
import { m, useAnimationControls } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";

import HeaderImageAnimation from "./HeaderImageAnimation";

// Helper function for smooth transition (lerping)
const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

interface RotatingModelProps {
  onHover: () => void;
  onHoverEnd: () => void;
}

function RotatingModel({ onHover, onHoverEnd }: RotatingModelProps) {
  const { scene } = useGLTF("/assets/images/model.glb");
  const modelRef = useRef(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.1);
  const [targetRotationSpeed, setTargetRotationSpeed] = useState(0.1);
  const [elapsedTime, setElapsedTime] = useState(0);

  useFrame((state, delta) => {
    if (modelRef.current) {
      setElapsedTime((prevTime) => prevTime + delta);
      const smoothSpeed = lerp(
        rotationSpeed,
        targetRotationSpeed,
        Math.min(elapsedTime / 2, 1),
      );
      modelRef.current.rotation.y += smoothSpeed;
      setRotationSpeed(smoothSpeed);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTargetRotationSpeed(0.01);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <primitive
      object={scene}
      scale={[1.6, 1.6, 1.6]}
      position={[0, -1.65, 0]}
      ref={modelRef}
      onPointerOver={onHover}
      onPointerOut={onHoverEnd}
    />
  );
}

function HeaderImage() {
  const controlsHeaderImage = useAnimationControls();
  const controlsHeaderOutline = useAnimationControls();
  const [loaded] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    if (loaded) {
      controlsHeaderImage.start({
        opacity: 1,
        transition: { duration: 0.5 },
      });
    }
  }, [loaded, controlsHeaderImage]);

  useEffect(() => {
    if (isHovering) {
      hoverTimerRef.current = setTimeout(() => {
        setIsButtonVisible(true);
      }, 1500);
    } else if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, [isHovering]);

  const handleHover = () => {
    setIsHovering(true);
  };

  const handleHoverEnd = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    setIsMenuVisible(!isMenuVisible); // 切换菜单的显示状态
  };

  return (
    <div className={clsx("relative h-[590px] w-[603px]")}>
      <div
        className={clsx(
          "from-accent-400/20 via-accent-400/0 absolute top-0 right-0 h-[590px] w-[375px] rounded-full bg-gradient-to-t",
          "dark:from-accent-600/10 dark:via-accent-600/0",
        )}
      >
        <div className={clsx("absolute right-0 bottom-0 overflow-hidden")}>
          <m.div
            className={clsx("absolute z-[10]")}
            initial={{ opacity: 1 }}
            animate={controlsHeaderOutline}
          >
            <HeaderImageAnimation
              onAnimationComplete={() => {
                controlsHeaderOutline.start({
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    delay: 0.15,
                  },
                });
                controlsHeaderImage.start({
                  opacity: 1,
                  transition: {
                    duration: 0.15,
                  },
                });
              }}
            />
          </m.div>
          <m.div
            className={clsx("h-[500px] w-[500px]")}
            initial={{ opacity: 0 }}
            animate={controlsHeaderImage}
            style={{ pointerEvents: "none" }} // 禁用 Canvas 的鼠标事件
          >
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={1.25} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={1}
                />
                <pointLight position={[-10, -10, -10]} intensity={1.5} />
                <RotatingModel
                  onHover={handleHover}
                  onHoverEnd={handleHoverEnd}
                />
                <OrbitControls />
              </Suspense>
            </Canvas>
          </m.div>
        </div>
      </div>

      {isButtonVisible && (
        <m.button
          onClick={handleClick}
          className="absolute bottom-4 right-4 rounded-full bg-blue-500 p-3 text-white shadow-lg transition-colors duration-200 hover:bg-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }} // 动画持续时间
          style={{ zIndex: 100, pointerEvents: "auto" }} // 确保按钮在最上层且可以接收点击事件
        >
          预留彩蛋位
        </m.button>
      )}

      {/* {isMenuVisible && (
        <m.div
          className="absolute bottom-4 left-[calc(100%+10px)] w-60 rounded-lg bg-white p-4 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-bold">这里没有彩蛋</h3>
          <ul>
            <li className="py-2">选项 1</li>
            <li className="py-2">选项 2</li>
            <li className="py-2">选项 3</li>
          </ul>
        </m.div>
      )} */}
    </div>
  );
}

export default HeaderImage;
