"use client";

import React, { useState } from "react";
import Image from "next/image";

const App = () => {
  const [imgData, setImgData] = useState(null);

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

  console.log(imgData);

  return (
    <div
      onPaste={handlePaste}
      className="bg-neutral-900 w-full h-screen flex flex-col"
    >
      <div className="py-4">
        <p className="text-white font-black text-3xl text-center">
          Control V to Paste
        </p>
        <p className="text-red-500 text-center">
          Click on the screen if it isn&apos;t working
        </p>
      </div>

      <div className="flex-1 justify-center items-center flex">
        {imgData && (
          <Image src={imgData} alt="Pasted image" width={500} height={500} />
        )}
      </div>
    </div>
  );
};

export default App;
