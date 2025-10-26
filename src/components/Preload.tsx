import Head from "next/head";

type Props = { images?: string[] };

export default function Preload({ images = [] }: Props) {
  const unique = Array.from(new Set(images));
  return (
    <Head>
      {unique.map((u) => (
        <link key={u} rel="preload" as="image" href={u} />
      ))}
    </Head>
  );
}
