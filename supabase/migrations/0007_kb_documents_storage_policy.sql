create policy "tenant owns their kb-document files"
on storage.objects for all
using (
  bucket_id = 'kb-documents'
  and (storage.foldername(name))[1] = auth_tenant_id()::text
);