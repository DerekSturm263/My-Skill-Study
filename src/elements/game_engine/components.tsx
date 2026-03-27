'use client'

import { CSSProperties, PureComponent, useState } from 'react';
import { Element, ElementPackage, ElementProps } from '@/lib/types/general';
import { SportsEsports } from '@mui/icons-material';
import { Type } from '@google/genai';

export interface ElementType extends Element {
  properties: CSSProperties,
  entities: Entity[]
};

export type Entity = {
  id: string,
  transform: transform,
  properties: CSSProperties,
  renderer: PureComponent | undefined
};

export type transform = {
  position: vector2,
  rotation: number,
  scale: vector2
}

export type vector2 = {
  x: number,
  y: number
}

const defaultValue: ElementType = {
  properties: { backgroundColor: "blue" },
  entities: [
    {
      id: "e1",
      transform: {
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      properties: { backgroundColor: "red" },
      renderer: undefined
    }
  ],
  requiresCompletion: true
}

const schema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [

  ]
};

function Component(props: ElementProps<ElementType>) {
  const [ value, setValue ] = useState(props.originalValue);
  
  //const renderedEntities = entities.map(entity => ({ ...entity, renderer: Renderer }));

  return (
    <></>
    /*<GameEngine
      style={{ ...properties, width: "100%", height: "100%" }}
      systems={[]}
      entities={entities}
    />*/
  );
}

/*function MoveEntity(entities, { input }) {
  const { payload } = input.find(x => x.name === "onMouseDown") || {};

  if (payload) {
    const box1 = entities["box1"];

    box1.x = payload.pageX;
    box1.y = payload.pageY;
  }

  return entities;
};

class Renderer extends PureComponent {
  render() {
    return (
      <div
        style={{ ...this.props.properties, position: "absolute", left: this.props.x, top: this.props.y }}
      />
    )
  }
}*/

const elementPackage: ElementPackage<ElementType> = {
  id: "game_engine",
  prettyName: "Game Engine",
  description: "Let users create small games in an engine. Feedback will be generated for the user based on their work.",
  category: "Computer Science",
  icon: SportsEsports,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
