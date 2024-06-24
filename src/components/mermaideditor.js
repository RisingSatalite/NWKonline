'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Mermaid = dynamic(() => import('@/components/mermaid'), { ssr: false });

export default function Editor() {
  const [mermaidChart, setMermaidChart] = useState(`
    mindmap
      root((mindmap))
        Origins
          Long history
          ::icon(fa fa-book)
          Popularisation
            British popular psychology author Tony Buzan
        Research
          On effectivness<br/>and features
          On Automatic creation
            Uses
                Creative techniques
                Strategic planning
                Argument mapping
        Tools
          Pen and paper
          Mermaid
  `);

  const change = (e) => {
    setMermaidChart(e.target.value);
  };

  return (
    <main>
      <span class="half">
        <textarea
            value={mermaidChart}
            onChange={change}
            rows={10}
            className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
      </span>
      <span class="half">
        <Mermaid chart={mermaidChart} />
      </span>
    </main>
  );
}
