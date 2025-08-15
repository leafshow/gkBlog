import { useEffect, useState } from "react";

import { Content } from "@/contents/index/CleanIntuitive";

export const useAnimateContent = (content: Array<Content>) => {
  const [currentState, setCurrentState] = useState<Content>(content[0]);
  const [isUserClick, setIsUserClick] = useState(false);

  useEffect(() => {
    let animateState: NodeJS.Timeout | null = null;
    let timeOutState: NodeJS.Timeout | null = null;

    if (isUserClick) {
      timeOutState = setTimeout(() => {
        animateState = setInterval(() => {
          setCurrentState(
            (prev) =>
              content[
                content.indexOf(prev) < content.length - 1
                  ? content.indexOf(prev) + 1
                  : 0
              ]
          );
        }, 1000);

        setIsUserClick(false);
      }, 5000);
    } else {
      animateState = setInterval(() => {
        setCurrentState(
          (prev) =>
            content[
              content.indexOf(prev) < content.length - 1
                ? content.indexOf(prev) + 1
                : 0
            ]
        );
      }, 1500);
    }

    return () => {
      if (animateState) {
        clearInterval(animateState);
      }
      if (timeOutState) {
        clearTimeout(timeOutState);
      }
    };
  }, [content, isUserClick, currentState]);
  return { setIsUserClick, currentState, setCurrentState };
};
