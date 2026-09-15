'use client';

/**
 * Process Explainer Template
 *
 * Sandwich layout: navy title band, full-width photo, numbered step stack.
 * Great for "Selling My Condominium" or "Buying Your First Home" type content.
 * Four steps is the designed count; five still fit.
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

type ContentPoint = { title: string; body?: string } | string;

type ContentData = {
  /** Small caps line above the title, e.g. "Selling My" */
  kicker?: string;
  /** Display line, e.g. "Condominium" */
  title: string;
  /** Caps line under the rule, e.g. "A Four Step Process" */
  subtitle?: string;
  /** Step labels; numbering is generated. Can be strings or { title, body } objects */
  points?: ContentPoint[];
  photoUrl?: string;
  /** object-position for the photo window; default 'center 34%' */
  photoFocus?: string;
};

type ContentTemplateProps = { agent: Agent; content: ContentData };

/** Extract step text from either string or object format */
const getStepText = (point: ContentPoint): string =>
  typeof point === 'string' ? point : point.title;

export default function ProcessExplainer({ agent, content }: ContentTemplateProps) {
  const steps = (content.points ?? []).slice(0, 5).map(getStepText);
  return (
    <>
      <style>{CSS}</style>
      <div className="pe-stage">
        <div className="pe-band">
          {content.kicker ? <div className="pe-k">{content.kicker}</div> : null}
          <div className="pe-l blk">{content.title}</div>
          <hr className="pe-rule" />
          {content.subtitle ? <div className="pe-s">{content.subtitle}</div> : null}
        </div>
        <div className="pe-win">
          {content.photoUrl ? (
            <img
              src={content.photoUrl}
              alt=""
              style={{ objectPosition: content.photoFocus ?? 'center 34%' }}
            />
          ) : null}
        </div>
        <div className="pe-steps">
          {steps.map((t, i) => (
            <div className="pe-st" key={t}>
              <div className="pe-n">{String(i + 1).padStart(2, '0')}</div>
              <div className="pe-t">{t}</div>
            </div>
          ))}
        </div>
        <div className="pe-contact">
          {agent.name} <s>|</s> {agent.phone} <s>|</s> {agent.website}
        </div>
        <div className="pe-foot">
          <div className="pe-balloon">
            <i className="r" />
            <i className="w" />
            <i className="b" />
            <b />
          </div>
          <div className="pe-wm">
            RE<em>/</em>MAX<span>NOVA</span>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.pe-stage{position:relative;width:1080px;height:1350px;overflow:hidden;background:var(--theme-surface,#f4f2ed);font-family:var(--theme-font-narrow,"Archivo Narrow"),sans-serif;--navy:var(--theme-primary,#0d2343);--navy2:var(--theme-primary-alt,#132f57);--red:var(--theme-accent,#d8252b)}
.pe-stage *{margin:0;padding:0;box-sizing:border-box}
.pe-stage a{color:var(--navy)}
.pe-stage .blk{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;text-transform:uppercase;line-height:.88;letter-spacing:-1px}
.pe-band{position:absolute;left:0;top:0;width:1080px;height:336px;background:var(--navy);padding:52px 56px 0}
.pe-k{font-weight:700;text-transform:uppercase;letter-spacing:5px;font-size:30px;color:#fff;opacity:.72}
.pe-l{font-size:96px;color:#fff;margin-top:14px}
.pe-rule{height:7px;border:0;background:var(--red);width:360px;margin-top:26px}
.pe-s{font-weight:700;text-transform:uppercase;letter-spacing:3.4px;font-size:34px;color:#fff;margin-top:22px}
.pe-win{position:absolute;left:0;top:336px;width:1080px;height:456px;overflow:hidden;background:var(--navy);border-top:7px solid var(--red);border-bottom:7px solid var(--red)}
.pe-win img{width:100%;height:100%;object-fit:cover;display:block}
.pe-steps{position:absolute;left:0;top:792px;width:1080px;height:344px;background:var(--navy2);display:flex;flex-direction:column}
.pe-st{flex:1;display:flex;align-items:center;gap:26px;padding:0 56px;border-bottom:1px solid rgba(255,255,255,.14)}
.pe-st:last-child{border-bottom:0}
.pe-n{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:40px;color:#fff;opacity:.55;width:52px;flex:none}
.pe-t{font-weight:700;text-transform:uppercase;letter-spacing:2.4px;font-size:37px;color:#fff;text-wrap:pretty}
.pe-contact{position:absolute;left:0;bottom:150px;width:1080px;height:64px;background:var(--navy);color:#fff;border-top:6px solid var(--red);display:flex;align-items:center;justify-content:center;gap:20px;font-weight:700;font-size:25px;letter-spacing:1.6px;text-transform:uppercase}
.pe-contact s{text-decoration:none;opacity:.5}
.pe-foot{position:absolute;left:0;bottom:0;width:1080px;height:150px;background:#fff;display:flex;align-items:center;justify-content:center;gap:22px}
.pe-balloon{width:52px;height:62px;position:relative}
.pe-balloon i{position:absolute;left:0;width:52px;display:block}
.pe-balloon i.r{top:0;height:15px;background:var(--red);border-radius:26px 26px 0 0/30px 30px 0 0}
.pe-balloon i.w{top:15px;height:14px;background:#fff}
.pe-balloon i.b{top:29px;height:15px;background:#1d4fa3;border-radius:0 0 26px 26px/0 0 26px 26px}
.pe-balloon b{position:absolute;left:20px;top:44px;width:12px;height:16px;background:#1d4fa3;clip-path:polygon(0 0,100% 0,50% 100%)}
.pe-wm{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:56px;letter-spacing:-2px;color:#1a1a1a;line-height:.8}
.pe-wm em{font-style:normal;color:var(--red)}
.pe-wm span{display:block;font-family:var(--theme-font-narrow,"Archivo Narrow"),sans-serif;font-size:22px;font-weight:700;letter-spacing:9px;color:var(--red);text-align:center;margin-top:4px}
`;
