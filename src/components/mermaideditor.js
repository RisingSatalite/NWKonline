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
    console.log("Textarea value changed:", e.target.value);
    setMermaidChart(e.target.value);
  };

  //Example
  const handleTextAreaChange = (e) => {
    const newValue = e.target.value;
    const oldValue = mermaidChart;
    const newLineCount = (newValue.match(/\n/g) || []).length;
    const oldLineCount = (oldValue.match(/\n/g) || []).length;
  
    if (newLineCount > oldLineCount) {
      const diff = newValue.slice(oldValue.length);
      const newlineIndex = diff.indexOf("\n");
      const newPosition = oldValue.length + newlineIndex;
  
      console.log(`New line added at position ${newPosition}!`);
    }
  
    setMermaidChart(newValue);
  };

  return (
    <main>
        <div class="full flex justify-center">
            <span class="half flex-1">
                <textarea
                value={mermaidChart}
                onChange={change}
                rows={10}
                className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
            </span>
            <span class="half flex-1">
                <Mermaid chart={mermaidChart} key={mermaidChart} />
            </span>
        </div>
    </main>
  );
}
