import { Llist } from "./llist.js";



//edges
class Edge {
    constructor(vertex, weight = 0) {
        this.vertex = vertex;
        this.weight = weight;
    }

    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case 'number':
                return this.weight;
            case 'string':
                return `namme: ${this.vertex.name}, weight: ${this.weight}`;            
        }
    }
}


//Vertices
class Vertex {
    constructor(name) {
        this.name = name;
        this.edges = new Llist();
    }

    addEdge({name, weight}) {
        this.edges.push(new Edge(name, weight));
    }
}




//TODO:graph
class Graph {
    constructor() {
        this.vertices = new Map(); //[name, vertex]
    }
    
    addVertex(vertices) {
        for (let [name, edges] of Object.entries(vertices)) {
            if(this.vertices.has(name)){

            }
        }

        
    }    
    
}

const gg = {
    'A':{        
         'B': 30,
         'C': 30,
        }
};


export { Vertex, Edge, Graph };