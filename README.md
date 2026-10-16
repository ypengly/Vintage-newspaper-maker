# Vintage Newspaper Maker

Create vintage-style newspaper pages in the browser. 10 templates, live preview,
PDF / PNG / JPG export, printing, and local project saving. No backend, no login.

## Run it (Windows, VS Code)
1. Unzip the folder and open it in VS Code (**File → Open Folder**).
2. Install the **Live Server** extension (Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.

An internet connection is needed: Google Fonts and the export libraries
(html2canvas, jsPDF) load from CDNs.

## Folder structure
```
vintage-newspaper-maker/
├── index.html      page structure + export dialog
├── css/style.css   app UI, 10 template layouts, Khmer font styles
├── js/app.js       templates, editor, storage, export, print
└── README.md
```

## How to use
1. **Home**: click a template card.
2. **Editor**: edit fields on the left; the newspaper updates live.
   Use the Layout box to change template, font style, page size (A4/A3/Letter) and orientation.
3. **Photo**: upload JPG/PNG/WebP/GIF (max 15 MB). Choose black & white, sepia or original first.
4. **Toolbar**: Save (Ctrl+S), Undo, Redo, Download, Print.
5. **Download**: enter a file name, pick PDF / PNG / JPG, resolution (and JPG quality).
6. **My Projects**: open, rename, duplicate, delete, export (.json) and import projects.

## Khmer fonts
In **Layout → Font style** choose a Khmer style, or press **Fill with Khmer sample text**.

| Style | Headings | Body |
|-------|----------|------|
| Khmer Vintage | Moul | Hanuman |
| Khmer Classic | Bokor | Battambang |
| Khmer Bold | Koulen | Noto Serif Khmer |
| Khmer Formal | Moulpali | Hanuman |

Khmer styles replace the template's fonts, and the date and price line switch to Khmer.
Text is left-aligned with taller line spacing, since Khmer has no spaces between words.
Add your own font: add its Google Fonts name to the `<link>` in `index.html`, then add an
`.paper.fk-kmN{--kh:'Heading font';--kb:'Body font'}` rule in `css/style.css` and an `<option value="kmN">` in `js/app.js`.

## Saving & backups
Projects live in your browser's localStorage (about 5 MB). They are lost if you clear
browser data and are not shared between browsers or PCs. Photos use the most space.
Use **Export** on My Projects to back up each project as a file and **Import** to restore it.

## Export notes
- PDF is one page at the chosen size; very long content is scaled to fit.
- Use 2× or 3× resolution for sharper images; very large pages at 3× may fail in some browsers.
- Print uses the browser dialog: enable "Background graphics" for full paper colour.

## Troubleshooting
- **Export does nothing / error**: check your internet connection and reload.
- **Fonts look plain**: fonts didn't load; reload while online.
- **"Browser storage is full"**: export projects, delete some, or use smaller photos.
