'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Mermaid = dynamic(() => import('@/components/mermaid'), { ssr: false });

export default function Editor() {
  const [mermaidChart, setMermaidChart] = useState(`sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
  `);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const arrowTypes = ["->>", "-->>", "--x", "-x", "->", "-->"];
  const [selectedArrow, setSelectedArrow] = useState('->>');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [toItem, setToItem] = useState(null);
  const [arrowText, setArrowText] = useState('');

  const [arrowList, setArrowList] = useState([]);

  useEffect(() => {
    if(arrowList.length == 0){
      //Set to default
      setMermaidChart(`sequenceDiagram
      Alice ->> Bob: Hello Bob, how are you?
      Bob-->>John: How about you John?
      Bob--x Alice: I am good thanks!
      Bob-x John: I am good thanks!
      Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

      Bob-->Alice: Checking with John...
      Alice->John: Yes... John, how are you?
      `)
      return
    }
    let text = `sequenceDiagram
      `
    for (let arrows of arrowList) {
      text += arrows[0] + arrows[3] + arrows[1] + ":" + arrows[2] + `
      `;
    }
    setMermaidChart(text)
  }, [arrowList])

  const change = (e) => {
    setMermaidChart(e.target.value);
  };

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const removeArrowList = (index) => {
    setArrowList(arrowList.filter((_, i) => i !== index));
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(arrowList);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setArrowList(reorderedItems);

  };

  const addArrow = () => {
    if (selectedItem && toItem && arrowText.trim()) {
      setArrowList([...arrowList, [ selectedItem, toItem, arrowText.trim(), selectedArrow]]);
      setArrowText('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default newline behavior

      const { selectionStart, selectionEnd, value } = event.target;
      const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(currentLineStart, selectionStart);
      const leadingSpaces = currentLine.match(/^\s*/)[0];

      const newValue = 
        value.substring(0, selectionStart) + '\n' + leadingSpaces + value.substring(selectionEnd);

      setMermaidChart(newValue);

      // Move the cursor to the new position
      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = selectionStart + leadingSpaces.length + 1;
      }, 0);
    }
  };

  const downloadFile = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  
  const handleExport = () => {
    let text = ''
    for (let arrows of arrowList) {
      text += arrows[0] + "," + arrows[3] + "," + arrows[1] + "," + arrows[2] + `
      `;
    }
    downloadFile('sequencediagram.txt', text);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const importedData = content;
        setMermaidChart(importedData);
      } catch (error) {
        console.error('Error parsing imported data:', error);
        alert('An error occurred while reading the data');
        alert('An error occurred while reading the data:', error);
      }
    };
  
    reader.readAsText(file);
  };  
  
  return (
    <main>
      <div>
        <button onClick={handleExport}>Export Data</button>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <button onClick={() => document.getElementById('fileInput').click()}>Import Data</button>
      </div>
      <div className="full flex justify-center">
        <span className="half flex-1">
          <textarea
            value={mermaidChart}
            onChange={change}
            onKeyDown={handleKeyDown}
            rows={10}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </span>
        <span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem}>Add Item</button>

          {items.map((item, index) => (
              <li key={index}>
                {item}
                <button onClick={() => removeItem(index)}>Remove</button>
                <button onClick={() => setSelectedItem(item)}>Select</button>
                <button onClick={() => setToItem(item)}>Select</button>
              </li>
            ))}
          <div>
              <h3>Add Text for: {selectedItem} to {toItem}</h3>
              <input
                type="text"
                value={arrowText}
                onChange={(e) => setArrowText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addArrow()}
              />
              <button onClick={addArrow}>Add Text</button>
          </div>

          <h2>Second List</h2>
          <ul>

            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={arrowList.map((item, index) => item + index)}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ listStyle: 'none', padding: 0 }}
                >
                  {arrowList.map((item, index) => (
                    <Draggable key={item + index} draggableId={item + index} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            padding: '8px',
                            margin: '0 0 8px 0',
                            backgroundColor: '#000',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                          }}
                        >
                          {item[0]} {item[3]} {item[1]}:{item[2]}
                          <button onClick={() => removeArrowList(index)}>Remove</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          </ul>
        </span>
        <span className="half flex-1">
          <Mermaid chart={mermaidChart} key={mermaidChart} />
        </span>
      </div>
    </main>
  );
}
