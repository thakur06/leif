import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { id: uuidv4(), text: task, completed: false }]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Healthcare To-Do List</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center p-2 border-b ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}
          >
            <span onClick={() => toggleTask(task.id)} className="cursor-pointer flex-1">
              {task.text}
            </span>
            <button onClick={() => removeTask(task.id)} className="text-red-500 hover:text-red-700">
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
