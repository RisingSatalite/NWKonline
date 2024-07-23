'use client'

import dynamic from 'next/dynamic';

const ThreeCube = dynamic(() => import('../components/threecube'), { ssr: false });

export default function Home() {
  
  return (
    <main className=" items-center p-24">
      <div>Sequence Diagram Maker</div>
      <ThreeCube/>
    </main>
  );
}//<Mermaid chart={mermaidChart} />
