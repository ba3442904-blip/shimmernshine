# Project Notes

## Next.js 15

Both `params` (route handlers) and `searchParams` (page components) are `Promise`s and must be awaited before use.

```ts
// Route handler
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
}

// Page component
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
}
```
