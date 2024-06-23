import Mermaid from "mermaid";

export default function CustomDiagram() {
    const diagramCode = "graph TD A[Start] --> B[End]";
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
            <Mermaid>diagramCode</Mermaid>
        </div>
      </main>
    );
  }
  