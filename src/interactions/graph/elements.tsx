'use client'

import { Interaction, InteractionPackage, InteractionProps } from '@/lib/types/general';
import { Architecture } from '@mui/icons-material';
import { useState } from 'react';
import { Type } from '@google/genai';
import { Box } from '@mui/material';

export interface InteractionType extends Interaction {
  placeholder: boolean
};

const defaultValue: InteractionType = {
  placeholder: false,
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

function Component(props: InteractionProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);
  
  /*const elt = createElement('div');

  const calculator = Desmos.GraphingCalculator(elt);
  calculator.setExpression({ id: "", latex: "y=x^2" });*/

  return (
    <Box
      sx={{ height: "100%" }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage<InteractionType> = {
  id: "graph",
  prettyName: "Graph",
  description: "Let users do math problems on a graph. Feedback will be generated for the user based on their work.",
  category: "Mathematics",
  icon: Architecture,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
