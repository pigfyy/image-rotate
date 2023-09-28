import { NextResponse, NextRequest } from "next/server";
import sharp from "sharp";

export async function POST(request) {
  const body = await request.json();
  const degrees = body.degrees;
  const originalImage = body.base64Image;
  const input = await Buffer.from(originalImage.split(",")[1], "base64");

  const buffer = await new Promise((resolve, reject) => {
    sharp(input)
      .rotate(degrees)
      .toBuffer((err, buffer, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
  });

  const resultImage = buffer.toString("base64");

  return NextResponse.json({
    base64Image: resultImage,
  });
}
