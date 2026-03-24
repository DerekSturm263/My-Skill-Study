'use client'

import Link from "next/link";

import { Breadcrumbs, Card, CardActionArea, CardActions, CardContent, Chip, LinearProgress, Rating, Stack, Tab, Tabs, TextField, Toolbar, Typography } from "@mui/material";
import { ViewMode, Sharable } from "@/lib/types/general";
import { useState } from "react";

export function SharableCard<T extends Sharable>({ sharable, id, type }: { sharable: T, id: string, type: string }) {
  return (
    <Card
      sx={{ width: '300px' }}
    >
      <CardActionArea
        href={`https://myskillstudy.com/${type}/${id}`}
      >
        <CardContent>
          <Typography
            variant="h6"
          >
            {sharable.title}
          </Typography>

          <Rating
            name="skill-rating"
            value={sharable.rating}
            precision={0.5}
            readOnly={true}
          />

          <Typography>
            {sharable.description}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={0}
          />
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Chip
          label="Save For Later"
        />
      </CardActions>
    </Card>
  );
}

export function SharablePage<T extends Sharable>({ slug, sharable, mode, hideLogo, type, children }: { slug: string, sharable: T, mode: ViewMode, hideLogo: boolean, type: string, children?: React.ReactNode }) {
  const [ tabIndex, setTabIndex ] = useState(0);

  const tabs = mode == ViewMode.Edit ? [ "About" ] : [ "About", "Recommended", "Reviews" ];

  return (
    <Stack
      sx={{ height: '100vh' }}
    >
      <Breadcrumbs>
        <Link
          href="./"
        >
          {type}
        </Link>
        
        <Typography>
          {sharable.title}
        </Typography>
      </Breadcrumbs>

      <Stack
        spacing={2}
        sx={{ height: 300, justifyContent: 'center' }}
      >
        <Title
          sharable={sharable}
          mode={mode as ViewMode}
        />

        <Tagline
          sharable={sharable}
          mode={mode as ViewMode}
        />

        {mode != ViewMode.Edit && (
          <Rating
            name="skill-rating"
            value={sharable.rating}
            precision={0.5}
            readOnly={true}
          />
        )}

        <Stack
          direction="row"
          spacing={2}
        >
          {children}
        </Stack>
      </Stack>

      <Tabs
        value={tabIndex}
        onChange={(e, value) => { setTabIndex(value); }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((label, index) => (
          <Tab
            key={index}
            label={label}
          />
        ))}
      </Tabs>

      {tabIndex == 0 ? (
        <Description
          sharable={sharable}
          mode={mode as ViewMode}
        />
      ) : (
        <></>
      )}
    </Stack>
  );
}

function Title<T extends Sharable>({ sharable, mode }: { sharable: T, mode: ViewMode }) {
  const [ title, setTitle ] = useState(sharable.title);
  
  const header = (
    <Typography
      variant='h4'
    >
      {title}
    </Typography>
  );

  const input = (
    <TextField
      label="Title"
      autoComplete="off"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        sharable.title = e.target.value;
      }}
    />
  );

  return mode == ViewMode.Edit ? input : header;
}

function Tagline<T extends Sharable>({ sharable, mode }: { sharable: T, mode: ViewMode }) {
  const [ tagLine, setTagLine ] = useState(sharable.tagLine);
  
  const header = (
    <Typography
      variant='body1'
    >
      {tagLine}
    </Typography>
  );

  const input = (
    <TextField
      label="Tagline"
      autoComplete="off"
      value={tagLine}
      onChange={(e) => {
        setTagLine(e.target.value);
        sharable.tagLine = e.target.value;
      }}
    />
  );

  return mode == ViewMode.Edit ? input : header;
}

function Description<T extends Sharable>({ sharable, mode }: { sharable: T, mode: ViewMode }) {
  const [ description, setDescription ] = useState(sharable.description);
  
  const header = (
    <Typography
      variant='body1'
    >
      {description}
    </Typography>
  );

  const input = (
    <TextField
      label="Description"
      autoComplete="off"
      rows={4}
      multiline
      fullWidth={true}
      value={description}
      onChange={(e) => {
        setDescription(e.target.value);
        sharable.description = e.target.value;
      }}
    />
  );

  return mode == ViewMode.Edit ? input : header;
}
