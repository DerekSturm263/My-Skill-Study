'use client'

import { InteractionPackage, InteractionProps } from "@/lib/types";
import { FormatLineSpacing } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

import * as helpers from "@/lib/helpers";

export type InteractionType = {
  correctOrder: string[]
};

const defaultValue: InteractionType = {
  correctOrder: [
    "New Item"
  ]
}

const schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      minItems: 2,
      maxItems: 6
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
  const [ items, setItems ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).correctOrder);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      {/*<Reorder>
        {items.map((item, index) => (
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
  id: "ordering",
  prettyName: "Ordering",
  category: "Assessments",
  icon: FormatLineSpacing,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
