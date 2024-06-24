'use client'
import dynamic from 'next/dynamic';

const Mermaid = dynamic(() => import('@/components/mermaid'), { ssr: false });

export default function Editor() {
  var mermaidChart = `
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
  `;
  const change = (e) => {
    mermaidChart = e
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <textarea value={mermaidChart} onChange={(e) => change(e.target.value)}></textarea>
      <Mermaid chart={mermaidChart} />
    </main>
  );
}