'use client';

/**
 * Buyer Objections Carousel
 *
 * Seven-frame carousel: cover, five objection slides, closing CTA.
 * Alternating light/dark grounds create swipe rhythm.
 * RE/MAX Nova footer included.
 */
import * as React from 'react';

type Agent = {
  name: string;
  title?: string;
  phone: string;
  website: string;
  headshotUrl?: string;
  logoUrl?: string;
  theme?: string;
};

type ObjectionItem = {
  /** Short label set in Archivo Black, e.g. "Price" */
  label: string;
  /** The objection, verbatim from the buyer */
  objection: string;
  /** "How {agent} handles it" — the agent's own words */
  response: string;
  /** Icon key; falls back to 'tag' */
  icon?: IconKey;
};

type CarouselData = {
  kicker?: string;
  /** Two display lines on the cover */
  title: [string, string] | string[];
  /** Cover sub-deck; **bold** spans are rendered as navy <b> */
  subtitle?: string;
  items: ObjectionItem[];
  closing?: {
    kicker?: string;
    title?: string;
    body?: string;
    cta?: string;
    icon?: IconKey;
  };
  /** Full-bleed skyline behind cover / objection / closing frames */
  skylineUrl?: string;
  /** Cutout portrait used on the cover panel and closing frame */
  portraitUrl?: string;
};

type CarouselTemplateProps = {
  agent: Agent;
  carousel: CarouselData;
  frameIndex: number;
  totalFrames: number;
};

/* ---------- icons (Lucide, 24x24 stroke) ---------- */

type IconKey = 'tag' | 'clock' | 'map-pin' | 'wrench' | 'users' | 'handshake' | 'key';

const ICONS: Record<IconKey, React.ReactNode> = {
  tag: (
    <>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
  key: (
    <>
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </>
  ),
};

const Icon = ({ name, size = 142 }: { name?: IconKey; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICONS[name ?? 'tag'] ?? ICONS.tag}
  </svg>
);

/* ---------- ground alternation ---------- */

/** Objection frames alternate paper / navy so the swipe has rhythm. */
const groundFor = (objectionIndex: number): 'lt' | 'dk' =>
  objectionIndex % 2 === 0 ? 'lt' : 'dk';

/* ---------- chrome ---------- */

const RemaxFooter = () => (
  <div className="cm-foot">
    <div className="cm-balloon">
      <i className="r" />
      <i className="w" />
      <i className="b" />
      <b />
    </div>
    <div className="cm-wm">
      RE<em>/</em>MAX<span>NOVA</span>
    </div>
  </div>
);

const ContactBar = ({ agent }: { agent: Agent }) => (
  <div className="cm-contact">
    {agent.name} <s>|</s> {agent.phone} <s>|</s> {agent.website}
  </div>
);

const Progress = ({ n, total }: { n: number; total: number }) => (
  <div className="cm-top">
    <div className="cm-num">
      {String(n).padStart(2, '0')} <s>/</s> {String(total).padStart(2, '0')}
    </div>
    <div className="cm-dots">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i === n - 1 ? 'on' : undefined} />
      ))}
    </div>
  </div>
);

/** Renders **bold** runs as accented spans, everything else verbatim. */
const RichText = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
      chunk.startsWith('**') && chunk.endsWith('**') ? (
        <b key={i}>{chunk.slice(2, -2)}</b>
      ) : (
        <React.Fragment key={i}>{chunk}</React.Fragment>
      )
    )}
  </>
);

/* ---------- frames ---------- */

const CoverFrame = ({ agent, carousel }: { agent: Agent; carousel: CarouselData }) => {
  const [l1, l2] = carousel.title;
  return (
    <div className="cm-stage lt cm-cover">
      <div className="cm-hd">
        <div className="cm-l1 blk">{l1}</div>
        {l2 ? <div className="cm-l2 blk">{l2}</div> : null}
        <hr />
        {carousel.subtitle ? (
          <div className="cm-sub">
            <RichText text={carousel.subtitle} />
          </div>
        ) : null}
      </div>
      {carousel.kicker ? <div className="cm-kick cm-tag">{carousel.kicker}</div> : null}
      <div
        className="cm-who"
        style={
          carousel.portraitUrl
            ? { backgroundImage: `url(${carousel.portraitUrl})` }
            : undefined
        }
      />
      <div className="cm-cl">
        {carousel.items.slice(0, 5).map((it, i) => (
          <div key={it.label}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {it.label}
          </div>
        ))}
      </div>
      <div className="cm-swipe">Swipe &rarr;</div>
      <ContactBar agent={agent} />
      <RemaxFooter />
    </div>
  );
};

const ObjectionFrame = ({
  agent,
  item,
  index,
  count,
  skylineUrl,
  agentFirstName,
}: {
  agent: Agent;
  item: ObjectionItem;
  index: number;
  count: number;
  skylineUrl?: string;
  agentFirstName: string;
}) => (
  <div className={`cm-stage ${groundFor(index)}`}>
    <div
      className="cm-bg"
      style={skylineUrl ? { backgroundImage: `url(${skylineUrl})` } : undefined}
    />
    <div className="cm-ghost">{String(index + 1).padStart(2, '0')}</div>
    <Progress n={index + 1} total={count} />
    <div className="cm-icon">
      <Icon name={item.icon} />
    </div>
    <div className="cm-body">
      <div className="cm-ttl blk">{item.label}</div>
      <hr className="cm-rule" />
      <div className="cm-obj">{item.objection}</div>
      <div className="cm-fixk">How {agentFirstName} handles it</div>
      <div className="cm-fix">{item.response}</div>
    </div>
    <ContactBar agent={agent} />
    <RemaxFooter />
  </div>
);

const ClosingFrame = ({
  agent,
  carousel,
}: {
  agent: Agent;
  carousel: CarouselData;
}) => {
  const c = carousel.closing ?? {};
  return (
    <div className="cm-stage cm-cl-stage">
      <div
        className="cm-bg"
        style={carousel.skylineUrl ? { backgroundImage: `url(${carousel.skylineUrl})` } : undefined}
      />
      <div className="cm-wash" />
      <div className="cm-icon big">
        <Icon name={c.icon ?? 'handshake'} size={112} />
      </div>
      <div className="cm-cbody">
        {c.kicker ? <div className="cm-ck">{c.kicker}</div> : null}
        {c.title ? <div className="cm-ct blk">{c.title}</div> : null}
        <hr className="cm-rule" />
        {c.body ? <div className="cm-cp">{c.body}</div> : null}
        {c.cta ? <div className="cm-cc blk">{c.cta}</div> : null}
      </div>
      {agent.headshotUrl ? (
        <div className="cm-cut">
          <img src={agent.headshotUrl} alt="" />
        </div>
      ) : null}
      <ContactBar agent={agent} />
      <RemaxFooter />
    </div>
  );
};

/* ---------- component ---------- */

export default function BuyerObjectionsCarousel({
  agent,
  carousel,
  frameIndex,
  totalFrames,
}: CarouselTemplateProps) {
  const items = carousel.items ?? [];
  const first = agent.name.split(' ')[0];
  const last = totalFrames - 1;

  let frame: React.ReactNode;
  if (frameIndex <= 0) {
    frame = <CoverFrame agent={agent} carousel={carousel} />;
  } else if (frameIndex >= last) {
    frame = <ClosingFrame agent={agent} carousel={carousel} />;
  } else {
    const i = frameIndex - 1;
    frame = (
      <ObjectionFrame
        agent={agent}
        item={items[i]}
        index={i}
        count={items.length}
        skylineUrl={carousel.skylineUrl}
        agentFirstName={first}
      />
    );
  }

  return (
    <>
      <style>{CSS}</style>
      {frame}
    </>
  );
}

/* ---------- styles ---------- */

const CSS = `
.cm-stage{position:relative;width:1080px;height:1350px;overflow:hidden;background:var(--theme-primary,#0d2343);font-family:var(--theme-font-narrow,"Archivo Narrow"),sans-serif;--navy:var(--theme-primary,#0d2343);--navy2:var(--theme-primary-alt,#132f57);--paper:var(--theme-surface,#f4f2ed);--red:var(--theme-accent,#d8252b);--mute:#5b6b85}
.cm-stage *{margin:0;padding:0;box-sizing:border-box}
.cm-stage a{color:var(--navy)}
.cm-stage .blk{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;text-transform:uppercase;line-height:.88;letter-spacing:-1px}
.cm-stage.lt{background:var(--paper)}
.cm-stage.dk{background:#07142b}
.cm-bg{position:absolute;left:0;top:0;width:1080px;height:1136px;background:#07142b center/cover no-repeat}
.lt .cm-bg{opacity:.2;-webkit-mask-image:linear-gradient(180deg,transparent 42%,#000 100%);mask-image:linear-gradient(180deg,transparent 42%,#000 100%)}
.dk .cm-bg{opacity:.34;-webkit-mask-image:linear-gradient(180deg,transparent 38%,#000 100%);mask-image:linear-gradient(180deg,transparent 38%,#000 100%)}
.cm-ghost{position:absolute;right:34px;top:452px;font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:420px;line-height:.7;letter-spacing:-18px;pointer-events:none}
.lt .cm-ghost{color:rgba(13,35,67,.07)}
.dk .cm-ghost{color:rgba(255,255,255,.06)}
.cm-top{position:absolute;left:56px;top:58px;width:968px;display:flex;align-items:center;justify-content:space-between;z-index:2}
.cm-num{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:46px;letter-spacing:-1px}
.cm-num s{text-decoration:none}
.lt .cm-num{color:var(--navy)}
.dk .cm-num{color:#fff}
.lt .cm-num s{color:var(--red)}
.dk .cm-num s{color:#fff}
.cm-dots{display:flex;gap:12px}
.cm-dots i{width:15px;height:15px;border-radius:50%;background:rgba(13,35,67,.22)}
.dk .cm-dots i{background:rgba(255,255,255,.26)}
.lt .cm-dots i.on{background:var(--navy)}
.dk .cm-dots i.on{background:#fff}
.cm-icon{position:absolute;left:56px;top:210px;width:248px;height:248px;display:flex;align-items:center;justify-content:center;z-index:2}
.lt .cm-icon{background:var(--navy);color:#fff}
.dk .cm-icon,.cm-cl-stage .cm-icon{background:#fff;color:var(--navy)}
.cm-body{position:absolute;left:56px;top:552px;width:920px;z-index:2}
.cm-ttl{font-size:90px}
.lt .cm-ttl{color:var(--navy)}
.dk .cm-ttl{color:#fff}
.cm-rule{height:7px;border:0;width:300px;margin:30px 0 34px}
.lt .cm-rule{background:var(--navy)}
.dk .cm-rule,.cm-cl-stage .cm-rule{background:#fff}
.cm-obj{font-weight:700;font-size:48px;line-height:1.14;text-wrap:pretty}
.lt .cm-obj{color:var(--navy)}
.dk .cm-obj{color:#fff}
.cm-fixk{font-weight:700;text-transform:uppercase;letter-spacing:4px;font-size:25px;margin-top:64px}
.lt .cm-fixk{color:var(--red)}
.dk .cm-fixk{color:#fff}
.cm-fix{font-size:38px;line-height:1.24;margin-top:16px;text-wrap:pretty}
.lt .cm-fix{color:var(--mute)}
.dk .cm-fix{color:#a9bbd4}
.cm-cover .cm-hd{position:absolute;left:56px;top:56px;width:700px;z-index:2}
.cm-cover .cm-l1,.cm-cover .cm-l2{font-size:104px;color:var(--navy)}
.cm-cover .cm-hd hr{width:300px;height:7px;border:0;background:var(--navy);margin:22px 0 20px}
.cm-cover .cm-sub{font-size:40px;font-weight:700;line-height:1.12;color:var(--mute);text-wrap:pretty}
.cm-cover .cm-sub b{color:var(--navy)}
.cm-tag{display:inline-block;background:var(--navy);color:#fff;font-weight:700;font-size:24px;letter-spacing:3px;text-transform:uppercase;padding:9px 20px}
.cm-cover .cm-kick{position:absolute;right:56px;top:70px;z-index:2}
.cm-cover .cm-who{position:absolute;left:0;top:340px;width:490px;height:796px;border-right:7px solid var(--navy);background:var(--navy) center/cover no-repeat}
.cm-cover .cm-cl{position:absolute;left:548px;top:352px;width:476px;display:flex;flex-direction:column;gap:26px;z-index:2}
.cm-cover .cm-cl div{display:flex;align-items:center;gap:20px;font-weight:700;text-transform:uppercase;letter-spacing:1.6px;font-size:35px;color:var(--navy)}
.cm-cover .cm-cl span{flex:none;width:52px;height:52px;background:var(--navy);color:#fff;font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:27px;display:flex;align-items:center;justify-content:center}
.cm-cover .cm-swipe{position:absolute;right:56px;bottom:250px;font-weight:700;text-transform:uppercase;letter-spacing:4px;font-size:27px;color:var(--red);z-index:2}
.cm-cl-stage{background:#07142b}
.cm-cl-stage .cm-bg{opacity:1}
.cm-wash{position:absolute;left:0;top:0;width:1080px;height:1136px;background:linear-gradient(180deg,rgba(7,20,43,.96) 0%,rgba(7,20,43,.88) 50%,rgba(7,20,43,.6) 100%)}
.cm-cl-stage .cm-icon.big{top:110px;width:200px;height:200px}
.cm-cbody{position:absolute;left:56px;top:378px;width:560px;z-index:2}
.cm-ck{font-weight:700;text-transform:uppercase;letter-spacing:5px;font-size:29px;color:#fff}
.cm-ct{font-size:92px;color:#fff;margin-top:18px}
.cm-cbody .cm-rule{margin:32px 0}
.cm-cp{font-size:36px;line-height:1.22;color:#c3d0e4;text-wrap:pretty}
.cm-cc{font-size:64px;color:#fff;margin-top:38px;letter-spacing:-2px}
.cm-cut{position:absolute;right:-56px;bottom:214px;width:640px;pointer-events:none;z-index:1}
.cm-cut img{width:100%;display:block}
.cm-contact{position:absolute;left:0;bottom:150px;width:1080px;height:64px;background:var(--navy);color:#fff;border-top:6px solid var(--red);display:flex;align-items:center;justify-content:center;gap:20px;font-weight:700;font-size:25px;letter-spacing:1.6px;text-transform:uppercase;z-index:3}
.cm-contact s{text-decoration:none;opacity:.5}
.cm-foot{position:absolute;left:0;bottom:0;width:1080px;height:150px;background:#fff;display:flex;align-items:center;justify-content:center;gap:22px;z-index:3}
.cm-balloon{width:52px;height:62px;position:relative}
.cm-balloon i{position:absolute;left:0;width:52px;display:block}
.cm-balloon i.r{top:0;height:15px;background:var(--red);border-radius:26px 26px 0 0/30px 30px 0 0}
.cm-balloon i.w{top:15px;height:14px;background:#fff}
.cm-balloon i.b{top:29px;height:15px;background:#1d4fa3;border-radius:0 0 26px 26px/0 0 26px 26px}
.cm-balloon b{position:absolute;left:20px;top:44px;width:12px;height:16px;background:#1d4fa3;clip-path:polygon(0 0,100% 0,50% 100%)}
.cm-wm{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:56px;letter-spacing:-2px;color:#1a1a1a;line-height:.8}
.cm-wm em{font-style:normal;color:var(--red)}
.cm-wm span{display:block;font-family:var(--theme-font-narrow,"Archivo Narrow"),sans-serif;font-size:22px;font-weight:700;letter-spacing:9px;color:var(--red);text-align:center;margin-top:4px}
`;
