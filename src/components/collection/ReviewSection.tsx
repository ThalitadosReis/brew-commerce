import Image from "next/image";

const reviews = [
  {
    quote:
      "This coffee has completely changed my mornings. The aroma and freshness are unmatched.",
    author: "Sarah Williams",
    subtitle: "Barista, New York",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    quote:
      "A smooth and balanced flavor. You can taste the quality in every cup.",
    author: "David Chen",
    subtitle: "Coffee Enthusiast, Singapore",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

export default function ReviewSection() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="mb-12">
        <div className="mx-auto text-center space-y-4">
          <h5 className="mb-1 text-lg font-heading">Review</h5>
          <h2 className="text-4xl lg:text-5xl font-heading">
            What some of our customers say
          </h2>
          <p className="font-body">
            Real experiences from people who love great coffee.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="mx-auto flex h-full flex-col items-center justify-center text-center space-y-8 p-8 border border-black/20"
          >
            <blockquote className="lg:text-lg font-light">
              “{review.quote}”
            </blockquote>

            <div className="flex flex-col items-center">
              <div className="mb-2">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  width={40}
                  height={40}
                  className="rounded-full mb-3 object-cover"
                />
              </div>
              <p className="font-bold">{review.author}</p>
              <p className="text-sm text-black/70">{review.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
