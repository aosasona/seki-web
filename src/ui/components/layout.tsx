import useAuth from "../hooks/use-auth";

type Props = {
  title: string;
  children?: any;
};

export default async function Layout({ children, title }: Props) {
  const { isLoggedIn, user } = await useAuth();

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="//unpkg.com/alpinejs" defer></script>
        <link rel="stylesheet" href="css/style.css" />
      </head>
      <body>
        {isLoggedIn ? (
          <nav class="flex justify-end py-3.5 px-6 w-screen border-b border-b-zinc-200">
            <div class="flex gap-3 items-center">
              <div class="overflow-hidden w-8 rounded-full aspect-square">
                {user?.avatarUrl ? <img src={user?.avatarUrl} alt="avatar" /> : <div class="flex w-full h-full border bg-zinc-200" />}
              </div>

              <a href="/api/auth/sign-out" class="text-xs font-medium text-zinc-500 hover:text-zinc-600">
                Sign out
              </a>
            </div>
          </nav>
        ) : null}
        <>{children}</>
      </body>
    </html>
  );
}
