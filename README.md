# QPedia File Manager

A Svelte 5 file manager for applications with versioned originals. The component supports folder navigation, paged listings, uploads, current and earlier downloads, and recursive ZIP exports. Hosts enable folder creation, file moves and empty-folder removal through optional adapter methods.

## Use with your own storage

Install the tagged package and supply a `FileAdapter` backed by your application's API. Folder and file IDs are opaque to the component. Your storage can be local, object storage, or a separate service.

```sh
npm install https://codeload.github.com/qern-net/qpedia-file-mgr/tar.gz/refs/tags/v0.1.0
```

```svelte
<script lang="ts">
  import FileManager from '@qern/file-manager/FileManager.svelte'
  import type { FileAdapter } from '@qern/file-manager/types'
  let { files }: { files: FileAdapter } = $props()
</script>

<FileManager adapter={files} root="root" folder="root" />
```

Implement `list`, `versions`, `download`, and `archive`. Add `upload` for writable stores. On upload, the server resolves the filename within the authorized folder, keeps the file ID stable when contents change, and returns `unchanged` for identical current contents. Each version needs a durable reference to its original. Authorize both individual downloads and every entry in an archive against the caller's current access. The full contract is in [types.ts](file-manager/types.ts).

## Server libraries

- Rust applications can use `qpedia-file-archive` directly. Node servers can call `archiveFiles` from `@qern/file-manager/archive` with an iterable of authorized `{ path, bytes }` records and the path to the compiled ZIP executable. The writer preserves relative UTF-8 paths, rejects unsafe or duplicate entries and accepts up to 2,048 files and 48 MiB of originals.
- PostgreSQL applications can reuse [select-files.sql](file-manager/select-files.sql) to scope and paginate a host-authorized file set. Applications using another database can implement the same adapter contract.
- Browsers can use `saveResponse` from `@qern/file-manager/download` to save a successful HTTP response under the supplied filename.

## Use with QPedia

The optional `qpedia-file-routes` crate adds directory listings and ZIP exports to QPedia 1.4.0. Mount `qpedia_file_routes::routes()` on an existing `qpedia_api::AppBuilder` with `with_routes`. QPedia continues to own source uploads, version history, original downloads, and authorization. The `@qern/file-manager/qpedia` client adapter accepts either HTTP requests or an in-process desktop transport.

An embedded deployment can opt into this adapter when it provides a file browser. Applications using the Svelte component or ZIP writer alone do not need a QPedia engine, embedded runtime, or database.

## Checks

Run `npm ci && npm test` for the generic client and `cargo test --locked --manifest-path file-manager/archive/Cargo.toml` for the writer. The CI workflow also opens a generated archive with Python's ZIP reader and exercises uploads, version downloads, folder boundaries and ZIP contents against PostgreSQL and QPedia.
