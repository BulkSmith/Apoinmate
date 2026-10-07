<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Verified doctors get a `doctor_listings` row (id = user_id text) via DB trigger; appointments link to doctors by `doctor_id`, so doctor RLS uses `doctor_id = auth.uid()::text`. Why: lets self-registered doctors be bookable alongside the static catalogue.
