import React, { useEffect, useRef, useState } from "react";

interface BarrageItem {
  id: string;
  text: string;
  top: number;
  duration: number;
  color: string;
}

interface BarrageProps {
  comments: {
    id: string;
    nick: string;
    commentText: string;
    avatar?: string;
  }[];
  speed?: number;
  density?: number;
}

const Barrage: React.FC<BarrageProps> = function Barrage({
  comments,
  speed = 100,
  density = 1,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationStyleRef = useRef<HTMLStyleElement | null>(null);
  const [barrages, setBarrages] = useState<BarrageItem[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 插入关键帧动画
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes barrageMove {
        from {
          left: 100%;
        }
        to {
          left: -100%;
        }
      }
    `;
    document.head.appendChild(style);
    animationStyleRef.current = style;

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // 随机颜色生成
  const getRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFBE0B",
      "#FB5607",
      "#8338EC",
      "#3A86FF",
      "#06D6A0",
      "#EF476F",
      "#118AB2",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 更新容器尺寸
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 生成弹幕
  useEffect(() => {
    if (!containerRef.current || comments.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      const randomComment =
        comments[Math.floor(Math.random() * comments.length)];

      const { height } = containerSize;
      const top = Math.floor(Math.random() * (height - 30));
      const duration = (containerSize.width + 200) / speed;

      setBarrages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${randomComment.id}`,
          text: `${randomComment.nick}: ${randomComment.commentText}`,
          top,
          duration,
          color: getRandomColor(),
        },
      ]);
    }, 1000 / density);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
    };
  }, [comments, containerSize, density, speed]);

  // 清理过期弹幕
  useEffect(() => {
    const interval = setInterval(() => {
      setBarrages((prev) =>
        prev.filter(
          (item) =>
            Date.now() - parseInt(item.id.split("-")[0], 10) <
            item.duration * 1000
        )
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black/5 rounded-lg mb-8"
      style={{ height: "300px" }}
    >
      {barrages.map((barrage) => (
        <div
          key={barrage.id}
          className="absolute whitespace-nowrap font-medium text-sm md:text-base px-2 py-1 rounded-full backdrop-blur-md"
          style={{
            top: `${barrage.top}px`,
            color: barrage.color,
            animation: `barrageMove ${barrage.duration}s linear forwards`,
          }}
        >
          {barrage.text}
        </div>
      ))}
    </div>
  );
};

export default Barrage;
