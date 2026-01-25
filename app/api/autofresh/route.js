
import { NextResponse } from "next/server";
import connect from "./../.././../db";
import PostModel from "../../../models/post";
import MovieModel from "../../../models/series";
import { Console } from "console";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { Server } from "socket.io"
import { createServer } from "http"



export async function GET() {
  const encoder = new TextEncoder()
const changestream=MovieModel.watch()
  const stream = new ReadableStream({
    start(controller) {
      // when DB changes
      changestream.on("change", (ch) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(ch)}\n\n`)
          
        )
        console.log(ch)
      })
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  })
}
