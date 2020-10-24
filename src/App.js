import React, { useState } from 'react';
import './App.css';
import { Droppable, DragDropContext, Draggable } from 'react-beautiful-dnd';
import Modal from '@material-ui/core/Modal';
import { Fade } from '@material-ui/core';
import {
  tarefas,
  tarefasFeitas,
  tarefasPausadas,
  tarefasSendoFeitas,
} from './services/api';

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 'tarefas',
      tarefa: tarefas,
    },
    {
      id: 'tarefasSendoFeitas',
      tarefa: tarefasSendoFeitas,
    },

    {
      id: 'tarefasPausadas',
      tarefa: tarefasPausadas,
    },

    {
      id: 'tarefasFeitas',
      tarefa: tarefasFeitas,
    },
  ]);
  const [open, setOpen] = useState(false);
  const [newTasks, setNewTasks] = useState('');

  function reorder(result) {
    const newList = tasks.map((it, index) => {
      if (it.id === result.source.droppableId) {
        const items = Array.from(it.tarefa);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        return { id: it.id, tarefa: items };
      }
      return it;
    });
    setTasks(newList);
  }

  function move(result) {
    const array = [];
    const removido = [];
    const array2 = [];
    tasks.forEach((it, index) => {
      if (it.id === result.source.droppableId) {
        const item1 = Array.from(it.tarefa);
        const itemRemovido = item1.splice(result.source.index, 1);
        removido.push(itemRemovido);
        array.push({ id: it.id, tarefa: item1 });
      } else {
        array.push(it);
      }
    });
    array.forEach((item) => {
      if (item.id === result.destination.droppableId) {
        const item1 = Array.from(item.tarefa);
        item1.splice(result.destination.index, 0, removido[0][0]);
        array2.push({ id: item.id, tarefa: item1 });
      } else {
        array2.push(item);
      }
    });
    setTasks(array2);
  }

  function handleDrag(result) {
    if (!result.destination) return;

    if (result.destination.droppableId === result.source.droppableId) {
      reorder(result);
    }
    if (result.destination.droppableId !== result.source.droppableId) {
      move(result);
    }
  }

  function addTask() {
    const array = [];
    tasks.forEach((item) => {
      if (item.id === 'tarefas') {
        const copy = Array.from(item.tarefa);
        copy.splice(0, 0, { id: newTasks, name: newTasks });
        console.log(copy);
        array.push({ id: item.id, tarefa: copy });
      } else {
        array.push(item);
      }
    });
    console.log(array);
    setTasks(array);
    close();
  }

  function showModal(event) {
    console.log('fthhtr');
    setOpen(true);
  }
  function close(event) {
    setOpen(false);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskFy</h1>
      </header>
      <main>
        <div className="listas">
          <h3 className="tar">
            Tarefas <span onClick={(e) => showModal()}>+</span>
          </h3>
          <h3>Fazendo</h3>
          <h3>Pausado</h3>
          <h3>
            Concluído{' '}
            <span style={{ color: '#819830', fontSize: '30px' }}>V</span>
          </h3>
        </div>
        <div className="cont">
          <DragDropContext
            draggableId="master"
            className="drag"
            onDragEnd={handleDrag}
          >
            {tasks.map((item, index) => {
              return (
                <Droppable
                  className="dropp"
                  key={item.id}
                  droppableId={item.id}
                >
                  {(provided) => (
                    <ul
                      className="characters"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {item.tarefa.map((it, idd) => {
                        return (
                          <Draggable
                            key={it.id}
                            draggableId={it.id}
                            index={idd}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <p>{it.name}</p>
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>
      </main>

      <Modal open={open} onClose={close} className="modal" closeAfterTransition>
        <Fade in={open}>
          <div className="paper">
            <h3>Cadastrar nova tarefa</h3>
            <div className="input-block">
              <input
                id="tarefa"
                value={newTasks}
                onChange={(e) => setNewTasks(e.target.value)}
                type="text"
              />
              <span onClick={(e) => addTask()}>+</span>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default App;
