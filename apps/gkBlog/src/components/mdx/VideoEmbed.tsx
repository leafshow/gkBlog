import { IframeHTMLAttributes } from "react";

type VideoType = "bilibili" | "youtube";

interface VideoEmbedProps {
  type: VideoType;
  id: string;
}

// 响应式容器的基础样式
const containerStyle: React.CSSProperties = {
  position: "relative",
  paddingBottom: "56.25%", // 16:9 宽高比
  height: 0,
  overflow: "hidden",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
};

// iframe 基础样式
const iframeStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: "none",
};

// 获取平台相关配置
const getPlatformConfig = (
  type: VideoType,
  id: string
): {
  url: string;
  title: string;
  props: IframeHTMLAttributes<HTMLIFrameElement>;
} | null => {
  const commonProps = {
    allowFullScreen: true,
    loading: "lazy" as const,
  };

  switch (type) {
    case "bilibili":
      return {
        url: `https://player.bilibili.com/player.html?isOutside=true&bvid=${id}`,
        title: "Bilibili 视频播放器",
        props: {
          ...commonProps,
          scrolling: "no",
          frameBorder: 0,
        },
      };

    case "youtube":
      return {
        url: `https://www.youtube.com/embed/${id}?rel=0`,
        title: "YouTube 视频播放器",
        props: {
          ...commonProps,
          width: 560,
          height: 315,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      };

    default:
      return null;
  }
};

function VideoEmbed({ type, id }: VideoEmbedProps) {
  const platformConfig = getPlatformConfig(type, id);

  if (!platformConfig) return null;

  return (
    <div style={containerStyle}>
      <iframe
        src={platformConfig.url}
        title={platformConfig.title}
        style={iframeStyle}
        {...platformConfig.props}
      />
    </div>
  );
}

export default VideoEmbed;
