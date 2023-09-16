import { getSession } from "@auth0/nextjs-auth0";
import { Container, Typography } from "@mui/material";

export default async function Home() {
  const user = await getSession();
  if (!user) {
    return (
      <Container>
        <Typography>
          <a href="/api/auth/login">Login</a>
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography>
        Welcome {user.user.email}! | <a href="/api/auth/logout">Logout</a>
      </Typography>
    </Container>
  );
}
