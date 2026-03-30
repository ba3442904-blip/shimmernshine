# Project Notes

## Next.js 15

Dynamic route `params` in route handlers are a `Promise` and must be typed as `Promise<{ id: string }>` (or the relevant shape) and awaited before use.

```ts
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```
