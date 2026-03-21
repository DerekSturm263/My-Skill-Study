'use client'

import { InteractionPackage, InteractionProps } from '@/lib/types';
import { Architecture } from '@mui/icons-material';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export type InteractionType = {
  placeholder: boolean
};

const defaultValue: InteractionType = {
  placeholder: false
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

function Component(props: InteractionProps) {
  /*const elt = createElement('div');

  const calculator = Desmos.GraphingCalculator(elt);
  calculator.setExpression({ id: "", latex: "y=x^2" });*/

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "graph",
  prettyName: "Graph",
  category: "Mathematics",
  icon: Architecture,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
