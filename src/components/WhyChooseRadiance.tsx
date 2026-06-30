import {CalendarClock, HeartHandshake, Microscope, ShieldCheck} from "lucide-react";

const icons = [Microscope, ShieldCheck, HeartHandshake, CalendarClock];

export function WhyChooseRadiance({
  items,
}: {
  items: {title: string; text: string}[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];

        return (
          <div
            key={item.title}
            className="gradient-border group relative min-h-72 overflow-hidden rounded-[2rem] bg-white/58 p-6 shadow-[0_26px_90px_rgba(15,16,22,0.08)] backdrop-blur-xl transition duration-500 hover:-translate-y-1"
          >
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[var(--aqua)]/16 blur-3xl transition group-hover:scale-125" />
            <div className="relative">
              <div className="mb-14 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--ivory)] shadow-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm font-extrabold text-[var(--bronze)]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="font-serif text-3xl leading-none text-[var(--ink)]">
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
