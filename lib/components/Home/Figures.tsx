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
    <section className="m-12 grid h-[85svh] min-h-0 grid-cols-12">
      <div className="relative col-span-4 h-full min-h-0 overflow-hidden rounded-xl ">
        <Image
          src="/concrete-and-chair.png"
          alt="Concrete interior with a lounge chair"
          fill
          sizes="33vw"
          className="object-cover"
        />
      </div>
      <div className="col-span-8 grid h-full min-h-0 grid-cols-8">
        <ul className="col-span-4 col-start-3 flex h-full flex-col justify-evenly py-8">
          {figures.map((figure) => (
            <li
              key={figure.copy}
              className="grid grid-cols-[minmax(8rem,auto)_1fr] items-center gap-12"
            >
              <p className="title flex items-baseline text-primary-white">
                <span className="subheading text-secondary-white">
                  {figure.prefix}{" "}
                </span>
                {figure.value}
                {figure.unit ? (
                  <span className="subheading text-secondary-white">
                    {" "}{figure.unit}
                  </span>
                ) : null}
              </p>
              <p className="small max-w-xs text-secondary-white">
                {figure.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
