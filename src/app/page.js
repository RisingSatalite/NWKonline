import dynamic from 'next/dynamic';

const Mermaid = dynamic(() => import('@/components/mermaid'), { ssr: false });

export default function Home() {
  const mermaidChart = `
    graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
  `;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Hi</div>
      <Mermaid chart={mermaidChart} />
    </main>
  );
}