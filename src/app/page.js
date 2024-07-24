'use client'

import dynamic from 'next/dynamic';

const ThreeGLBViewer = dynamic(() => import('../components/ThreeGLBViewer'), { ssr: false });

export default function Home() {
  
  return (
    <main className=" items-center p-24">
      <div>Sequence Diagram Maker</div>
      <ThreeGLBViewer/>
    </main>
  );
}//<Mermaid chart={mermaidChart} />
