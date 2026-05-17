# Book cover images

Drop book cover images here named by the book slug:

```
covers/
  fix-your-gut-for-good.png
  the-dust-between-seconds.png
  untitled-cosy-mystery.png
```

Supported extensions: `.png`, `.jpg`, `.webp`. The `BookCover` component
checks `/covers/<slug>.png` first, falls back to `.jpg`, then `.webp`,
then falls back to the stylised gradient placeholder.

## Recommended dimensions

- **Source**: 600×800 px (3:4) or larger
- **Will be rendered at**: 64×80 px (`size="md"`) or 96×128 px (`size="lg"`)

## How to generate

Use ChatGPT with image generation:

> Generate three photorealistic book covers as separate PNG images, 600×800 px
> portrait orientation:
>
> 1. **Fix Your Gut For Good** — nonfiction health, sage green palette,
>    a single hero element (kale leaf or gut illustration), bold serif title
> 2. **The Dust Between Seconds** — literary fiction, atmospheric muted photo
>    of a lone figure in a desolate field at dusk, sans-serif title
> 3. **Death in the Cathedral Close** — cosy mystery, gothic illustration
>    of a cathedral silhouette at night with dark crimson accents, ornate
>    serif title with author name "S.A. Ibrahim"
