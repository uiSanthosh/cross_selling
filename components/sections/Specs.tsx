'use client';

import { SPEC_DIMENSIONS, SPEC_SOLO, SPEC_TABS } from '@/data/content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Specs() {
  return (
    <section className="specs">
      <Tabs defaultValue="dim">
        <TabsList className="spec-tabs">
          {SPEC_TABS.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
        </TabsList>
        <div className="spec-card">
          <TabsContent value="dim" className="spec-panel">
            <div className="dim-img">
              <img src="/assets/main-raw1.png" alt="Bento Lite, 23.5 cm by 17.5 cm" />
              <span className="dim-w">23.5 cm</span><span className="dim-h">17.5 cm</span>
            </div>
            <dl className="spec-list">
              <h3>Specifications</h3>
              {SPEC_DIMENSIONS.map(([k, v]) => (
                <div key={k} className="contents"><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </TabsContent>
          {Object.entries(SPEC_SOLO).map(([id, s]) => (
            <TabsContent key={id} value={id} className="spec-panel">
              <dl className="spec-list solo">
                <h3>{s.title}</h3>
                {s.rows.map(([k, v]) => <div key={k} className="contents"><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  );
}
