"use client";

import * as React from "react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import type { EmblaPluginType } from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselOrientation = "horizontal" | "vertical";

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  orientation?: CarouselOrientation;
};

type CarouselContextValue = {
  carouselRef: (node: HTMLElement | null) => void;
  api: EmblaCarouselType | undefined;
  orientation: CarouselOrientation;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used inside <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      children,
      opts,
      plugins,
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    React.useEffect(() => {
      if (!api) return;

      const updateScrollState = () => {
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
        setSelectedIndex(api.selectedScrollSnap() ?? 0);
      };

      const handleReInit = () => {
        setScrollSnaps(api.scrollSnapList());
        updateScrollState();
      };

      setScrollSnaps(api.scrollSnapList());
      updateScrollState();

      api.on("select", updateScrollState);
      api.on("reInit", handleReInit);

      return () => {
        api.off("select", updateScrollState);
        api.off("reInit", handleReInit);
      };
    }, [api]);

    const contextValue = React.useMemo(
      () => ({
        carouselRef,
        api,
        orientation,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
      }),
      [
        carouselRef,
        api,
        orientation,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
      ]
    );

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-orientation={orientation}
          className={cn("relative", className)}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="h-full overflow-hidden">
      <div
        ref={ref}
        data-orientation={orientation}
        className={cn(
          "flex h-full",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { api, canScrollPrev, orientation } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label="Previous slide"
      className={cn(
        "absolute z-10 h-10 w-10 rounded-full bg-background/95 shadow-sm transition",
        orientation === "horizontal"
          ? "left-2 top-1/2 -translate-y-1/2"
          : "left-1/2 top-2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={() => api?.scrollPrev()}
      {...props}
    >
      <CaretLeft size={18} weight="bold" />
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { api, canScrollNext, orientation } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label="Next slide"
      className={cn(
        "absolute z-10 h-10 w-10 rounded-full bg-background/95 shadow-sm transition",
        orientation === "horizontal"
          ? "right-2 top-1/2 -translate-y-1/2"
          : "left-1/2 bottom-2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={() => api?.scrollNext()}
      {...props}
    >
      <CaretRight size={18} weight="bold" />
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

const CarouselIndicators = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { api, scrollSnaps, selectedIndex } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  return (
    <div
      ref={ref}
      className={cn("mt-6 flex items-center justify-center gap-2", className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => api?.scrollTo(index)}
          className={cn(
            "h-2.5 w-2.5 rounded-full transition",
            index === selectedIndex
              ? "bg-foreground"
              : "bg-muted-foreground/40 hover:bg-muted-foreground/70"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
});
CarouselIndicators.displayName = "CarouselIndicators";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
  useCarousel,
};
