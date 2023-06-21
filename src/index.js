
import React, { useRef, useEffect, useState } from 'react';
import { render } from "react-dom";
import Konva from 'konva';
import { Stage, Layer, Rect,Image } from 'react-konva';
import img from '../src/assets/deepp.png'
import useImage from 'use-image';

const Image1 = (props) => {
  const [image1] = useImage('https://images.pexels.com/photos/3620411/pexels-photo-3620411.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image2] = useImage('https://images.pexels.com/photos/1148960/pexels-photo-1148960.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image3] = useImage('https://images.pexels.com/photos/4355702/pexels-photo-4355702.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image4] = useImage('https://images.pexels.com/photos/3310694/pexels-photo-3310694.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image5] = useImage('https://images.pexels.com/photos/1375736/pexels-photo-1375736.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image6] = useImage('https://images.pexels.com/photos/1544724/pexels-photo-1544724.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image7] = useImage('https://images.pexels.com/photos/2728263/pexels-photo-2728263.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [image8] = useImage('https://images.pexels.com/photos/3328128/pexels-photo-3328128.jpeg?auto=compress&cs=tinysrgb&w=800');

  console.log(props)
  const  images = [image1,image2,image3,image4,image5,image6,image7,image8];
  const randomImageUrl = images[(props.indexX+props.indexY)%8];

  return <Image image={randomImageUrl} {...props}/>;
};



const WIDTH = 150;
const HEIGHT = 200;

const grid = [["red", "yellow"], ["green", "blue"]];




const App = () => {
  const stageRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const gridSize = 100;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const gridGroupRef = useRef(null);

  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;
  const endX =
    Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;

  const startY =
    Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY =
    Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents = [];
  
  var i = 0;
  for (var x = startX; x < endX; x += WIDTH) {
 
    for (var y = startY; y < endY; y += HEIGHT) {
      if (i === 4) {
        i = 0;
      }

      const isOddColumn = Math.floor((x<0 ? -(x) : x)/ WIDTH) % 2 === 1;

      const indexX = Math.abs(x / WIDTH) % (grid.length*8);
      const indexY = Math.abs(y / HEIGHT) % (grid[0].length*8);
     


      gridComponents.push(
        // <GridItem x={x} y={y} size={WIDTH} />

        <Image1
          x={x}
          y={isOddColumn? y+50 : y}
          width={WIDTH}
          indexX={indexX}
          indexY={isOddColumn? indexY+50: indexY}
          height={HEIGHT}
          stroke="white"
          strokeWidth={40}
          cornerRadius={10}
        />
      );
    }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      const stage = stageRef.current;
      const pointerPosition = stage.getPointerPosition();

      if (autoScroll && pointerPosition) {
        const { x, y } = pointerPosition;

        // Calculate the distance from the mouse position to the canvas center
        const offsetX = (canvasWidth / 2 - x) * 0.02;
        const offsetY = (canvasHeight / 2 - y) * 0.02;



        // Update the stage position based on the distance
        stage.position({
          x: stage.x() + offsetX,
          y: stage.y() + offsetY
        });
        setStagePos({
          x: stage.x() + offsetX,
          y: stage.y() + offsetY
        });

        const tween = new Konva.Tween({
          node: stage,
          x: stage.x() + offsetX,
          y: stage.y() + offsetY,
          easing: Konva.Easings.EaseIn,
          duration: 0.8,
          delay:0.3,
        });

        tween.play();
   

        stage.batchDraw();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [autoScroll]);

  const handleMouseDown = () => {
    setAutoScroll(true);
  };

  const handleMouseUp = () => {
    setAutoScroll(false);
  };

  const renderGrid = () => {
    const rows = Math.ceil(canvasHeight / gridSize) + 1;
    const cols = Math.ceil(canvasWidth / gridSize) + 1;

    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;
        const fill = (row + col) % 2 === 0 ? '#ffffff' : '#f3f3f3';

        grid.push(
          <Image
            key={`${row}-${col}`}
            x={x}
            y={y}
            width={gridSize}
            height={gridSize}
            fill={fill}
          />
        );
      }
    }

    return grid;
  };

  return (
    <div>
      <div style={{position:"fixed",background:"white",width:"50vw",top:0,left:0,bottom:0,zIndex:100}}></div>
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      ref={stageRef}
      draggable
      onMouseOver={handleMouseDown}
      onMouseEnter={handleMouseDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Layer>{gridComponents}</Layer>
    </Stage>
    </div>
  );
};


render(<App />, document.getElementById("root"));
