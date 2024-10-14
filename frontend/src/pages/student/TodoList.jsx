import React, { useState } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([
    { text: 'Complete Math Homework', done: false },
    { text: 'Watch Science Video', done: false },
    { text: 'Play Learning Game', done: false },
  ]);

  const toggleTaskDone = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(newTasks);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTaskDone(index)}
              className="mr-2"
            />
            <span className={task.done ? 'line-through' : ''}>{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
