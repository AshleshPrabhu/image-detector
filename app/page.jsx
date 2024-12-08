"use client"
import ObjectDetect from "@/components/ObjectDetect";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col p-8">
      <div className="gradient-for-text font-bold text-3xl text-center w-full">Object Detector</div>
      <ObjectDetect/>

    </div>
  );
}
