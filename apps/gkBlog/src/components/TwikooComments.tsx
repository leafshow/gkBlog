import { useEffect } from "react";

import useTwikoo from "@/hooks/useTwikoo";

function TwikooComments() {
  const { twikooLoaded, initTwikoo } = useTwikoo();

  useEffect(() => {
    if (twikooLoaded) {
      initTwikoo("#tcomment");
    }
  }, [twikooLoaded, initTwikoo]);

  return <div id="tcomment" />;
}

export default TwikooComments;
