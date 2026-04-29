import { useEffect, useState } from "react";
import { getChatMembers } from "../services/api";

export function useChatRequestCount(enabled = true) {
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setRequestCount(0);
      return;
    }

    let active = true;

    const loadRequestCount = async () => {
      try {
        const { data } = await getChatMembers();
        if (active) {
          setRequestCount(Array.isArray(data?.incomingRequests) ? data.incomingRequests.length : 0);
        }
      } catch {
        if (active) {
          setRequestCount(0);
        }
      }
    };

    loadRequestCount();
    const intervalId = window.setInterval(loadRequestCount, 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  return requestCount;
}