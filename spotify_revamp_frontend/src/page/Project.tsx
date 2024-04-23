import React, { useState, useEffect, useRef} from 'react';
import styles from "./styles.module.css"
import NodeComponent from '../baseBlocks/startingBlock';
import ButtonsComponent from '../sharedComponents/Button';
import EdgeComponent from '../edge/edges';

interface Node {
    id: string;
    numberInputs: number;
    numberOutputs: number;
    prevPosition: { x: number; y: number };
    currPosition: { x: number; y: number };
    inputEdgeIds: string[];
    outputEdgeIDs: string[]; 
}

interface Edge {
    id: string;
    nodeStartId: string;
    nodeEndId: string;
    inputIndex: number;
    outputIndex: number;
    prevStartPosition: { x: number; y: number };
    currStartPosition: { x: number; y: number };
    prevEndPosition: { x: number; y: number };
    currEndPosition: { x: number; y: number };
}

const Playground: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Set default theme to 'light'

    const [isDragging, setIsDragging] = useState(false);
    const [scale, setScale] = useState<number>(1); //can change to user's presets
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragOrigin = useRef({ x: 0, y: 0 });
    const [nodes, setNodes] = useState<Node[]>([]); // Initialize with an empty array of nodes
    const [selectedNode, setSelectedNode] = useState<string | null>(null); 

    const [newEdge, setNewEdge] = useState<Edge | null>(null); 
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
    const [insideInput, setInsideInput] = useState<{
        nodeId: string;
        inputIndex: number;
        positionX: number;
        positionY: number;
    } | null>(null);
    const zoomOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const boardElement = document.getElementById("board");


        const handleWheel = (event: WheelEvent) => {
            event.preventDefault(); // to prevent the page from scrolling
            if (boardElement) {
                const mouseX = event.clientX - position.x;
                const mouseY = event.clientY - position.y;

                // Convert mouse position to a percentage of the element's dimensions
                const scrollSpeedFactor = -0.001; // Adjust this factor to control zoom speed
                const originXPerc = ((mouseX) / 2000) * 100;
                const originYPerc = ((mouseY) / 2000) * 100;
                console.log(originXPerc, originYPerc); 

                zoomOffset.current.x = originXPerc * 2000; 
                zoomOffset.current.y = (mouseY) * scale; 

                boardElement.style.transition = 'transform-origin 0.5s ease'; // Smooth transition for transform-origin
                boardElement.style.transformOrigin = `${originXPerc}% ${originYPerc}%`;
        
                setScale(prevScale => {
                    const newScale = Math.min(Math.max(prevScale + event.deltaY * scrollSpeedFactor, 1), 5);
                    boardElement.style.transform = `scale(${newScale})`;
                    return newScale;
                });

                // Calculate new scale, adjust scroll sensitivity here
                
                // boardElement.style.transform = `scale(${scale})`;
                // boardElement.style.transform = `scale(${scale})`;
                // boardElement.style.marginTop = `${(scale - 1) * 50}vh`
                // boardElement.style.marginLeft = `${(scale - 1) * 50}vw`
            }            
        };

        if (boardElement) {
            boardElement.addEventListener("wheel", handleWheel, { passive: false });
        }

        // Cleanup function to remove event listener
        return () => {
            if (boardElement) {
                boardElement.removeEventListener("wheel", handleWheel);
            }
        };
    }, [scale]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? 'dark' : 'light'); // Set initial theme based on current preference
        
        console.log(theme)
    }, [theme]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragOrigin.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y
        };
    };

    const handleMouseDownBoard = () => {
        setSelectedNode(null);
    }

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging && newEdge === null){
                if (selectedNode !== null) {
                    const clientMouseX = event.clientX;
                    const clientMouseY = event.clientY;
                    const deltaX = (clientMouseX - (dragOrigin.current.x) - position.x) / scale;
                    const deltaY = (clientMouseY - (dragOrigin.current.y) - position.y) / scale;
                    
                    setNodes(prevNodes =>
                        prevNodes.map(node =>
                            node.id === selectedNode
                                ? {
                                    ...node,
                                    // Update the current position by adding the displacement
                                    // No further division by scale is needed here
                                    currPosition: {
                                        x: node.prevPosition.x / scale + deltaX,
                                        y: node.prevPosition.y / scale + deltaY,
                                    },
                                }
                                : node
                        )
                    );


                } else {
                    const newX = (event.clientX) - dragOrigin.current.x;
                    const newY = (event.clientY) - dragOrigin.current.y;
                    // Cap the movement to only allow negative values
                    // const boundedX = Math.min(0, Math.max(newX, -1200)); // Keeps x within [-2000, 0]
                    // const boundedY = Math.min(0, Math.max(newY, -150)); 
                    console.log(newX, newY)
                    setPosition({
                        x: newX, 
                        y: newY,
                    });
                }
            }
            if (isDragging && newEdge !== null) {
                const boardWrapperElement = document.getElementById('boardWrapper') as HTMLElement;
                if (boardWrapperElement) {
                    // Use the spread operator to update the edge state immutably
                    setNewEdge(prevEdge => {
                        if (!prevEdge) return null;
                        const clientMouseX = event.clientX;
                        const clientMouseY = event.clientY;

                        // Calculate deltas directly, adjusting by scale if necessary

                        // const deltaX = clientMouseX / scale - (prevEdge.currStartPosition.x) - position.x - 300;
                        const deltaX = Math.max(0, (clientMouseX - (prevEdge.currStartPosition.x) - position.x));
                        const deltaY = (clientMouseY - (prevEdge.currStartPosition.y) - position.y);
                        // Apply deltas to current positions (assuming you want to adjust both x and y from the same starting positions)
                        console.log(zoomOffset.current.x, zoomOffset.current.y)
                        return {
                            ...prevEdge,
                            currEndPosition: {
                                x: prevEdge.currStartPosition.x + deltaX,
                                y: prevEdge.currStartPosition.y + deltaY, 
                            }
                        };
                    });
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (newEdge !== null && insideInput === null){
                setNewEdge(null);
            }

            if (newEdge !== null && insideInput !== null){
                const nodeStartId = newEdge.nodeStartId; 
                const nodeEndId = insideInput.nodeId; 
                
                const nodeStart = nodes.find(node => node.id === nodeStartId);
                const nodeEnd = nodes.find(node => node.id === nodeEndId);

                const boardWrapperElement = document.getElementById("boardWrapper");
  
                if (nodeStart && nodeEnd && boardWrapperElement) {
                    const edgeId = `edge_${nodeStart.id}_${newEdge?.outputIndex}_${nodeEnd.id}_${newEdge?.inputIndex}`;
                    console.log(edgeId)
                    
                    if (nodeStart.outputEdgeIDs.includes(edgeId) || nodeEnd.outputEdgeIDs.includes(edgeId)) {
                        setNewEdge(null);
                        return;
                    }

                    const addEdgeToNodes = (edgeId: string, startNodeId: string, endNodeId: string) => {
                        setNodes((prevNodes) => {
                          return prevNodes.map(node => {
                            if (node.id === startNodeId) {
                              // Create a new object for the start node with updated outputEdgeIDs
                              return {
                                ...node,
                                outputEdgeIDs: [...node.outputEdgeIDs, edgeId]
                              };
                            } else if (node.id === endNodeId) {
                              // Create a new object for the end node with updated inputEdgeIds
                              return {
                                ...node,
                                inputEdgeIds: [...node.inputEdgeIds, edgeId]
                              };
                            }
                            return node; // Return the unchanged node
                          });
                        });
                      };

                    addEdgeToNodes(edgeId, nodeStart.id, nodeEnd.id);
                    console.log(nodeStart.outputEdgeIDs, nodeEnd.inputEdgeIds)

                    // Create a new edge with updated positions
                    const newEdgeData = newEdge ? {
                        ...newEdge,
                        id: edgeId,
                        // Update other edge properties as needed
                        // Calculate positions based on scroll and scale
                    } : null;
                
                    if (newEdgeData) {
                        console.log(newEdgeData)
                        setEdges([...edges, newEdgeData]);
                        setNewEdge(null);
                    }
                }
            }
        };

        const handleMouseMoveWindow = (event: MouseEvent) => handleMouseMove(event);
        const handleMouseUpWindow = () => handleMouseUp();
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMoveWindow);
            window.addEventListener('mouseup', handleMouseUpWindow);
        }
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMoveWindow);
            window.removeEventListener('mouseup', handleMouseUpWindow);
        };
    }, [isDragging, newEdge, insideInput, nodes]);

    const handleOnClickAdd = (numberInputs: number, numberOutputs: number) => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
    
        const newNode: Node = {
          id: `node_${Math.random().toString(36).substring(2, 8)}`,
          numberInputs,
          numberOutputs,
          prevPosition: { x: randomX, y: randomY },
          currPosition: { x: randomX, y: randomY },
          inputEdgeIds: [],
          outputEdgeIDs: [],
        };
    
        setNodes((prevNodes) => [...prevNodes, newNode]);
    };

    const handleOnClickDelete = () => {
        const node = nodes.find(node => node.id === selectedNode)

        if (!node) {
            setSelectedNode(null);
            return; 
        }
        const updatedNodes = nodes.filter(node => node.id !== selectedNode);
        setNodes(updatedNodes); 
        setSelectedNode(null);
    }

    const handleOnMouseDownNode = (id: string, event: React.MouseEvent<HTMLDivElement>) => {
        setSelectedNode(id);
        // setClickedPosition({ x: event.clientX, y: event.clientY });
    
        // Find the node and update its previous position
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === id
              ? {
                  ...node,
                  prevPosition: {
                    x: node.currPosition.x * scale,
                    y: node.currPosition.y * scale,
                  },
                }
              : node
          )
        );
        handleMouseDown(event);
    };
    
    function handleOnMouseDownOutput(outputPositionX: number, outputPositionY: number, nodeId:string, outputIndex: number, event: React.MouseEvent<HTMLDivElement>){

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
              const node = nodes[i];
              const newDragOriginX = node.currPosition.x;
              const newDragOriginY = node.currPosition.y;
      
              console.log(newDragOriginX, newDragOriginY); // Log current position
      
              // Optionally update the dragOrigin ref here if needed
              dragOrigin.current = { x: newDragOriginX, y: newDragOriginY };
              break; 
            }
        } 
        
        setSelectedNode(null);
        setIsDragging(true);
        const boardWrapperElement = document.getElementById("boardWrapper");
        const yOffset = outputIndex * 25; 

        if (boardWrapperElement) {
            // Create edge position signals with updated scale value
            const prevEdgeStart = {
                x: dragOrigin.current.x,
                y: (dragOrigin.current.y),
            };
            const currEdgeStart = {
                x: (dragOrigin.current.x) + 140,
                y: (dragOrigin.current.y) + 35 + yOffset,
            };
            const prevEdgeEnd = {
                x: (dragOrigin.current.x),
                y: (dragOrigin.current.y),
            };  
            const currEdgeEnd = {
                x: dragOrigin.current.x + 140,
                y: dragOrigin.current.y + 35 + yOffset,
            };
            console.log(outputIndex)
            setNewEdge({
                id: "",
                nodeStartId: nodeId,
                outputIndex: outputIndex,
                nodeEndId: "",
                inputIndex: -1,
                prevStartPosition: prevEdgeStart,
                currStartPosition: currEdgeStart,
                prevEndPosition: prevEdgeEnd,
                currEndPosition: currEdgeEnd,
            });
            console.log(newEdge);
        }
    }
    
    function handleOnMouseEnterInput(inputPositionX: number, inputPositionY: number, nodeId: string, inputIndex: number) {
        setInsideInput({ nodeId, inputIndex, positionX: inputPositionX, positionY: inputPositionY });
        console.log("Hello");
        console.log(insideInput)
    }

    function handleOnMouseLeaveInput(nodeId:string, inputIndex: number){
        setInsideInput(null);
        console.log("Good bye")
    }

    return (
        <div id="boardWrapper" className={styles.wrapper} onMouseDown={handleMouseDown}>
            <ButtonsComponent showDelete={selectedNode !== null} onClickAdd={handleOnClickAdd} onClickDelete={handleOnClickDelete}></ButtonsComponent>
            <div
                id="board"
                className={theme === 'dark' ? styles.boardDarkmode : styles.board}
                style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
                onMouseDown={handleMouseDownBoard}
            >
                {nodes.map((node: Node) => (
                    <NodeComponent
                        key={node.id}
                        id={node.id}
                        x={node.currPosition.x}
                        y={node.currPosition.y}
                        numberInputs={node.numberInputs}
                        numberOutputs={node.numberOutputs}
                        selected={selectedNode === node.id}
                        onMouseDownNode={handleOnMouseDownNode}
                        onMouseDownOutput={handleOnMouseDownOutput}
                        onMouseEnterInput={handleOnMouseEnterInput}
                        onMouseLeaveInput={handleOnMouseLeaveInput}
                    />
                ))}
                {newEdge !== null && (
                    <EdgeComponent
                        selected={false}
                        isNew={true}
                        position={{
                            x0: newEdge.currStartPosition.x,
                            y0: newEdge.currStartPosition.y,
                            x1: newEdge.currEndPosition.x,
                            y1: newEdge.currEndPosition.y,
                        }}
                        onMouseDownEdge={() => {}}
                        onClickDelete={() => {}}
                    />
                )}
                {edges.map((edge) => (
                    <EdgeComponent
                        key={edge.id} // Always use a unique key when mapping over an array
                        selected={selectedEdge === edge.id}
                        isNew={false}
                        position={{
                        x0: edge.currStartPosition.x,
                        y0: edge.currStartPosition.y,
                        x1: edge.currEndPosition.x,
                        y1: edge.currEndPosition.y,
                        }}
                        onMouseDownEdge={() => {}}
                        onClickDelete={() => {}}
                    />
                    ))}
            </div>
        </div>
    );
};

export default Playground; 

