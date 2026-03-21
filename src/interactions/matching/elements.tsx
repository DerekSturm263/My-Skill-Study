'use client'

import { InteractionPackage, InteractionProps } from "@/lib/types";
import { useState } from 'react';
import { SyncAlt } from '@mui/icons-material';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

import * as helpers from "@/lib/helpers";

export type InteractionType = {
  items: MatchingItem[]
};

type MatchingItem = {
  leftSide: string,
  rightSide: string
};

const defaultValue: InteractionType = {
  items: [
    {
      leftSide: "New Item",
      rightSide: "New Item"
    }
  ]
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

function Component(props: InteractionProps) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).items);
  
  //const shuffledItemsLeft = useState(items.map(item => item.leftSide).sort(item => Math.random() - 0.5))[0];
  //const shuffledItemsRight = useState(items.map(item => item.rightSide).sort(item => Math.random() - 0.5))[0];
  
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      {/*<Reorder>
        {shuffledItemsLeft.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>

      <Reorder>
        {shuffledItemsRight.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>*/}
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "matching",
  prettyName: "Matching",
  category: "Assessments",
  icon: SyncAlt,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
