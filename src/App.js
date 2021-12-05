import VideoGrid from './VideoGrid';
import FloatButton from './FloatButton';
import './App.css';
import AddDialog from './AddDialog';
import React, { useState } from 'react';


function App() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialItems = [
    { i: 'a', x: 0, y: 0, w: 4, h: 3, url: 'https://www.youtube.com/watch?v=ltBu2XKnIKI' },
    { i: 'b', x: 4, y: 0, w: 4, h: 3, url: 'https://www.youtube.com/watch?v=ltBu2XKnIKI' },
    { i: 'c', x: 8, y: 0, w: 4, h: 3, url: 'https://www.youtube.com/watch?v=ltBu2XKnIKI' }
  ];
  const [items, setItems] = useState(initialItems);
  const [nItems, setNItems] = useState(3);

  const addItem = () => {
    console.log(nItems);
    const newItem = {
      i: "n" + nItems,
      x: Infinity,
      y: Infinity, // puts it at the bottom
      w: 4,
      h: 3
    };
    setNItems(nItems+1);
    setItems([...items, newItem]);
  }

  const handleAdd = () => {
    addItem();
    handleClose();
  }


  return (
    <>
      <FloatButton addVideo={handleOpen} />
      <AddDialog handleAdd={handleAdd} handleClose={handleClose} open={open} />
      <VideoGrid items={items}/>
    </>

  );
}

export default App;
