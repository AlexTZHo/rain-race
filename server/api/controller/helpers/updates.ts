import { clients, users } from "../users";
import { Request, Response } from "express";

/**
 * Called in on loading client. Used in EventSource in React App
 * @param req
 * @param res
 */
export const subscribeUpdates = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  if (users.length > 0) {
    res.write(`data: ${JSON.stringify(users)}\n\n`);
  }

  req.on("close", () => {
    // Remove on disconnect
    clients.splice(clients.indexOf(res), 1);
  });
};

/**
 * Sends out updated user data for leaderboard updates
 */
export const broadcastUpdates = () => {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(users)}\n\n`);
  });
};
