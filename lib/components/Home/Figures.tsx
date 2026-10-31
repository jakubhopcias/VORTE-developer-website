import Image from "next/image";

type Figure = {
  value: string;
  prefix?: string;
  unit?: string;
  copy: string;
};

const figures: Figure[] = [
  {
    prefix: "€ ",
    value: "140",
    unit: " M+",
    copy: "Total value of completed high-end residential and architectural assets.",
  },
  {
    value: "3",
    copy: "Maximum number of private residential commissions accepted per year.",
  },
  {
    value: "50",
    unit: " Yrs",
    copy: "Minimum certified durability standard for monolithic concrete structures.",
  },
  {
    value: "100",
    unit: "%",
    copy: "Transactions and private viewings executed under strict multi-layer NDA protocols.",
  },
];

export default function Figures() {
  return (
    <section className="grid grid-cols-1 gap-12 px-section py-section-y md:h-[85svh] md:min-h-0 md:grid-cols-12 md:gap-8 md:p-section">
      <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-xl md:order-1 md:col-span-5 md:aspect-auto md:h-full md:min-h-0">
        <Image
          src="/concrete-and-chair.png"
          alt="Concrete interior with a lounge chair"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
        <ul className="mx-auto order-2 grid w-full max-w-md grid-cols-1 gap-8 md:mx-0 md:max-w-none md:col-span-7 md:h-full md:content-evenly md:gap-0 md:py-8 lg:col-span-5 lg:col-start-7">
          {figures.map((figure) => (
            <li
              key={figure.copy}
              className="grid grid-cols-6 items-start md:items-center md:grid-cols-[minmax(8rem,auto)_1fr] md:gap-8 lg:gap-12"
            >
              <p className="title col-span-2 flex items-baseline text-primary-white md:col-auto">
                <span className="subheading text-secondary-white">
                  {figure.prefix}{" "}
                </span>
                {figure.value}
                {figure.unit ? (
                  <span className="subheading text-secondary-white">
                    {" "}
                    {figure.unit}
                  </span>
                ) : null}
              </p>
              <p className="small col-span-3 col-start-4 text-secondary-white md:col-auto md:col-start-auto md:max-w-xs">
                {figure.copy}
              </p>
            </li>
          ))}
        </ul>
    </section>
  );
}
