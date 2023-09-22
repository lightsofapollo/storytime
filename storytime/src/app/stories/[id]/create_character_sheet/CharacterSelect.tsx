"use client";

import type characters from "@/data/characters";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ReactMarkdown from "react-markdown";

type Props = {
  presetCharacters: typeof characters;
  onSelect?: (character: (typeof characters)[0]) => void;
};

export default function CharacterSelect({ presetCharacters, onSelect }: Props) {
  return (
    <Container>
      <Typography variant="h4">Preset Characters</Typography>
      <Grid2 container rowSpacing={2} spacing={4}>
        {presetCharacters.map((character, idx) => (
          <Grid2 xs={2} key={idx}>
            <Card key={character.name}>
              <CardContent>
                <Typography variant="h4">{character.name}</Typography>
                <Typography variant="body1">
                  <ReactMarkdown>{character.description}</ReactMarkdown>
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => onSelect && onSelect(character)}>
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}
