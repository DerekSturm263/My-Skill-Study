'use client'

import { Interaction, InteractionPackage, InteractionProps } from "@/lib/types/general";
import { FormatLineSpacing } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface InteractionType extends Interaction {
  correctOrder: string[]
};

const defaultValue: InteractionType = {
  correctOrder: [
    "New Item"
  ],
  requiresCompletion: true
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

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  return (
    <Box
      sx={{ height: "100%", alignContent: 'center' }}
    >
      {<Reorder>
        {items.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>}
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "ordering",
  prettyName: "Ordering",
  category: "Assessments",
  icon: FormatLineSpacing,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
