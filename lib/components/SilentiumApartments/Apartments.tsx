import Image from "next/image";
import  { Apartment } from "./apartments";
import { apartments } from "./apartments";

function ApartmentSection({
  apartment,
  imageOnLeft,
}: {
  apartment: Apartment;
  imageOnLeft: boolean;
}) {
  const current = apartment.images[0];

  const media = (
    <div
      className={`flex min-h-0 flex-col gap-6 lg:col-span-7 ${
        imageOnLeft ? "order-2 lg:order-1" : "order-2 lg:order-2"
      }`}
    >
      <div className="relative aspect-[4/5] min-h-0 overflow-hidden rounded-3xl lg:aspect-auto lg:flex-1">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-6 items-start gap-x-4 gap-y-4 lg:grid-cols-7">
        <p className="small col-span-2 text-primary-white">{current.room}</p>
        <p className="small col-span-4 text-secondary-white lg:col-span-2">
          {current.caption}
        </p>
        <ol className="col-span-4 col-start-3 flex gap-4 lg:col-span-2 lg:col-start-6 lg:justify-end">
          {apartment.images.map(
            (image: { src: string; alt: string }, index: number) => (
              <li key={image.src}>
                <span
                  className={`small ${
                    index === 0 ? "text-primary-white" : "text-secondary-white"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ),
          )}
        </ol>
      </div>
    </div>
  );

  const content = (
    <div
      className={`flex h-full flex-col justify-between gap-10 lg:col-span-5 lg:py-2 ${
        imageOnLeft ? "order-1 lg:order-2" : "order-1 lg:order-1"
      }`}
    >
      <div className="flex flex-col gap-12">
        <div>
          <p className="eyebrow">{apartment.name}</p>
          <h2 className="headline mt-6 text-primary-white">
            {apartment.headline.map((line: string) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:gap-y-10">
          <div>
            <dt className="small text-secondary-white">Area</dt>
            <dd className="small mt-2 text-primary-white">{apartment.area}</dd>
          </div>
          <div>
            <dt className="small text-secondary-white">Outdoor</dt>
            <dd className="small mt-2 text-primary-white">{apartment.outdoor}</dd>
          </div>
          <div>
            <dt className="small text-secondary-white">Ceiling Height</dt>
            <dd className="small mt-2 text-primary-white">
              {apartment.ceilingHeight}
            </dd>
          </div>
          <div>
            <dt className="small text-secondary-white">Layout</dt>
            <dd className="small mt-2 text-primary-white">{apartment.layout}</dd>
          </div>
          <div>
            <dt className="small text-secondary-white">Access</dt>
            <dd className="small mt-2 text-primary-white">{apartment.access}</dd>
          </div>
        </dl>
      </div>
      <div className="btn-group flex-col gap-4 sm:flex-row">
        <button type="button" className="btn btn-ghost">
          Download floorplan
        </button>
        <button type="button" className="btn btn-primary">
          Request Private Consultation
        </button>
      </div>
    </div>
  );

  return (
    <section className="grid grid-cols-1 gap-10 px-section py-section-y lg:min-h-svh lg:grid-cols-12 lg:gap-x-8 lg:py-section">
      {media}
      {content}
    </section>
  );
}

export default function Apartments() {
  return (
    <div id="apartments">
      {apartments.map((apartment: Apartment, index: number) => (
        <ApartmentSection
          key={apartment.name}
          apartment={apartment}
          imageOnLeft={index % 2 === 0}
        />
      ))}
    </div>
  );
}
