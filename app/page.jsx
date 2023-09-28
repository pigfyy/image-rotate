"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RotateCcw, RotateCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const App = () => {
  const { toast } = useToast();
  const [imgData, setImgData] = useState("");

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData;
    const items = clipboardData.items;

    for (const item of items) {
      if (item.type === "image/png" || item.type === "image/jpeg") {
        const file = item.getAsFile();
        const reader = new FileReader();

        reader.onload = () => {
          setImgData(reader.result);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const rotateImage = async (degrees) => {
    if (!imgData) return;

    const response = await fetch("/api/rotate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64Image: imgData,
        degrees,
      }),
    });

    const image = (await response.json()).base64Image;

    setImgData("data:image/png;base64," + image);
  };

  const copytoClipboard = async () => {
    function b64toBlob(b64String) {
      const byteCharacters = atob(b64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      return blob;
    }

    if (!imgData) return;

    const blob = b64toBlob(imgData.split(",")[1]);
    const data = [new ClipboardItem({ ["image/png"]: blob })];
    navigator.clipboard.write(data).then(() => {
      toast({
        title: "Image Copied!",
      });
    });
  };

  return (
    <div
      onPaste={handlePaste}
      className="bg-neutral-900 w-full h-screen flex flex-col gap-4 p-4 md:py-10"
    >
      <div className="py-4">
        <p className="text-white font-black text-3xl text-center">
          Control V to Paste
        </p>
        <p className="text-red-500 text-center">
          Click on the screen if it isn&apos;t working
        </p>
      </div>

      <div className="self-center flex gap-4">
        <Button variant="outline" size="icon" onClick={() => rotateImage(270)}>
          <RotateCcw />
        </Button>
        <Button variant="outline" onClick={copytoClipboard}>
          <Copy className="mr-2 h-5 w-5" />
          Copy Image
        </Button>
        <Button variant="outline" size="icon" onClick={() => rotateImage(90)}>
          <RotateCw />
        </Button>
      </div>

      <div className="flex-1 justify-center items-center flex">
        {imgData && (
          <Image
            src={imgData}
            alt="Pasted image"
            width={1000}
            height={1000}
            className="max-w-[60vw] max-h-[60vh] object-contain"
          />
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default App;
