const HEART = { f: 'c0913', e: '5c379', lf: 'd86db', lh: 'a63e5', le: '780c7' } as const;

export function Hearts({ n, large = false, half = false }: { n: number; large?: boolean; half?: boolean }) {
  return (
    <span className={`hearts${large ? ' lg' : ''}`} role="img" aria-label={`${n}${half ? '.5' : ''} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => {
        const t = large ? (i <= n ? 'lf' : half && i === n + 1 ? 'lh' : 'le') : i <= n ? 'f' : 'e';
        return <img key={i} src={`/assets/${HEART[t]}.svg`} alt="" />;
      })}
    </span>
  );
}
