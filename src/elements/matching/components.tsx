'use client'

import { Element, ElementPackage, ElementProps } from "@/lib/types/element";
import { useState } from 'react';
import { SyncAlt } from '@mui/icons-material';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface ElementType extends Element {
  items: MatchingItem[]
};

type MatchingItem = {
  leftSide: string,
  rightSide: string
};

const defaultValue: ElementType = {
  items: [
    {
      leftSide: "New Item",
      rightSide: "New Item"
    }
  ],
  requiresCompletion: true
}

const schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          leftSide: {
            type: Type.STRING
          },
          rightSide: {
            type: Type.STRING
          }
        },
        required: [
          "leftSide",
          "rightSide"
        ],
        propertyOrdering: [
          "leftSide",
          "rightSide"
        ]
      },
      minItems: 2,
      maxItems: 4
    }
  },
  required: [
    "items"
  ],
  propertyOrdering: [
    "items"
  ]
};

function Component(props: ElementProps<ElementType>) {
  const [ value, setValue ] = useState(props.originalValue);
  
  //const shuffledItemsLeft = useState(items.map(item => item.leftSide).sort(item => Math.random() - 0.5))[0];
  //const shuffledItemsRight = useState(items.map(item => item.rightSide).sort(item => Math.random() - 0.5))[0];
  
  return (
    <Box
      sx={{ height: "100%", alignContent: 'center' }}
    >
      
    </Box>
  );
}

const elementPackage: ElementPackage<ElementType> = {
  id: "matching",
  prettyName: "Matching",
  description: "Let users match two lists of text. Feedback will be generated for the user based on their response.",
  category: "Assessments",
  icon: SyncAlt,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default elementPackage;
