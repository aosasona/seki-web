import useAuth from "../hooks/use-auth";

type Props = {
  title: string;
  children?: any;
};

export default async function Layout({ children, title }: Props) {
  const { isLoggedIn, user } = await useAuth();
  console.log(user);

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="css/style.css" />
      </head>
      <body>
        {isLoggedIn ? <nav></nav> : null}
        <>{children}</>
      </body>
    </html>
  );
}
