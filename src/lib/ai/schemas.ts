import { Type } from "@google/genai";

export const embedTypeSchema = {
  type: Type.STRING,
  enum: [
    "Drawing",
    "Graph",
    "DAW",
    "Codespace",
    "Engine"
  ]
}

const elementSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: [
        "shortAnswer",
        "multipleChoice",
        "trueOrFalse",
        "matching",
        "ordering",
        "files",
        "drawing",
        "3dModeling",
        "graph",
        "daw",
        "codespace",
        "engine",
        "embed"
      ]
    },
    text: {
      type: Type.STRING
    },
    value: {
      type: Type.OBJECT,
      anyOf: [
        // shortAnswerSchema,
        // multipleChoiceSchema,
        // trueOrFalseSchema,
        // matchingSchema,
        // orderingSchema,
        // fileSchema,
        // drawingSchema,
        // 3dModelingSchema,
        // graphSchema,
        // dawSchema,
        // codespaceSchema,
        // engineSchema,
        // embedSchema
      ]
    }
  },
  required: [
    "type",
    "text",
    "value"
  ],
  propertyOrdering: [
    "type",
    "text",
    "value"
  ]
};

const chapterSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING
    },
    elements: {
      type: Type.ARRAY,
      items: elementSchema,
      minItems: 1,
      maxItems: 7
    }
  },
  required: [
    "title",
    "elements"
  ],
  propertyOrdering: [
    "title",
    "elements"
  ]
};

const learnSchema = {
  type: Type.OBJECT,
  properties: {
    chapters: {
      type: Type.ARRAY,
      items: chapterSchema,
      minItems: 5,
      maxItems: 9
    }
  },
  required: [
    "chapters"
  ],
  propertyOrdering: [
    "chapters"
  ]
};

const practiceSchema = {
  type: Type.OBJECT,
  properties: {
    placeholder: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "placeholder"
  ],
  propertyOrdering: [
    "placeholder"
  ]
};

export const skillSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING
    },
    description: {
      type: Type.STRING
    },
    learn: learnSchema,
    practice: practiceSchema,
    implement: {
      type: Type.STRING
    },
    certify: {
      type: Type.STRING
    }
  },
  required: [
    "title",
    "description",
    "learn",
    "practice",
    "implement",
    "certify"
  ],
  propertyOrdering: [
    "title",
    "description",
    "learn",
    "practice",
    "implement",
    "certify"
  ]
}
