import { CERTS, CUSTOMER_PHOTOS, FEATURES, HAPPY_REVIEWS, RATING_DIST, REVIEWS } from '@/data/content';
import { Hearts } from '@/components/Hearts';

export function Features() {
  return (
    <section className="features">
      <h2 className="sec-title">Product Features</h2>
      <div className="feat-grid">
        {FEATURES.map(f => (
          <article key={f.title}><img src={f.img} alt="" /><h3>{f.title}</h3><p>{f.text}</p></article>
        ))}
      </div>
    </section>
  );
}

export function Certs() {
  return (
    <section className="certs">
      <img className="wave wave-t" src="/assets/00acc.svg" alt="" aria-hidden="true" />
      <img className="wave wave-b" src="/assets/00acc.svg" alt="" aria-hidden="true" />
      <h2 className="sec-title">Tested. Certified. Trusted.</h2>
      <p className="sec-sub">100% Free from Harmful Toxins</p>
      <div className="cert-row">
        {CERTS.map(c => (
          <figure key={c.img}>
            <div><img src={c.img} alt="" /></div>
            <figcaption>
              {c.caption.map((line, i) => (i ? [<br key="br" />, line] : line))}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Happy() {
  return (
    <section className="happy">
      <h2 className="sec-title">2 Lakh+ Happy Families</h2>
      <div className="stars-row"><span className="stars big" /><span>(4.9)</span></div>
      <div className="review-strip">
        <div className="review-track">
          {HAPPY_REVIEWS.map((r, i) => (
            <article key={i} className="rcard">
              <img src={r.img} alt="" />
              <div>
                <div className="rc-top"><span className="stars sm" /><span className="verified">VERIFIED</span></div>
                <h4>{r.name}</h4>
                <p>{r.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Intent() {
  return (
    <section className="intent">
      <div className="pattern pattern-t" />
      <div className="intent-band">
        <img src="/assets/intent-raw1.png" alt="Designed with intent: materials you can trust blindly, parent-approved design, tested for little hands, opens without help" />
      </div>
      <div className="pattern pattern-b" />
    </section>
  );
}

export function Reviews() {
  return (
    <section className="reviews">
      <div className="rev-card">
        <div className="rev-left">
          <h2>Customer Reviews</h2>
          <div className="dist">
            {RATING_DIST.map(([stars, count]) => (
              <div key={stars} className="dist-row">
                <Hearts n={stars} />
                <div className="dist-bar">{count ? <i style={{ width: '50%' }} /> : null}</div>
                <span>{count}</span>
              </div>
            ))}
          </div>
          <div className="avg"><Hearts n={4} large half /><span>4.50 out of 5</span><span className="based">Based on 2 reviews</span></div>
          <button className="write">Write a review</button>
          <div className="photos">
            <p>Customer photos &amp; videos</p>
            <div>{CUSTOMER_PHOTOS.map(p => <img key={p} src={`/assets/${p}.png`} alt="" />)}</div>
          </div>
        </div>
        <div className="rev-right">
          <div className="rev-bar">
            <span className="sort">Most Recent <img src="/assets/a795a.svg" alt="" width={18} height={18} /></span>
            <button className="viewall">VIEW ALL</button>
          </div>
          <div className="rev-cols">
            {REVIEWS.map((r, i) => (
              <article key={i} className="rev">
                <div className="rev-meta"><Hearts n={4} large /><time>{r.when}</time></div>
                <div className="rev-user"><i><img src="/assets/18eb9.svg" alt="" width={24} height={24} /></i><span>{r.user}</span></div>
                <p>{r.text}</p>
                <div className="reply">
                  <p><span>&gt;&gt;</span> <b>yourbasil</b> replied:</p>
                  <p>{r.reply}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
