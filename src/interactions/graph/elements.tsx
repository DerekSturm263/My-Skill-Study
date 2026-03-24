'use client'

import { InteractionPackage, InteractionProps } from '@/lib/types/general';
import { Architecture } from '@mui/icons-material';
import { useState } from 'react';
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

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  
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

const interaction: InteractionPackage<InteractionType> = {
  id: "graph",
  prettyName: "Graph",
  category: "Mathematics",
  icon: Architecture,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
