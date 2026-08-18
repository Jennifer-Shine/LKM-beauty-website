import "./Info.css";

const values = [
  {
    title: "Gentle first",
    text: "We favor barrier-friendly formulas over aggressive actives that promise fast results.",
  },
  {
    title: "Small routines",
    text: "A routine you'll actually finish beats a ten-step one you abandon in a week.",
  },
  {
    title: "Honest sourcing",
    text: "We work directly with Korean manufacturers and list every ingredient we use.",
  },
];

export default function About() {
  return (
    <div className="info-page">
      <section className="info-hero">
        <div className="container">
          <span className="eyebrow">About us</span>
          <h1>Started with a skincare shelf that felt honest.</h1>
          <p>
            LKM Beauty began as a small student project: a shared frustration
            with routines that were either too complicated or too vague about
            what was actually inside the bottle. We set out to build a shelf
            of Korean skincare and makeup we'd recommend to a friend, with
            plain explanations of what each product does and why.
          </p>
        </div>
      </section>

      <section className="info-values">
        <div className="container values-grid">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-story">
        <div className="container story-grid">
          <div>
            <span className="eyebrow">Our approach</span>
            <h2>Function before packaging</h2>
          </div>
          <p>
            Korean skincare is often reduced to trends — glass skin, ten-step
            routines, viral serums. We're more interested in what each
            product is actually doing for your skin barrier, and in helping
            you build a routine sized to your life, not your feed.
          </p>
        </div>
      </section>
    </div>
  );
}