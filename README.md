# Jack Ford — personal website

A static HTML, CSS, JavaScript, and Bootstrap website. No build step or package installation is required. Open `index.html` in a browser, or serve the folder locally with `python -m http.server 8000` and visit `http://localhost:8000`.

## Add your content

All visible content lives in **index.html**. Search for square brackets (`[`) to find placeholder copy. Nearby comments mark the blocks to edit or duplicate.

| Section | What to edit |
| --- | --- |
| Home | Name, role, phone, logos, and links inside `#home`. |
| About | Introduction paragraphs and portrait inside `#about`. |
| Experience | Copy an entire `article.experience-entry` for each role. List newest first. |
| Projects | Copy an entire `col-md-6` block inside `#projects` for each project. Replace its title, description, tags, and image. Link examples are in an HTML comment in the first project. |
| Skills | Rename the three groups and replace their list items. Add or remove items as needed. |
| Contact | Invitation, email, profile URLs, and location inside `#contact`. Keep the business card links in sync. |

Also update the page title, meta description, navigation name, and footer if changing the site owner. The copyright year updates automatically.

## Add images

1. Put image files in `assets/`, using simple names such as `portrait.jpg` and `project-one.webp`.
2. Replace the relevant image's `src`, for example `src="assets/portrait.jpg"`.
3. Replace `alt` with a useful description of the image.
4. Keep the existing CSS class. Images are cropped to a consistent shape: portrait **6:7**, projects **8:5**. Update the HTML `width` and `height` to the source image dimensions. Adjust `object-position` in CSS if the crop needs moving.

The SVG placeholders are local files, so there are no external image dependencies. The original logo files remain in the project root.

## Styling and behavior

- **styles.css** contains theme colors in `:root`, followed by navigation, business card, section, and responsive styles. Body text uses system Arial/Helvetica; the card retains its serif styling.
- **theme.js** applies light/dark mode before the page renders. The initial theme follows the device preference; the header toggle saves an explicit choice in local storage. Dark mode uses the original `#1a1a1a` background and keeps the business card's paper color. Edit the dark theme variables in `styles.css` to adjust its palette.
- **script.js** handles the mobile navigation, current-section indicator, copyright year, and the original card's mouse-drag tilt. Drag anywhere on the card except its links; it follows the pointer even outside the card and resets when released. Links remain clickable. Reduced-motion preferences are respected, and touch gestures continue to scroll the page.
- **vendor/bootstrap/** contains Bootstrap **5.3.3**, downloaded from the official package on jsDelivr. Its MIT license notice is preserved in each file. Local copies allow the page to work without a CDN connection.

Contact links use `mailto:` to open a visitor's email app. There is no form backend to configure. Project links stay as plain placeholder text until you add real destinations.

## Check your edits

1. Open each section from the navigation and check that the correct link is highlighted as you scroll.
2. At a phone width, open the menu and choose a section. It should close and move focus to the section heading. The name link returns home and closes the menu too.
3. Turn the phone sideways or use a short browser window. The open menu should scroll so all six links remain reachable.
4. Use Tab to navigate and Escape to close the mobile menu. The first Tab stop is a skip link for reaching the main content.
5. Enable your device's reduced-motion preference to check that smooth scrolling and the card tilt are disabled.
6. Check that your replacement images load, have descriptive alt text, and crop as intended.
7. Switch light/dark mode, then reload to confirm your choice is remembered. Check text and links in both themes.
8. Start dragging near a corner of the card. Pressing down should leave it level; moving the mouse should tilt it relative to that starting point. Drag past its edges, then release to reset. Clicking a link directly should still open its destination.

The theme button shows a moon to switch to dark mode and a sun to switch to light mode, with a matching accessible label and tooltip. The name and description are centered together using equal top and bottom padding in `.business-card-content`.

The business card keeps its original **700 × 420 (5:3)** proportions at every screen width. Its frame caps the width at 700px; `--card-unit` scales the text, logos, spacing, and decorative details together. For example, `calc(33 * var(--card-unit))` is 33px at full size. The footer stays in one row on mobile, and the home section keeps the extra space around the smaller card.

## Before publishing

- Replace all bracketed content and placeholder images.
- Check contact details and every project/profile link.
- Preview both a narrow phone width and a desktop width.
- Upload the folder, including `assets/`, `vendor/`, and both original logo files, to your static host. File names and capitalization must match exactly.
