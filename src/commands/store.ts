// src/store.ts
export let todoList: string[] = [];

// Fungsi untuk menghapus item dari list
export const removeTodo = (taskName: string): boolean => {
    const initialLength = todoList.length;
    todoList = todoList.filter(item => item !== taskName.toLowerCase().trim());
    return todoList.length < initialLength;
};