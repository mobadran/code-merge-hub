"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";

export default function PostAttachments({
  post,
  startingImageIndex,
  children,
}: {
  post: Post;
  startingImageIndex: number;
  children: React.ReactNode;
}) {
  const [selectedImageIndex, setSelectedImageIndex] =
    useState(startingImageIndex);

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.scrollTo(selectedImageIndex);
    const onSelect = () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap() || 0);
    };
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [selectedImageIndex, carouselApi]);

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImageIndex(startingImageIndex);
          }
        }}
      >
        <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Attachments</DialogTitle>
            <DialogDescription>
              View all attachments for this post
            </DialogDescription>
          </DialogHeader>
          <div className="h-[450px] flex items-center">
            <Carousel
              opts={{ loop: true, startIndex: startingImageIndex }}
              className="w-full mx-8"
              setApi={setCarouselApi}
            >
              <CarouselContent className="flex items-center">
                {post.mediaUrls.map((url, index) => (
                  <CarouselItem key={index} className="flex justify-center">
                    <div className="h-[450px] flex items-center">
                      <Image
                        src={url}
                        alt={post.title}
                        className="object-contain max-h-[450px] w-auto max-w-full mx-auto"
                        width={800}
                        height={450}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          {/* <div className="flex justify-center gap-4">
            {post.mediaUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={post.title}
                className={cn(
                  "object-cover h-12 w-12 hover:opacity-70 cursor-pointer rounded-lg transition-all duration-200",
                  index === selectedImageIndex &&
                    "scale-125 border-2 border-primary"
                )}
                width={80}
                height={80}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div> */}

          <CarouselThumbnails
            setSelectedImageIndex={setSelectedImageIndex}
            post={post}
            selectedImageIndex={selectedImageIndex}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function CarouselThumbnails({
  setSelectedImageIndex,
  post,
  selectedImageIndex,
}: {
  setSelectedImageIndex: (index: number) => void;
  post: Post;
  selectedImageIndex: number;
}) {
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const scrollBy = 4; // how many items to move per click

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(selectedImageIndex);
  }, [selectedImageIndex, emblaApi]);

  const scrollNext = () => {
    if (!emblaApi) return;
    const nextIndex = emblaApi.selectedScrollSnap() + scrollBy;
    emblaApi.scrollTo(nextIndex, true); // true = animated
  };

  const scrollPrev = () => {
    if (!emblaApi) return;
    const prevIndex = emblaApi.selectedScrollSnap() - scrollBy;
    emblaApi.scrollTo(prevIndex, true);
  };
  return (
    <Carousel
      opts={{ startIndex: selectedImageIndex }}
      setApi={setEmblaApi}
      className="mx-8"
    >
      <CarouselContent className="p-2 -ml-4 mr-4">
        {post.mediaUrls.map((url, index) => (
          <CarouselItem key={index} className="basis-auto">
            <Image
              src={url}
              alt={post.title}
              className={cn(
                "object-cover h-12 w-12 hover:opacity-70 cursor-pointer rounded-lg transition-all duration-200",
                index === selectedImageIndex &&
                  "scale-125 border-2 border-primary"
              )}
              width={80}
              height={80}
              onClick={() => setSelectedImageIndex(index)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious onClick={scrollPrev} />
      <CarouselNext onClick={scrollNext} />
    </Carousel>
  );
}
