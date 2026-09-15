'use client';

/**
 * Coming Soon Template
 *
 * Square listing announcement: navy headline band, photo window, address bar, spec strip.
 * Sandwich layout - nothing overlays the photo.
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

type Listing = {
  address: string;
  city?: string;
  price?: string;
  mls?: string;
  beds?: string | number;
  baths?: string | number;
  sqft?: string | number;
  acres?: string | number;
  photoUrl?: string;
  photoFocus?: string;
};

type ComingSoonProps = {
  agent: Agent;
  listing: Listing;
  /** Optional overrides: headline lines and the price label */
  content?: { headline?: [string, string]; priceLabel?: string };
};

export default function ComingSoon({ agent, listing, content }: ComingSoonProps) {
  const [l1, l2] = content?.headline ?? ['Coming', 'Soon'];
  const specs = [
    listing.beds != null ? `${listing.beds} Bed` : null,
    listing.baths != null ? `${listing.baths} Bath` : null,
    listing.sqft != null ? `${listing.sqft} Sq Ft` : null,
    listing.acres != null ? `${listing.acres} Acres` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <style>{CSS}</style>
      <div className="cs-stage">
        <div className="cs-band">
          <div className="cs-l blk">
            {l1}
            <br />
            <em>{l2}</em>
          </div>
          {listing.price ? (
            <div className="cs-r">
              <div className="cs-rk">{content?.priceLabel ?? 'Offered at'}</div>
              <div className="cs-rp">{listing.price}</div>
            </div>
          ) : null}
        </div>
        <div className="cs-win">
          {listing.photoUrl ? (
            <img
              src={listing.photoUrl}
              alt=""
              style={{ objectPosition: listing.photoFocus ?? 'center 38%' }}
            />
          ) : null}
        </div>
        <div className="cs-bar">
          <div className="cs-a">
            {listing.address}
            {listing.city ? ` \u00b7 ${listing.city}` : ''}
          </div>
          {listing.mls ? <div className="cs-m">MLS&reg; {listing.mls}</div> : null}
        </div>
        {specs.length ? (
          <div className="cs-specs">
            {specs.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 ? <s>/</s> : null}
                <span>{s}</span>
              </React.Fragment>
            ))}
          </div>
        ) : null}
        <div className="cs-contact">
          {agent.name} <s>|</s> {agent.phone} <s>|</s> {agent.website}
        </div>
        <div className="cs-foot">
          <div className="cs-balloon">
            <i className="r" />
            <i className="w" />
            <i className="b" />
            <b />
          </div>
          <div className="cs-wm">
            RE<em>/</em>MAX<span>NOVA</span>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.cs-stage{position:relative;width:1080px;height:1080px;overflow:hidden;background:var(--theme-surface,#f4f2ed);font-family:var(--theme-font-narrow,"Archivo Narrow"),sans-serif;--navy:var(--theme-primary,#0d2343);--navy2:var(--theme-primary-alt,#132f57);--red:var(--theme-accent,#d8252b)}
.cs-stage *{margin:0;padding:0;box-sizing:border-box}
.cs-stage a{color:var(--navy)}
.cs-stage .blk{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;text-transform:uppercase;line-height:.88;letter-spacing:-1px}
.cs-band{position:absolute;left:0;top:0;width:1080px;height:252px;background:var(--navy);padding:44px 56px 0;display:flex;align-items:flex-start;justify-content:space-between}
.cs-l{font-size:88px;color:#fff}
.cs-l em{font-style:normal;color:var(--red)}
.cs-r{text-align:right;padding-top:8px}
.cs-rk{font-weight:700;text-transform:uppercase;letter-spacing:3.4px;font-size:24px;color:#fff;opacity:.72}
.cs-rp{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:60px;letter-spacing:-2px;color:#fff;margin-top:8px;line-height:1}
.cs-win{position:absolute;left:0;top:252px;width:1080px;height:450px;overflow:hidden;background:var(--navy);border-top:7px solid var(--red);border-bottom:7px solid var(--red)}
.cs-win img{width:100%;height:100%;object-fit:cover;display:block}
.cs-bar{position:absolute;left:0;top:702px;width:1080px;height:76px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 56px}
.cs-a{font-weight:700;text-transform:uppercase;letter-spacing:2px;font-size:34px;color:var(--navy)}
.cs-m{font-weight:700;text-transform:uppercase;letter-spacing:2.6px;font-size:22px;color:var(--navy);opacity:.7}
.cs-specs{position:absolute;left:0;top:778px;width:1080px;height:88px;background:var(--navy2);display:flex;align-items:center;gap:44px;padding:0 56px;font-weight:700;text-transform:uppercase;letter-spacing:2.4px;font-size:28px;color:#fff}
.cs-specs s{text-decoration:none;color:var(--red)}
.cs-contact{position:absolute;left:0;bottom:150px;width:1080px;height:64px;background:var(--navy);color:#fff;border-top:6px solid var(--red);display:flex;align-items:center;justify-content:center;gap:20px;font-weight:700;font-size:25px;letter-spacing:1.6px;text-transform:uppercase}
.cs-contact s{text-decoration:none;opacity:.5}
.cs-foot{position:absolute;left:0;bottom:0;width:1080px;height:150px;background:#fff;display:flex;align-items:center;justify-content:center;gap:22px}
.cs-balloon{width:52px;height:62px;position:relative}
.cs-balloon i{position:absolute;left:0;width:52px;display:block}
.cs-balloon i.r{top:0;height:15px;background:var(--red);border-radius:26px 26px 0 0/30px 30px 0 0}
.cs-balloon i.w{top:15px;height:14px;background:#fff}
.cs-balloon i.b{top:29px;height:15px;background:#1d4fa3;border-radius:0 0 26px 26px/0 0 26px 26px}
.cs-balloon b{position:absolute;left:20px;top:44px;width:12px;height:16px;background:#1d4fa3;clip-path:polygon(0 0,100% 0,50% 100%)}
.cs-wm{font-family:var(--theme-font-display,"Archivo Black"),sans-serif;font-size:56px;letter-spacing:-2px;color:#1a1a1a;line-height:.8}
.cs-wm em{font-style:normal;color:var(--red)}
.cs-wm span{display:block;font-family:var(--theme-font-narrow,"Archivo Narrow"),sans-serif;font-size:22px;font-weight:700;letter-spacing:9px;color:var(--red);text-align:center;margin-top:4px}
`;
