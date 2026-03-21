'use client'

import ky from 'ky';
import verify, { CodeResult } from './functions';

import { Stack,  Tabs, Tab, Button, Typography, TextField, Checkbox, FormControlLabel, LinearProgress, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { ComponentMode, InteractionPackage, InteractionProps } from '@/lib/types';
import { Add, Code, PlayArrow } from '@mui/icons-material';
import { Fragment, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Type } from '@google/genai';

import * as helpers from '@/lib/helpers';

export type InteractionType = {
  language: CodespaceLanguage,
  content: CodespaceFile[],
  isSimplified: boolean,
  allowNewFiles: boolean,
  correctOutput: string | undefined
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
  content: [
    {
      name: 'Main.js',
      content: 'console.log("Hello, world!");'
    }
  ],
  isSimplified: false,
  allowNewFiles: false,
  correctOutput: undefined
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
    "isSimplified"
  ],
  propertyOrdering: [
    "language",
    "content",
    "isSimplified",
    "correctOutput"
  ]
};

function Component(props: InteractionProps) {
  const [ language, setLanguage ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).language);
  const [ content, setContent ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).content);
  const [ isSimplified, setIsSimplified ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).isSimplified);
  const [ allowNewFiles, setAllowNewFiles ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).allowNewFiles);
  const [ correctOutput, setCorrectOutput ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).correctOutput);
  const [ output, setOutput ] = useState("");
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ isRunning, setIsRunning ] = useState(false);
  
  const file = content[tabIndex];

  async function submit() {
    setIsRunning(true);
    props.setIsThinking(true);

    const response = await ky.post('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
      headers: {
        'x-rapidapi-key': props.elementID.keys[0],
        'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      json: {
        language: language,
        stdin: "",
        files: content.map(file => isSimplified ? unsimplify(file) : file)
      }
    }).json() as CodeResult;

    const output = `${response.stdout ?? ''}\n${response.stderr ?? ''}`;
    setOutput(output.trim() == '' ? 'Program did not output anything' : output);
    setIsRunning(false);

    const feedback = await verify(props.originalText, content, response, helpers.getInteractionValue<InteractionType>(props.elementID));
    props.setText(feedback.feedback);
    props.setIsThinking(false);

    if (feedback.isValid) {
      props.setComplete(true);
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
      direction="row"
    >
      <Stack
        sx={{ flexGrow: 1, width: '60%' }}
      >
        {props.mode == ComponentMode.Edit && (
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <FormControl
              size="small"
            >
              <InputLabel id="mode-label">Language</InputLabel>

              <Select
                labelId="language-label"
                value={language}
                label="Language"
                onChange={(e) => {
                  setLanguage(e.target.value as CodespaceLanguage);
                  helpers.getInteractionValue<InteractionType>(props.elementID).language = e.target.value as CodespaceLanguage;
                }}
              >
                {(Object.values(CodespaceLanguage).map((item, index) => (
                  <MenuItem
                    value={item}
                    key={index}
                  >
                    {item}
                  </MenuItem>
                )))}
              </Select>
            </FormControl>

            <FormControlLabel label="Is Simplified" control={
              <Checkbox
                name="isSimplified"
                id="isSimplified"
                checked={isSimplified}
                onChange={(e) => {
                  setIsSimplified(e.target.checked);
                  helpers.getInteractionValue<InteractionType>(props.elementID).isSimplified = e.target.checked;
                }}
              />}
            />
            
            <FormControlLabel label="Allow New Files" control={
              <Checkbox
                name="allowNewFiles"
                id="allowNewFiles"
                checked={allowNewFiles}
                onChange={(e) => {
                  setAllowNewFiles(e.target.checked);
                  helpers.getInteractionValue<InteractionType>(props.elementID).allowNewFiles = e.target.checked;
                }}
              />}
            />
          </Stack>
        )}

        <Stack
          sx={{ flexGrow: 1 }}
        >
          <Tabs
            value={tabIndex}
            onChange={(e, value) => { setTabIndex(value); }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {content.map((file, index) => (
              <Tab
                key={index}
                label={file.name}
              />
            ))}

            {(props.mode == ComponentMode.Edit || allowNewFiles) && (
              <Tab
                icon={<Add />}
                onClick={(e) => {
                  const newContent = content;
                  newContent.push({ name: "New File", content: "" });
                  setContent(newContent);

                  if (props.mode == ComponentMode.Edit) {
                    helpers.getInteractionValue<InteractionType>(props.elementID).content = content;
                  }
                }}
              />
            )}
          </Tabs>

          <Editor
            path={file.name}
            defaultLanguage={language}
            defaultValue={file.content}
            theme="vs-dark"
            onChange={(e) => {
              const newContent = content;
              newContent[tabIndex].content = e ?? '';
              setContent(newContent);

              if (props.mode == ComponentMode.Edit) {
                helpers.getInteractionValue<InteractionType>(props.elementID).content[tabIndex].content = e ?? '';
              }
            }}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{ flexGrow: 1 }}
      >
        {props.mode == ComponentMode.Edit ? (
          <TextField
            label="Correct Output"
            name="correctOutput"
            value={correctOutput}
            multiline
            rows={22}
            onChange={(e) => {
              setCorrectOutput(e.target.value);
              helpers.getInteractionValue<InteractionType>(props.elementID).correctOutput = e.target.value;
            }}
            fullWidth={true}
          />
        ) : (
          <>
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
                onClick={submit}
                sx={{ width: '120px' }}
                disabled={isRunning}
              >
                Run
              </Button>
            </Stack>

            <Typography
              variant="body2"
              sx={{ margin: '16px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
            >
              {isRunning && (
                <Fragment>
                  <LinearProgress />
                  <br />
                </Fragment>
              )}

              {isRunning ? 'Running...' : output}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
}

function unsimplify(file: CodespaceFile) {
  return {
    name: file.name,
    content: `using System;

    public class Program
    {
      public static void Main(string[] args)
      {
        ${file.content}
      }
    }`
  };
}

const interaction: InteractionPackage = {
  id: "codespace",
  prettyName: "Codespace",
  category: "Computer Science",
  icon: Code,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
