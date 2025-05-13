import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./componets/Header";
import Tasks from "./componets/Tasks";
import AddTask from "./componets/AddTask";
import Footer from "./componets/Footer";
import About from "./componets/About";

function App() {
  const [showAddTask, setShowAddTasks] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() =>{
    const getTask = async() => {
      const taskfromserver = await fetchTask()
      setTasks(taskfromserver)
    }
    getTask()
  },[])
  //fetch tak
  const fetchTask = async () => {
    const respoene = await fetch("http://localhost:1000/tasks");
    const data = await respoene.json();
    
  return data 
  }

  //fetch tak
  const fetchTas = async (id) => {
    const respoene = await fetch(`http://localhost:1000/tasks/${id}`);
    const data = await respoene.json();
    
  return data 
  }

  const addTask = async (task) => {
    const respoene = await fetch("http://localhost:1000/tasks/", {
      method: 'POST',
      headers: {
       'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await respoene.json()
    setTasks([...tasks,data])

    // const id = Math.floor(Math.random() * 10000 + 1);
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);

  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:1000/tasks/${id}`, {
      method: "DELETE"
    })

    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleReminder = async (id) => {
    const taskTotoggle =await fetchTas(id)
    const updateTask = { ...taskTotoggle, reminder:!taskTotoggle.reminder}
    const respoene = await fetch(`http://localhost:1000/tasks/${id}`, {
      method: "PUT",
      header: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })
    const data =await respoene.json()
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
  <div className="container">
    <Header onAdd={() => setShowAddTasks(!showAddTask)} showAdd={showAddTask} />

    <Routes>
      <Route
        path="/"
        element={
          <>
            {showAddTask && <AddTask onAdd={addTask} title={"Task Tracker"} />}
            {tasks.length > 0 ? (
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
            ) : (
              "No task here"
            )}
          </>
        }
      />
      <Route path="/about" element={<About />} />
    </Routes>

    <Footer />
  </div>
</Router>
  );
}

export default App;
