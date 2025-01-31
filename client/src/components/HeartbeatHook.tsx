import { useEffect } from "react";
import { User } from "../models/types";

/**
 * Sends a heartbeat as long as the user is set and not null
 * Used for detecting if user is online or not
 * @param user
 */
export const useHeartbeat = (user: User | null) => {
  useEffect(() => {
    if (!user) return;

    let isUnloading = false;

    const sendHeartbeat = async () => {
      try {
        console.log("Sending Heartbeat");
        await fetch("/api/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: user.name }),
        });
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    };

    const handleBeforeUnload = () => {
      isUnloading = true;
      navigator.sendBeacon("/api/offline", JSON.stringify({ name: user.name }));
    };

    // Initial heartbeat
    sendHeartbeat();

    // Regular heartbeats
    const heartbeatInterval: NodeJS.Timeout = setInterval(sendHeartbeat, 15000);

    // Tab close detection - Unreliable
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (!isUnloading) {
        // User navigated away but tab remains open
        fetch("/api/offline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: user.name }),
          keepalive: true, // Ensures request completes
        });
      }
    };
  }, [user]);
};
