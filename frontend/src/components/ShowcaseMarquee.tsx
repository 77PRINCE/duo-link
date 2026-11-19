import Image from "next/image";

// Replace these entries with the image paths and company names you add under
// frontend/public/showcase. The background is a ready-to-use placeholder.
const showcaseItems = [
  { name: "Your company", image: "/background.png" },
  { name: "Your company", image: "/background.png" },
  { name: "Your company", image: "/background.png" },
  { name: "Your company", image: "/background.png" },
];

export function ShowcaseMarquee() {
  return (
    <div className="showcase-window" aria-label="Sample app gallery">
      <div className="showcase-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="showcase-group"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {showcaseItems.map((item, index) => (
              <article className="showcase-card" key={`${copy}-${index}`}>
                <Image
                  src={item.image}
                  alt={copy === 0 ? `${item.name} app preview` : ""}
                  width={320}
                  height={180}
                  sizes="(max-width: 640px) 38vw, 210px"
                  className="showcase-image"
                />
                <p>{item.name}</p>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
