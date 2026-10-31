import Image from "next/image";
import {
  apartments,
  type Apartment,
} from "@/lib/components/SilentiumApartments/apartments";

function ApartmentSection({
  apartment,
  imageOnLeft,
}: {
  apartment: Apartment;
  imageOnLeft: boolean;
}) {
  const current = apartment.images[0];

  const media = (
    <div className="col-span-7 flex min-h-0 flex-col gap-6">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="58vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-7 items-start gap-x-4">
        <p className="small col-span-2 text-primary-white">{current.room}</p>
        <p className="small col-span-2 text-secondary-white">
          {current.caption}
        </p>
        <ol className="col-span-2 col-start-6 flex justify-end gap-4">
          {apartment.images.map((image: { src: string; alt: string }, index: number) => (
            <li key={image.src}>
              <span
                className={`small ${
                  index === 0 ? "text-primary-white" : "text-secondary-white"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  const content = (
    <div className="col-span-5 flex min-h-0 flex-col justify-between py-2">
      <div>
        <p className="eyebrow text-secondary-white">{apartment.name}</p>
        <h2 className="headline mt-6 text-primary-white">
          {apartment.headline.map((line: string) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </div>
      <dl className="grid grid-cols-3 gap-x-6 gap-y-10">
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
      <div className="btn-group">
        <button type="button" className="btn-outline">
          Download floorplan
        </button>
        <button type="button" className="btn-primary">
          Request Private Consultation
        </button>
      </div>
    </div>
  );

  return (
    <section className="grid h-svh grid-cols-12 gap-x-8 px-section py-section">
      {imageOnLeft ? (
        <>
          {media}
          {content}
        </>
      ) : (
        <>
          {content}
          {media}
        </>
      )}
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
