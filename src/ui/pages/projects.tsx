import { useRequestContext } from "hono/jsx-renderer";

export default function Projects() {
  const c = useRequestContext();
  return <h1>Projects</h1>;
}
