# JOUK — Explore Jordan

JOUK is a travel discovery and trip planning website focused on Jordan. Visitors can explore destinations, find activities, build day-by-day itineraries, and read or share travel experiences.

The interface and destination content are primarily in English.

## Explore the Website

- **Home:** an introduction to JOUK and Jordan.
- **Plans:** destination collections for Relax, Culture, and Adventure, plus Something to Do.
- **Destination pages:** descriptions, visit information, activities, packing suggestions, photos, and nearby places.
- **Something to Do:** a monthly event calendar and activity cards with external venue links.
- **Create My Trip / My Path:** select destinations, assign them to days, and view a trip on an illustrated Jordan map.
- **Community:** browse traveler experiences and share an experience.
- **Profile and Saved Places:** manage account information and revisit saved content.

## Technology

- HTML, CSS, and vanilla JavaScript.
- Firebase Authentication for email/password accounts.
- Cloud Firestore for account-related records, including saved trips and shared experiences.
- Browser `localStorage` for local state, cached trip data, saved-place IDs, and local messaging data.
- A JSON destination catalog, local image assets, SVG graphics, and externally loaded Google Fonts.

Firebase SDK modules are imported directly from Google's CDN. There is no package installation or frontend build step in this repository.

## Run Locally

Serve the repository over HTTP rather than opening its HTML files directly.

With Python installed, run this command from the project root:

```bash
python -m http.server 8000
```

Then visit **http://localhost:8000/**. The root page redirects to the home page.

An editor extension such as Live Server can also serve the project. Internet access is needed for Firebase services and external resources.

> Some destination pages include a fallback catalog for `file://` previews, but that does not make all account and data features work without an HTTP server.

## Firebase Setup

Firebase client configuration is located in `shared/firebase.js`.

To run the project against your own Firebase project:

1. Register a Firebase web app and replace the client configuration in that file.
2. Enable **Email/Password** in Firebase Authentication.
3. Add your local and deployed hostnames to the appropriate authentication domain configuration.
4. Create a Cloud Firestore database and configure rules for the intended access model.
5. Create any Firestore indexes requested by the application's queries.

The code reads or writes records including:

| Path | Purpose |
| --- | --- |
| `users/{uid}` | User profile information |
| `users/{uid}/savedPlans/{planId}` | Saved trip plans |
| `experiences/{experienceId}` | Shared travel experiences |

Firebase security rules and index configuration are not included in this repository. Configure and review them separately; frontend sign-in checks do not replace database access rules. Do not commit service-account credentials or private keys.

## Feature Status

This table describes the implementation found in the source. It is **not** a claim that every flow has been verified against the deployed Firebase project.

| Feature | Current implementation and limits |
| --- | --- |
| Destination browsing | Static category pages and a shared destination renderer backed by the destination catalog. |
| Sign up / sign in / sign out | Firebase Authentication integration is present; requires valid configuration and service access. |
| Trip creation and editing | Day assignment, Firestore writes for signed-in users, and local trip state are implemented. |
| My Path map | Illustrates selected destinations using predefined image coordinates. It is not a live GPS or route optimization system. Some destinations may lack map coordinates. |
| Driving directions | Opens Google Maps through an external directions link. |
| Saved places | Requires sign-in, but IDs are stored in this browser under a user-specific `localStorage` key. Cloud synchronization is not implemented for these bookmarks. |
| Shared experiences | Firestore loading and posting are implemented. The posting flow compresses selected images and includes image data in the experience record; it is not a dedicated Firebase Storage upload pipeline. |
| Profile | Includes Firebase-backed profile operations and a mixture of cloud and local data. |
| Messages / chat | Browser-local implementation; not a live, cross-device messaging service. |
| Event calendar | Uses an in-code event list and initially selects the current month using Jordan time. The displayed calendar is labeled 2026. Events do not automatically update from organizers. |
| Venue links | Open external websites. The cinema card offers separate cinema website choices. Bookings and payments are handled outside JOUK. |

## Project Structure

```text
JOUK-fixed-repo/
├── index.html                 # Redirect to the home page
├── home page/                 # Landing page
├── plans/                     # Category pages, events, and activity cards
├── data/                      # Destination catalog and browser fallback
├── paths/                     # My Path and illustrated trip map
├── reviews/                   # Community and experience submission
├── other pages/
│   ├── place/                 # Shared destination page
│   ├── create-plan/           # Trip creation and editing
│   ├── view-plan/             # Trip details
│   ├── profile/               # Profile interface
│   ├── other-profile/         # Other traveler profiles
│   ├── saved-places/           # Saved destination list
│   ├── messages/              # Local messages interface
│   └── chat/                  # Local chat interface
├── sign up-log in/            # Authentication interface
├── shared/                    # Firebase, navigation, and shared UI
├── about/                     # About page
└── images/                    # Shared image assets
```

## Update Destinations and Events

- Edit destination records in `data/places.json`.
- Keep `data/places-local.js` synchronized with the same catalog for pages using the browser fallback.
- Category cards are also defined in their category HTML files; update their images, links, and text when changing the catalog.
- Use the destination's **`image`** for its exterior card cover and **`heroImage`** for its internal hero. These are separate choices.
- Shared destination rendering and styles are in `other pages/place/`.
- Event data and month selection are in `plans/something to do/script.js`; venue cards are in that folder's `index.html`.
- Review event dates and the calendar year before reusing the calendar in a later year.

Entry fees, travel times, opening arrangements, and event schedules are editorial content and may change. Confirm them with the relevant operator when maintaining the catalog.

## Current Limitations

- No automated test suite or build pipeline is included.
- Local browser data does not automatically synchronize across devices and may be lost when site data is cleared.
- There is no live event feed, in-site booking/payment system, or automatic itinerary optimization.
- Firebase deployment rules, indexes, and a dedicated media-storage configuration are not bundled.
- Live account, database, and external-link flows need verification in the configured deployment environment.

## Credits and Usage

JOUK uses destination photography, illustrations, and third-party venue references. Review image ownership and usage permissions before redistributing assets. No license file is currently included; add an appropriate license before presenting the repository as freely reusable.
