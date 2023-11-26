type Props = {
  title: string;
  children?: any;
};

export default function Layout({ children, title }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="css/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
