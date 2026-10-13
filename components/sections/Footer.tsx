'use client';

import { FOOTER_LISTS, RETAILERS } from '@/data/content';

export function Footer() {
  return (
    <footer className="footer">
      <div className="f-grid">
        <div className="f-col f-brand">
          <img src="/assets/51652.png" alt="basil" width={90} height={31} />
          <p className="tag">Designed for Kids. Approved by Families.</p>
          <hr className="dash" />
          <h4>Get In The Loop</h4>
          <p>We&apos;re always cooking up something fun - get first access to new drops &amp; insider deals!</p>
          <form className="news" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email" />
            <button aria-label="Subscribe"><img src="/assets/9c8af.svg" alt="" width={22} height={21} /></button>
          </form>
        </div>
        <div className="vdiv" />
        <div className="f-col f-links">
          <div className="lists">
            {FOOTER_LISTS.map(l => (
              <div key={l.title}>
                <h4>{l.title}</h4>
                <ul>{l.links.map(t => <li key={t}><a href="#">{t}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <hr className="dash" />
          <div className="find">
            <h4>Find us here!</h4>
            <div className="social">
              <a href="#" aria-label="Instagram"><img src="/assets/2117f.svg" alt="" width={19} height={19} /></a>
              <a href="#" aria-label="Facebook"><img src="/assets/bc0ef.svg" alt="" width={21} height={21} /></a>
              <a href="#" aria-label="YouTube"><img src="/assets/b5775.svg" alt="" width={22} height={17} /></a>
            </div>
          </div>
        </div>
        <div className="vdiv" />
        <div className="f-col f-market">
          <h4>Marketed By</h4>
          <address>SY NO.26/1, K NO.1056,1037/1/1042/1, INDIQUBE AURA,IBIS Hotel, Hongasandra village, Next to Oxford engineering college, Garvebhavi Palya, Bengaluru, Bengaluru Urban, Karnataka, 560068<br />CIN U51909KA2022PTC164084</address>
          <hr className="dash" />
          <h4>Now Available At:</h4>
          <div className="retail">{RETAILERS.map(r => <img key={r.img} src={`/assets/${r.img}.png`} alt={r.name} />)}</div>
        </div>
      </div>
      <hr className="dash wide" />
      <div className="f-bottom">
        <span>© Copyright, yourbasil 2026</span>
        <nav>
          <a href="#">Refund policy</a><a href="#">Privacy policy</a><a href="#">Terms of service</a><a href="#">Contact information</a>
        </nav>
        <span>Made with ❤️ by Boco</span>
      </div>
    </footer>
  );
}
