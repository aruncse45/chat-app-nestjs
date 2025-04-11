import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

const ioHandler = (req: Request) => {
    if (process.env.NODE_ENV !== "production") {
        (global as any).io = (global as any).io || new Server(4000, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
    }

    return NextResponse.json({ success: true });
};

export async function GET(req: Request) {
    return ioHandler(req);
}

export async function POST(req: Request) {
    return ioHandler(req);
}