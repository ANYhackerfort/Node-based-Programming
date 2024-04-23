class Node:
    def __init__(self, value):
        self.value = value
        self.adjacent = {}  # Keys are nodes, values are weights

    def __str__(self):
        return self.value

class UndirectedGraph:
    def __init__(self):
        self.nodes = {}

    def add_node(self, value):
        if value not in self.nodes:
            self.nodes[value] = Node(value)

    def add_edge(self, from_node, to_node, weight=1):
        if from_node in self.nodes and to_node in self.nodes:
            self.nodes[from_node].adjacent[self.nodes[to_node]] = weight
        else:
            print(f"Error: One or both nodes not found: {from_node}, {to_node}")

    def display(self):
        for node in self.nodes.values():
            for adj, weight in node.adjacent.items():
                print(f"{node.value} -> {adj.value} with weight {weight}")
                
    def find_paths(self, start, path=[], paths=[]):
        if start not in self.nodes:
            return []
        node = self.nodes[start]
        path = path + [node.value]
        
        # Check if this node has no outgoing edges (is a terminal node)
        if not node.adjacent:
            paths.append(path)
        else:
            for adjacent in node.adjacent:
                self.find_paths(adjacent.value, path, paths)
        return paths

# Example usage:
if __name__ == "__main__":
    graph = UndirectedGraph()
    # Adding nodes
    graph.add_node('A')
    graph.add_node('B')
    graph.add_node('C')

    # Adding edges
    graph.add_edge('A', 'B', 2)
    graph.add_edge('A', 'C', 3)
    graph.add_edge('B', 'C', 5)
    
    graph.add_node('E')
    graph.add_node('D')
    
    graph.add_edge('C', 'D', 5)
    graph.add_edge('D', 'E', 5)

    # Display the graph
    graph.display()
    
    paths = graph.find_paths('A')
    print("\nAll paths from 'A' to terminal nodes:")
    for path in paths:
        print(" -> ".join(path))

