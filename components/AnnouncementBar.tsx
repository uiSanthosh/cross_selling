import { Fragment } from 'react';
import { ANNOUNCEMENTS } from '@/data/content';

export function AnnouncementBar() {
  // one half = every message plus a trailing dot; rendered twice because the track translates by -50%
  return (
    <div className="adv" aria-label="Announcements">
      <div className="adv-track">
        {[0, 1].map(half => (
          <Fragment key={half}>
            {ANNOUNCEMENTS.map((t, i) => (
              <Fragment key={i}>
                <span className="dot" />
                <span>{t}</span>
              </Fragment>
            ))}
            <span className="dot" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
