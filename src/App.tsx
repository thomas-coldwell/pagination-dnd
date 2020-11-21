import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import composeRefs from "@seznam/compose-react-refs";

const Main = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  height: 300px;
  width: 600px;
  background-color: #ccc;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const ScrollBuffer = styled.div`
  flex-shrink: 0;
  height: 10px;
  width: calc((100% - 340px) / 2);
`;

const Item = styled.div<any>`
  flex-shrink: 0;
  width: 300px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  background-color: #8cd;
  color: #fff;
  margin-left: 20px;
  margin-right: 20px;
`;

const initialItems = ["A", "B", "C"];

function App() {
  //

  const [items, setItems] = useState(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = useRef<HTMLDivElement>(null);

  const onDragEnd = (result: DropResult) => {
    // IF there is no destination
    if (!result.destination) {
      return;
    }
    // if the destination is the same as the source
    if (result.destination.index === result.source.index) {
      return;
    }
    // Else the destination !== source so reorder the item
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const newItems = Array.from(items);
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);
    setItems(newItems);
    setCurrentIndex(endIndex);
  };

  useEffect(() => {
    if (scroll.current) {
      const scrollOffset = currentIndex * 340;
      scroll.current.scrollTo({ left: scrollOffset, behavior: "smooth" });
    }
  }, [scroll, currentIndex, items]);

  return (
    <Main>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <Container
              ref={
                composeRefs(
                  provided.innerRef,
                  scroll
                ) as React.RefObject<HTMLDivElement>
              }
              {...provided.droppableProps}
            >
              <ScrollBuffer />
              {items.map((item, index) => {
                return (
                  <DraggableItem
                    key={item}
                    item={item}
                    itemIndex={index}
                    currentIndex={currentIndex}
                  />
                );
              })}
              {provided.placeholder}
              <ScrollBuffer />
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={() =>
          currentIndex < items.length - 1 && setCurrentIndex(currentIndex + 1)
        }
      >
        Next
      </button>
      <button
        onClick={() => currentIndex !== 0 && setCurrentIndex(currentIndex - 1)}
      >
        Previous
      </button>
    </Main>
  );
}

export default App;

interface IDraggableItemProps {
  item: string;
  itemIndex: number;
  currentIndex: number;
}

function DraggableItem(props: IDraggableItemProps) {
  return (
    <Draggable draggableId={props.item} index={props.itemIndex}>
      {(provided) => (
        <Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...props}
        >
          {props.item}
        </Item>
      )}
    </Draggable>
  );
}
