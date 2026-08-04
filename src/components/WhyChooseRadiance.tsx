import {
  CalendarClock,
  HeartHandshake,
  Microscope,
  ShieldCheck,
} from "lucide-react";

const icons = [Microscope, ShieldCheck, HeartHandshake, CalendarClock];

export function WhyChooseRadiance({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <div className="grid min-w-0 gap-4 min-[380px]:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];

        return (
          <div
            key={item.title}
            className="gradient-border group relative min-h-[14rem] min-w-0 overflow-hidden rounded-[1.35rem] bg-white/58 p-4 shadow-[0_26px_90px_rgba(15,16,22,0.08)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 sm:min-h-72 sm:rounded-[2rem] sm:p-6"
          >
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[var(--aqua)]/16 blur-3xl transition group-hover:scale-125" />
            <div className="relative">
              <div className="mb-9 flex items-center justify-between sm:mb-14">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--ivory)] shadow-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm font-extrabold text-[var(--bronze)]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="font-serif text-2xl leading-none text-[var(--ink)] sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-[var(--ink)]/62">
                {item.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
