module.exports = [
    {
        id: 1,
        text: "Para incluir una biblioteca en C++ se utiliza la siguiente sentencia:",
        options: ["#include (stdlib)", "#include <stdlib>", "cin >> stdlib", "cout << stdlib"],
        correct: "#include <stdlib>"
    },
    {
        id: 2,
        text: "La definición de una variable se realiza de la siguiente manera:",
        options: ["#include variable1", "const int variable1 = 25", "int variable1", "int variable1 = 25"],
        correct: "int variable1 = 25"
    },
    {
        id: 3,
        text: "¿Cuál es la forma correcta de declarar un puntero a entero?",
        options: ["int p;", "int *p;", "int &p;", "pointer int p;"],
        correct: "int *p;"
    },
    {
        id: 4,
        text: "¿Qué palabra clave se usa para crear una clase derivada en C++?",
        options: ["implements", "inherits", "extends", ": public"],
        correct: ": public"
    },
    {
        id: 5,
        text: "¿Qué hace delete en C++?",
        options: ["Libera memoria asignada dinámicamente", "Borra una variable local", "Borra un archivo", "Convierte punteros a nulos"],
        correct: "Libera memoria asignada dinámicamente"
    },
    {
        id: 6,
        text: "¿Cuál es la diferencia entre struct y class en C++?",
        options: ["Ninguna", "struct es público por defecto y class es privado", "struct no puede tener funciones", "class no puede tener variables públicas"],
        correct: "struct es público por defecto y class es privado"
    },
    {
        id: 7,
        text: "¿Qué palabra clave indica que una función puede ser redefinida en clases derivadas?",
        options: ["abstract", "virtual", "override", "inline"],
        correct: "virtual"
    },
    {
        id: 8,
        text: "¿Qué función convierte una cadena de caracteres a entero en C++?",
        options: ["stoi()", "toInt()", "atoi()", "strint()"],
        correct: "stoi()"
    },
    {
        id: 9,
        text: "¿Cuál es el operador de acceso a miembros de un puntero a objeto?",
        options: [".", "->", "*.", "&."],
        correct: "->"
    },
    {
        id: 10,
        text: "¿Cuál es la ventaja principal de usar std::vector sobre arreglos nativos?",
        options: ["Permite cambiar de tipo de datos", "No requiere memoria", "Tamaño dinámico y métodos útiles", "Más rápido que los arreglos"],
        correct: "Tamaño dinámico y métodos útiles"
    },
    {
        id: 11,
        text: "¿Qué hace la palabra clave const en C++?",
        options: ["Crea variables que nunca cambian", "Crea variables públicas", "Crea punteros automáticos", "Nada, es opcional"],
        correct: "Crea variables que nunca cambian"
    },
    {
        id: 12,
        text: "¿Cuál es la forma correcta de declarar un constructor por defecto en una clase 'Persona'?",
        options: ["Persona();", "void Persona();", "Persona(void);", "construct Persona();"],
        correct: "Persona();"
    },
    {
        id: 13,
        text: "¿Cuál de los siguientes tipos NO es un tipo de dato fundamental en C++?",
        options: ["int", "float", "string", "double"],
        correct: "string"
    },
    {
        id: 14,
        text: "¿Qué significa encapsulación en programación orientada a objetos?",
        options: ["Separar archivos", "Ocultar datos", "Herencia múltiple", "Punteros"],
        correct: "Ocultar datos"
    },
    {
        id: 15,
        text: "¿A qué apunta 'nullptr'?",
        options: ["Apunta al inicio", "No apunta a nada", "Apunta a 0", "Apunta a una variable"],
        correct: "No apunta a nada"
    }
];