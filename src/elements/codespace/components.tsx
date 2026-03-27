'use client'

import verify, { compile } from './functions';

import { Stack,  Tabs, Tab, Button, Typography, LinearProgress, Box } from '@mui/material';
import { ViewMode, ElementPackage, ElementProps, Element } from '@/lib/types/general';
import { Add, Code, PlayArrow } from '@mui/icons-material';
import { Verification } from '@/lib/ai/types';
import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Type } from '@google/genai';

export interface InteractionType extends Element {
  language: CodespaceLanguage,
  files: CodespaceFile[],
  isSimplified: boolean,
  allowNewFiles: boolean,
  correctOutput: string | null
};

enum CodespaceLanguage {
  Java = 'java',
  Python = 'python',
  C = 'c',
  CPP = 'cpp',
  NodeJS = 'nodejs',
  JavaScript = 'javascript',
  Groovy = 'groovy',
  JShell = 'jshell',
  Haskell = 'haskell',
  TCL = 'tcl',
  Lua = 'lua',
  Ada = 'ada',
  CommonLisp = 'commonlisp',
  D = 'd',
  Elixir = 'elixir',
  Erlang = 'erlang',
  FSharp = 'fsharp',
  Fortran = 'fortran',
  Assembly = 'assembly',
  Scala = 'scala',
  PHP = 'php',
  Python2 = 'python2',
  CSharp = 'csharp',
  Perl = 'perl',
  Ruby = 'ruby',
  Go = 'go',
  R = 'r',
  Racket = 'racket',
  OCaml = 'ocaml',
  VB = 'vb',
  Basic = 'basic',
  Bash = 'bash',
  Clojure = 'clojure',
  TypeScript = 'typescript',
  Cobol = 'cobol',
  Kotlin = 'kotlin',
  Pascal = 'pascal',
  Prolog = 'prolog',
  Rust = 'rust',
  Swift = 'swift',
  ObjectiveC = 'objectivec',
  Octave = 'octave',
  Text = 'text',
  BrainFK = 'brainfk',
  CoffeeScript = 'coffeescript',
  EJS = 'ejs',
  Dart = 'dart',
  Deno = 'deno',
  Bun = 'bun',
  MySQL = 'mysql',
  Oracle = 'oracle',
  PostgreSQL = 'postgresql',
  MongoDB = 'mongodb',
  SQLite = 'sqlite',
  Redis = 'redis',
  MariaDB = 'mariadb',
  PLSQL = 'plsql',
  SQLServer = 'sqlserver'
};

export type CodespaceFile = {
  name: string,
  content: string
}

const defaultValue: InteractionType = {
  language: CodespaceLanguage.JavaScript,
  files: [
    {
      name: 'Main.js',
      content: 'console.log("Hello, world!");'
    }
  ],
  isSimplified: false,
  allowNewFiles: false,
  correctOutput: null,
  requiresCompletion: true
}

const schema = {
  type: Type.OBJECT,
  properties: {
    language: {
      type: Type.STRING,
      enum: [
        "csharp",
        "javascript",
        "python",
        "c",
        "cpp",
        "java",
        "php",
        "html",
        "ruby",
        "react",
        "nodejs",
        "assembly",
        "lua",
        "haskell",
        "perl",
        "fortran",
        "go",
        "scala",
        "typescript",
        "swift",
        "rust",
        "kotlin",
        "cobol",
        "mysql",
        "jquery",
        "angular"
      ]
    },
    content: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING
          },
          content: {
            type: Type.STRING
          }
        },
        required: [
          "name",
          "content"
        ],
        propertyOrdering: [
          "name",
          "content"
        ]
      },
      minItems: 1
    },
    isSimplified: {
      type: Type.BOOLEAN
    },
    correctOutput: {
      type: Type.STRING
    }
  },
  required: [
    "language",
    "content",
    "allowNewFiles",
    "isSimplified"
  ],
  propertyOrdering: [
    "language",
    "content",
    "isSimplified",
    "allowNewFiles",
    "correctOutput"
  ]
};

function Component(props: ElementProps<InteractionType>) {
  const [ value, setValue ] = useState(props.originalValue);

  const [ output, setOutput ] = useState("");
  const [ currentTabIndex, setTabIndex ] = useState(0);
  const [ isRunning, setIsRunning ] = useState(false);
  
  const currentFile = value.files[currentTabIndex];

  async function submit(): Promise<Verification> {
    setIsRunning(true);

    const output = await compile(value);
    setOutput(output.consoleOutput);

    setIsRunning(false);

    return verify(props.text, value, output.response);
  }

  return (
    <Stack
      direction="row"
      sx={{ flexGrow: 1 }}
    >
      <Stack
        sx={{ flexGrow: 1, width: '60%' }}
      >
        <Tabs
          value={currentTabIndex}
          onChange={(e, value) => { setTabIndex(value); }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {value.files.map(file => (
            <Tab
              key={file.name} // TODO: Replace with constant ID. File names can change!
              label={file.name}
            />
          ))}

          {value.allowNewFiles && (
            <Tab
              icon={<Add />}
              onClick={(e) => {
                const newFiles = value.files;
                newFiles.push({ name: "New File", content: "" });
                setValue({ ... value, files: newFiles });
              }}
            />
          )}
        </Tabs>

        <Editor
          path={currentFile.name}
          defaultLanguage={value.language}
          defaultValue={currentFile.content}
          theme="vs-dark"
          onChange={(e) => {
            const newFiles = value.files;
            newFiles[currentTabIndex].content = e ?? '';
            setValue({ ... value, files: newFiles });
          }}
        />
      </Stack>

      <Stack
        sx={{ flexGrow: 1 }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ height: '48px' }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', flexGrow: 1 }}
            style={{ margin: 'auto' }}
          >
            Press Run to execute your code
            <br />
            All output and errors will be printed below
          </Typography>

          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={(e) => props.evaluateAndReply(submit())}
            sx={{ width: '120px' }}
            disabled={isRunning || props.mode == ViewMode.Edit as ViewMode}
          >
            Run
          </Button>
        </Stack>

        <Box
          sx={{ overflowY: "scroll", height: "100%" }}
        >
          <Typography
            variant="body2"
            sx={{ margin: '16px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
          >
            {isRunning && (
              <>
                <LinearProgress />
                <br />
              </>
            )}

            {isRunning ? 'Running...' : output}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

const interaction: ElementPackage<InteractionType> = {
  id: "codespace",
  prettyName: "Codespace",
  description: "Let users write code in an IDE. Feedback will be generated for the user based on their work.",
  category: "Computer Science",
  icon: Code,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
