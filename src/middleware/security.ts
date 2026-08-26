import { NextFunction, Request, Response } from "express";
import { RateLimitRole } from "../type.js";
import aj from "../config/arcjet.js";
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "test") return next();

  try {
    const role: RateLimitRole = req.user?.role ?? "guest";

    let limit: number;

    switch (role) {
      case "admin":
        limit = 20;
        break;
      case "teacher":
      case "student":
        limit = 10;
        break;

      default:
        limit = 5;
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
      }),
    );

    const arcjetReq: ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
      },
    };

    const decision = await client.protect(arcjetReq);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too many requests" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot traffic blocked" });
      }
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    console.log("Arject middlewar error: ", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong with security middleware.",
    });
  }
};

export default securityMiddleware;
